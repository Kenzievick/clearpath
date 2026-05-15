import Link from "next/link";
import { notFound } from "next/navigation";
import {
  FileText,
  Target,
  GitCompareArrows,
  PlusCircle,
  AlertTriangle,
  ClipboardCheck,
  type LucideIcon,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { NAVY, INK, MUTED } from "@/components/dashboard/ui";
import BackToTop from "@/components/BackToTop";
import CopyItems from "@/components/iep/CopyItems";
import type {
  IEPGoal,
  GapItem,
  PushbackItem,
} from "@/lib/ai/analyzeIEP";

type MissingAccommodation = {
  accommodation: string;
  why: string;
  priority: "high" | "medium" | "consider";
};

type ServiceFound = {
  serviceName: string;
  frequency: string;
  duration: string;
  location: string;
};

function formatDate(d: string | null | undefined) {
  if (!d) return "—";
  const parsed = new Date(d);
  if (isNaN(parsed.getTime())) return d; // iep_date may be a free-text string
  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/* ─── Rating styling ─────────────────────────────────────────────────────── */
const OVERALL_RATING: Record<
  string,
  { label: string; bg: string; fg: string }
> = {
  strong: { label: "Strong IEP", bg: "#D1FAE5", fg: "#065F46" },
  adequate: {
    label: "Adequate IEP — Some Items to Address",
    bg: "#DBEAFE",
    fg: "#1E40AF",
  },
  weak: {
    label: "Weak IEP — Action Required Before Signing",
    bg: "#FEF3C7",
    fg: "#92400E",
  },
  insufficient: {
    label: "Insufficient IEP — Do Not Sign Without Major Changes",
    bg: "#FEE2E2",
    fg: "#991B1B",
  },
};

const GOAL_QUALITY: Record<string, { label: string; bg: string; fg: string }> = {
  strong: { label: "Strong", bg: "#D1FAE5", fg: "#065F46" },
  adequate: { label: "Adequate", bg: "#DBEAFE", fg: "#1E40AF" },
  weak: { label: "Weak", bg: "#FEF3C7", fg: "#92400E" },
  vague: { label: "Vague", bg: "#FEE2E2", fg: "#991B1B" },
};

const GAP_SEVERITY: Record<string, { label: string; bg: string; fg: string }> = {
  significant: { label: "Significant", bg: "#FEE2E2", fg: "#991B1B" },
  moderate: { label: "Moderate", bg: "#FEF3C7", fg: "#92400E" },
  minor: { label: "Minor", bg: "#DBEAFE", fg: "#1E40AF" },
  none: { label: "No Gap", bg: "#D1FAE5", fg: "#065F46" },
};

const PRIORITY: Record<string, { label: string; bg: string; fg: string }> = {
  high: { label: "High priority", bg: "#FEE2E2", fg: "#991B1B" },
  medium: { label: "Medium priority", bg: "#FEF3C7", fg: "#92400E" },
  consider: { label: "Worth discussing", bg: "#F3F4F6", fg: "#374151" },
};

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
    <section className="mb-14 lg:mb-20 pl-5" style={{ borderLeft: `3px solid ${NAVY}` }}>
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

function Chip({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full font-semibold"
      style={{
        background: ok ? "#D1FAE5" : "#FEE2E2",
        color: ok ? "#065F46" : "#991B1B",
        fontSize: "11px",
        padding: "3px 9px",
      }}
    >
      {label} {ok ? "✓" : "✗"}
    </span>
  );
}

export default async function IEPAnalysisPage({
  params,
}: {
  params: { analysisId: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) notFound();

  const { data: analysis } = await supabase
    .from("iep_analyses")
    .select("*, children(first_name)")
    .eq("id", params.analysisId)
    .eq("user_id", user.id)
    .single();

  if (!analysis) notFound();

  const childName =
    (analysis as unknown as { children?: { first_name: string } }).children?.first_name ??
    "Your child";

  // Still processing or failed.
  if (analysis.status !== "completed") {
    return (
      <div>
        <h1 className="font-bold mb-3" style={{ color: INK, fontSize: "28px" }}>
          {childName}&apos;s IEP Analysis
        </h1>
        <p style={{ color: MUTED }}>
          {analysis.status === "processing"
            ? "Your IEP analysis is still being generated. Refresh in a minute."
            : "This analysis failed to generate. Please upload the IEP again."}
        </p>
      </div>
    );
  }

  // Null-safe field access — older analyses may be missing some fields.
  const iepSummary: string = analysis.iep_summary ?? "";
  const goalAnalysis: IEPGoal[] = Array.isArray(analysis.goal_analysis)
    ? analysis.goal_analysis
    : [];
  const gapAnalysis: GapItem[] = Array.isArray(analysis.gap_analysis)
    ? analysis.gap_analysis
    : [];
  const missingAccommodations: MissingAccommodation[] = Array.isArray(
    analysis.missing_accommodations
  )
    ? analysis.missing_accommodations
    : [];
  const languageToPushback: PushbackItem[] = Array.isArray(analysis.language_to_pushback)
    ? analysis.language_to_pushback
    : [];
  const beforeYouSign: string[] = Array.isArray(analysis.before_you_sign)
    ? analysis.before_you_sign
    : [];
  const servicesFound: ServiceFound[] = Array.isArray(analysis.services_found)
    ? analysis.services_found
    : [];
  const accommodationsFound: string[] = Array.isArray(analysis.accommodations_found)
    ? analysis.accommodations_found
    : [];
  const goalsFound: number =
    typeof analysis.goals_found === "number"
      ? analysis.goals_found
      : goalAnalysis.length;
  const overallRating: string = analysis.overall_rating ?? "adequate";
  const overallRatingExplanation: string = analysis.overall_rating_explanation ?? "";
  const ratingStyle = OVERALL_RATING[overallRating] ?? OVERALL_RATING.adequate;
  const usedBrief = !!analysis.brief_id;

  // Goal quality summary counts.
  const goalCounts = { strong: 0, adequate: 0, weak: 0, vague: 0 };
  goalAnalysis.forEach((g) => {
    if (g.qualityRating in goalCounts) goalCounts[g.qualityRating] += 1;
  });

  return (
    <div>
      {/* Header */}
      <div className="mb-2">
        <Link
          href="/dashboard/analyze-iep"
          className="text-sm font-medium hover:underline mb-3 inline-block"
          style={{ color: MUTED }}
        >
          ← Back to all analyses
        </Link>
        <h1
          className="font-bold"
          style={{ color: INK, fontSize: "clamp(28px, 4vw, 38px)", letterSpacing: "-0.02em" }}
        >
          {childName}&apos;s IEP Analysis
        </h1>
        <p className="mt-1.5" style={{ color: MUTED, fontSize: "14px" }}>
          Analyzed on {formatDate(analysis.completed_at ?? analysis.created_at)}
          {analysis.iep_date && ` · IEP dated ${formatDate(analysis.iep_date)}`}
        </p>
        {usedBrief && (
          <span
            className="inline-block mt-2 rounded-full font-semibold"
            style={{
              background: "#EEF2F9",
              color: NAVY,
              fontSize: "12px",
              padding: "4px 12px",
            }}
          >
            Cross-referenced with your child&apos;s evaluation brief
          </span>
        )}
      </div>

      <div className="mt-8 max-w-3xl">
        {/* Overall rating banner */}
        <div
          className="rounded-2xl mb-12"
          style={{ background: ratingStyle.bg, padding: "24px 28px" }}
        >
          <p
            className="font-bold mb-1.5"
            style={{ color: ratingStyle.fg, fontSize: "20px", letterSpacing: "-0.01em" }}
          >
            {ratingStyle.label}
          </p>
          {overallRatingExplanation && (
            <p style={{ color: ratingStyle.fg, fontSize: "14.5px", lineHeight: 1.65 }}>
              {overallRatingExplanation}
            </p>
          )}
        </div>

        {/* Section 1 — What this IEP is offering */}
        <Section icon={FileText} eyebrow="Section 1" title="What this IEP is offering">
          <div
            className="whitespace-pre-line mb-6"
            style={{ color: "#374151", fontSize: "17px", lineHeight: 1.75 }}
          >
            {iepSummary || "No summary was generated for this IEP."}
          </div>
          <div className="flex flex-wrap gap-3">
            {[
              { value: goalsFound, label: goalsFound === 1 ? "goal" : "goals" },
              {
                value: servicesFound.length,
                label: servicesFound.length === 1 ? "service" : "services",
              },
              {
                value: accommodationsFound.length,
                label:
                  accommodationsFound.length === 1
                    ? "accommodation"
                    : "accommodations",
              },
              ...(analysis.school_year
                ? [{ value: analysis.school_year, label: "school year" }]
                : []),
            ].map((stat, i) => (
              <div
                key={i}
                className="rounded-xl"
                style={{ background: "#EEF2F9", padding: "12px 18px" }}
              >
                <div className="font-bold" style={{ color: NAVY, fontSize: "20px" }}>
                  {stat.value}
                </div>
                <div style={{ color: MUTED, fontSize: "12px" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* Section 2 — Goal quality analysis */}
        <Section icon={Target} eyebrow="Section 2" title="Goal quality analysis">
          {goalAnalysis.length === 0 ? (
            <p style={{ color: MUTED, fontSize: "15px" }}>
              No goals were found in this IEP document.
            </p>
          ) : (
            <>
              <div
                className="rounded-xl mb-5 font-semibold"
                style={{
                  background: "#F9FAFB",
                  border: "1px solid #F3F4F6",
                  padding: "12px 18px",
                  color: INK,
                  fontSize: "14px",
                }}
              >
                {goalCounts.strong} Strong · {goalCounts.adequate} Adequate ·{" "}
                {goalCounts.weak} Weak · {goalCounts.vague} Vague
              </div>
              <div className="space-y-4">
                {goalAnalysis.map((g, i) => {
                  const q = GOAL_QUALITY[g.qualityRating] ?? GOAL_QUALITY.adequate;
                  return (
                    <div
                      key={i}
                      className="bg-white rounded-2xl"
                      style={{
                        boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.04)",
                        padding: "24px",
                      }}
                    >
                      <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
                        <span
                          className="italic"
                          style={{ color: MUTED, fontSize: "14px", lineHeight: 1.6, flex: 1 }}
                        >
                          “{g.goalText}”
                        </span>
                        <span
                          className="rounded-full font-semibold uppercase flex-shrink-0"
                          style={{
                            background: q.bg,
                            color: q.fg,
                            fontSize: "11px",
                            padding: "3px 10px",
                            letterSpacing: "0.04em",
                          }}
                        >
                          {q.label}
                        </span>
                      </div>
                      {g.area && (
                        <p
                          className="font-semibold mb-3"
                          style={{ color: INK, fontSize: "13px" }}
                        >
                          {g.area}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Chip ok={!!g.isMeasurable} label="Measurable" />
                        <Chip ok={!!g.hasBaseline} label="Has Baseline" />
                        <Chip ok={!!g.hasCriteria} label="Has Criteria" />
                      </div>
                      <p style={{ color: "#374151", fontSize: "14.5px", lineHeight: 1.65 }}>
                        {g.whyThisRating}
                      </p>
                      {g.suggestedRewrite && (
                        <div
                          className="rounded-xl mt-4"
                          style={{ background: "#EEF2F9", padding: "14px 16px" }}
                        >
                          <p
                            className="font-semibold uppercase mb-1.5"
                            style={{ color: NAVY, fontSize: "11px", letterSpacing: "0.1em" }}
                          >
                            Suggested rewrite
                          </p>
                          <p style={{ color: INK, fontSize: "14px", lineHeight: 1.6 }}>
                            {g.suggestedRewrite}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </Section>

        {/* Section 3 — Gap analysis */}
        {gapAnalysis.length > 0 ? (
          <Section
            icon={GitCompareArrows}
            eyebrow="Section 3"
            title={
              usedBrief
                ? "Gaps between the evaluation and the IEP"
                : "Areas that may be underserved"
            }
          >
            <div className="space-y-4">
              {gapAnalysis.map((gap, i) => {
                const sev = GAP_SEVERITY[gap.gapSeverity] ?? GAP_SEVERITY.moderate;
                return (
                  <div
                    key={i}
                    className="bg-white rounded-2xl"
                    style={{
                      boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                      padding: "24px",
                    }}
                  >
                    <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
                      <h3 className="font-bold" style={{ color: INK, fontSize: "16px" }}>
                        {gap.area}
                      </h3>
                      <span
                        className="rounded-full font-semibold uppercase flex-shrink-0"
                        style={{
                          background: sev.bg,
                          color: sev.fg,
                          fontSize: "11px",
                          padding: "3px 10px",
                          letterSpacing: "0.04em",
                        }}
                      >
                        {sev.label}
                      </span>
                    </div>
                    <p
                      className="italic mb-1.5"
                      style={{ color: MUTED, fontSize: "14px", lineHeight: 1.6 }}
                    >
                      {gap.whatScoresSay}
                    </p>
                    <p
                      className="mb-3"
                      style={{ color: "#374151", fontSize: "14.5px", lineHeight: 1.65 }}
                    >
                      {gap.whatIEPOffers}
                    </p>
                    <div
                      className="rounded-xl"
                      style={{ background: "#EEF2F9", padding: "14px 16px" }}
                    >
                      <p
                        className="font-semibold uppercase mb-1.5"
                        style={{ color: NAVY, fontSize: "11px", letterSpacing: "0.1em" }}
                      >
                        Recommendation
                      </p>
                      <p style={{ color: INK, fontSize: "14px", lineHeight: 1.6 }}>
                        {gap.recommendation}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Section>
        ) : (
          !usedBrief && (
            <Section
              icon={GitCompareArrows}
              eyebrow="Section 3"
              title="Areas that may be underserved"
            >
              <div
                className="rounded-xl"
                style={{ background: "#EEF2F9", padding: "20px" }}
              >
                <p style={{ color: INK, fontSize: "14.5px", lineHeight: 1.65 }}>
                  Upload your child&apos;s evaluation report to get a deeper gap
                  analysis that compares the IEP against specific test scores.{" "}
                  <Link
                    href="/dashboard/upload"
                    className="font-semibold hover:underline"
                    style={{ color: NAVY }}
                  >
                    Upload an evaluation report →
                  </Link>
                </p>
              </div>
            </Section>
          )
        )}

        {/* Section 4 — Missing accommodations */}
        {missingAccommodations.length > 0 && (
          <Section
            icon={PlusCircle}
            eyebrow="Section 4"
            title="Accommodations that may be missing"
          >
            <div className="space-y-3">
              {missingAccommodations.map((a, i) => {
                const p = PRIORITY[a.priority] ?? PRIORITY.consider;
                return (
                  <div
                    key={i}
                    className="bg-white rounded-xl"
                    style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)", padding: "20px" }}
                  >
                    <div className="flex items-start justify-between gap-3 flex-wrap mb-1.5">
                      <h4 className="font-bold" style={{ color: INK, fontSize: "15px" }}>
                        {a.accommodation}
                      </h4>
                      <span
                        className="rounded-full font-semibold uppercase flex-shrink-0"
                        style={{
                          background: p.bg,
                          color: p.fg,
                          fontSize: "11px",
                          padding: "3px 10px",
                          letterSpacing: "0.04em",
                        }}
                      >
                        {p.label}
                      </span>
                    </div>
                    <p style={{ color: "#374151", fontSize: "14px", lineHeight: 1.6 }}>
                      {a.why}
                    </p>
                  </div>
                );
              })}
            </div>
          </Section>
        )}

        {/* Section 5 — Language to push back on */}
        <Section
          icon={AlertTriangle}
          eyebrow="Section 5"
          title="Language to push back on"
        >
          {languageToPushback.length === 0 ? (
            <p style={{ color: MUTED, fontSize: "15px", lineHeight: 1.6 }}>
              No significant language concerns identified. The IEP language appears
              reasonably specific and enforceable.
            </p>
          ) : (
            <div className="space-y-5">
              {languageToPushback.map((item, i) => (
                <div key={i}>
                  {item.location && (
                    <p
                      className="font-semibold uppercase mb-2"
                      style={{ color: MUTED, fontSize: "11px", letterSpacing: "0.1em" }}
                    >
                      {item.location}
                    </p>
                  )}
                  <div
                    className="rounded-r-xl mb-2"
                    style={{
                      background: "#FEF2F2",
                      borderLeft: "3px solid #C04A3A",
                      padding: "12px 16px",
                    }}
                  >
                    <p
                      className="italic"
                      style={{ color: "#991B1B", fontSize: "14px", lineHeight: 1.6 }}
                    >
                      “{item.originalLanguage}”
                    </p>
                  </div>
                  <p
                    className="mb-2"
                    style={{ color: "#374151", fontSize: "14.5px", lineHeight: 1.65 }}
                  >
                    {item.whyItIsProblematic}
                  </p>
                  <div
                    className="rounded-r-xl"
                    style={{
                      background: "#F0FDF4",
                      borderLeft: "3px solid #15803D",
                      padding: "12px 16px",
                    }}
                  >
                    <p
                      className="font-semibold uppercase mb-1"
                      style={{ color: "#166534", fontSize: "11px", letterSpacing: "0.1em" }}
                    >
                      Suggested replacement
                    </p>
                    <p style={{ color: "#14532D", fontSize: "14px", lineHeight: 1.6 }}>
                      {item.suggestedReplacement}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* Section 6 — Before you sign */}
        <Section icon={ClipboardCheck} eyebrow="Section 6" title="Before you sign">
          {beforeYouSign.length === 0 ? (
            <p style={{ color: MUTED, fontSize: "15px" }}>
              No specific pre-signing action items were generated.
            </p>
          ) : (
            <>
              <div className="flex justify-end mb-4">
                <CopyItems items={beforeYouSign} />
              </div>
              <ol className="space-y-4">
                {beforeYouSign.map((item, i) => (
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
                    <p
                      style={{ color: INK, fontSize: "15px", lineHeight: 1.65, paddingTop: "3px" }}
                    >
                      {item}
                    </p>
                  </li>
                ))}
              </ol>
              <div
                className="rounded-xl mt-6"
                style={{ background: "#FEF3C7", padding: "14px 18px" }}
              >
                <p style={{ color: "#92400E", fontSize: "13.5px", lineHeight: 1.6 }}>
                  Consider requesting a follow-up PPT/IEP meeting to address these items
                  before signing. You are not required to sign the IEP at the meeting.
                </p>
              </div>
            </>
          )}
        </Section>
      </div>

      <BackToTop />
    </div>
  );
}
