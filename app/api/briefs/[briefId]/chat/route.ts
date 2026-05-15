import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { anthropic, MAIN_MODEL } from "@/lib/ai/client";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

const CHAT_SYSTEM_PROMPT = `You are a trusted friend who happens to be a Special Education Director with 35 years of experience. You have already read this child's evaluation report and written their IEP brief. The parent is coming to you like a friend who needs real talk, not a formal consultation.

HOW YOU SPEAK:
- Short responses. 3-5 sentences most of the time. Never a wall of text.
- Conversational and warm. Like texting a knowledgeable friend, not reading a report.
- Ask one follow-up question at the end of most responses to keep the conversation going.
- Use "I" naturally. "I'd push back on that." "I'd bring this up first." "Honestly, I'd be more worried about..."
- Never use bullet points or numbered lists unless the parent specifically asks for a list.
- Never use bold text or markdown formatting. Just plain conversational sentences.
- Match the parent's energy. If they're stressed, be calming. If they're fired up, validate it.
- Be direct. Don't hedge everything with "it depends" or "you might want to consider."
- Use the child's actual name, not "your child."

WHAT YOU NEVER DO:
- Never dump everything you know in one response.
- Never start with "Great question!" or any filler affirmation.
- Never use clinical acronyms without explaining them in the same sentence.
- Never give a numbered checklist unless asked.
- Never say "based on the brief" out loud -- just answer naturally as if you know this child.
- Never say "your child legally qualifies for" -- say "families in this situation have pushed for" or "I'd ask for."

WHAT YOU ALWAYS DO:
- Ground every answer in Susan's actual scores, but mention them naturally, not clinically.
- Give the parent one specific, actionable thing they can say or do.
- End with a question that moves the conversation forward.

BRIEF CONTEXT:
{BRIEF_CONTEXT}`;

type ChildRow = { first_name?: string; grade?: string; state?: string } | null;

type ScoreFound = {
  name: string;
  score: number | null;
  percentile: number | null;
};

type Battery = {
  batteryName: string;
  scoresFound?: ScoreFound[];
  plainEnglishSummary?: string;
};

type Service = {
  serviceName: string;
  priorityLevel: string;
  why: string;
};

type Question = { question: string };

type Rights = {
  stateTerminology?: string;
  keyRights?: string[];
} | null;

type BriefRow = {
  summary?: string | null;
  watch_for?: string | null;
  key_findings?: string[] | null;
  formal_diagnoses?: string[] | null;
  scores_explained?: Battery[] | null;
  services?: Service[] | null;
  questions?: Question[] | null;
  rights?: Rights;
  children?: ChildRow;
};

function buildBriefContext(brief: BriefRow): string {
  const child = brief.children ?? null;
  const scoresExplained = brief.scores_explained ?? [];
  const services = brief.services ?? [];
  const questions = brief.questions ?? [];

  const scoresSummary = scoresExplained
    .map((battery) => {
      const scores = (battery.scoresFound ?? [])
        .map(
          (s) =>
            `${s.name}: ${s.score ?? "N/A"} (${
              s.percentile != null ? s.percentile + "th percentile" : "percentile N/A"
            })`
        )
        .join(", ");
      return `${battery.batteryName}: ${scores}. ${battery.plainEnglishSummary ?? ""}`;
    })
    .join("\n");

  const servicesText = services
    .map((s) => `${s.serviceName} (${s.priorityLevel} priority): ${s.why}`)
    .join("\n");

  const questionsText = questions.map((q, i) => `${i + 1}. ${q.question}`).join("\n");

  return `
CHILD: ${child?.first_name ?? "the child"}, ${child?.grade ?? "unknown grade"}, ${child?.state ?? "unknown state"}

FORMAL DIAGNOSES: ${(brief.formal_diagnoses ?? []).join(", ") || "None formally stated"}

KEY FINDINGS:
${(brief.key_findings ?? []).map((f) => `• ${f}`).join("\n")}

SUMMARY:
${brief.summary ?? ""}

SCORES:
${scoresSummary}

SERVICES RECOMMENDED:
${servicesText}

TOP QUESTIONS FOR THE MEETING:
${questionsText}

WHAT TO WATCH FOR:
${brief.watch_for ?? ""}

STATE RIGHTS (${brief.rights?.stateTerminology ?? "IEP Meeting"}):
Key rights: ${(brief.rights?.keyRights ?? []).join("; ")}
  `.trim();
}

export async function POST(
  request: NextRequest,
  { params }: { params: { briefId: string } }
) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { message?: string; conversationHistory?: { role: string; content: string }[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { message, conversationHistory } = body;
  if (!message || typeof message !== "string") {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  const { data: brief } = await supabase
    .from("briefs")
    .select(
      "summary, watch_for, key_findings, formal_diagnoses, scores_explained, services, questions, rights, status, children(first_name, grade, state)"
    )
    .eq("id", params.briefId)
    .eq("user_id", user.id)
    .single<BriefRow & { status: string }>();

  if (!brief || brief.status !== "completed") {
    return NextResponse.json({ error: "Brief not found" }, { status: 404 });
  }

  const briefContext = buildBriefContext(brief);
  const systemPrompt = CHAT_SYSTEM_PROMPT.replace("{BRIEF_CONTEXT}", briefContext);

  const messages = [
    ...(conversationHistory ?? [])
      .slice(-20)
      .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
      .map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
    { role: "user" as const, content: message },
  ];

  try {
    const response = await anthropic.messages.create({
      model: MAIN_MODEL,
      max_tokens: 1000,
      system: systemPrompt,
      messages,
    });

    const content = response.content[0];
    if (content.type !== "text") {
      return NextResponse.json({ error: "Unexpected response type" }, { status: 500 });
    }

    // Persist the exchange so the chat survives page reloads.
    await supabase.from("chat_messages").insert([
      { user_id: user.id, brief_id: params.briefId, role: "user", content: message },
      { user_id: user.id, brief_id: params.briefId, role: "assistant", content: content.text },
    ]);

    return NextResponse.json({
      response: content.text,
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
    });
  } catch (e) {
    console.error("Chat error:", e);
    return NextResponse.json(
      { error: "The assistant couldn't respond. Please try again." },
      { status: 500 }
    );
  }
}
