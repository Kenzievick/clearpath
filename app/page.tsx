import Link from "next/link";
import Logo from "@/components/Logo";

const briefOutputs = [
  {
    number: "01",
    title: "What This Report Is Saying",
    description:
      "A plain-English summary of the overall findings, written at an 8th-grade reading level — no jargon, no confusion.",
  },
  {
    number: "02",
    title: "Your Child's Scores Explained",
    description:
      "For every test in the report: what it measures, what your child's score means, and what it looks like in the classroom every day.",
  },
  {
    number: "03",
    title: "Services Your Child May Qualify For",
    description:
      "A list of the related services and special education supports that your child's score profile typically unlocks.",
  },
  {
    number: "04",
    title: "Accommodations Worth Requesting",
    description:
      "A state-specific accommodations menu organized by category, with a sentence explaining exactly why each one applies to your child.",
  },
  {
    number: "05",
    title: "Your 10 Questions for the Meeting",
    description:
      "Ten specific questions drawn directly from your child's report — each with a note on what it's designed to uncover or secure.",
  },
  {
    number: "06",
    title: "What to Watch For",
    description:
      "What a strong IEP looks like versus a weak one for your child's profile, and the vague language to push back on.",
  },
  {
    number: "07",
    title: "Know Your Rights",
    description:
      "State-specific procedural rights, correct meeting terminology, key timelines, and your right to request an Independent Educational Evaluation.",
  },
];

const steps = [
  {
    step: "Step 1",
    title: "Upload your child's evaluation report",
    description:
      "Just the PDF the school or private evaluator gave you — the 15 to 30 page report with all the scores.",
  },
  {
    step: "Step 2",
    title: "Clearpath reads and interprets every score",
    description:
      "Our AI is trained specifically on neuropsychological and psychoeducational assessments. It knows what WISC-V, WIAT-IV, BASC-3, and every other battery actually means.",
  },
  {
    step: "Step 3",
    title: "You get your personalized meeting brief",
    description:
      "A structured document with plain-English explanations, the questions to ask, the services to request, and your legal rights — ready in about 3 to 5 minutes.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="px-6 py-5 flex items-center justify-between max-w-6xl mx-auto">
        <Logo size="md" />
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-stone-600 hover:text-stone-900 text-sm font-medium transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
          >
            Get started free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 pt-16 pb-24 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-sm font-medium px-4 py-1.5 rounded-full mb-8">
          <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
          Built for IEP meetings. Built for parents.
        </div>

        <h1 className="text-5xl sm:text-6xl font-semibold text-stone-900 leading-tight mb-6 tracking-tight">
          Finally understand your
          <br />
          <span className="text-blue-600">child&apos;s evaluation report.</span>
        </h1>

        <p className="text-xl text-stone-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          Clearpath reads your child&apos;s neuropsychological report and gives
          you a plain-English brief, the right questions to ask, and the
          services worth requesting — before you walk into the IEP meeting.
        </p>

        <Link
          href="/signup"
          className="inline-flex items-center gap-2 bg-blue-600 text-white text-lg font-medium px-8 py-4 rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
        >
          Get Your Free Brief
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </Link>

        <p className="mt-4 text-sm text-stone-400">
          Free to try. No credit card required.
        </p>
      </section>

      {/* How it works */}
      <section className="bg-stone-50 px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-semibold text-stone-900 text-center mb-4">
            How Clearpath works
          </h2>
          <p className="text-stone-500 text-center mb-14 max-w-xl mx-auto">
            From upload to meeting-ready brief in three simple steps.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((item) => (
              <div
                key={item.step}
                className="bg-white rounded-2xl p-7 border border-stone-100 shadow-sm"
              >
                <div className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-3">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-stone-900 mb-3 leading-snug">
                  {item.title}
                </h3>
                <p className="text-stone-500 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <h2 className="text-3xl font-semibold text-stone-900 text-center mb-4">
          What your brief includes
        </h2>
        <p className="text-stone-500 text-center mb-14 max-w-xl mx-auto">
          Seven sections. Everything you need to walk into that meeting prepared
          and confident.
        </p>

        <div className="grid sm:grid-cols-2 gap-5">
          {briefOutputs.map((item) => (
            <div
              key={item.number}
              className="flex gap-5 p-6 rounded-2xl border border-stone-100 hover:border-blue-100 hover:bg-blue-50/30 transition-colors"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibold">
                {item.number}
              </div>
              <div>
                <h3 className="font-semibold text-stone-900 mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-stone-500 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-blue-600 px-6 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-semibold text-white mb-4">
            Ready to walk in prepared?
          </h2>
          <p className="text-blue-100 text-lg mb-10">
            Upload your child&apos;s evaluation report and get your personalized
            brief in minutes — for free.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-white text-blue-700 text-lg font-semibold px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors shadow-md"
          >
            Get Started Free
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-stone-100">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo size="sm" />
          <p className="text-xs text-stone-400 text-center sm:text-right">
            &copy; {new Date().getFullYear()} Clearpath. Not legal advice.
            Always consult a qualified special education advocate for your
            specific situation.
          </p>
        </div>
      </footer>
    </div>
  );
}
