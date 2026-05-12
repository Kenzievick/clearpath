import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import Navbar from "@/components/Navbar";
import { FadeIn } from "@/components/FadeIn";

/* ─── Photo registry ─────────────────────────────────────────────────────── */
const P = {
  hero: "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?w=1200&q=80",
  pain: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=900&q=80",
  trust: "https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=900&q=80",
  stepOne: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
  stepThree: "https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=800&q=80",
};

/* ─── Data ───────────────────────────────────────────────────────────────── */
const stats = [
  { value: "8.2M+", label: "active IEPs in the US" },
  { value: "12+", label: "states represented" },
  { value: "~5 min", label: "to your brief" },
];

const briefCards = [
  {
    n: "01",
    title: "What This Report Is Saying",
    body: "A plain-English summary of everything the evaluators found, written at an 8th-grade reading level. No acronyms without explanation. No clinical jargon without translation.",
  },
  {
    n: "02",
    title: "Your Child's Scores Explained",
    body: "For every assessment battery in the report: what the test measures, what your child's specific score means compared to peers, and what it looks like in the classroom every day.",
  },
  {
    n: "03",
    title: "Services Your Child May Qualify For",
    body: "A list of related services and special education supports that your child's score profile typically unlocks — framed to help you have the right conversation, not make legal claims.",
  },
  {
    n: "04",
    title: "Accommodations Worth Requesting",
    body: "A state-specific accommodations menu organized by category, with one sentence explaining exactly why each accommodation applies to your child's specific profile.",
  },
  {
    n: "05",
    title: "Your 10 Questions for the Meeting",
    body: "Ten specific questions drawn directly from your child's report — not generic IEP questions. Each one designed to yield a specific commitment from the district.",
  },
  {
    n: "06",
    title: "What to Watch For",
    body: "What a strong IEP looks like versus a weak one for your child's profile. The vague language to push back on. The specific, measurable goal language to ask for.",
  },
  {
    n: "07",
    title: "Know Your Rights",
    body: "State-specific procedural rights, correct meeting terminology, key timelines, and your right to request an Independent Educational Evaluation if you disagree with the district.",
  },
];

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function HomePage() {
  return (
    <div className="bg-white overflow-x-hidden">
      <Navbar />

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* HERO — cinematic split: dark left, photo right                     */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="noise relative bg-[#0F1117] min-h-[calc(100svh-68px)] flex items-center overflow-hidden">
        {/* Photo — fills right 52% of the hero on desktop */}
        <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-[52%]">
          <Image
            src={P.hero}
            alt="A parent reviewing their child's neuropsychological evaluation report"
            fill
            className="object-cover object-top"
            priority
          />
          {/* Gradient: dark bleeds into the photo from left */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, #0F1117 0%, rgba(15,17,23,0.85) 20%, rgba(15,17,23,0.4) 55%, rgba(15,17,23,0.1) 100%)",
            }}
          />
          {/* Subtle teal tint overlay at the very bottom of the photo */}
          <div
            aria-hidden
            className="absolute bottom-0 left-0 right-0 h-48"
            style={{
              background:
                "linear-gradient(to top, rgba(45,155,131,0.12), transparent)",
            }}
          />
        </div>

        {/* Mobile photo (stacks above text) */}
        <div className="lg:hidden absolute top-0 left-0 right-0 h-72 sm:h-96">
          <Image
            src={P.hero}
            alt="A parent reviewing their child's evaluation report"
            fill
            className="object-cover object-top"
            priority
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, transparent 0%, #0F1117 85%)",
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto w-full px-6 py-16 lg:py-24 mt-56 lg:mt-0">
          <div className="max-w-[54%] lg:max-w-[48%]">
            {/* Label */}
            <div className="inline-flex items-center gap-2 mb-8">
              <div className="w-5 h-px bg-[#2D9B83]" />
              <span
                className="text-[#2D9B83] text-xs font-semibold uppercase"
                style={{ letterSpacing: "0.12em" }}
              >
                Built for IEP meetings
              </span>
            </div>

            {/* Headline — size contrast creates visual hierarchy */}
            <h1 className="mb-7">
              <span
                className="block text-[#9CA3AF] font-light"
                style={{
                  fontSize: "clamp(16px, 2vw, 22px)",
                  letterSpacing: "0.01em",
                  marginBottom: "6px",
                }}
              >
                Finally understand
              </span>
              <span
                className="block text-white font-extrabold font-display"
                style={{
                  fontSize: "clamp(38px, 5.5vw, 68px)",
                  lineHeight: "1.05",
                  letterSpacing: "-0.025em",
                }}
              >
                your child&apos;s
                <br />
                evaluation report.
              </span>
            </h1>

            <p
              className="text-[#9CA3AF] mb-10 leading-relaxed"
              style={{ fontSize: "clamp(16px, 1.5vw, 19px)", maxWidth: "480px" }}
            >
              Clearpath reads your child&apos;s neuropsychological report and
              gives you a plain-English brief, the right questions to ask, and
              the services worth requesting — before you walk into the IEP
              meeting.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 mb-10">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 bg-[#2D9B83] hover:bg-[#238A72] text-white font-semibold rounded-full transition-all duration-200"
                style={{
                  padding: "14px 28px",
                  fontSize: "16px",
                  boxShadow:
                    "0 0 0 1px rgba(45,155,131,0.4), 0 4px 24px rgba(45,155,131,0.3)",
                }}
              >
                Get Your Free Brief
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
              <a
                href="#brief-sections"
                className="inline-flex items-center gap-2 text-white/70 hover:text-white font-medium rounded-full border border-white/15 hover:border-white/30 transition-all duration-200"
                style={{ padding: "14px 24px", fontSize: "15px" }}
              >
                See what&apos;s inside
              </a>
            </div>

            {/* Stats bar */}
            <div
              className="flex flex-wrap items-center gap-6 pt-8"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
            >
              {stats.map((stat, i) => (
                <Fragment key={stat.label}>
                  {i > 0 && (
                    <div className="w-px h-7 bg-white/10 hidden sm:block" />
                  )}
                  <div>
                    <div className="text-white font-semibold text-base leading-none mb-1">
                      {stat.value}
                    </div>
                    <div
                      className="text-[#6B7280]"
                      style={{ fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase" }}
                    >
                      {stat.label}
                    </div>
                  </div>
                </Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 animate-bounce">
          <svg
            className="w-5 h-5 text-[#4B5563]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* PAIN — the gut punch. The emotional mirror.                        */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="bg-[#FAFAF8] px-6 py-24 lg:py-32 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">

            {/* Photo — parent at kitchen table, tired, papers everywhere */}
            <FadeIn direction="left" className="order-2 lg:order-1">
              <div className="relative">
                {/* Teal corner accent */}
                <div
                  className="absolute -bottom-4 -left-4 w-24 h-24 rounded-2xl"
                  style={{ background: "rgba(45,155,131,0.12)", zIndex: 0 }}
                />
                <div
                  className="relative rounded-2xl overflow-hidden"
                  style={{
                    boxShadow:
                      "0 2px 8px rgba(0,0,0,0.06), 0 16px 48px rgba(0,0,0,0.10)",
                    zIndex: 1,
                  }}
                >
                  <div className="aspect-[4/3] relative">
                    <Image
                      src={P.pain}
                      alt="A parent sitting at the kitchen table late at night reviewing evaluation paperwork"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Text */}
            <div className="order-1 lg:order-2">
              <FadeIn delay={60}>
                <div
                  className="text-xs font-semibold text-[#2D9B83] uppercase mb-5"
                  style={{ letterSpacing: "0.12em" }}
                >
                  The moment we built this for
                </div>
                <h2
                  className="font-bold text-[#0F1117] mb-8 leading-tight"
                  style={{
                    fontSize: "clamp(26px, 3.5vw, 38px)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  You received a report.
                  <br />
                  Nobody explained what it means.
                </h2>
              </FadeIn>

              <FadeIn delay={120}>
                <p className="text-[#374151] text-lg leading-relaxed mb-8">
                  Your child just had a neuropsychological evaluation. The
                  school handed you 20 pages of scores, indices, and clinical
                  terminology — and scheduled a meeting in two weeks where
                  you&apos;ll be expected to advocate for services you don&apos;t
                  yet know your child qualifies for.
                </p>
              </FadeIn>

              {/* Editorial pull quote — the emotional center of the section */}
              <FadeIn delay={180}>
                <div
                  className="my-8 pl-6"
                  style={{ borderLeft: "3px solid #2D9B83" }}
                >
                  <p
                    className="font-display italic text-[#0F1117]"
                    style={{
                      fontSize: "clamp(22px, 2.5vw, 30px)",
                      lineHeight: "1.4",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    &ldquo;sitting at your kitchen table at 11pm, trying to
                    figure out what a processing speed index of 74 actually
                    means for your kid.&rdquo;
                  </p>
                </div>
              </FadeIn>

              <FadeIn delay={240}>
                <p className="text-[#374151] text-lg leading-relaxed mb-8">
                  The evaluators are experts. The district has lawyers and
                  administrators.
                </p>
                <p
                  className="font-semibold text-[#0F1117]"
                  style={{ fontSize: "18px" }}
                >
                  Clearpath was built for exactly this moment.
                </p>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* HOW IT WORKS — vertical stepped, alternating, editorial            */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="bg-white px-6 py-24 lg:py-32 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <FadeIn className="text-center mb-20">
            <div
              className="text-xs font-semibold text-[#2D9B83] uppercase mb-4"
              style={{ letterSpacing: "0.12em" }}
            >
              The process
            </div>
            <h2
              className="font-bold text-[#0F1117] mb-4"
              style={{
                fontSize: "clamp(28px, 4vw, 42px)",
                letterSpacing: "-0.02em",
              }}
            >
              From report to meeting-ready in minutes.
            </h2>
            <p className="text-[#6B7280] text-xl max-w-md mx-auto">
              Three steps. No jargon. No confusion.
            </p>
          </FadeIn>

          {/* Steps — alternating layout with teal left rail */}
          <div className="relative">
            {/* Vertical teal connector rail */}
            <div
              aria-hidden
              className="hidden lg:block absolute left-6 top-12 bottom-12 w-px"
              style={{
                background:
                  "linear-gradient(to bottom, transparent, #2D9B83 12%, #2D9B83 88%, transparent)",
              }}
            />

            {/* ── Step 1 ── */}
            <FadeIn className="relative lg:pl-20 py-12 lg:py-16">
              {/* Rail dot */}
              <div
                aria-hidden
                className="hidden lg:block absolute left-[19px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#2D9B83]"
                style={{ boxShadow: "0 0 0 4px rgba(45,155,131,0.2)" }}
              />
              {/* Faded background step number */}
              <div
                aria-hidden
                className="absolute top-0 right-0 font-display font-bold select-none pointer-events-none leading-none text-[#2D9B83]"
                style={{
                  fontSize: "clamp(100px, 14vw, 180px)",
                  opacity: 0.04,
                  lineHeight: 1,
                  top: "-10px",
                }}
              >
                01
              </div>

              <div className="grid lg:grid-cols-[1fr_1fr] gap-10 lg:gap-16 items-center">
                {/* Photo */}
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.06),_0_16px_40px_rgba(0,0,0,0.08)]">
                  <Image
                    src={P.stepOne}
                    alt="A child working with a teacher or learning specialist"
                    fill
                    className="object-cover"
                  />
                </div>
                {/* Text */}
                <div>
                  <div
                    className="text-xs font-semibold text-[#2D9B83] uppercase mb-3"
                    style={{ letterSpacing: "0.12em" }}
                  >
                    Step 1
                  </div>
                  <h3
                    className="font-bold text-[#0F1117] mb-4 font-display"
                    style={{
                      fontSize: "clamp(22px, 2.5vw, 30px)",
                      letterSpacing: "-0.015em",
                    }}
                  >
                    Upload your child&apos;s report
                  </h3>
                  <p className="text-[#6B7280] text-lg leading-relaxed">
                    Forward the PDF the school or private evaluator gave you —
                    the 15 to 30 page document with all the scores. Clearpath
                    accepts any standard neuropsychological or psychoeducational
                    evaluation format.
                  </p>
                </div>
              </div>
            </FadeIn>

            {/* ── Step 2 ── */}
            <FadeIn className="relative lg:pl-20 py-12 lg:py-16">
              <div
                aria-hidden
                className="hidden lg:block absolute left-[19px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#2D9B83]"
                style={{ boxShadow: "0 0 0 4px rgba(45,155,131,0.2)" }}
              />
              <div
                aria-hidden
                className="absolute top-0 left-0 font-display font-bold select-none pointer-events-none leading-none text-[#2D9B83]"
                style={{
                  fontSize: "clamp(100px, 14vw, 180px)",
                  opacity: 0.04,
                  lineHeight: 1,
                  top: "-10px",
                }}
              >
                02
              </div>

              <div className="grid lg:grid-cols-[1fr_1fr] gap-10 lg:gap-16 items-center">
                {/* Text (left on this step) */}
                <div className="lg:order-1">
                  <div
                    className="text-xs font-semibold text-[#2D9B83] uppercase mb-3"
                    style={{ letterSpacing: "0.12em" }}
                  >
                    Step 2
                  </div>
                  <h3
                    className="font-bold text-[#0F1117] mb-4 font-display"
                    style={{
                      fontSize: "clamp(22px, 2.5vw, 30px)",
                      letterSpacing: "-0.015em",
                    }}
                  >
                    Clearpath reads every score
                  </h3>
                  <p className="text-[#6B7280] text-lg leading-relaxed">
                    Our AI is trained specifically on neuropsychological and
                    psychoeducational assessments. It knows what WISC-V,
                    WIAT-IV, BASC-3, CTOPP-2, and every other assessment
                    battery actually means — and translates it into plain
                    English.
                  </p>
                </div>

                {/* Document mockup (right on this step) */}
                <div className="lg:order-2 relative">
                  <div
                    className="bg-white rounded-2xl p-6 relative overflow-hidden"
                    style={{
                      boxShadow:
                        "0 2px 8px rgba(0,0,0,0.06), 0 16px 40px rgba(0,0,0,0.10)",
                      border: "1px solid #F3F4F6",
                    }}
                  >
                    {/* Teal top bar */}
                    <div
                      className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                      style={{
                        background:
                          "linear-gradient(to right, #2D9B83, rgba(45,155,131,0.2))",
                      }}
                    />
                    <div
                      className="text-xs font-semibold text-[#2D9B83] uppercase mb-4"
                      style={{ letterSpacing: "0.1em" }}
                    >
                      WISC-V Score Analysis
                    </div>
                    <div className="space-y-4">
                      {[
                        {
                          label: "Processing Speed Index",
                          score: "74",
                          pct: 34,
                          note: "4th percentile — significant difficulty",
                        },
                        {
                          label: "Working Memory Index",
                          score: "81",
                          pct: 48,
                          note: "10th percentile — moderate difficulty",
                        },
                        {
                          label: "Verbal Comprehension",
                          score: "103",
                          pct: 72,
                          note: "58th percentile — age-appropriate",
                        },
                      ].map((row) => (
                        <div key={row.label}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-[#374151] font-medium">
                              {row.label}
                            </span>
                            <span className="text-sm font-bold text-[#0F1117]">
                              {row.score}
                            </span>
                          </div>
                          <div className="h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden mb-1">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${row.pct}%`,
                                background:
                                  row.pct < 40
                                    ? "#E8956D"
                                    : row.pct < 55
                                    ? "#D4A853"
                                    : "#2D9B83",
                              }}
                            />
                          </div>
                          <p className="text-[10px] text-[#9CA3AF]">
                            {row.note}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div
                      className="mt-5 pt-4"
                      style={{ borderTop: "1px solid #F3F4F6" }}
                    >
                      <div
                        className="text-[10px] font-semibold text-[#2D9B83] uppercase mb-2"
                        style={{ letterSpacing: "0.1em" }}
                      >
                        Services to Request
                      </div>
                      {[
                        "Extended time on all assessments",
                        "Resource room support (60 min/week)",
                        "Preferential seating",
                      ].map((s) => (
                        <div
                          key={s}
                          className="flex items-center gap-2 text-[11px] text-[#374151] mb-1.5"
                        >
                          <div className="w-1 h-1 rounded-full bg-[#2D9B83] flex-shrink-0" />
                          {s}
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Shadow accent */}
                  <div
                    aria-hidden
                    className="absolute -bottom-3 -right-3 w-full h-full rounded-2xl -z-10"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(45,155,131,0.15), transparent)",
                    }}
                  />
                </div>
              </div>
            </FadeIn>

            {/* ── Step 3 ── */}
            <FadeIn className="relative lg:pl-20 py-12 lg:py-16">
              <div
                aria-hidden
                className="hidden lg:block absolute left-[19px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#2D9B83]"
                style={{ boxShadow: "0 0 0 4px rgba(45,155,131,0.2)" }}
              />
              <div
                aria-hidden
                className="absolute top-0 right-0 font-display font-bold select-none pointer-events-none leading-none text-[#2D9B83]"
                style={{
                  fontSize: "clamp(100px, 14vw, 180px)",
                  opacity: 0.04,
                  lineHeight: 1,
                  top: "-10px",
                }}
              >
                03
              </div>

              <div className="grid lg:grid-cols-[1fr_1fr] gap-10 lg:gap-16 items-center">
                {/* Photo */}
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.06),_0_16px_40px_rgba(0,0,0,0.08)]">
                  <Image
                    src={P.stepThree}
                    alt="A parent and child together, warm and confident"
                    fill
                    className="object-cover"
                  />
                </div>
                {/* Text */}
                <div>
                  <div
                    className="text-xs font-semibold text-[#2D9B83] uppercase mb-3"
                    style={{ letterSpacing: "0.12em" }}
                  >
                    Step 3
                  </div>
                  <h3
                    className="font-bold text-[#0F1117] mb-4 font-display"
                    style={{
                      fontSize: "clamp(22px, 2.5vw, 30px)",
                      letterSpacing: "-0.015em",
                    }}
                  >
                    You get your personalized brief
                  </h3>
                  <p className="text-[#6B7280] text-lg leading-relaxed">
                    A structured document with plain-English explanations, the
                    questions to bring to the meeting, the services to request,
                    and your state-specific legal rights. Ready in about 3 to 5
                    minutes.
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* BRIEF SECTIONS — 7 cards, elevated, interactive                   */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section
        id="brief-sections"
        className="px-6 py-24 lg:py-32"
        style={{
          background:
            "linear-gradient(180deg, #FAFAF8 0%, rgba(45,155,131,0.04) 100%)",
        }}
      >
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-16">
            <div
              className="text-xs font-semibold text-[#2D9B83] uppercase mb-4"
              style={{ letterSpacing: "0.12em" }}
            >
              What you&apos;re getting
            </div>
            <h2
              className="font-bold text-[#0F1117] mb-4"
              style={{
                fontSize: "clamp(28px, 4vw, 42px)",
                letterSpacing: "-0.02em",
              }}
            >
              Everything you need to walk in prepared.
            </h2>
            <p className="text-[#6B7280] text-xl max-w-lg mx-auto">
              Seven sections. Built around your child&apos;s specific scores —
              not generic IEP advice.
            </p>
          </FadeIn>

          <div className="grid sm:grid-cols-2 gap-4">
            {briefCards.map((card, i) => (
              <FadeIn
                key={card.n}
                delay={Math.min(i % 2, 1) * 80}
                className={
                  i === 6
                    ? "sm:col-span-2 sm:max-w-md sm:mx-auto w-full"
                    : ""
                }
              >
                <div
                  className="brief-card group relative bg-white rounded-2xl p-7 h-full cursor-default hover:-translate-y-1"
                  style={{ borderLeft: "3px solid #2D9B83" }}
                >
                  {/* Number badge with gradient */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
                    style={{
                      background:
                        "linear-gradient(135deg, #2D9B83 0%, #1d7a66 100%)",
                    }}
                  >
                    <span className="text-white text-sm font-bold">
                      {card.n}
                    </span>
                  </div>
                  <h3
                    className="font-bold text-[#0F1117] mb-2.5 leading-snug"
                    style={{ fontSize: "17px" }}
                  >
                    {card.title}
                  </h3>
                  <p className="text-[#6B7280] text-sm leading-relaxed">
                    {card.body}
                  </p>

                  {/* Hover chevron */}
                  <div className="absolute bottom-5 right-5 w-5 h-5 text-[#2D9B83] opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0.5 group-hover:translate-x-0">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* TRUST — dark, authoritative, editorial quote                       */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="noise relative bg-[#0F1117] px-6 py-24 lg:py-32 overflow-hidden">
        {/* Subtle radial glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(45,155,131,0.08) 0%, transparent 70%)",
          }}
        />

        <div className="relative max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">

            {/* Quote column */}
            <FadeIn direction="left">
              <div
                className="text-xs font-semibold text-[#2D9B83] uppercase mb-8"
                style={{ letterSpacing: "0.12em" }}
              >
                Built with insider knowledge
              </div>
              <h2
                className="font-bold text-white mb-8 leading-tight"
                style={{
                  fontSize: "clamp(24px, 3.5vw, 38px)",
                  letterSpacing: "-0.02em",
                }}
              >
                Built with 25 years of
                <br />
                insider knowledge.
              </h2>
              <p className="text-[#9CA3AF] text-lg leading-relaxed mb-10">
                Clearpath was built in partnership with a Special Education
                Director with 25 years of experience in Connecticut&apos;s
                public school system. Every score interpretation and every
                service recommendation reflects what she has seen work — and
                what she has seen districts try to minimize.
              </p>

              {/* Large typographic pull quote */}
              <div className="relative">
                {/* Big quotation mark */}
                <div
                  className="font-display text-[#2D9B83] leading-none mb-3 select-none"
                  style={{ fontSize: "80px", opacity: 0.7, lineHeight: 1 }}
                  aria-hidden
                >
                  &ldquo;
                </div>
                <blockquote
                  className="font-display italic text-white mb-5"
                  style={{
                    fontSize: "clamp(18px, 2vw, 24px)",
                    lineHeight: "1.55",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Parents consistently do not understand their evaluation
                  reports. I manually synthesize all of this for them at every
                  single meeting.
                </blockquote>
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="w-10 h-px bg-[#2D9B83]" />
                  <cite className="text-[#6B7280] text-sm not-italic">
                    Special Education Director
                  </cite>
                  <div
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full"
                    style={{
                      background: "rgba(45,155,131,0.12)",
                      border: "1px solid rgba(45,155,131,0.25)",
                    }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[#2D9B83]" />
                    <span
                      className="text-[#2D9B83] text-xs font-medium"
                      style={{ letterSpacing: "0.05em" }}
                    >
                      25 Years · Connecticut
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href="/signup"
                className="inline-flex items-center gap-2 mt-8 bg-[#2D9B83] hover:bg-[#238A72] text-white font-semibold rounded-full transition-colors duration-200"
                style={{
                  padding: "13px 26px",
                  fontSize: "15px",
                  boxShadow: "0 0 0 1px rgba(45,155,131,0.4)",
                }}
              >
                Get your free brief
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </FadeIn>

            {/* Photo */}
            <FadeIn delay={120}>
              <div className="relative">
                {/* Teal accent frame behind photo */}
                <div
                  aria-hidden
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    background: "rgba(45,155,131,0.15)",
                    transform: "rotate(2deg) translate(10px, 10px)",
                  }}
                />
                <div
                  className="relative rounded-2xl overflow-hidden"
                  style={{
                    boxShadow:
                      "0 4px 16px rgba(0,0,0,0.3), 0 24px 64px rgba(0,0,0,0.4)",
                  }}
                >
                  <div className="aspect-[3/4] relative">
                    <Image
                      src={P.trust}
                      alt="A parent and child together, warm and connected"
                      fill
                      className="object-cover"
                    />
                    {/* Subtle dark overlay for better integration */}
                    <div
                      className="absolute inset-0"
                      style={{ background: "rgba(15,17,23,0.15)" }}
                    />
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* FINAL CTA                                                          */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section
        className="noise relative px-6 py-28 lg:py-36 overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse 120% 80% at 50% 0%, #162520 0%, #0F1117 60%)",
        }}
      >
        {/* Teal glow at top center */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-px"
          style={{
            height: "200px",
            background:
              "linear-gradient(to bottom, rgba(45,155,131,0.6), transparent)",
          }}
        />

        <div className="relative max-w-3xl mx-auto text-center">
          <FadeIn>
            <div
              className="text-xs font-semibold text-[#2D9B83] uppercase mb-8"
              style={{ letterSpacing: "0.12em" }}
            >
              You&apos;re closer than you think
            </div>
            <h2
              className="font-extrabold font-display text-white mb-6 leading-tight"
              style={{
                fontSize: "clamp(36px, 6vw, 60px)",
                letterSpacing: "-0.025em",
                lineHeight: "1.08",
              }}
            >
              Walk into that meeting
              <br />
              <span className="text-[#2D9B83]">prepared.</span>
            </h2>
            <p className="text-[#9CA3AF] text-xl leading-relaxed mb-10 max-w-lg mx-auto">
              Your child&apos;s evaluation report is sitting on your kitchen
              table. Let Clearpath tell you what it actually means.
            </p>

            <Link
              href="/signup"
              className="inline-flex items-center gap-2.5 bg-[#2D9B83] hover:bg-[#238A72] text-white font-semibold rounded-full transition-all duration-200"
              style={{
                padding: "16px 36px",
                fontSize: "18px",
                boxShadow:
                  "0 0 0 1px rgba(45,155,131,0.5), 0 8px 32px rgba(45,155,131,0.25)",
              }}
            >
              Get Started Free
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>

            <p className="text-[#4B5563] text-sm mt-5 mb-3">
              Free to start. No credit card required.
            </p>
            <p className="text-[#4B5563] text-sm">
              Join parents who walked into their IEP meeting knowing exactly
              what to ask for.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* FOOTER                                                             */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <footer
        className="bg-[#0F1117] px-6 py-6"
        style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
      >
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-semibold text-xl">
            <span className="text-[#2D9B83]">Clear</span>
            <span className="text-white">path</span>
          </span>
          <p className="text-[#4B5563] text-sm">
            &copy; {new Date().getFullYear()} Clearpath. All rights reserved.
          </p>
          <Link
            href="/privacy"
            className="text-[#4B5563] hover:text-[#9CA3AF] text-sm transition-colors"
          >
            Privacy Policy
          </Link>
        </div>
      </footer>
    </div>
  );
}
