import Link from "next/link";
import { notFound } from "next/navigation";
import {
  FileText,
  BarChart3,
  HandHelping,
  Settings2,
  MessageSquareQuote,
  Eye,
  Scale,
  type LucideIcon,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { NAVY, INK, MUTED } from "@/components/dashboard/ui";
import BackToTop from "@/components/BackToTop";
import CopyQuestions from "@/components/brief/CopyQuestions";
import DownloadPDFButton from "@/components/brief/DownloadPDFButton";
import BriefChat from "@/components/brief/BriefChat";
import { PaywallGate } from "@/components/PaywallGate";

type ScoreType =
  | "standard"
  | "tScore"
  | "scaledScore"
  | "percentile"
  | "gradeEquivalent"
  | "ageEquivalent"
  | "other";

type ScoreFound = {
  name: string;
  score: number | null;
  percentile: number | null;
  scoreType?: ScoreType;
  descriptor: string;
  colorCode?: "red" | "amber" | "green";
};

type ScoreInterpretation = {
  batteryName: string;
  batteryFullName: string;
  whatItMeasures: string;
  scoresFound: ScoreFound[];
  plainEnglishSummary: string;
  classroomImpact: string;
  strengthsIdentified: string[];
  areasOfConcern: string[];
};

type Service = {
  serviceName: string;
  why: string;
  typicalFrequency: string;
  priorityLevel: "high" | "medium" | "consider";
};

type AccommodationCategory = {
  category: string;
  accommodations: { name: string; why: string }[];
};

type Question = { question: string; purpose: string };

type Rights = {
  stateTerminology: string;
  keyRights: string[];
  timelines: string[];
  ieeRight: string;
};

const SCORE_COLOR: Record<"red" | "amber" | "green", string> = {
  red: "#C04A3A",
  amber: "#C8893A",
  green: "#1B3A6B",
};

const PRIORITY: Record<Service["priorityLevel"], { label: string; bg: string; fg: string }> = {
  high: { label: "High priority", bg: "#EEF2F9", fg: NAVY },
  medium: { label: "Medium priority", bg: "#FEF3C7", fg: "#92400E" },
  consider: { label: "Worth discussing", bg: "#F3F4F6", fg: "#374151" },
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Pipeline occasionally mislabels behavioral rating scales. Correct known
// mix-ups at display time so we don't have to re-run an upload to fix labels.
function correctBatteryName(
  batteryName: string,
  batteryFullName: string
): { name: string; fullName: string } {
  const full = (batteryFullName || "").toLowerCase();
  const name = (batteryName || "").toLowerCase();
  if (full.includes("achenbach") && name.includes("basc")) {
    return { name: "CBCL", fullName: "Achenbach Child Behavior Checklist" };
  }
  if (name === "basc-2" && full.includes("achenbach")) {
    return { name: "CBCL", fullName: "Achenbach Child Behavior Checklist" };
  }
  return { name: batteryName, fullName: batteryFullName };
}

// Map a score to a 0-100 bar percentage. The percentile is the most intuitive
// visual for a parent, so whenever a percentile is available we draw the bar
// straight from it — regardless of scoreType. Only when there is no percentile
// do we fall back to a scale-specific formula. Returns 0 when there is nothing
// meaningful to draw (grade/age equivalents, unknown types, missing data);
// the renderer hides the bar entirely in that case.
function getBarWidth(
  score: number | null,
  scoreType: ScoreType | string | undefined,
  percentile: number | null
): number {
  // ALWAYS use percentile when available — most intuitive for parents.
  if (percentile !== null && percentile !== undefined) {
    return Math.min(Math.max(percentile, 2), 98);
  }

  // Only fall back to score-based formula when no percentile is available.
  if (score === null) return 0;

  switch (scoreType) {
    case "standard":
      return Math.min(Math.max(((score - 40) / 120) * 100, 2), 98);
    case "tScore":
      return Math.min(Math.max(((score - 20) / 60) * 100, 2), 98);
    case "scaledScore":
      return Math.min(Math.max(((score - 1) / 18) * 100, 2), 98);
    case "percentile":
      return Math.min(Math.max(score, 2), 98);
    default:
      return 0;
  }
}

const BAR_RED = "#C04A3A";
const BAR_AMBER = "#C8893A";
const BAR_NAVY = "#1B3A6B";

// Adaptive T-score scales are "higher = better"; everything else is clinical
// ("higher = worse"). Matched by substring against the score name.
const ADAPTIVE_SCALE_HINTS = [
  "adaptab",
  "social skill",
  "leadership",
  "daily living",
  "activities of daily",
  "functional communication",
  "adaptive",
];

// Derive a bar color from the raw score when colorCode is absent.
function deriveBarColor(
  score: number | null,
  scoreType: ScoreType | undefined,
  name: string
): string {
  if (score === null) return BAR_AMBER;
  const lower = (name || "").toLowerCase();
  switch (scoreType) {
    case "standard":
      if (score >= 90) return BAR_NAVY;
      if (score >= 80) return BAR_AMBER;
      return BAR_RED;
    case "percentile":
      if (score >= 25) return BAR_NAVY;
      if (score >= 9) return BAR_AMBER;
      return BAR_RED;
    case "scaledScore":
      if (score >= 8) return BAR_NAVY;
      if (score >= 7) return BAR_AMBER;
      return BAR_RED;
    case "tScore": {
      const isAdaptive = ADAPTIVE_SCALE_HINTS.some((h) => lower.includes(h));
      if (isAdaptive) {
        // higher = better
        if (score > 40) return BAR_NAVY;
        if (score >= 30) return BAR_AMBER;
        return BAR_RED;
      }
      // clinical: higher = worse
      if (score < 60) return BAR_NAVY;
      if (score < 70) return BAR_AMBER;
      return BAR_RED;
    }
    default:
      return BAR_AMBER;
  }
}

// colorCode is the primary source of truth for bar color. Fall back to
// score-derived clinical thresholds only when colorCode is missing.
function getBarColor(s: ScoreFound): string {
  if (s.colorCode && SCORE_COLOR[s.colorCode]) {
    return SCORE_COLOR[s.colorCode];
  }
  return deriveBarColor(s.score, s.scoreType, s.name);
}

function scoreTypeLabel(scoreType: ScoreType | undefined): string | null {
  if (scoreType === "gradeEquivalent") return "grade equivalent";
  if (scoreType === "ageEquivalent") return "age equivalent";
  return null;
}

const SEVERITY: Record<
  "mild" | "moderate" | "significant" | "complex",
  { label: string; bg: string }
> = {
  mild: { label: "MILD PROFILE", bg: "#2D7A5F" },
  moderate: { label: "MODERATE PROFILE", bg: "#1B3A6B" },
  significant: { label: "SIGNIFICANT PROFILE", bg: "#C8893A" },
  complex: { label: "COMPLEX PROFILE", bg: "#C04A3A" },
};

function isImpactfulFinding(text: string): boolean {
  return /diagnos|below average|clinically significant|grade levels behind/i.test(text);
}

function Section({
  icon: Icon,
  eyebrow,
  title,
  children,
}: {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className="mb-14 lg:mb-20 pl-5"
      style={{ borderLeft: `3px solid ${NAVY}` }}
    >
      <div className="flex items-center gap-2.5 mb-2">
        <Icon size={18} color={NAVY} strokeWidth={2} />
        <span
          className="font-semibold uppercase"
          style={{ color: NAVY, fontSize: "11px", letterSpacing: "0.16em" }}
        >
          {eyebrow}
        </span>
      </div>
      <h2
        className="font-bold mb-6"
        style={{ color: INK, fontSize: "clamp(22px, 3vw, 30px)", letterSpacing: "-0.015em" }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

export default async function BriefPage({
  params,
  searchParams,
}: {
  params: { briefId: string };
  searchParams?: { upgraded?: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) notFound();

  const { data: brief } = await supabase
    .from("briefs")
    .select(
      "id, status, created_at, completed_at, summary, key_findings, formal_diagnoses, profile_severity, scores_explained, services, accommodations, questions, watch_for, rights, child_id, children(first_name)"
    )
    .eq("id", params.briefId)
    .eq("user_id", user.id)
    .single();

  if (!brief) notFound();

  // Subscription gate: free users see Section 1 only.
  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_status")
    .eq("id", user.id)
    .single();
  const isSubscribed = profile?.subscription_status === "active";
  const upgraded = searchParams?.upgraded === "true";

  const childName =
    (brief as unknown as { children?: { first_name: string } }).children?.first_name ?? "Your child";

  const keyFindings: string[] = Array.isArray(brief.key_findings) ? brief.key_findings : [];
  const formalDiagnoses: string[] = Array.isArray(brief.formal_diagnoses)
    ? brief.formal_diagnoses
    : [];
  const profileSeverity = (brief.profile_severity ?? null) as
    | "mild"
    | "moderate"
    | "significant"
    | "complex"
    | null;

  // Still processing or failed — show a minimal placeholder
  if (brief.status !== "completed") {
    return (
      <div>
        <h1 className="font-bold mb-3" style={{ color: INK, fontSize: "28px" }}>
          {childName}&apos;s Evaluation Brief
        </h1>
        <p style={{ color: MUTED }}>
          {brief.status === "processing"
            ? "Your brief is still being generated. Refresh in a minute."
            : "This brief failed to generate. Please upload the report again."}
        </p>
      </div>
    );
  }

  const scoresExplained: ScoreInterpretation[] = (brief.scores_explained as ScoreInterpretation[]) ?? [];
  const services: Service[] = (brief.services as Service[]) ?? [];
  const accommodations: AccommodationCategory[] =
    (brief.accommodations as AccommodationCategory[]) ?? [];
  const questions: Question[] = (brief.questions as Question[]) ?? [];
  const rights: Rights = (brief.rights as Rights) ?? {
    stateTerminology: "IEP Meeting",
    keyRights: [],
    timelines: [],
    ieeRight: "",
  };

  // Group services by priority
  const servicesByPriority: Record<Service["priorityLevel"], Service[]> = {
    high: [],
    medium: [],
    consider: [],
  };
  services.forEach((s) => {
    (servicesByPriority[s.priorityLevel] ?? servicesByPriority.consider).push(s);
  });

  return (
    <div>
      {/* Post-checkout success banner */}
      {upgraded && (
        <div
          className="rounded-xl mb-6 flex items-center gap-3"
          style={{ background: NAVY, color: "#FFFFFF", padding: "14px 20px" }}
        >
          <span style={{ fontSize: "20px" }}>🎉</span>
          <p style={{ fontSize: "14px", fontWeight: 500 }}>
            Welcome to Clearpath! Your subscription is active. Here&apos;s{" "}
            {childName}&apos;s complete brief.
          </p>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap mb-2">
        <div>
          <Link
            href="/dashboard/briefs"
            className="text-sm font-medium hover:underline mb-3 inline-block"
            style={{ color: MUTED }}
          >
            ← Back to all briefs
          </Link>
          <h1
            className="font-bold"
            style={{ color: INK, fontSize: "clamp(28px, 4vw, 38px)", letterSpacing: "-0.02em" }}
          >
            {childName}&apos;s Evaluation Brief
          </h1>
          <p className="mt-1.5" style={{ color: MUTED, fontSize: "14px" }}>
            Generated {formatDate(brief.completed_at ?? brief.created_at)}
          </p>
        </div>
        {isSubscribed && (
          <DownloadPDFButton briefId={brief.id} childName={childName} />
        )}
      </div>

      <div className="mt-10 max-w-3xl">
        {/* Key Findings callout — first thing the parent sees */}
        {(keyFindings.length > 0 || formalDiagnoses.length > 0 || profileSeverity) && (
          <div
            className="bg-white rounded-2xl mb-12"
            style={{ border: `2px solid ${NAVY}`, padding: "32px" }}
          >
            <div className="flex items-center justify-between gap-3 flex-wrap mb-5">
              <span
                className="font-semibold uppercase"
                style={{ color: NAVY, fontSize: "12px", letterSpacing: "0.12em" }}
              >
                Key Findings
              </span>
              {profileSeverity && SEVERITY[profileSeverity] && (
                <span
                  className="rounded-full font-bold uppercase text-white"
                  style={{
                    background: SEVERITY[profileSeverity].bg,
                    fontSize: "11px",
                    padding: "4px 12px",
                    letterSpacing: "0.08em",
                  }}
                >
                  {SEVERITY[profileSeverity].label}
                </span>
              )}
            </div>

            {formalDiagnoses.length > 0 && (
              <div className="mb-6">
                <p
                  className="font-semibold uppercase mb-2"
                  style={{ color: MUTED, fontSize: "11px", letterSpacing: "0.12em" }}
                >
                  Formal Diagnoses
                </p>
                <div className="flex flex-wrap gap-2">
                  {formalDiagnoses.map((d, i) => (
                    <span
                      key={i}
                      className="rounded-full text-white"
                      style={{
                        background: NAVY,
                        fontSize: "14px",
                        padding: "5px 14px",
                        fontWeight: 600,
                      }}
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {keyFindings.length > 0 && (
              <ul className="space-y-2.5">
                {keyFindings.map((f, i) => (
                  <li
                    key={i}
                    className="flex gap-3"
                    style={{
                      color: INK,
                      fontSize: "16px",
                      lineHeight: 1.7,
                      fontWeight: isImpactfulFinding(f) ? 600 : 400,
                    }}
                  >
                    <span style={{ color: NAVY, flexShrink: 0, fontWeight: 700 }}>•</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* 1 — Summary (always visible, free + paid) */}
        <Section icon={FileText} eyebrow="Section 1" title="What this report is saying">
          <div
            className="whitespace-pre-line"
            style={{ color: "#374151", fontSize: "17px", lineHeight: 1.75 }}
          >
            {brief.summary}
          </div>
        </Section>

        {/* Sections 2-7 + chat are paid. Free users hit the paywall here. */}
        {!isSubscribed ? (
          <PaywallGate briefId={brief.id} childName={childName} />
        ) : (
          <>
        {/* 2 — Scores */}
        <Section icon={BarChart3} eyebrow="Section 2" title="Your child's scores explained">
          <div className="space-y-6">
            {scoresExplained.length === 0 && (
              <p style={{ color: MUTED, fontSize: "15px" }}>
                No score interpretations were generated.
              </p>
            )}
            {scoresExplained.map((b) => {
              const corrected = correctBatteryName(b.batteryName, b.batteryFullName);
              return (
              <div
                key={corrected.name}
                className="bg-white rounded-2xl"
                style={{
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.04)",
                  padding: "28px",
                }}
              >
                <h3 className="font-bold mb-1" style={{ color: INK, fontSize: "20px" }}>
                  {corrected.fullName}
                </h3>
                <p className="mb-4" style={{ color: MUTED, fontSize: "13px" }}>
                  {corrected.name}
                </p>

                <p className="mb-1 font-semibold" style={{ color: INK, fontSize: "13px" }}>
                  What this test measures
                </p>
                <p className="mb-5" style={{ color: "#374151", fontSize: "15px", lineHeight: 1.65 }}>
                  {b.whatItMeasures}
                </p>

                {b.scoresFound.length > 0 && (
                  <div className="space-y-3 mb-5">
                    {b.scoresFound.map((s) => {
                      const widthPct = getBarWidth(s.score, s.scoreType, s.percentile);
                      const typeLabel = scoreTypeLabel(s.scoreType);
                      return (
                        <div key={s.name}>
                          <div className="flex items-baseline justify-between gap-3 mb-1.5">
                            <span style={{ color: INK, fontSize: "14px", fontWeight: 600 }}>
                              {s.name}
                            </span>
                            <span style={{ color: INK, fontSize: "14px", fontWeight: 700 }}>
                              {s.score ?? "—"}
                              {typeLabel && (
                                <span
                                  style={{
                                    color: MUTED,
                                    fontWeight: 500,
                                    fontSize: "12px",
                                    marginLeft: "8px",
                                    fontStyle: "italic",
                                  }}
                                >
                                  ({typeLabel})
                                </span>
                              )}
                              {s.percentile != null && !typeLabel && (
                                <span
                                  style={{ color: MUTED, fontWeight: 500, fontSize: "12px", marginLeft: "8px" }}
                                >
                                  {s.percentile}th pct
                                </span>
                              )}
                            </span>
                          </div>
                          {widthPct > 0 && (
                            <div
                              className="rounded-full overflow-hidden"
                              style={{ height: "6px", background: "#F3F4F6" }}
                            >
                              <div
                                className="h-full rounded-full"
                                style={{ width: `${widthPct}%`, background: getBarColor(s) }}
                              />
                            </div>
                          )}
                          <p className="mt-1.5" style={{ color: MUTED, fontSize: "12.5px", lineHeight: 1.5 }}>
                            {s.descriptor}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}

                <p className="mb-1 font-semibold" style={{ color: INK, fontSize: "13px" }}>
                  What this means in plain English
                </p>
                <p className="mb-4" style={{ color: "#374151", fontSize: "15px", lineHeight: 1.7 }}>
                  {b.plainEnglishSummary}
                </p>

                <p className="mb-1 font-semibold" style={{ color: INK, fontSize: "13px" }}>
                  What this looks like in school
                </p>
                <p className="mb-5" style={{ color: "#374151", fontSize: "15px", lineHeight: 1.7 }}>
                  {b.classroomImpact}
                </p>

                {b.strengthsIdentified.length > 0 && (
                  <div
                    className="rounded-xl mb-3"
                    style={{ background: "#EEF2F9", padding: "16px 18px" }}
                  >
                    <p
                      className="font-semibold uppercase mb-2"
                      style={{ color: NAVY, fontSize: "11px", letterSpacing: "0.12em" }}
                    >
                      Strengths identified
                    </p>
                    <ul className="space-y-1.5">
                      {b.strengthsIdentified.map((s, i) => (
                        <li key={i} style={{ color: INK, fontSize: "14px" }}>
                          • {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {b.areasOfConcern.length > 0 && (
                  <div
                    className="rounded-xl"
                    style={{ background: "#FEF3C7", padding: "16px 18px" }}
                  >
                    <p
                      className="font-semibold uppercase mb-2"
                      style={{ color: "#92400E", fontSize: "11px", letterSpacing: "0.12em" }}
                    >
                      Areas of concern
                    </p>
                    <ul className="space-y-1.5">
                      {b.areasOfConcern.map((s, i) => (
                        <li key={i} style={{ color: INK, fontSize: "14px" }}>
                          • {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              );
            })}
          </div>
        </Section>

        {/* 3 — Services */}
        <Section icon={HandHelping} eyebrow="Section 3" title="Services your child may qualify for">
          <div className="space-y-6">
            {(["high", "medium", "consider"] as const).map((p) => {
              const list = servicesByPriority[p];
              if (list.length === 0) return null;
              return (
                <div key={p}>
                  <div
                    className="font-semibold uppercase mb-3"
                    style={{ color: MUTED, fontSize: "11px", letterSpacing: "0.14em" }}
                  >
                    {PRIORITY[p].label}
                  </div>
                  <div className="space-y-3">
                    {list.map((s, i) => (
                      <div
                        key={i}
                        className="bg-white rounded-xl"
                        style={{
                          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                          padding: "20px",
                        }}
                      >
                        <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
                          <h4 className="font-bold" style={{ color: INK, fontSize: "16px" }}>
                            {s.serviceName}
                          </h4>
                          <span
                            className="rounded-full font-semibold"
                            style={{
                              background: PRIORITY[s.priorityLevel].bg,
                              color: PRIORITY[s.priorityLevel].fg,
                              fontSize: "11px",
                              padding: "3px 10px",
                              letterSpacing: "0.04em",
                              textTransform: "uppercase",
                            }}
                          >
                            {PRIORITY[s.priorityLevel].label}
                          </span>
                        </div>
                        <p className="mb-2" style={{ color: "#374151", fontSize: "14.5px", lineHeight: 1.65 }}>
                          {s.why}
                        </p>
                        <span
                          className="inline-block rounded-md"
                          style={{
                            background: "#F3F4F6",
                            color: "#374151",
                            fontSize: "12px",
                            padding: "3px 8px",
                            fontWeight: 500,
                          }}
                        >
                          Typical: {s.typicalFrequency}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <p
            className="mt-5 italic"
            style={{ color: MUTED, fontSize: "13px", lineHeight: 1.6 }}
          >
            These recommendations are based on your child&apos;s score profile.
            They are not legal determinations of eligibility. Discuss with your
            IEP team.
          </p>
        </Section>

        {/* 4 — Accommodations */}
        <Section icon={Settings2} eyebrow="Section 4" title="Accommodations worth requesting">
          <div className="space-y-6">
            {accommodations.map((cat) => (
              <div key={cat.category}>
                <h3 className="font-bold mb-3" style={{ color: INK, fontSize: "16px" }}>
                  {cat.category}
                </h3>
                <ul className="space-y-3">
                  {cat.accommodations.map((a, i) => (
                    <li key={i}>
                      <div style={{ color: INK, fontSize: "15px", fontWeight: 600, marginBottom: "2px" }}>
                        {a.name}
                      </div>
                      <p style={{ color: "#374151", fontSize: "14.5px", lineHeight: 1.65 }}>
                        {a.why}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        {/* 5 — Questions */}
        <Section icon={MessageSquareQuote} eyebrow="Section 5" title="Your 10 questions for the meeting">
          <div className="flex justify-end mb-4">
            <CopyQuestions questions={questions.map((q) => q.question)} />
          </div>
          <ol className="space-y-5">
            {questions.map((q, i) => (
              <li key={i} className="flex gap-4">
                <span
                  className="flex-shrink-0 rounded-full flex items-center justify-center font-bold"
                  style={{
                    width: "30px",
                    height: "30px",
                    background: "#EEF2F9",
                    color: NAVY,
                    fontSize: "14px",
                  }}
                >
                  {i + 1}
                </span>
                <div>
                  <p className="font-bold" style={{ color: INK, fontSize: "16px", lineHeight: 1.55 }}>
                    {q.question}
                  </p>
                  <p className="mt-1" style={{ color: MUTED, fontSize: "13.5px", lineHeight: 1.6 }}>
                    {q.purpose}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Section>

        {/* 6 — Watch For */}
        <Section icon={Eye} eyebrow="Section 6" title="What to watch for">
          <div
            className="whitespace-pre-line"
            style={{ color: "#374151", fontSize: "17px", lineHeight: 1.75 }}
          >
            {brief.watch_for}
          </div>
        </Section>

        {/* 7 — Rights */}
        <Section icon={Scale} eyebrow="Section 7" title="Know your rights">
          <div
            className="rounded-xl mb-6"
            style={{ background: "#EEF2F9", padding: "16px 20px" }}
          >
            <p
              className="font-semibold uppercase mb-1"
              style={{ color: NAVY, fontSize: "11px", letterSpacing: "0.12em" }}
            >
              In your state, the meeting is called
            </p>
            <p className="font-bold" style={{ color: NAVY, fontSize: "18px" }}>
              {rights.stateTerminology}
            </p>
          </div>

          {rights.keyRights.length > 0 && (
            <div className="mb-6">
              <h3 className="font-bold mb-3" style={{ color: INK, fontSize: "16px" }}>
                Your key procedural rights
              </h3>
              <ol className="space-y-2.5 list-decimal list-outside pl-5">
                {rights.keyRights.map((r, i) => (
                  <li key={i} style={{ color: "#374151", fontSize: "15px", lineHeight: 1.65 }}>
                    {r}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {rights.timelines.length > 0 && (
            <div className="mb-6">
              <h3 className="font-bold mb-3" style={{ color: INK, fontSize: "16px" }}>
                Legal timelines the district must follow
              </h3>
              <ol className="space-y-2.5 list-decimal list-outside pl-5">
                {rights.timelines.map((r, i) => (
                  <li key={i} style={{ color: "#374151", fontSize: "15px", lineHeight: 1.65 }}>
                    {r}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {rights.ieeRight && (
            <div
              className="rounded-xl"
              style={{ background: "#FFFFFF", border: `1px solid ${NAVY}`, padding: "20px" }}
            >
              <p
                className="font-semibold uppercase mb-2"
                style={{ color: NAVY, fontSize: "11px", letterSpacing: "0.14em" }}
              >
                Your right to an Independent Educational Evaluation
              </p>
              <p style={{ color: "#374151", fontSize: "15px", lineHeight: 1.7 }}>
                {rights.ieeRight}
              </p>
            </div>
          )}
        </Section>
        {/* Chat */}
        <div className="mt-16">
          <BriefChat briefId={brief.id} childName={childName} />
        </div>
          </>
        )}
      </div>

      <BackToTop />
    </div>
  );
}
