import { anthropic, FAST_MODEL } from "./client";

export interface ReportClassification {
  childAge: number | null;
  childGrade: string | null;
  state: string | null;
  stateCode: string | null;
  evaluationType: "initial" | "reevaluation" | "unknown";
  meetingTerminology: string;
  batteriesFound: string[];
  primaryDiagnosticAreas: string[];
  reportDate: string | null;
  evaluatorType: "school_district" | "private" | "unknown";
}

const CLASSIFICATION_PROMPT = `You are an expert at analyzing neuropsychological and psychoeducational evaluation reports for children with learning disabilities and developmental differences.

Analyze the following evaluation report text and extract structured metadata. Return ONLY valid JSON with no additional text, explanation, or markdown formatting.

Extract the following:
1. childAge: The child's age as a number (just the number, null if not found)
2. childGrade: The child's grade as a string (e.g. "3rd", "kindergarten", null if not found)
3. state: The full state name where the evaluation took place (null if not found)
4. stateCode: Two-letter state code (null if not found)
5. evaluationType: "initial" if this is a first evaluation, "reevaluation" if this is a re-evaluation, "unknown" if unclear
6. meetingTerminology: The correct term for the IEP meeting in this state. Use "PPT" for Connecticut, "ARD" for Texas, "IEP Meeting" for all other states
7. batteriesFound: An array of assessment battery names found in the report. Look for any of these and include all that are present: WISC-V, WISC-IV, WIAT-IV, WIAT-III, BASC-3, BASC-2, CTOPP-2, CTOPP, GARS-3, GARS-2, Vineland-3, Vineland-II, NEPSY-II, NEPSY, WJ-IV, Woodcock-Johnson, KTEA-3, KTEA, BRIEF-2, BRIEF, Conners-3, Conners, ADOS-2, ADOS, ADI-R, CARS-2, SRS-2, DKEFS, CASL-2, CASL, CELF-5, CELF, GFTA-3, GFTA, PPVT-5, PPVT, EVT-3, EVT, PAL-II, TOWRE-2, TOWRE, RAVE-O, DIBELS, AIMSweb, Beery VMI, Rey-O, RCFT, Trail Making Test, Stroop, CPT-3, TOVA, Leiter-3, Leiter, Stanford-Binet, SB5, UNIT-2, CMS, WRAML-2, WRAML, CVLT-C, CAVLT, ROCFT, Bender-Gestalt, DAP, Figure Drawing
8. primaryDiagnosticAreas: An array of the main areas of concern identified in the report. Use plain English terms like: "reading and decoding", "math", "writing", "attention and focus", "working memory", "processing speed", "social-emotional", "speech and language", "autism spectrum", "intellectual functioning", "executive function", "visual-motor integration", "phonological processing"
9. reportDate: The date of the report as a string in YYYY-MM-DD format (null if not found)
10. evaluatorType: "school_district" if conducted by the school, "private" if conducted by a private evaluator, "unknown" if unclear

Report text:
{REPORT_TEXT}

Return only valid JSON. No other text.`;

export async function classifyReport(reportText: string): Promise<ReportClassification> {
  const truncatedText = reportText.slice(0, 12000);

  const response = await anthropic.messages.create({
    model: FAST_MODEL,
    max_tokens: 1000,
    messages: [
      {
        role: "user",
        content: CLASSIFICATION_PROMPT.replace("{REPORT_TEXT}", truncatedText),
      },
    ],
  });

  const content = response.content[0];
  if (content.type !== "text") {
    throw new Error("Classification returned unexpected response type");
  }

  try {
    const cleaned = content.text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleaned) as ReportClassification;
  } catch {
    throw new Error("Classification returned invalid JSON");
  }
}
