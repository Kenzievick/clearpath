import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";

// Picsum seeds give consistent placeholder images.
// Swap these src values for real Unsplash photos when available.
const IMAGES = {
  hero: "https://picsum.photos/seed/clearpath-hero/800/1000",
  pain: "https://picsum.photos/seed/clearpath-pain/800/700",
  trust: "https://picsum.photos/seed/clearpath-trust/800/700",
};

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

export default function HomePage() {
  return (
    <div className="bg-white">
      <Navbar />

      {/* ─── HERO ──────────────────────────────────────────────────── */}
      <section className="relative bg-[#0F1117] min-h-[calc(100vh-64px)] flex items-center px-6 py-20 overflow-hidden">
        {/* Subtle radial glow behind text */}
        <div
          aria-hidden
          className="pointer-events-none absolute -left-40 top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.07]"
          style={{ background: "radial-gradient(circle, #2D9B83 0%, transparent 70%)" }}
        />

        <div className="relative max-w-6xl mx-auto w-full">
          <div className="grid lg:grid-cols-[3fr_2fr] gap-16 items-center">
            {/* Left: copy */}
            <div>
              <div className="inline-flex items-center gap-2 border border-[#2D9B83]/40 text-[#2D9B83] text-sm font-medium px-4 py-1.5 rounded-full mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2D9B83] flex-shrink-0" />
                Built for IEP meetings. Built for parents.
              </div>

              <h1
                className="font-extrabold text-white leading-[1.1] mb-6"
                style={{ fontSize: "clamp(40px, 5vw, 64px)", letterSpacing: "-0.02em" }}
              >
                Finally understand your child&apos;s evaluation report.
              </h1>

              <p className="text-[#9CA3AF] text-lg sm:text-xl leading-relaxed mb-10 max-w-xl">
                Clearpath reads your child&apos;s neuropsychological report and
                gives you a plain-English brief, the right questions to ask, and
                the services worth requesting — before you walk into the IEP
                meeting.
              </p>

              <div className="flex flex-wrap gap-4 mb-6">
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 bg-[#2D9B83] hover:bg-[#238A72] text-white font-semibold px-8 py-4 rounded-full text-lg transition-colors shadow-lg shadow-[#2D9B83]/25"
                >
                  Get Your Free Brief
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <a
                  href="#brief-sections"
                  className="inline-flex items-center gap-2 border border-white/25 hover:border-white/50 text-white font-semibold px-8 py-4 rounded-full text-lg transition-colors"
                >
                  See what&apos;s inside
                </a>
              </div>

              <p className="text-[#6B7280] text-sm mb-1">
                Free to start. No credit card required.
              </p>
              <p className="text-[#6B7280] text-sm">
                Trusted by parents navigating IEP meetings across Connecticut
                and beyond.
              </p>
            </div>

            {/* Right: photo */}
            <div className="hidden lg:block relative aspect-[4/5] rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50">
              <Image
                src={IMAGES.hero}
                alt="A mother reviewing her child's evaluation report at the kitchen table"
                fill
                className="object-cover"
                unoptimized
                priority
              />
              {/* Subtle inner shadow for depth */}
              <div
                aria-hidden
                className="absolute inset-0 rounded-2xl"
                style={{ boxShadow: "inset 0 0 60px rgba(0,0,0,0.3)" }}
              />
            </div>
          </div>
        </div>

        {/* Scroll chevron */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-[#4B5563]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ─── PAIN ──────────────────────────────────────────────────── */}
      <section className="bg-[#FAFAF8] px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Photo */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.08),0_8px_24px_rgba(0,0,0,0.06)] order-2 lg:order-1">
              <Image
                src={IMAGES.pain}
                alt="A parent sitting at the kitchen table late at night, reviewing evaluation paperwork"
                fill
                className="object-cover"
                unoptimized
              />
            </div>

            {/* Text */}
            <div className="order-1 lg:order-2">
              <h2
                className="font-bold text-[#0F1117] mb-8 leading-tight"
                style={{ fontSize: "clamp(28px, 4vw, 40px)", letterSpacing: "-0.015em" }}
              >
                You received a report. Nobody explained what it means.
              </h2>
              <div className="space-y-5 text-[#374151] text-lg leading-relaxed">
                <p>
                  Your child just had a neuropsychological evaluation. The
                  school handed you 20 pages of scores, indices, and clinical
                  terminology — and scheduled a meeting in two weeks where
                  you&apos;ll be expected to advocate for services you don&apos;t
                  yet know your child qualifies for.
                </p>
                <p>
                  The evaluators are experts. The district has lawyers and
                  administrators. And you&apos;re sitting at your kitchen table
                  at 11pm trying to figure out what a processing speed index of
                  74 actually means for your kid.
                </p>
                <p className="font-semibold text-[#0F1117]">
                  Clearpath was built for exactly this moment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ───────────────────────────────────────────── */}
      <section className="bg-white px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="font-bold text-[#0F1117] mb-4 leading-tight"
              style={{ fontSize: "clamp(28px, 4vw, 40px)", letterSpacing: "-0.015em" }}
            >
              From report to meeting-ready in minutes.
            </h2>
            <p className="text-[#6B7280] text-xl">
              Three steps. No jargon. No confusion.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-0 relative">
            {/* Connector lines (desktop only) */}
            <div
              aria-hidden
              className="hidden md:block absolute top-10 left-[33%] right-[33%] h-px"
              style={{ background: "linear-gradient(to right, #2D9B83, #2D9B83)" }}
            />

            {[
              {
                num: "1",
                title: "Upload your child's report",
                body: "Forward the PDF the school or private evaluator gave you — the 15 to 30 page document with all the scores. Clearpath accepts any standard neuropsychological or psychoeducational evaluation format.",
              },
              {
                num: "2",
                title: "Clearpath reads every score",
                body: "Our AI is trained specifically on neuropsychological and psychoeducational assessments. It knows what WISC-V, WIAT-IV, BASC-3, CTOPP-2, and every other assessment battery actually means — and translates it into plain English.",
              },
              {
                num: "3",
                title: "You get your personalized brief",
                body: "A structured document with plain-English explanations, the questions to bring to the meeting, the services to request, and your state-specific legal rights. Ready in about 3 to 5 minutes.",
              },
            ].map((step) => (
              <div key={step.num} className="flex flex-col items-center text-center px-8 py-6">
                <div className="w-20 h-20 rounded-full bg-[#E8F5F2] flex items-center justify-center mb-6 relative z-10">
                  <span className="text-[#2D9B83] text-3xl font-extrabold">{step.num}</span>
                </div>
                <h3 className="text-xl font-bold text-[#0F1117] mb-3 leading-snug">
                  {step.title}
                </h3>
                <p className="text-[#6B7280] text-base leading-relaxed">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHAT'S INSIDE ─────────────────────────────────────────── */}
      <section id="brief-sections" className="bg-[#FAFAF8] px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="font-bold text-[#0F1117] mb-4 leading-tight"
              style={{ fontSize: "clamp(28px, 4vw, 40px)", letterSpacing: "-0.015em" }}
            >
              Everything you need to walk in prepared.
            </h2>
            <p className="text-[#6B7280] text-xl max-w-xl mx-auto">
              Seven sections. Built around your child&apos;s specific scores —
              not generic IEP advice.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {briefCards.map((card, i) => (
              <div
                key={card.n}
                className={`bg-white rounded-2xl p-7 ${
                  i === 6 ? "sm:col-span-2 sm:max-w-md sm:mx-auto w-full" : ""
                }`}
                style={{
                  boxShadow:
                    "0 1px 3px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.04)",
                }}
              >
                <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-[#E8F5F2] mb-4">
                  <span className="text-[#2D9B83] text-sm font-bold">{card.n}</span>
                </div>
                <h3 className="text-lg font-bold text-[#0F1117] mb-2 leading-snug">
                  {card.title}
                </h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TRUST ──────────────────────────────────────────────────── */}
      <section className="bg-white px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Photo */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.08),0_8px_24px_rgba(0,0,0,0.06)]">
              <Image
                src={IMAGES.trust}
                alt="A parent and child together, warm and candid"
                fill
                className="object-cover"
                unoptimized
              />
            </div>

            {/* Text */}
            <div>
              <h2
                className="font-bold text-[#0F1117] mb-6 leading-tight"
                style={{ fontSize: "clamp(28px, 4vw, 40px)", letterSpacing: "-0.015em" }}
              >
                Built with 25 years of insider knowledge.
              </h2>
              <p className="text-[#374151] text-lg leading-relaxed mb-8">
                Clearpath was built in partnership with a Special Education
                Director with 25 years of experience in Connecticut&apos;s
                public school system. Every prompt, every score interpretation,
                and every service recommendation reflects what she has seen work
                — and what she has seen districts try to minimize — across
                thousands of IEP meetings.
              </p>

              {/* Pull quote */}
              <blockquote className="border-l-4 border-[#2D9B83] pl-6 mb-8">
                <p className="text-[#0F1117] text-lg font-medium italic leading-relaxed mb-3">
                  &ldquo;Parents consistently do not understand their evaluation
                  reports. I manually synthesize all of this for them at every
                  single meeting.&rdquo;
                </p>
                <cite className="text-[#6B7280] text-sm not-italic">
                  — Special Education Director, 25 years experience
                </cite>
              </blockquote>

              <Link
                href="/signup"
                className="inline-flex items-center gap-2 bg-[#2D9B83] hover:bg-[#238A72] text-white font-semibold px-8 py-4 rounded-full text-lg transition-colors shadow-lg shadow-[#2D9B83]/20"
              >
                Get your free brief
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ──────────────────────────────────────────────── */}
      <section className="bg-[#0F1117] px-6 py-28">
        <div className="max-w-2xl mx-auto text-center">
          <h2
            className="font-extrabold text-white mb-5 leading-tight"
            style={{ fontSize: "clamp(32px, 4vw, 52px)", letterSpacing: "-0.02em" }}
          >
            Walk into that meeting prepared.
          </h2>
          <p className="text-[#9CA3AF] text-xl leading-relaxed mb-10">
            Your child&apos;s evaluation report is sitting on your kitchen
            table. Let Clearpath tell you what it actually means.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-[#2D9B83] hover:bg-[#238A72] text-white font-semibold px-10 py-5 rounded-full text-xl transition-colors shadow-xl shadow-[#2D9B83]/20"
          >
            Get Started Free
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <p className="text-[#4B5563] text-sm mt-5">
            Free to start. No credit card required.
          </p>
        </div>
      </section>

      {/* ─── FOOTER ─────────────────────────────────────────────────── */}
      <footer className="bg-[#0F1117] border-t border-white/5 px-6 py-6">
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
