import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type ScoreFound = {
  name: string;
  score: number | null;
  scoreType?: string;
};

type Battery = { scoresFound?: ScoreFound[] };

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
    .select("scores_explained, children(first_name)")
    .eq("id", params.briefId)
    .eq("user_id", user.id)
    .single<{ scores_explained: Battery[] | null }>();

  if (!brief) return NextResponse.json({ error: "Brief not found" }, { status: 404 });

  const scores = brief.scores_explained ?? [];

  let highest: { name: string; value: number } = { name: "", value: -Infinity };
  let lowest: { name: string; value: number } = { name: "", value: Infinity };

  scores.forEach((battery) => {
    (battery.scoresFound ?? []).forEach((score) => {
      // Use standard scores only for the gap question (mixed scales make for
      // misleading comparisons). Treat unset scoreType as standard for
      // backwards-compat with older briefs.
      const isStd = !score.scoreType || score.scoreType === "standard";
      if (!isStd || score.score == null) return;
      if (score.score > highest.value) highest = { name: score.name, value: score.score };
      if (score.score < lowest.value) lowest = { name: score.name, value: score.score };
    });
  });

  const hasGap = highest.name && lowest.name && highest.value - lowest.value >= 15;
  const dynamicPrompt = hasGap
    ? `Why is there such a big gap between ${highest.name} (${highest.value}) and ${lowest.name} (${lowest.value})?`
    : "What is the most important score pattern I should understand?";

  const prompts = [
    "Walk me through the most important findings",
    "What should I say if they push back on services?",
    "Help me prepare for tomorrow's meeting",
    "What if the school says the IEP is already adequate?",
    "Which accommodations should I fight hardest for?",
    dynamicPrompt,
  ];

  return NextResponse.json({ prompts });
}
