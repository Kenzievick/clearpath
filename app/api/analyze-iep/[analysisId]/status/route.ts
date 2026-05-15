import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: { analysisId: string } }
) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: analysis } = await supabase
    .from("iep_analyses")
    .select("id, status, completed_at")
    .eq("id", params.analysisId)
    .eq("user_id", user.id)
    .single();

  if (!analysis) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    status: analysis.status,
    completedAt: analysis.completed_at,
  });
}
