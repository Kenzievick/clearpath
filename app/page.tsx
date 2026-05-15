import Link from "next/link";
import Image from "next/image";
import { Fragment } from "react";
import {
  Shield,
  Lock,
  EyeOff,
  Trash2,
  Award,
  FileText,
  ClipboardCheck,
  ChevronDown,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { FadeIn } from "@/components/FadeIn";
import AccountDeletedToast from "@/components/AccountDeletedToast";

/* ─── Palette ────────────────────────────────────────────────────────────── */
const C = {
  darkBg: "#0B0E0D",
  lightBg: "#FAFAF7",
  inkLight: "#0B0E0D",
  inkDark: "#FFFFFF",
  mutedLight: "#5C6360",
  mutedDark: "#A8B0AC",
  accent: "#1B3A6B",
  accentHover: "#152D54",
  scoreLow: "#C04A3A",
  scoreMid: "#C8893A",
  scoreOk: "#1B3A6B",
  rule: "#E5E7EB",
  ruleDark: "#1F2422",
  pill: "#F3F4F6",
  dotIdle: "#D1D5DB",
};

/* ─── Data ───────────────────────────────────────────────────────────────── */
const stats = [
  { value: "8.2M+", label: "ACTIVE IEPs IN THE US" },
  { value: "15–30", label: "PAGES IN THE AVERAGE REPORT" },
  { value: "~5 min", label: "TO YOUR BRIEF" },
  { value: "35 years", label: "SPECIAL ED DIRECTOR EXPERTISE" },
];

const briefCards = [
  {
    n: "01",
    title: "What This Report Is Saying",
    body: "We read the report the way a special ed director would and tell you what they'd tell their own sister. No acronyms. No clinical hedging. Two paragraphs, the whole picture.",
  },
  {
    n: "02",
    title: "Your Child's Scores Explained",
    body: "For every test in the report — WISC-V, WIAT-IV, BASC-3, whatever they ran — we tell you what it measures, what your child's number actually means, and what that looks like when your kid sits down in a classroom.",
  },
  {
    n: "03",
    title: "Services Your Child May Qualify For",
    body: "Based on the full score profile, we show you the services families in similar situations have successfully requested. Not legal advice — a starting point so you know what to ask for and why.",
  },
  {
    n: "04",
    title: "Accommodations Worth Requesting",
    body: "A full list of accommodations organized by category, with one sentence on why each one fits your child specifically. Not a generic list you could Google. One built from your child's actual scores.",
  },
  {
    n: "05",
    title: "Your 10 Questions for the Meeting",
    body: "Ten questions pulled directly from your child's report — not from an IEP template. Each one is designed to get a specific answer from the district, not a vague commitment that disappears after you sign.",
  },
  {
    n: "06",
    title: "What to Watch For",
    body: "We tell you what a strong IEP looks like for your child's profile and what a weak one looks like. The phrases that sound reasonable but mean nothing. The language worth fighting to change before you sign.",
  },
  {
    n: "07",
    title: "Know Your Rights",
    body: "Your state's specific procedural rights, the correct name for your meeting (PPT in Connecticut, ARD in Texas), the timelines the district has to follow, and what to do if you think the evaluation missed something.",
  },
];

const scoreRows = [
  {
    name: "Processing Speed Index",
    score: "74",
    width: 4, // 4th percentile — bar fill matches the percentile
    color: C.scoreLow,
    note: "4th percentile · Significant difficulty — affects timed tasks and written output",
  },
  {
    name: "Working Memory Index",
    score: "81",
    width: 10, // 10th percentile
    color: C.scoreMid,
    note: "10th percentile · Moderate difficulty — impacts multi-step instructions",
  },
  {
    name: "Verbal Comprehension Index",
    score: "103",
    width: 58, // 58th percentile
    color: C.scoreOk,
    note: "58th percentile · Age-appropriate · Relative strength to leverage",
  },
];

/* ─── Style tokens ───────────────────────────────────────────────────────── */
const labelStyle = { fontSize: "13px", letterSpacing: "0.16em" } as const;
const tinyLabelStyle = { fontSize: "11px", letterSpacing: "0.14em" } as const;
const bodyLargeStyle = { fontSize: "19px", lineHeight: "1.7" } as const;

/* ─── Hero product card ──────────────────────────────────────────────────── */
function ReportCard() {
  return (
    <div
      className="bg-white rounded-2xl w-full lg:w-[420px]"
      style={{
        boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
        padding: "24px",
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <span
          className="uppercase font-semibold"
          style={{ ...tinyLabelStyle, color: C.mutedLight }}
        >
          WISC-V · Wechsler Intelligence Scale
        </span>
        <span
          className="inline-flex items-center gap-1.5 uppercase font-semibold"
          style={{ ...tinyLabelStyle, color: C.mutedLight }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: C.accent }}
          />
          Processing complete
        </span>
      </div>

      {/* Score rows */}
      <div className="space-y-4">
        {scoreRows.map((r) => (
          <div key={r.name}>
            <div className="flex items-center justify-between mb-1.5">
              <span
                style={{ fontSize: "14px", fontWeight: 600, color: C.inkLight }}
              >
                {r.name}
              </span>
              <span
                style={{ fontSize: "14px", fontWeight: 700, color: C.inkLight }}
              >
                {r.score}
              </span>
            </div>
            <div
              className="rounded-full overflow-hidden"
              style={{ height: "6px", background: C.pill }}
            >
              <div
                className="h-full rounded-full"
                style={{ width: `${r.width}%`, background: r.color }}
              />
            </div>
            <p style={{ fontSize: "12px", color: C.mutedLight, marginTop: "6px" }}>
              {r.note}
            </p>
          </div>
        ))}
      </div>

      <div style={{ borderTop: `1px solid ${C.pill}`, margin: "20px 0" }} />

      {/* Plain-English Summary */}
      <div className="mb-5">
        <div
          className="uppercase font-semibold mb-2"
          style={{ ...tinyLabelStyle, color: C.mutedLight }}
        >
          What this means for school
        </div>
        <p style={{ fontSize: "13px", color: C.mutedLight, lineHeight: 1.6 }}>
          Your child processes information more slowly than peers and has
          difficulty holding multiple pieces of information in mind at once.
          This affects timed tests, written assignments, and following
          multi-step directions.
        </p>
      </div>

      {/* Services */}
      <div>
        <div
          className="uppercase font-semibold mb-2.5"
          style={{ ...tinyLabelStyle, color: C.mutedLight }}
        >
          Recommended to request
        </div>
        <div className="flex flex-wrap gap-1.5">
          {[
            "Extended time on assessments",
            "Resource room support",
            "Preferential seating",
          ].map((s) => (
            <span
              key={s}
              className="rounded-full"
              style={{
                background: C.pill,
                color: C.inkLight,
                fontSize: "12px",
                padding: "5px 11px",
              }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Pain timeline card ─────────────────────────────────────────────────── */
function TimelineCard() {
  const rows = [
    { color: C.accent, title: "Evaluation report received", note: "Today", noteColor: C.mutedLight },
    { color: C.dotIdle, title: "IEP meeting scheduled", note: "14 days", noteColor: C.scoreLow },
    { color: C.dotIdle, title: "You need to be ready", note: "Before day 14", noteColor: C.mutedLight },
  ];
  return (
    <div
      className="bg-white rounded-xl w-full"
      style={{
        maxWidth: "400px",
        padding: "32px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06), 0 16px 40px rgba(0,0,0,0.08)",
      }}
    >
      <div
        className="uppercase font-semibold mb-6"
        style={{ fontSize: "14px", letterSpacing: "0.14em", color: C.mutedLight }}
      >
        Your timeline
      </div>

      <div className="relative">
        <div
          aria-hidden
          className="absolute left-[5px] top-2 bottom-2 w-px"
          style={{ background: C.dotIdle }}
        />
        {rows.map((r, i) => (
          <div
            key={r.title}
            className="relative flex items-start gap-4"
            style={{ marginBottom: i === rows.length - 1 ? 0 : "20px" }}
          >
            <div
              className="rounded-full mt-1.5 flex-shrink-0 relative z-10"
              style={{ width: "11px", height: "11px", background: r.color, boxShadow: `0 0 0 3px ${C.lightBg}` }}
            />
            <div>
              <div style={{ fontSize: "15px", fontWeight: 600, color: C.inkLight }}>
                {r.title}
              </div>
              <div style={{ fontSize: "13px", color: r.noteColor, marginTop: "2px" }}>
                {r.note}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ borderTop: `1px solid ${C.pill}`, marginTop: "24px", paddingTop: "16px" }}>
        <p style={{ fontSize: "12px", color: C.mutedLight, fontStyle: "italic", lineHeight: 1.6 }}>
          Federal law gives districts 30 days from report to meeting. Most
          parents get less than two weeks notice.
        </p>
      </div>
    </div>
  );
}

/* ─── Upload zone (step 1) ───────────────────────────────────────────────── */
function UploadZone() {
  return (
    <div
      className="rounded-xl text-center w-full"
      style={{
        background: "#F9FAFB",
        border: `1.5px dashed ${C.dotIdle}`,
        padding: "40px 24px",
      }}
    >
      <svg
        className="mx-auto mb-4"
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#9CA3AF"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
      <p style={{ fontSize: "16px", color: C.mutedLight, marginBottom: "6px" }}>
        Drop your evaluation report here
      </p>
      <p style={{ fontSize: "13px", color: "#9CA3AF", marginBottom: "20px" }}>
        PDF up to 50MB · Processed in memory · Never stored
      </p>
      <button
        type="button"
        className="rounded-full text-white font-semibold"
        style={{ background: C.accent, padding: "10px 20px", fontSize: "14px" }}
      >
        Browse files
      </button>
    </div>
  );
}

/* ─── Phone mockup (step 3) ──────────────────────────────────────────────── */
function PhoneMock() {
  return (
    <div className="flex flex-col items-center">
      <div
        className="rounded-[36px] mx-auto"
        style={{
          background: C.darkBg,
          border: `2px solid #374151`,
          padding: "28px 18px",
          width: "240px",
          height: "380px",
        }}
      >
        <div
          className="bg-white rounded-xl p-4 h-full flex flex-col"
          style={{ boxShadow: "0 4px 14px rgba(0,0,0,0.2)" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div
              className="rounded-full flex items-center justify-center"
              style={{ background: C.accent, width: "20px", height: "20px" }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: C.inkLight }}>
              Your Brief is ready
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-2 rounded-full" style={{ background: C.pill, width: "90%" }} />
            <div className="h-2 rounded-full" style={{ background: C.pill, width: "75%" }} />
            <div className="h-2 rounded-full" style={{ background: C.pill, width: "85%" }} />
            <div className="h-2 rounded-full" style={{ background: C.pill, width: "60%" }} />
            <div className="h-2 rounded-full" style={{ background: C.pill, width: "80%" }} />
          </div>
        </div>
      </div>
      <button
        type="button"
        className="rounded-full text-white font-semibold mt-6"
        style={{ background: C.accent, padding: "10px 22px", fontSize: "14px" }}
      >
        Download PDF
      </button>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function HomePage({
  searchParams,
}: {
  searchParams?: { deleted?: string };
}) {
  const accountDeleted = searchParams?.deleted === "true";
  return (
    <div className="bg-white overflow-x-hidden">
      {accountDeleted && <AccountDeletedToast />}
      <Navbar />

      {/* ─── INTRO — full-viewport split introduction ─────────────────────── */}
      <section
        className="relative flex flex-col md:flex-row"
        style={{ background: C.lightBg, minHeight: "100vh" }}
      >
        {/* Left: text content */}
        <div className="order-2 md:order-1 md:w-1/2 flex flex-col justify-center py-8 px-6 md:py-16 md:pl-20 md:pr-10">
          {/* 1 — Wordmark */}
          <FadeIn delay={0}>
            <div
              className="font-bold tracking-tight"
              style={{ fontSize: "28px" }}
            >
              <span style={{ color: C.accent }}>Clear</span>
              <span style={{ color: C.inkLight }}>path</span>
            </div>
          </FadeIn>

          {/* 2 — Category label */}
          <FadeIn delay={100}>
            <span
              className="inline-flex items-center rounded-full font-medium uppercase mt-6"
              style={{
                border: `1px solid ${C.accent}`,
                color: C.accent,
                background: "#FFFFFF",
                padding: "6px 14px",
                fontSize: "12px",
                letterSpacing: "0.08em",
              }}
            >
              Special Education Support
            </span>
          </FadeIn>

          {/* 3 — Headline */}
          <FadeIn delay={200}>
            <h1 className="mt-6">
              <span
                className="block"
                style={{
                  fontFamily: "Inter, system-ui, sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(32px, 4.4vw, 48px)",
                  color: C.inkLight,
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                }}
              >
                Everything parents need
              </span>
              <span
                className="block"
                style={{
                  fontFamily: "Inter, system-ui, sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(38px, 5.2vw, 56px)",
                  color: C.accent,
                  lineHeight: 1.08,
                  letterSpacing: "-0.025em",
                }}
              >
                to fight for their child.
              </span>
            </h1>
          </FadeIn>

          {/* 4 — Product description */}
          <FadeIn delay={300}>
            <p
              className="mt-6"
              style={{
                fontFamily: "Inter, system-ui, sans-serif",
                fontSize: "18px",
                color: C.mutedLight,
                lineHeight: 1.7,
                maxWidth: "480px",
              }}
            >
              Clearpath helps parents and caregivers of children with
              disabilities understand and manage every part of the special
              education process — from educational evaluations and IEP meetings
              to services, accommodations, and legal rights. In plain English.
              In minutes.
            </p>
          </FadeIn>

          {/* 5 — Capability chips */}
          <FadeIn delay={400}>
            <div className="flex flex-wrap gap-2 mt-6">
              {[
                { Icon: FileText, label: "Evaluation Reports" },
                { Icon: ClipboardCheck, label: "IEP Documents" },
                { Icon: Shield, label: "Your Legal Rights" },
              ].map(({ Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 rounded-full font-medium"
                  style={{
                    background: "#EEF2F9",
                    color: C.accent,
                    padding: "8px 16px",
                    fontSize: "13px",
                  }}
                >
                  <Icon size={14} strokeWidth={2} />
                  {label}
                </span>
              ))}
            </div>
          </FadeIn>

          {/* 6 — CTA buttons */}
          <FadeIn delay={500}>
            <div className="flex flex-col sm:flex-row gap-3 mt-7">
              <Link
                href="/signup"
                className="btn-press inline-flex items-center justify-center rounded-full font-semibold text-white transition-colors"
                style={{
                  background: C.accent,
                  padding: "14px 28px",
                  fontSize: "16px",
                }}
              >
                Get Started Free
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center rounded-full font-semibold transition-colors hover:bg-[#EEF2F9]"
                style={{
                  background: "transparent",
                  border: `1px solid ${C.accent}`,
                  color: C.accent,
                  padding: "14px 28px",
                  fontSize: "16px",
                }}
              >
                See how it works
              </a>
            </div>
          </FadeIn>

          {/* 7 — Social proof */}
          <FadeIn delay={600}>
            <p
              className="mt-6 italic"
              style={{ fontSize: "13px", color: "#9CA3AF" }}
            >
              Trusted by families navigating IEP meetings across Connecticut and
              beyond.
            </p>
          </FadeIn>

          {/* 8 — Scroll indicator */}
          <div className="mt-10" aria-hidden>
            <ChevronDown
              size={20}
              style={{ color: "#9CA3AF", animation: "introChevron 2s ease-in-out infinite" }}
            />
          </div>
        </div>

        {/* Vertical divider — desktop only */}
        <div
          aria-hidden
          className="hidden md:block"
          style={{ width: "1px", background: C.rule }}
        />

        {/* Right: photograph */}
        <FadeIn
          direction="none"
          duration={800}
          delay={200}
          className="order-1 md:order-2 relative w-full h-[280px] md:h-auto md:w-1/2 overflow-hidden rounded-none md:rounded-l-3xl"
        >
          <Image
            src="https://images.unsplash.com/photo-1588072432836-e10032774350?w=1600&q=90&auto=format&fit=crop"
            alt="A parent reviewing documents with their child, preparing for an IEP meeting"
            fill
            quality={90}
            priority
            className="object-cover"
            style={{ objectPosition: "center" }}
          />
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0) 40%)",
            }}
          />
        </FadeIn>

        {/* Scoped keyframe for the scroll chevron */}
        <style>{`
          @keyframes introChevron {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(6px); }
          }
        `}</style>
      </section>

      {/* HERO */}
      <section
        className="relative flex items-center overflow-hidden"
        style={{ background: C.darkBg, minHeight: "calc(100svh - 68px)" }}
      >
        <div className="relative z-10 max-w-6xl mx-auto w-full px-6 py-16 lg:py-24">
          <div className="grid lg:grid-cols-[1fr_auto] gap-12 lg:gap-16 items-center">
            {/* Left: copy */}
            <div className="max-w-xl hero-enter">
              <div className="inline-flex items-center gap-2 mb-8">
                <div className="w-5 h-px" style={{ background: C.mutedDark }} />
                <span
                  className="font-semibold uppercase"
                  style={{ ...labelStyle, color: C.mutedDark }}
                >
                  Built for the meeting that changes everything.
                </span>
              </div>

              <h1 className="mb-6">
                <span
                  className="block text-white"
                  style={{
                    fontFamily: "Inter, system-ui, sans-serif",
                    fontWeight: 400,
                    fontSize: "clamp(22px, 3vw, 32px)",
                    letterSpacing: "-0.01em",
                    marginBottom: "8px",
                  }}
                >
                  They have experts.
                </span>
                <span
                  className="block font-extrabold font-display text-white"
                  style={{
                    fontSize: "clamp(40px, 6vw, 64px)",
                    lineHeight: "1.05",
                    letterSpacing: "-0.025em",
                  }}
                >
                  Now you have one too.
                </span>
              </h1>

              <div
                className="inline-flex items-center gap-2 mb-7"
                style={{ color: C.mutedDark, fontSize: "14px", lineHeight: 1.5 }}
              >
                <Award className="w-4 h-4 flex-shrink-0" style={{ color: C.accent }} strokeWidth={2} />
                <span>
                  Built with a Special Education Director with 35 years of
                  experience running thousands of IEP meetings
                </span>
              </div>

              <p
                className="mb-10"
                style={{ ...bodyLargeStyle, color: C.mutedDark, maxWidth: "540px" }}
              >
                Twenty pages of clinical scores. One meeting that shapes the
                next decade. Clearpath reads the report and gives you a
                plain-English brief — what each score means, which services to
                request, and the ten questions to bring to the table.
              </p>

              <div className="flex flex-wrap items-center gap-3 mb-6">
                <Link
                  href="/signup"
                  className="btn-press inline-flex items-center gap-2 text-white font-semibold rounded-full transition-colors"
                  style={{
                    background: C.accent,
                    padding: "14px 28px",
                    fontSize: "16px",
                  }}
                >
                  Translate my report — free
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href="/quiz"
                  className="inline-flex items-center gap-2 text-white font-medium rounded-full transition-colors"
                  style={{
                    border: "1px solid rgba(255,255,255,0.25)",
                    padding: "13px 24px",
                    fontSize: "15px",
                  }}
                >
                  Not sure where to start? Take the quiz
                </Link>
              </div>

              <p style={{ color: C.mutedDark, fontSize: "13px", marginBottom: "24px" }}>
                Free translation. Full meeting brief is $27, money-back if it
                doesn&apos;t help.
              </p>

              {/* Data trust pills */}
              <div className="flex flex-wrap gap-3 mb-6" style={{ marginTop: "24px" }}>
                {[
                  { Icon: Shield,  label: "Your data is never sold" },
                  { Icon: Lock,    label: "Encrypted at rest" },
                  { Icon: EyeOff,  label: "We never train on your data" },
                  { Icon: Trash2,  label: "Delete everything anytime" },
                ].map(({ Icon, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1.5 rounded-full"
                    style={{
                      background: "#1A1F1E",
                      color: C.mutedDark,
                      fontSize: "12px",
                      padding: "8px 14px",
                    }}
                  >
                    <Icon className="w-3.5 h-3.5" strokeWidth={1.8} />
                    {label}
                  </span>
                ))}
              </div>

              {/* Stats */}
              <div
                className="flex flex-wrap items-center gap-x-6 gap-y-5 pt-8"
                style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
              >
                {stats.map((stat, i) => (
                  <Fragment key={stat.label}>
                    {i > 0 && (
                      <div
                        className="w-px h-8 hidden sm:block"
                        style={{ background: "#4B5563" }}
                      />
                    )}
                    <div>
                      <div
                        className="text-white font-bold leading-none mb-1"
                        style={{ fontSize: "30px" }}
                      >
                        {stat.value}
                      </div>
                      <div
                        style={{
                          color: C.mutedDark,
                          fontSize: "10px",
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                        }}
                      >
                        {stat.label}
                      </div>
                    </div>
                  </Fragment>
                ))}
              </div>
            </div>

            {/* Right: report card mock */}
            <div className="lg:justify-self-end">
              <ReportCard />
            </div>
          </div>
        </div>
      </section>

      {/* PAIN */}
      <section
        className="px-6 py-24 lg:py-32 overflow-hidden"
        style={{ background: C.lightBg }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            <FadeIn direction="left" className="order-2 lg:order-1 flex flex-col items-center lg:items-start gap-6">
              {/* Warm photo above the timeline — a real family, not just a clock */}
              <div
                className="relative w-full overflow-hidden rounded-2xl"
                style={{
                  maxWidth: "440px",
                  aspectRatio: "4 / 3",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06), 0 18px 44px rgba(0,0,0,0.10)",
                }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1609220136736-443140cffec6?w=2000&q=90&auto=format&fit=crop"
                  alt="A parent and child reading together at home"
                  fill
                  quality={95}
                  sizes="(min-width: 1024px) 440px, 100vw"
                  className="object-cover"
                  style={{ objectPosition: "center" }}
                />
                <div
                  aria-hidden
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(11,14,13,0.18), rgba(11,14,13,0) 40%)",
                  }}
                />
              </div>
              <TimelineCard />
            </FadeIn>

            <div className="order-1 lg:order-2">
              <FadeIn delay={60}>
                <div
                  className="font-semibold uppercase mb-5"
                  style={{ ...labelStyle, color: C.mutedLight }}
                >
                  The moment we built this for
                </div>
                <h2
                  className="font-bold mb-8 leading-tight"
                  style={{
                    color: C.inkLight,
                    fontSize: "clamp(26px, 3.5vw, 38px)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  You got the report.
                  <br />
                  Now you have two weeks.
                </h2>
              </FadeIn>

              <FadeIn delay={120}>
                <p className="mb-6" style={{ ...bodyLargeStyle, color: "#374151" }}>
                  Your child just had an evaluation. The school sent home a
                  document with composite scores, percentile ranks, standard
                  deviations, and clinical recommendations — and a meeting
                  invitation for two weeks from now. You are expected to walk
                  into that meeting and advocate for services. Nobody explained
                  how.
                </p>
                <p className="mb-8" style={{ ...bodyLargeStyle, color: "#374151" }}>
                  The team running the meeting has been through hundreds of
                  these. They know what every score means, what services each
                  score range typically triggers, and what the district can
                  offer without raising a budget concern. You are reading the
                  report for the first time.
                </p>
              </FadeIn>

              <FadeIn delay={180}>
                <div
                  style={{
                    borderLeft: `3px solid ${C.accent}`,
                    paddingLeft: "20px",
                    margin: "32px 0",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "Inter, system-ui, sans-serif",
                      fontSize: "18px",
                      lineHeight: 1.7,
                      color: C.inkLight,
                    }}
                  >
                    A processing speed index of 74 means something specific. It
                    unlocks specific accommodations. It supports specific service
                    requests. You should not have to figure that out at 11pm the
                    night before the meeting.
                  </p>
                </div>
              </FadeIn>

              <FadeIn delay={240}>
                <p className="font-semibold" style={{ color: C.inkLight, fontSize: "19px" }}>
                  Clearpath was built so you don&apos;t have to.
                </p>
              </FadeIn>
            </div>
          </div>

          {/* Quiz entry callout */}
          <FadeIn className="mt-16 lg:mt-20">
            <div
              className="bg-white rounded-xl mx-auto"
              style={{
                border: "1px solid #D1D5DB",
                padding: "24px",
                maxWidth: "560px",
              }}
            >
              <div
                className="font-semibold uppercase mb-2"
                style={{ ...labelStyle, color: C.accent, fontSize: "11px" }}
              >
                Don&apos;t have a report yet?
              </div>
              <h3
                className="font-bold mb-3"
                style={{ color: C.inkLight, fontSize: "20px", letterSpacing: "-0.01em" }}
              >
                Not sure if your child needs an evaluation?
              </h3>
              <p className="mb-5" style={{ color: C.mutedLight, fontSize: "15px", lineHeight: 1.6 }}>
                Answer 5 quick questions and we&apos;ll tell you where you
                stand — whether that&apos;s requesting an evaluation,
                understanding the difference between a 504 and an IEP, or
                knowing what to do before the school acts.
              </p>
              <Link
                href="/quiz"
                className="btn-press inline-flex items-center gap-2 text-white font-semibold rounded-lg transition-colors"
                style={{ background: C.accent, padding: "11px 22px", fontSize: "14px" }}
              >
                Take the free quiz
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="bg-white px-6 py-24 lg:py-32 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-20">
            <div
              className="font-semibold uppercase mb-4"
              style={{ ...labelStyle, color: C.mutedLight }}
            >
              The process
            </div>
            <h2
              className="font-bold mb-4"
              style={{
                color: C.inkLight,
                fontSize: "clamp(28px, 4vw, 42px)",
                letterSpacing: "-0.02em",
              }}
            >
              Four steps. About five minutes.
            </h2>
            <p style={{ color: C.mutedLight, fontSize: "20px", maxWidth: "32rem", margin: "0 auto" }}>
              From the PDF on your kitchen table to a brief you can bring to the
              meeting.
            </p>
          </FadeIn>

          <div className="relative">
            {/* Neutral timeline rail */}
            <div
              aria-hidden
              className="hidden lg:block absolute left-6 top-12 bottom-12 w-px"
              style={{ background: C.dotIdle }}
            />

            {/* Step 1 */}
            <FadeIn className="relative lg:pl-20 py-12 lg:py-16">
              <div
                aria-hidden
                className="hidden lg:block absolute left-[19px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
                style={{ background: C.accent }}
              />
              <div className="grid lg:grid-cols-[1fr_1fr] gap-10 lg:gap-16 items-center">
                <div className="lg:order-1">
                  <div
                    className="font-semibold uppercase mb-3"
                    style={{ ...labelStyle, color: C.mutedLight }}
                  >
                    Step 1
                  </div>
                  <h3
                    className="font-bold mb-4 font-display"
                    style={{
                      color: C.inkLight,
                      fontSize: "clamp(22px, 2.5vw, 30px)",
                      letterSpacing: "-0.015em",
                    }}
                  >
                    Add your child&apos;s profile
                  </h3>
                  <p style={{ ...bodyLargeStyle, color: C.mutedLight }}>
                    Tell Clearpath about your child — their name, age, grade,
                    state, and any known diagnoses. This takes two minutes and
                    makes every brief, every question, and every accommodation
                    specific to your child rather than generic advice.
                  </p>
                </div>
                {/* Profile card mock */}
                <div className="lg:order-2 relative">
                  <div
                    className="bg-white rounded-2xl p-6 relative overflow-hidden"
                    style={{
                      boxShadow: "0 2px 8px rgba(0,0,0,0.06), 0 16px 40px rgba(0,0,0,0.10)",
                      border: "1px solid #F3F4F6",
                    }}
                  >
                    <div
                      className="font-semibold uppercase mb-4"
                      style={{ ...tinyLabelStyle, color: C.mutedLight }}
                    >
                      Child Profile
                    </div>
                    <div className="space-y-3">
                      {[
                        { label: "Name", value: "Maya" },
                        { label: "Age", value: "9" },
                        { label: "Grade", value: "4th" },
                        { label: "State", value: "Connecticut" },
                      ].map((field) => (
                        <div
                          key={field.label}
                          className="flex justify-between items-center"
                        >
                          <span
                            className="text-xs font-medium"
                            style={{ color: "#9CA3AF" }}
                          >
                            {field.label}
                          </span>
                          <span
                            className="text-sm font-semibold"
                            style={{ color: C.inkLight }}
                          >
                            {field.value}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-5 pt-4" style={{ borderTop: "1px solid #F3F4F6" }}>
                      <div
                        className="font-semibold uppercase mb-2"
                        style={{ ...tinyLabelStyle, color: C.mutedLight }}
                      >
                        Known Diagnoses
                      </div>
                      {["Dyslexia", "ADHD — Combined type"].map((d) => (
                        <div
                          key={d}
                          className="flex items-center gap-2 text-[11px] mb-1.5"
                          style={{ color: "#374151" }}
                        >
                          <div
                            className="w-1 h-1 rounded-full flex-shrink-0"
                            style={{ background: C.accent }}
                          />
                          {d}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Step 2 */}
            <FadeIn className="relative lg:pl-20 py-12 lg:py-16">
              <div
                aria-hidden
                className="hidden lg:block absolute left-[19px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
                style={{ background: C.dotIdle }}
              />
              <div className="grid lg:grid-cols-[1fr_1fr] gap-10 lg:gap-16 items-center">
                <UploadZone />
                <div>
                  <div
                    className="font-semibold uppercase mb-3"
                    style={{ ...labelStyle, color: C.mutedLight }}
                  >
                    Step 2
                  </div>
                  <h3
                    className="font-bold mb-4 font-display"
                    style={{
                      color: C.inkLight,
                      fontSize: "clamp(22px, 2.5vw, 30px)",
                      letterSpacing: "-0.015em",
                    }}
                  >
                    Upload the report
                  </h3>
                  <p style={{ ...bodyLargeStyle, color: C.mutedLight }}>
                    Drop in the PDF the evaluator gave you. Any standard
                    psychoeducational or neuropsychological format works —
                    district reports, private evaluations, re-evaluations. Your
                    file is processed in memory and never stored on our servers.
                  </p>
                </div>
              </div>
            </FadeIn>

            {/* Step 3 */}
            <FadeIn className="relative lg:pl-20 py-12 lg:py-16">
              <div
                aria-hidden
                className="hidden lg:block absolute left-[19px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
                style={{ background: C.dotIdle }}
              />
              <div className="grid lg:grid-cols-[1fr_1fr] gap-10 lg:gap-16 items-center">
                <div className="lg:order-1">
                  <div
                    className="font-semibold uppercase mb-3"
                    style={{ ...labelStyle, color: C.mutedLight }}
                  >
                    Step 3
                  </div>
                  <h3
                    className="font-bold mb-4 font-display"
                    style={{
                      color: C.inkLight,
                      fontSize: "clamp(22px, 2.5vw, 30px)",
                      letterSpacing: "-0.015em",
                    }}
                  >
                    Clearpath interprets every score
                  </h3>
                  <p style={{ ...bodyLargeStyle, color: C.mutedLight }}>
                    Our AI was built specifically for evaluation reports — not
                    general questions, not generic IEP advice. It identifies
                    every assessment battery in your child&apos;s report
                    (WISC-V, WIAT-IV, BASC-3, CTOPP-2, and others), interprets
                    each composite and index score, and connects the scores to
                    what they mean in a classroom every day.
                  </p>
                </div>
                {/* WISC-V card — kept as-is */}
                <div className="lg:order-2 relative">
                  <div
                    className="bg-white rounded-2xl p-6 relative overflow-hidden"
                    style={{
                      boxShadow: "0 2px 8px rgba(0,0,0,0.06), 0 16px 40px rgba(0,0,0,0.10)",
                      border: "1px solid #F3F4F6",
                    }}
                  >
                    <div
                      className="font-semibold uppercase mb-4"
                      style={{ ...tinyLabelStyle, color: C.mutedLight }}
                    >
                      WISC-V Score Analysis
                    </div>
                    <div className="space-y-4">
                      {scoreRows.map((r) => (
                        <div key={r.name}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-medium" style={{ color: "#374151" }}>{r.name}</span>
                            <span className="text-sm font-bold" style={{ color: C.inkLight }}>{r.score}</span>
                          </div>
                          <div className="h-1.5 rounded-full overflow-hidden mb-1" style={{ background: "#F3F4F6" }}>
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${r.width}%`, background: r.color }}
                            />
                          </div>
                          <p className="text-[10px]" style={{ color: "#9CA3AF" }}>{r.note}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-5 pt-4" style={{ borderTop: "1px solid #F3F4F6" }}>
                      <div
                        className="font-semibold uppercase mb-2"
                        style={{ ...tinyLabelStyle, color: C.mutedLight }}
                      >
                        Services to Request
                      </div>
                      {[
                        "Extended time on all assessments",
                        "Resource room support (60 min/week)",
                        "Preferential seating",
                      ].map((s) => (
                        <div key={s} className="flex items-center gap-2 text-[11px] mb-1.5" style={{ color: "#374151" }}>
                          <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: C.accent }} />
                          {s}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Step 4 */}
            <FadeIn className="relative lg:pl-20 py-12 lg:py-16">
              <div
                aria-hidden
                className="hidden lg:block absolute left-[19px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
                style={{ background: C.dotIdle }}
              />
              <div className="grid lg:grid-cols-[1fr_1fr] gap-10 lg:gap-16 items-center">
                <div className="flex justify-center">
                  <PhoneMock />
                </div>
                <div>
                  <div
                    className="font-semibold uppercase mb-3"
                    style={{ ...labelStyle, color: C.mutedLight }}
                  >
                    Step 4
                  </div>
                  <h3
                    className="font-bold mb-4 font-display"
                    style={{
                      color: C.inkLight,
                      fontSize: "clamp(22px, 2.5vw, 30px)",
                      letterSpacing: "-0.015em",
                    }}
                  >
                    You walk in prepared
                  </h3>
                  <p style={{ ...bodyLargeStyle, color: C.mutedLight }}>
                    You receive a structured brief written in plain English:
                    what the report is saying, what each score means, which
                    services your child&apos;s profile typically supports, which
                    accommodations to request, ten questions to bring to the
                    meeting, and your state-specific rights. Ready to read on
                    your phone or print and bring with you.
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* BRIEF SECTIONS */}
      <section
        id="brief-sections"
        className="px-6 py-24 lg:py-32"
        style={{ background: C.lightBg }}
      >
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-16">
            <div
              className="font-semibold uppercase mb-4"
              style={{ ...labelStyle, color: C.mutedLight }}
            >
              What&apos;s in your brief
            </div>
            <h2
              className="font-bold mb-4"
              style={{
                color: C.inkLight,
                fontSize: "clamp(28px, 4vw, 42px)",
                letterSpacing: "-0.02em",
              }}
            >
              Everything you need to walk in prepared.
            </h2>
            <p style={{ color: C.mutedLight, fontSize: "20px", maxWidth: "32rem", margin: "0 auto" }}>
              Seven sections built around your child&apos;s actual scores — not
              generic advice scraped from a parent forum.
            </p>
          </FadeIn>

          <div className="grid sm:grid-cols-2 gap-4">
            {briefCards.map((card, i) => (
              <FadeIn
                key={card.n}
                delay={Math.min(i % 2, 1) * 80}
                className={i === 6 ? "sm:col-span-2 sm:max-w-md sm:mx-auto w-full" : ""}
              >
                <div
                  className="brief-card card-hover group relative bg-white rounded-2xl p-7 h-full cursor-default"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
                    style={{ background: "#EEF2F9" }}
                  >
                    <span className="text-sm font-bold" style={{ color: C.accent }}>
                      {card.n}
                    </span>
                  </div>
                  <h3
                    className="font-bold mb-2.5 leading-snug"
                    style={{ color: C.inkLight, fontSize: "17px" }}
                  >
                    {card.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: C.mutedLight }}>
                    {card.body}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section
        className="relative px-6 py-24 lg:py-32 overflow-hidden"
        style={{ background: C.darkBg }}
      >
        <div className="relative max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            <FadeIn direction="left">
              <div
                className="font-semibold uppercase mb-8"
                style={{ ...labelStyle, color: C.mutedDark }}
              >
                Built by insiders
              </div>
              <h2
                className="font-bold text-white mb-8 leading-tight"
                style={{ fontSize: "clamp(24px, 3.5vw, 38px)", letterSpacing: "-0.02em" }}
              >
                35 years inside the system.
                <br />
                Now working for you.
              </h2>
              <p className="mb-10" style={{ ...bodyLargeStyle, color: C.mutedDark }}>
                Clearpath was built in close partnership with a Special
                Education Director with 35 years of experience in Connecticut
                public schools. Every score interpretation, every service
                recommendation, and every meeting question reflects what she
                has watched work — and what she has watched parents miss —
                across thousands of IEP meetings.
              </p>

              <div
                style={{
                  borderLeft: `3px solid ${C.accent}`,
                  paddingLeft: "20px",
                  marginBottom: "32px",
                }}
              >
                <blockquote
                  className="text-white"
                  style={{
                    fontFamily: "Inter, system-ui, sans-serif",
                    fontSize: "18px",
                    lineHeight: 1.7,
                  }}
                >
                  Parents consistently do not understand their evaluation
                  reports. I end up translating it for them at every single
                  meeting. This tool does that work before they walk in the
                  room.
                </blockquote>
                <cite
                  className="not-italic block"
                  style={{ color: C.mutedDark, fontSize: "13px", marginTop: "14px" }}
                >
                  Special Education Director · 35 years experience · Connecticut public schools
                </cite>
              </div>

              <Link
                href="/signup"
                className="btn-press inline-flex items-center gap-2 text-white font-semibold rounded-full transition-colors"
                style={{
                  background: C.accent,
                  padding: "13px 26px",
                  fontSize: "15px",
                }}
              >
                Translate my report — free
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </FadeIn>

            {/* Right column: warm family photo with the credential floated over it */}
            <FadeIn delay={120}>
              <div
                className="relative w-full overflow-hidden rounded-2xl"
                style={{
                  aspectRatio: "4 / 5",
                  maxHeight: "620px",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.3), 0 32px 72px rgba(0,0,0,0.35)",
                }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?w=2400&q=90&auto=format&fit=crop"
                  alt="A warm moment between a parent and child"
                  fill
                  quality={95}
                  sizes="(min-width: 1024px) 540px, 100vw"
                  className="object-cover"
                  style={{ objectPosition: "center" }}
                />
                {/* Dark bottom gradient so the caption reads on any photo */}
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(11,14,13,0.88) 0%, rgba(11,14,13,0.35) 45%, rgba(11,14,13,0) 75%)",
                  }}
                />

                {/* Credential caption */}
                <div className="absolute left-0 right-0 bottom-0 p-7 lg:p-8">
                  <div
                    className="inline-flex items-center gap-2 mb-3 rounded-full"
                    style={{
                      background: "rgba(255,255,255,0.12)",
                      padding: "6px 12px",
                      backdropFilter: "blur(6px)",
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: C.accent }}
                    />
                    <span
                      className="uppercase font-semibold text-white"
                      style={{ fontSize: "11px", letterSpacing: "0.14em" }}
                    >
                      Built with families like yours in mind
                    </span>
                  </div>
                  <div
                    className="text-white font-bold leading-tight"
                    style={{ fontSize: "26px", letterSpacing: "-0.015em" }}
                  >
                    35 years inside the system.
                  </div>
                  <div
                    className="mt-1.5"
                    style={{ color: "rgba(255,255,255,0.82)", fontSize: "14px", lineHeight: 1.55 }}
                  >
                    Every score interpretation reflects what a Connecticut
                    Special Education Director has watched work — and watched
                    parents miss — across thousands of IEP meetings.
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section
        className="relative px-6 py-28 lg:py-36 overflow-hidden"
        style={{ background: C.darkBg }}
      >
        <div className="relative max-w-3xl mx-auto text-center">
          <FadeIn>
            <h2
              className="font-extrabold font-display text-white mb-6 leading-tight"
              style={{
                fontSize: "clamp(36px, 6vw, 60px)",
                letterSpacing: "-0.025em",
                lineHeight: "1.08",
              }}
            >
              Walk in knowing
              <br />
              what to ask for.
            </h2>
            <p className="mb-10 mx-auto" style={{ ...bodyLargeStyle, color: C.mutedDark, maxWidth: "32rem" }}>
              The report is already on your kitchen table. Spend five minutes
              turning it into the brief you wish came with it.
            </p>

            <Link
              href="/signup"
              className="btn-press inline-flex items-center gap-2.5 text-white font-semibold rounded-full transition-colors"
              style={{
                background: C.accent,
                padding: "16px 36px",
                fontSize: "18px",
              }}
            >
              Translate my report — free
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>

            <p style={{ color: C.mutedDark, fontSize: "13px", marginTop: "24px" }}>
              Free translation. Full meeting brief is $27, money-back if it
              doesn&apos;t help.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        className="px-6 py-6"
        style={{ background: C.darkBg, borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-bold text-xl">
            <span style={{ color: C.accent }}>Clear</span>
            <span className="text-white">path</span>
          </span>
          <p style={{ color: C.mutedDark, fontSize: "13px" }}>
            &copy; {new Date().getFullYear()} Clearpath. All rights reserved.
          </p>
          <Link
            href="/privacy"
            className="transition-colors"
            style={{ color: C.mutedDark, fontSize: "13px" }}
          >
            Privacy Policy
          </Link>
        </div>
      </footer>
    </div>
  );
}
