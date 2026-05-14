import { NextRequest, NextResponse } from "next/server";
import { createElement, type ReactElement } from "react";
import { createClient } from "@/lib/supabase/server";
import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";
import { BriefPDF } from "@/lib/pdf/generateBriefPDF";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: { briefId: string } }
) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: brief } = await supabase
    .from("briefs")
    .select("*, children(first_name)")
    .eq("id", params.briefId)
    .eq("user_id", user.id)
    .single();

  if (!brief || brief.status !== "completed") {
    return NextResponse.json({ error: "Brief not found or not complete" }, { status: 404 });
  }

  const childRow = (brief as { children?: { first_name?: string } }).children;
  const childName = childRow?.first_name || "Your Child";
  const generatedDate = new Date(brief.completed_at || brief.created_at).toLocaleDateString(
    "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );

  const briefData = {
    summary: brief.summary,
    scoresExplained: brief.scores_explained,
    services: brief.services,
    accommodations: brief.accommodations,
    questions: brief.questions,
    watchFor: brief.watch_for,
    rights: brief.rights,
    keyFindings: brief.key_findings ?? [],
    formalDiagnoses: brief.formal_diagnoses ?? [],
  };

  const pdfBuffer = await renderToBuffer(
    createElement(BriefPDF, {
      brief: briefData,
      childName,
      generatedDate,
    }) as unknown as ReactElement<DocumentProps>
  );

  return new NextResponse(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${childName.replace(/[^a-zA-Z0-9-_]/g, "")}-IEP-Brief.pdf"`,
    },
  });
}
