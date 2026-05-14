import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { briefId: string } }
) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: brief } = await supabase
    .from("briefs")
    .select("id, status, completed_at")
    .eq("id", params.briefId)
    .eq("user_id", user.id)
    .single();

  if (!brief) {
    return NextResponse.json({ error: "Brief not found" }, { status: 404 });
  }

  return NextResponse.json({
    status: brief.status,
    completedAt: brief.completed_at,
  });
}
