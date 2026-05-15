import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { extractTextFromPDF } from "@/lib/pdf/processor";
import { analyzeIEPDocument } from "@/lib/ai/analyzeIEP";

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

    // IEP analyzer is a paid-only feature.
    const { data: profile } = await supabase
      .from("profiles")
      .select("subscription_status")
      .eq("id", user.id)
      .single();

    if (profile?.subscription_status !== "active") {
      return NextResponse.json({ error: "Subscription required" }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const childId = formData.get("childId") as string | null;
    const briefId = formData.get("briefId") as string | null;
    const useBriefContext = formData.get("useBriefContext") === "true";

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
    if (!childId) return NextResponse.json({ error: "No child selected" }, { status: 400 });
    if (file.type !== "application/pdf")
      return NextResponse.json({ error: "File must be a PDF" }, { status: 400 });
    if (file.size > 50 * 1024 * 1024)
      return NextResponse.json({ error: "File must be under 50MB" }, { status: 400 });

    // Verify the child belongs to this user.
    const { data: child } = await supabase
      .from("children")
      .select("*")
      .eq("id", childId)
      .eq("user_id", user.id)
      .single();

    if (!child) return NextResponse.json({ error: "Child not found" }, { status: 404 });

    // Create the analysis record up front so the client can poll its status.
    const { data: analysis, error: analysisError } = await supabase
      .from("iep_analyses")
      .insert({
        user_id: user.id,
        child_id: childId,
        brief_id: useBriefContext && briefId ? briefId : null,
        status: "processing",
      })
      .select()
      .single();

    if (analysisError || !analysis) {
      return NextResponse.json({ error: "Failed to initialize analysis" }, { status: 500 });
    }

    // Extract the PDF text in memory, then zero the buffer immediately.
    const arrayBuffer = await file.arrayBuffer();
    const pdfBuffer = Buffer.from(arrayBuffer);

    let iepText: string;
    try {
      iepText = await extractTextFromPDF(pdfBuffer);
    } catch (error) {
      await supabase.from("iep_analyses").update({ status: "failed" }).eq("id", analysis.id);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Failed to read PDF" },
        { status: 422 }
      );
    }

    pdfBuffer.fill(0);

    // Optionally pull in the evaluation brief for cross-referenced gap analysis.
    let briefContext: {
      summary: string;
      scoresExplained: unknown[];
      services: unknown[];
      accommodations: unknown[];
    } | null = null;

    if (useBriefContext && briefId) {
      const { data: brief } = await supabase
        .from("briefs")
        .select("summary, scores_explained, services, accommodations")
        .eq("id", briefId)
        .eq("user_id", user.id)
        .single();

      if (brief) {
        briefContext = {
          summary: brief.summary ?? "",
          scoresExplained: brief.scores_explained || [],
          services: brief.services || [],
          accommodations: brief.accommodations || [],
        };
      }
    }

    // Run the analysis pipeline.
    try {
      const result = await analyzeIEPDocument(
        iepText,
        briefContext as Parameters<typeof analyzeIEPDocument>[1]
      );
      iepText = "";

      await supabase
        .from("iep_analyses")
        .update({
          status: "completed",
          iep_summary: result.iepSummary,
          goal_analysis: result.goalAnalysis,
          gap_analysis: result.gapAnalysis,
          missing_accommodations: result.missingAccommodations,
          language_to_pushback: result.languageToPushback,
          overall_rating: result.overallRating,
          overall_rating_explanation: result.overallRatingExplanation,
          before_you_sign: result.beforeYouSign,
          services_found: result.servicesFound,
          goals_found: result.goalsFound,
          accommodations_found: result.accommodationsFound,
          iep_date: result.iepDate,
          school_year: result.schoolYear,
          completed_at: new Date().toISOString(),
        })
        .eq("id", analysis.id);

      return NextResponse.json({ success: true, analysisId: analysis.id });
    } catch (error) {
      await supabase.from("iep_analyses").update({ status: "failed" }).eq("id", analysis.id);
      console.error("IEP analysis pipeline error:", error);
      return NextResponse.json({ error: "Analysis failed. Please try again." }, { status: 500 });
    }
  } catch (error) {
    console.error("IEP analyze route error:", error);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}
