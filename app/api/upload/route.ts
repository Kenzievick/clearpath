import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { extractTextFromPDF } from "@/lib/pdf/processor";
import { classifyReport } from "@/lib/ai/classify";
import { interpretScores } from "@/lib/ai/interpret";
import { generateFullBrief } from "@/lib/ai/generateBrief";
import { sendBriefReadyEmail } from "@/lib/email/send";
import { trackServerEvent } from "@/lib/analytics/posthog";

export const maxDuration = 300;
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const childId = formData.get("childId") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
    if (!childId) {
      return NextResponse.json({ error: "No child selected" }, { status: 400 });
    }
    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "File must be a PDF" }, { status: 400 });
    }

    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File size must be under 50MB" }, { status: 400 });
    }

    const { data: child, error: childError } = await supabase
      .from("children")
      .select("*")
      .eq("id", childId)
      .eq("user_id", user.id)
      .single();

    if (childError || !child) {
      return NextResponse.json({ error: "Child not found" }, { status: 404 });
    }

    const { data: brief, error: briefError } = await supabase
      .from("briefs")
      .insert({
        user_id: user.id,
        child_id: childId,
        status: "processing",
      })
      .select()
      .single();

    if (briefError || !brief) {
      return NextResponse.json({ error: "Failed to initialize brief" }, { status: 500 });
    }

    await trackServerEvent({
      userId: user.id,
      event: "upload_started",
      properties: { fileSize: file.size, childId },
    });

    const arrayBuffer = await file.arrayBuffer();
    const pdfBuffer = Buffer.from(arrayBuffer);

    let reportText: string;
    try {
      reportText = await extractTextFromPDF(pdfBuffer);
    } catch (extractError) {
      await supabase.from("briefs").update({ status: "failed" }).eq("id", brief.id);

      return NextResponse.json(
        {
          error: extractError instanceof Error ? extractError.message : "Failed to read PDF",
        },
        { status: 422 }
      );
    }

    pdfBuffer.fill(0);

    try {
      const classification = await classifyReport(reportText);
      const interpretations = await interpretScores(reportText, classification);
      const generatedBrief = await generateFullBrief(reportText, classification, interpretations, {
        firstName: child.first_name,
        age: child.age || classification.childAge || 10,
        grade: child.grade || classification.childGrade || "unknown",
        state: child.state || classification.stateCode || "CT",
        evaluationType: child.evaluation_type || classification.evaluationType,
      });

      reportText = "";

      await supabase
        .from("briefs")
        .update({
          status: "completed",
          summary: generatedBrief.summary,
          key_findings: generatedBrief.keyFindings,
          formal_diagnoses: generatedBrief.formalDiagnoses,
          profile_severity: generatedBrief.profileSeverity,
          scores_explained: generatedBrief.scoresExplained,
          services: generatedBrief.services,
          accommodations: generatedBrief.accommodations,
          questions: generatedBrief.questions,
          watch_for: generatedBrief.watchFor,
          rights: generatedBrief.rights,
          detected_state: classification.stateCode,
          batteries_found: classification.batteriesFound,
          completed_at: new Date().toISOString(),
        })
        .eq("id", brief.id);

      await trackServerEvent({
        userId: user.id,
        event: "brief_generated",
        properties: {
          briefId: brief.id,
          childId,
          batteriesFound: classification.batteriesFound,
          detectedState: classification.stateCode,
        },
      });

      // Best-effort: send the brief-ready email. Look up subscription
      // status from `profiles`; the recipient email comes from the auth
      // user. Failures are swallowed so the brief is still returned.
      try {
        const { data: profileRow } = await supabase
          .from("profiles")
          .select("subscription_status")
          .eq("id", user.id)
          .single();

        if (user.email) {
          await sendBriefReadyEmail({
            to: user.email,
            childName: child.first_name,
            briefId: brief.id,
            isSubscribed: profileRow?.subscription_status === "active",
          });
        }
      } catch (emailLookupError) {
        console.error("brief-ready email lookup failed:", emailLookupError);
      }

      return NextResponse.json({
        success: true,
        briefId: brief.id,
      });
    } catch (pipelineError) {
      await supabase.from("briefs").update({ status: "failed" }).eq("id", brief.id);
      console.error("Pipeline error:", pipelineError);
      return NextResponse.json(
        { error: "Brief generation failed. Please try again." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Upload route error:", error);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}
