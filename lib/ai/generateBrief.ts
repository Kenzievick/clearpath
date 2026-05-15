import { anthropic, MAIN_MODEL, FAST_MODEL } from "./client";
import { ReportClassification } from "./classify";
import { ScoreInterpretation } from "./interpret";

export interface GeneratedBrief {
  summary: string;
  keyFindings: string[];
  formalDiagnoses: string[];
  profileSeverity: "mild" | "moderate" | "significant" | "complex";
  scoresExplained: ScoreInterpretation[];
  services: {
    serviceName: string;
    why: string;
    typicalFrequency: string;
    priorityLevel: "high" | "medium" | "consider";
  }[];
  accommodations: {
    category: string;
    accommodations: {
      name: string;
      why: string;
    }[];
  }[];
  questions: {
    question: string;
    purpose: string;
  }[];
  watchFor: string;
  rights: {
    stateTerminology: string;
    keyRights: string[];
    timelines: string[];
    ieeRight: string;
  };
}

const BRIEF_SYSTEM_PROMPT = `You are a Special Education Director with 35 years of experience in Connecticut public schools. You have run thousands of IEP meetings. You know exactly what districts offer, what they try to minimize, what parents miss, and what makes the difference between a child getting the services they need and a child being underserved for years.

You are writing a plain-English advocacy brief for a parent. This brief is the document they will bring to the IEP meeting. It must be accurate, specific, warm, and actionable. Every recommendation must be grounded in the actual scores from the report — never generic.

Write at an 8th grade reading level. Use short sentences. Use plain English. Treat the parent as intelligent but not clinically trained.

Never say "your child legally qualifies for" — instead say "based on your child's scores, families in similar situations have successfully requested" or "these scores typically support eligibility for."

Never minimize real difficulties. Never catastrophize. Be honest, warm, and direct — the way a trusted insider would speak to a friend.`;

const SERVICES_PROMPT = `Based on the following score interpretations from a child's evaluation report, generate a list of special education services and related services that this child's profile typically supports.

Child profile:
- Age: {AGE}
- Grade: {GRADE}
- State: {STATE}
- Evaluation type: {EVAL_TYPE}
- Primary areas of concern: {DIAGNOSTIC_AREAS}

Score summary:
{SCORES_SUMMARY}

Generate a services list. Return ONLY valid JSON:

{
  "services": [
    {
      "serviceName": "name of the service e.g. Special Education Reading Instruction",
      "why": "1-2 sentences explaining specifically why this child's scores support this service request — cite the actual scores",
      "typicalFrequency": "what frequency is typically appropriate e.g. '45 minutes per day, 5 days per week' or '60 minutes per week'",
      "priorityLevel": "high, medium, or consider — high means strongly supported by scores, medium means supported, consider means worth discussing"
    }
  ]
}

Services to consider based on the profile (include only those actually supported by the scores):
- Special Education Instruction (resource room, inclusion support, or self-contained)
- Reading Specialist support
- Math Specialist support
- Speech-Language Therapy
- Occupational Therapy
- Physical Therapy
- Extended School Year (ESY)
- Assistive Technology evaluation
- School Counseling services
- Social Skills groups
- Applied Behavior Analysis (ABA) — only if autism indicators present
- Orientation and Mobility — only if visual impairment indicators present

Be specific. Be honest. Only include services actually supported by the scores. Do not pad the list.`;

const ACCOMMODATIONS_PROMPT = `Based on the following score profile, generate a state-specific accommodations menu for a child's IEP.

Child profile:
- State: {STATE}
- Grade: {GRADE}
- Primary areas of concern: {DIAGNOSTIC_AREAS}

Score summary:
{SCORES_SUMMARY}

Generate accommodations organized by category. Return ONLY valid JSON:

{
  "accommodations": [
    {
      "category": "category name e.g. Testing Accommodations",
      "accommodations": [
        {
          "name": "accommodation name e.g. Extended time (time and a half) on all assessments",
          "why": "one sentence explaining specifically why this accommodation fits this child's profile — cite the relevant score"
        }
      ]
    }
  ]
}

Categories to include (only if accommodations in that category are supported by the scores):
- Testing Accommodations
- Instructional Accommodations
- Environmental Accommodations
- Assistive Technology
- Behavioral Supports
- Communication Supports

Be specific to this child's actual scores. Every accommodation must have a clear connection to a specific finding in the report.`;

const QUESTIONS_PROMPT = `Based on the following evaluation report findings, generate 10 specific questions for a parent to bring to the IEP meeting.

Child profile:
- State: {STATE}
- Meeting terminology: {MEETING_TERM}
- Primary areas of concern: {DIAGNOSTIC_AREAS}

Score summary:
{SCORES_SUMMARY}

These questions must be:
- Specific to this child's actual findings — not generic IEP questions
- Direct and clear — one sentence each
- Designed to yield a specific commitment from the district
- Ordered from most important to least important

Return ONLY valid JSON:

{
  "questions": [
    {
      "question": "the question to ask, written as if the parent is speaking it directly to the team",
      "purpose": "one sentence explaining what this question is designed to uncover or secure from the district"
    }
  ]
}`;

const WATCH_FOR_PROMPT = `Based on this child's evaluation profile, write 2-3 paragraphs telling the parent what to watch for in the proposed IEP.

Child profile:
- Grade: {GRADE}
- Primary areas of concern: {DIAGNOSTIC_AREAS}

Score summary:
{SCORES_SUMMARY}

Cover:
1. What a strong IEP looks like for this specific profile
2. What vague or weak language to push back on (with examples of what weak language sounds like vs. strong language)
3. What the district may try to offer that falls short of what the scores support

Write in warm, direct plain English. Write as a trusted insider speaking to a friend. Return the text as a single string — no JSON needed for this section.`;

const RIGHTS_PROMPT = `Generate the state-specific rights section for a parent in {STATE} (meeting terminology: {MEETING_TERM}).

Return ONLY valid JSON:

{
  "stateTerminology": "what the meeting is called in this state",
  "keyRights": [
    "list of 5-7 key procedural rights the parent has in this state, written in plain English"
  ],
  "timelines": [
    "list of 3-5 key legal timelines the district must follow, written as plain English statements"
  ],
  "ieeRight": "2-3 sentences explaining the parent's right to request an Independent Educational Evaluation (IEE) if they disagree with the district's evaluation, including that the district must pay for it or initiate a due process hearing within a reasonable time"
}`;

function buildScoresSummary(interpretations: ScoreInterpretation[]): string {
  return interpretations
    .map((interp) => {
      const scores = interp.scoresFound
        .map(
          (s) =>
            `${s.name}: ${s.score ?? "not found"} (${
              s.percentile ? s.percentile + "th percentile" : "percentile not reported"
            })`
        )
        .join(", ");
      return `${interp.batteryName}: ${scores}. ${interp.plainEnglishSummary}`;
    })
    .join("\n\n");
}

export async function generateFullBrief(
  reportText: string,
  classification: ReportClassification,
  interpretations: ScoreInterpretation[],
  childProfile: {
    firstName: string;
    age: number;
    grade: string;
    state: string;
    evaluationType: string;
  }
): Promise<GeneratedBrief> {
  const scoresSummary = buildScoresSummary(interpretations);
  const diagnosticAreas = classification.primaryDiagnosticAreas.join(", ");
  const state = childProfile.state || classification.state || "the United States";
  const meetingTerm = classification.meetingTerminology || "IEP Meeting";

  const [
    summaryResponse,
    servicesResponse,
    accommodationsResponse,
    questionsResponse,
    watchForResponse,
    rightsResponse,
    keyFindingsResponse,
  ] = await Promise.all([
    anthropic.messages.create({
      model: MAIN_MODEL,
      max_tokens: 1500,
      system: BRIEF_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Write a plain-English summary of this child's evaluation report findings. 2-3 paragraphs. Written at 8th grade reading level. Warm, clear, honest. Tell the parent what the evaluators found, what it means for their child's daily life, and what the overall picture suggests about their child's learning profile.

IMPORTANT: If the evaluator stated formal diagnoses in the report (such as dyslexia, ADHD, Specific Learning Disability, Autism Spectrum Disorder, etc.), name them explicitly in the summary using plain English. Do not soften diagnostic language that the evaluator used. If the evaluator said "dyslexia," use that word. If the evaluator diagnosed ADHD Combined Type, say so clearly. Parents need to hear the actual diagnostic conclusions, not softened clinical language.

Child: ${childProfile.firstName}, age ${childProfile.age}, grade ${childProfile.grade}
State: ${state}
Primary areas of concern: ${diagnosticAreas}

Score summary:
${scoresSummary}

Write as plain text, no JSON needed.`,
        },
      ],
    }),

    anthropic.messages.create({
      model: MAIN_MODEL,
      max_tokens: 3000,
      system: BRIEF_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: SERVICES_PROMPT
            .replace("{AGE}", String(childProfile.age))
            .replace("{GRADE}", childProfile.grade)
            .replace("{STATE}", state)
            .replace("{EVAL_TYPE}", childProfile.evaluationType)
            .replace("{DIAGNOSTIC_AREAS}", diagnosticAreas)
            .replace("{SCORES_SUMMARY}", scoresSummary),
        },
      ],
    }),

    anthropic.messages.create({
      model: MAIN_MODEL,
      max_tokens: 3000,
      system: BRIEF_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: ACCOMMODATIONS_PROMPT
            .replace("{STATE}", state)
            .replace("{GRADE}", childProfile.grade)
            .replace("{DIAGNOSTIC_AREAS}", diagnosticAreas)
            .replace("{SCORES_SUMMARY}", scoresSummary),
        },
      ],
    }),

    anthropic.messages.create({
      model: MAIN_MODEL,
      max_tokens: 2000,
      system: BRIEF_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: QUESTIONS_PROMPT
            .replace("{STATE}", state)
            .replace("{MEETING_TERM}", meetingTerm)
            .replace("{DIAGNOSTIC_AREAS}", diagnosticAreas)
            .replace("{SCORES_SUMMARY}", scoresSummary),
        },
      ],
    }),

    anthropic.messages.create({
      model: MAIN_MODEL,
      max_tokens: 1500,
      system: BRIEF_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: WATCH_FOR_PROMPT
            .replace("{GRADE}", childProfile.grade)
            .replace("{DIAGNOSTIC_AREAS}", diagnosticAreas)
            .replace("{SCORES_SUMMARY}", scoresSummary),
        },
      ],
    }),

    anthropic.messages.create({
      model: FAST_MODEL,
      max_tokens: 1500,
      messages: [
        {
          role: "user",
          content: RIGHTS_PROMPT
            .replace("{STATE}", state)
            .replace("{MEETING_TERM}", meetingTerm),
        },
      ],
    }),

    anthropic.messages.create({
      model: FAST_MODEL,
      max_tokens: 800,
      system: BRIEF_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Based on this evaluation profile, extract:

1. keyFindings: 3-5 bullet points that are the most critical things a parent needs to know. Each bullet should be one clear sentence. Lead with the most important finding. If formal diagnoses were stated, the first bullet should name them.

2. formalDiagnoses: An array of the formal diagnostic conclusions stated in the evaluation report. Use the exact diagnostic language the evaluator used. Examples: "ADHD Combined Type", "Specific Learning Disability in Reading (Dyslexia)", "Autism Spectrum Disorder". Empty array if no formal diagnoses were stated.

3. profileSeverity: A single word assessment of the overall profile complexity:
- "mild": one area of mild concern, minimal impact on daily functioning
- "moderate": one or two areas of moderate concern with some daily impact
- "significant": significant concerns in one or more areas with clear daily impact
- "complex": multiple significant areas of concern with major daily impact

Child: ${childProfile.firstName}, age ${childProfile.age}, grade ${childProfile.grade}
Areas of concern: ${diagnosticAreas}

Score summary:
${scoresSummary}

Return ONLY valid JSON, no markdown:
{
  "keyFindings": ["finding 1", "finding 2", "finding 3"],
  "formalDiagnoses": ["diagnosis 1", "diagnosis 2"],
  "profileSeverity": "moderate"
}`,
        },
      ],
    }),
  ]);

  const parseJSON = (response: typeof summaryResponse, fieldName: string) => {
    const content = response.content[0];
    if (content.type !== "text") throw new Error(`${fieldName} returned unexpected type`);
    try {
      const cleaned = content.text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      return JSON.parse(cleaned);
    } catch {
      throw new Error(`${fieldName} returned invalid JSON`);
    }
  };

  const getText = (response: typeof summaryResponse, fieldName: string): string => {
    const content = response.content[0];
    if (content.type !== "text") throw new Error(`${fieldName} returned unexpected type`);
    return content.text.trim();
  };

  const services = parseJSON(servicesResponse, "Services");
  const accommodations = parseJSON(accommodationsResponse, "Accommodations");
  const questions = parseJSON(questionsResponse, "Questions");
  const rights = parseJSON(rightsResponse, "Rights");

  // Key findings is best-effort — if it fails, fall back to safe empty values
  // so the rest of the brief still generates.
  let keyFindings: string[] = [];
  let formalDiagnoses: string[] = [];
  let profileSeverity: GeneratedBrief["profileSeverity"] = "moderate";
  try {
    const kf = parseJSON(keyFindingsResponse, "KeyFindings");
    if (Array.isArray(kf.keyFindings)) keyFindings = kf.keyFindings;
    if (Array.isArray(kf.formalDiagnoses)) formalDiagnoses = kf.formalDiagnoses;
    if (["mild", "moderate", "significant", "complex"].includes(kf.profileSeverity)) {
      profileSeverity = kf.profileSeverity;
    }
  } catch (e) {
    console.warn("Key findings extraction failed, using defaults:", e);
  }

  return {
    summary: getText(summaryResponse, "Summary"),
    keyFindings,
    formalDiagnoses,
    profileSeverity,
    scoresExplained: interpretations,
    services: services.services,
    accommodations: accommodations.accommodations,
    questions: questions.questions,
    watchFor: getText(watchForResponse, "Watch For"),
    rights: rights,
  };
}
