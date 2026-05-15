import { MAIN_MODEL, FAST_MODEL, callWithRetry, parseJSONResponse } from "./client";

export interface IEPGoal {
  goalText: string;
  area: string;
  qualityRating: "strong" | "adequate" | "weak" | "vague";
  whyThisRating: string;
  suggestedRewrite: string | null;
  isMeasurable: boolean;
  hasBaseline: boolean;
  hasCriteria: boolean;
}

export interface GapItem {
  area: string;
  whatScoresSay: string;
  whatIEPOffers: string;
  gapSeverity: "significant" | "moderate" | "minor" | "none";
  recommendation: string;
}

export interface PushbackItem {
  originalLanguage: string;
  whyItIsProblematic: string;
  suggestedReplacement: string;
  location: string;
}

export interface IEPAnalysis {
  iepSummary: string;
  goalAnalysis: IEPGoal[];
  gapAnalysis: GapItem[];
  missingAccommodations: {
    accommodation: string;
    why: string;
    priority: "high" | "medium" | "consider";
  }[];
  languageToPushback: PushbackItem[];
  overallRating: "strong" | "adequate" | "weak" | "insufficient";
  overallRatingExplanation: string;
  beforeYouSign: string[];
  servicesFound: {
    serviceName: string;
    frequency: string;
    duration: string;
    location: string;
  }[];
  goalsFound: number;
  accommodationsFound: string[];
  iepDate: string | null;
  schoolYear: string | null;
  sectionsWithErrors: string[];
}

/* eslint-disable @typescript-eslint/no-explicit-any */

const IEP_SYSTEM_PROMPT = `You are a Special Education Director with 35 years of experience in Connecticut public schools. You have reviewed thousands of IEP documents. You know exactly what a strong IEP looks like, what districts try to get away with, what language is legally enforceable versus what sounds good but means nothing, and what a parent should push back on before signing.

Your job is to read a proposed IEP document and give a parent a completely honest, plain-English analysis of what it actually offers — and what it is missing.

CORE PRINCIPLES:
- Be honest. A weak IEP is a weak IEP. Do not soften it.
- Be specific. Quote the actual IEP language when flagging problems.
- Be actionable. Every criticism must come with a specific suggestion.
- Write at an 8th grade reading level.
- Never use legal jargon without immediately explaining it.
- Never say "legally entitled to" — say "families in similar situations have successfully requested"
- The parent is about to sign a legally binding document. Treat this with appropriate seriousness.

WHAT MAKES A STRONG IEP GOAL:
- Has a measurable baseline: "Currently reading at 72 words per minute"
- Has a specific target: "Will read 95 words per minute"
- Has clear criteria: "as measured by curriculum-based reading probes"
- Has a timeline: "by June 2026"
- Is specific to the child's actual needs
- Example of strong goal: "By June 2026, given a 4th grade reading passage, [child] will read 95 words per minute with 95% accuracy as measured by bi-weekly curriculum-based reading probes, improving from a baseline of 72 words per minute."

WHAT MAKES A WEAK OR VAGUE IEP GOAL:
- No baseline: "will improve reading skills"
- No measurable target: "will make progress in reading"
- No criteria: "as evidenced by teacher observation"
- Vague timeline: "by the end of the year"
- Generic language that could apply to any child
- Example of weak goal: "Student will improve reading fluency with teacher support."

LANGUAGE TO ALWAYS FLAG AS PROBLEMATIC:
- "with teacher support" — not measurable, who provides support and how?
- "as appropriate" — district decides what is appropriate, not the IEP
- "when possible" — allows the district to not provide the service
- "will attempt to" — no commitment to actual achievement
- "will work on" — not a measurable goal
- "as needed" — the district decides when it is needed
- "minimal assistance" — not defined or measurable
- "will demonstrate improvement" — no baseline, no target
- Any goal without a number, percentage, or measurable criterion`;

const CLASSIFICATION_PROMPT = `You are analyzing an IEP document. Extract structured metadata.

Return ONLY valid JSON:
{
  "iepDate": "date of the IEP or null",
  "schoolYear": "school year e.g. 2025-2026 or null",
  "childName": "child's first name or null",
  "grade": "grade level or null",
  "state": "state or null",
  "primaryDisabilities": ["array of disability categories listed"],
  "placementType": "general education / resource room / self-contained / specialized school / other",
  "servicesFound": [
    {
      "serviceName": "name of the service",
      "frequency": "how often e.g. 3x per week",
      "duration": "how long per session e.g. 45 minutes",
      "location": "where e.g. resource room, general education classroom"
    }
  ],
  "totalGoalsCount": 0,
  "accommodationsFound": ["list of accommodations as written in the IEP"],
  "goalAreas": ["reading", "math", "writing", "behavior", "speech", "other areas covered by goals"]
}

IEP Document text:
{IEP_TEXT}`;

const GOAL_ANALYSIS_PROMPT = `Analyze every IEP goal in this document. For each goal, provide a detailed quality analysis.

Return ONLY valid JSON:
{
  "goals": [
    {
      "goalText": "the exact goal as written in the IEP",
      "area": "the subject area this goal addresses e.g. reading fluency, math calculation, social skills",
      "qualityRating": "strong OR adequate OR weak OR vague",
      "whyThisRating": "2-3 sentences explaining exactly why this goal is strong, adequate, weak, or vague. Be specific. Quote the problematic language.",
      "suggestedRewrite": "if weak or vague: a specific rewrite of this goal that makes it measurable and enforceable. If strong: null.",
      "isMeasurable": true or false,
      "hasBaseline": true or false,
      "hasCriteria": true or false
    }
  ]
}

If you cannot find any goals in the text, return {"goals": []}.

IEP Document text:
{IEP_TEXT}`;

const SUMMARY_PROMPT = `Write a plain-English summary of this IEP document.

The summary should tell the parent:
1. What special education services this IEP provides (what, how much, where)
2. What the IEP goals are trying to address
3. What accommodations are included
4. The overall placement and support level

Write 3-4 paragraphs at an 8th grade reading level in a warm, direct voice. Be honest — if the IEP is thin, say so gently. If it is comprehensive, say so.

Return plain text only, no JSON.

IEP Document text:
{IEP_TEXT}`;

const PUSHBACK_PROMPT = `Identify specific language in this IEP that is vague, unmeasurable, or legally unenforceable. A parent needs to know what to push back on before signing.

For each problematic phrase or section you find:
- Quote the exact language from the IEP
- Explain in plain English why it is problematic
- Provide specific replacement language

Return ONLY valid JSON:
{
  "items": [
    {
      "originalLanguage": "exact quote from the IEP",
      "whyItIsProblematic": "plain-English explanation of the problem — be specific",
      "suggestedReplacement": "what the language should say instead",
      "location": "where in the IEP this appears e.g. Reading Goal 1, Accommodations section, Services table"
    }
  ]
}

Focus on: vague goal language, missing baselines, unenforceable service language, ambiguous accommodation language, and any place where the district has given itself wiggle room to not deliver what it promises.

IEP Document text:
{IEP_TEXT}`;

const BEFORE_YOU_SIGN_PROMPT = `Based on this IEP document, what are the most important things a parent should clarify or request before signing?

Generate 4-6 specific action items. Each should be one concrete thing the parent can do or ask for. Frame them as direct instructions.

Return ONLY valid JSON:
{
  "items": [
    "specific action item written as a direct instruction to the parent"
  ]
}

Examples of good action items:
- "Ask the district to add a measurable baseline to Reading Goal 1 before you sign — as written, there is no way to measure progress."
- "Request that the speech therapy frequency be changed from 'as needed' to a specific number of sessions per week."
- "Ask for written clarification on what 'extended time' means — is it time and a half, double time, or unlimited time?"

IEP Document text:
{IEP_TEXT}`;

const OVERALL_RATING_PROMPT = `Based on your analysis of this IEP document, provide an overall rating and explanation.

Rating options:
- "strong": IEP has measurable goals with baselines, appropriate services at appropriate frequency, clear accommodations, and enforceable language throughout
- "adequate": IEP covers the basics but has some vague goals or missing elements that should be strengthened before signing
- "weak": IEP has significant problems — vague goals, inadequate services, missing accommodations, or language that gives the district too much wiggle room
- "insufficient": IEP fails to address the child's documented needs — major gaps, unmeasurable goals throughout, and services that fall well short of what the profile requires

Return ONLY valid JSON:
{
  "rating": "strong OR adequate OR weak OR insufficient",
  "explanation": "3-4 sentences in plain English explaining this rating. Be specific. Name the 2-3 most important strengths and weaknesses. Tell the parent what this rating means for their child."
}

IEP Document text:
{IEP_TEXT}`;

export async function analyzeIEPDocument(
  iepText: string,
  briefContext?: {
    summary: string;
    scoresExplained: any[];
    services: any[];
    accommodations: any[];
  } | null
): Promise<IEPAnalysis> {
  const sectionsWithErrors: string[] = [];
  const truncatedText = iepText.slice(0, 90000);

  // Gap analysis prompt is built dynamically — richer when we have brief context.
  const GAP_ANALYSIS_PROMPT = briefContext
    ? `Compare this IEP document against the child's evaluation brief findings. Identify gaps between what the evaluation scores support and what the IEP actually offers.

Evaluation brief context:
Summary: ${briefContext.summary}

Scores: ${briefContext.scoresExplained
        .map(
          (b: any) =>
            `${b.batteryName}: ${b.scoresFound
              ?.map((s: any) => `${s.name} ${s.score} (${s.percentile}th pct)`)
              .join(", ")}`
        )
        .join("\n")}

Services the evaluation supports: ${briefContext.services
        .map((s: any) => s.serviceName)
        .join(", ")}
Accommodations the evaluation supports: ${briefContext.accommodations
        .flatMap((c: any) => c.accommodations?.map((a: any) => a.name) || [])
        .join(", ")}

Now analyze the IEP:
${truncatedText}

Return ONLY valid JSON:
{
  "gaps": [
    {
      "area": "the area where there is a gap e.g. reading instruction, speech therapy, processing speed accommodations",
      "whatScoresSay": "what the evaluation findings indicate the child needs in this area",
      "whatIEPOffers": "what the IEP actually provides in this area — quote specific language",
      "gapSeverity": "significant OR moderate OR minor OR none",
      "recommendation": "specific recommendation for what to request to close this gap"
    }
  ]
}`
    : `Analyze this IEP document and identify any apparent gaps or areas where the services and goals seem insufficient based on the documented needs.

IEP Document:
${truncatedText}

Return ONLY valid JSON:
{
  "gaps": [
    {
      "area": "area of concern",
      "whatScoresSay": "what the IEP itself documents about this child's needs in this area",
      "whatIEPOffers": "what the IEP provides for this area",
      "gapSeverity": "significant OR moderate OR minor OR none",
      "recommendation": "specific recommendation"
    }
  ]
}`;

  const MISSING_ACCOMMODATIONS_PROMPT = briefContext
    ? `Based on the evaluation findings and this IEP document, identify accommodations that the child's profile supports but that are missing from the IEP.

Accommodations the evaluation supports: ${briefContext.accommodations
        .flatMap(
          (c: any) =>
            c.accommodations?.map((a: any) => `${a.name}: ${a.why}`) || []
        )
        .join("\n")}

IEP Document:
${truncatedText}

Return ONLY valid JSON:
{
  "missing": [
    {
      "accommodation": "name of the missing accommodation",
      "why": "why this accommodation is supported by the evaluation findings",
      "priority": "high OR medium OR consider"
    }
  ]
}`
    : `Based on the documented needs in this IEP, identify accommodations that seem to be missing or should be considered.

IEP Document:
${truncatedText}

Return ONLY valid JSON:
{
  "missing": [
    {
      "accommodation": "name of the missing accommodation",
      "why": "why this accommodation seems warranted based on the IEP's own documentation",
      "priority": "high OR medium OR consider"
    }
  ]
}`;

  // Run all analysis calls in parallel.
  const results = await Promise.allSettled([
    callWithRetry(
      {
        model: FAST_MODEL,
        max_tokens: 1500,
        messages: [
          {
            role: "user",
            content: CLASSIFICATION_PROMPT.replace(
              "{IEP_TEXT}",
              truncatedText.slice(0, 20000)
            ),
          },
        ],
      },
      "classification"
    ),

    callWithRetry(
      {
        model: MAIN_MODEL,
        max_tokens: 1500,
        system: IEP_SYSTEM_PROMPT,
        messages: [
          { role: "user", content: SUMMARY_PROMPT.replace("{IEP_TEXT}", truncatedText) },
        ],
      },
      "summary"
    ),

    callWithRetry(
      {
        model: MAIN_MODEL,
        max_tokens: 6000,
        system: IEP_SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: GOAL_ANALYSIS_PROMPT.replace("{IEP_TEXT}", truncatedText),
          },
        ],
      },
      "goals"
    ),

    callWithRetry(
      {
        model: MAIN_MODEL,
        max_tokens: 4000,
        system: IEP_SYSTEM_PROMPT,
        messages: [{ role: "user", content: GAP_ANALYSIS_PROMPT }],
      },
      "gaps"
    ),

    callWithRetry(
      {
        model: MAIN_MODEL,
        max_tokens: 3000,
        system: IEP_SYSTEM_PROMPT,
        messages: [{ role: "user", content: MISSING_ACCOMMODATIONS_PROMPT }],
      },
      "missing_accommodations"
    ),

    callWithRetry(
      {
        model: MAIN_MODEL,
        max_tokens: 3000,
        system: IEP_SYSTEM_PROMPT,
        messages: [
          { role: "user", content: PUSHBACK_PROMPT.replace("{IEP_TEXT}", truncatedText) },
        ],
      },
      "pushback"
    ),

    callWithRetry(
      {
        model: MAIN_MODEL,
        max_tokens: 800,
        system: IEP_SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: BEFORE_YOU_SIGN_PROMPT.replace("{IEP_TEXT}", truncatedText),
          },
        ],
      },
      "before_you_sign"
    ),

    callWithRetry(
      {
        model: MAIN_MODEL,
        max_tokens: 600,
        system: IEP_SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: OVERALL_RATING_PROMPT.replace("{IEP_TEXT}", truncatedText),
          },
        ],
      },
      "overall_rating"
    ),
  ]);

  const getText = (
    result: PromiseSettledResult<{ response: { content: any[] } }>,
    section: string
  ): string => {
    if (result.status === "rejected") {
      sectionsWithErrors.push(section);
      return "";
    }
    const content = result.value.response.content[0];
    return content.type === "text" ? content.text.trim() : "";
  };

  const getJSON = <T>(
    result: PromiseSettledResult<{ response: { content: any[] } }>,
    section: string,
    key?: string
  ): T | null => {
    const text = getText(result, section);
    if (!text) return null;
    try {
      const parsed = parseJSONResponse<any>(text, section);
      return key ? parsed[key] : parsed;
    } catch {
      sectionsWithErrors.push(`${section}_parse`);
      return null;
    }
  };

  const [
    classificationResult,
    summaryResult,
    goalsResult,
    gapsResult,
    missingResult,
    pushbackResult,
    beforeSignResult,
    ratingResult,
  ] = results;

  const classification = getJSON<any>(classificationResult, "classification");
  const goals = getJSON<any>(goalsResult, "goals", "goals");
  const gaps = getJSON<any>(gapsResult, "gaps", "gaps");
  const missing = getJSON<any>(missingResult, "missing_accommodations", "missing");
  const pushback = getJSON<any>(pushbackResult, "pushback", "items");
  const beforeSign = getJSON<any>(beforeSignResult, "before_you_sign", "items");
  const rating = getJSON<any>(ratingResult, "overall_rating");

  return {
    iepSummary: getText(summaryResult, "summary"),
    goalAnalysis: goals || [],
    gapAnalysis: gaps || [],
    missingAccommodations: missing || [],
    languageToPushback: pushback || [],
    overallRating: rating?.rating || "adequate",
    overallRatingExplanation: rating?.explanation || "",
    beforeYouSign: beforeSign || [],
    servicesFound: classification?.servicesFound || [],
    goalsFound: goals?.length || classification?.totalGoalsCount || 0,
    accommodationsFound: classification?.accommodationsFound || [],
    iepDate: classification?.iepDate || null,
    schoolYear: classification?.schoolYear || null,
    sectionsWithErrors,
  };
}
