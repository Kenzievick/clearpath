"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Check,
  CheckCircle2,
  FileText,
  ClipboardList,
  Layers,
  Lightbulb,
  ArrowLeft,
  type LucideIcon,
} from "lucide-react";

const NAVY = "#1B3A6B";
const NAVY_HOVER = "#152D54";
const NAVY_SUBTLE = "#EEF2F9";
const INK = "#0B0E0D";
const MUTED = "#5C6360";

type Question = {
  prompt: string;
  options: string[];
};

const QUESTIONS: Question[] = [
  {
    prompt: "How old is your child?",
    options: [
      "Under 3 years old",
      "3 to 5 years old (preschool age)",
      "6 to 12 years old (elementary school)",
      "13 to 18 years old (middle or high school)",
      "Over 18 (transition age)",
    ],
  },
  {
    prompt: "What best describes your current situation?",
    options: [
      "I think my child might have a learning difference but nothing has been evaluated yet",
      "The school has suggested an evaluation and I want to understand the process",
      "My child was recently evaluated and I received a report I don't fully understand",
      "My child already has an IEP and I want to make sure it is working",
      "My child has a 504 plan and I'm not sure if they need more",
    ],
  },
  {
    prompt: "Which of these best describes what you are seeing with your child?",
    options: [
      "Struggles with reading, writing, or spelling",
      "Has difficulty with focus, attention, or behavior",
      "Has speech, language, or communication challenges",
      "Has social or emotional difficulties at school",
      "Multiple areas of difficulty",
    ],
  },
  {
    prompt: "Has your child's school taken any formal steps yet?",
    options: [
      "No — nothing has been done officially",
      "The school has done some informal interventions (like extra help or tutoring)",
      "The school has referred my child for an evaluation",
      "An evaluation has been completed and I have the report",
      "An IEP or 504 is already in place",
    ],
  },
  {
    prompt: "What would be most helpful to you right now?",
    options: [
      "Understanding whether my child qualifies for special education services",
      "Understanding what my child's evaluation report actually means",
      "Knowing what to ask for at an upcoming IEP meeting",
      "Making sure my child's current IEP is strong enough",
      "Learning about my rights as a parent in this process",
    ],
  },
];

type ResultKey = "A" | "B" | "C" | "D";

function computeResult(answers: (number | null)[]): ResultKey {
  const q2 = answers[1];
  const q4 = answers[3];
  const q5 = answers[4];

  if ((q2 === 0 || q2 === 1) && (q4 === 0 || q4 === 1)) return "A";
  if (q2 === 2 || q4 === 3) return "B";
  if (q2 === 3 || q5 === 2) return "C";
  if (q2 === 4 || q5 === 0) return "D";
  return "B";
}

type ResultContent = {
  icon: LucideIcon;
  headline: string;
  body: string;
  steps?: string[];
  primaryCta: { label: string; href: string };
  secondary?: { label: string; href: string };
  footnote?: string;
};

const RESULTS: Record<ResultKey, ResultContent> = {
  A: {
    icon: ClipboardList,
    headline: "Your next step is requesting a formal evaluation.",
    body: "Based on what you've shared, your child has not yet been formally evaluated for special education services. You have the legal right to request a free evaluation from your school district at any time — and the district is required to respond within 60 days in most states. Here is what to do next.",
    steps: [
      "Write a formal evaluation request letter to your school district's Special Education Director. Put it in writing — this starts the legal clock.",
      "Keep a written record of everything the school tells you, including dates and names.",
      "When the evaluation is complete and you receive the report, come back to Clearpath to get a plain-English translation.",
    ],
    primaryCta: { label: "Upload your report when it's ready", href: "/signup" },
    secondary: { label: "Learn more about requesting an evaluation", href: "/signup" },
  },
  B: {
    icon: FileText,
    headline: "You have the report. Now you need to understand it.",
    body: "You're in the exact moment Clearpath was built for. You have a neuropsychological or psychoeducational evaluation report, and you need to know what it actually means for your child — before you walk into the IEP meeting. Clearpath reads the report and gives you a plain-English brief in about five minutes.",
    primaryCta: { label: "Translate my report — free", href: "/signup" },
    footnote: "Free translation. Full meeting brief is $27, money-back if it doesn't help.",
  },
  C: {
    icon: Layers,
    headline: "Your meeting is coming. Let's get you ready.",
    body: "You already have an IEP in place — which means you know how these meetings work. But knowing how they work and walking in fully prepared are two different things. Clearpath generates a brief from your child's most recent evaluation that tells you exactly what to ask for, what to push back on, and what a strong IEP looks like for your child's specific profile.",
    primaryCta: { label: "Get your meeting brief", href: "/signup" },
  },
  D: {
    icon: Lightbulb,
    headline: "A 504 might not be enough for your child.",
    body: "504 plans provide accommodations but do not include specialized instruction or related services like speech therapy, occupational therapy, or resource room support. If your child has had a formal evaluation, Clearpath can read that report and tell you whether the findings support a stronger level of support than a 504 can provide.",
    primaryCta: { label: "Find out what your child's report supports", href: "/signup" },
  },
};

export default function QuizClient() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(QUESTIONS.length).fill(null)
  );
  const [showResults, setShowResults] = useState(false);

  const total = QUESTIONS.length;
  const current = QUESTIONS[step];
  const selected = answers[step];
  const isLast = step === total - 1;
  const progress = ((step + (selected !== null ? 1 : 0)) / total) * 100;

  function selectOption(i: number) {
    setAnswers((a) => {
      const next = [...a];
      next[step] = i;
      return next;
    });
  }

  function next() {
    if (selected === null) return;
    if (isLast) setShowResults(true);
    else setStep((s) => s + 1);
  }

  function back() {
    if (step > 0) setStep((s) => s - 1);
  }

  function retake() {
    setAnswers(Array(QUESTIONS.length).fill(null));
    setStep(0);
    setShowResults(false);
  }

  return (
    <div className="min-h-screen" style={{ background: "#FAFAF7" }}>
      {/* Header */}
      <header className="px-6 py-5 bg-white" style={{ borderBottom: "1px solid #E5E7EB" }}>
        <div className="max-w-6xl mx-auto flex flex-col gap-1">
          <Link href="/" className="font-bold tracking-tight text-2xl">
            <span style={{ color: NAVY }}>Clear</span>
            <span style={{ color: INK }}>path</span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs font-medium hover:underline"
            style={{ color: MUTED }}
          >
            <ArrowLeft className="w-3 h-3" />
            Back to home
          </Link>
        </div>
      </header>

      <main className="px-4 sm:px-6 py-12 lg:py-20">
        {/* Hero */}
        <div className="max-w-3xl mx-auto text-center mb-10 lg:mb-14">
          <div
            className="font-semibold uppercase mb-5"
            style={{ color: NAVY, fontSize: "11px", letterSpacing: "0.16em" }}
          >
            Free · 5 questions · No signup required
          </div>
          <h1
            className="font-extrabold font-display mb-5"
            style={{
              color: INK,
              fontSize: "clamp(34px, 5.5vw, 48px)",
              lineHeight: 1.1,
              letterSpacing: "-0.025em",
            }}
          >
            {showResults ? "Here's where you stand." : "Find out where you stand."}
          </h1>
          <p
            className="mx-auto"
            style={{ color: MUTED, fontSize: "18px", lineHeight: 1.6, maxWidth: "600px" }}
          >
            Answer five questions about your child. We&apos;ll tell you exactly
            what your next step should be — whether that&apos;s requesting an
            evaluation, preparing for an IEP meeting, or understanding what
            your child&apos;s existing report actually means.
          </p>
        </div>

        {/* Card */}
        <div
          className="bg-white rounded-2xl mx-auto"
          style={{
            maxWidth: "640px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 12px 40px rgba(0,0,0,0.06)",
            padding: "32px",
          }}
        >
          <div className="sm:px-4 sm:py-4">
            {!showResults ? (
              <QuizCard
                question={current}
                index={step}
                total={total}
                selected={selected}
                progress={progress}
                onSelect={selectOption}
                onNext={next}
                onBack={back}
                isLast={isLast}
              />
            ) : (
              <ResultCard
                resultKey={computeResult(answers)}
                onRetake={retake}
              />
            )}
          </div>
        </div>

        {/* Trust strip */}
        <div className="max-w-3xl mx-auto mt-10 grid sm:grid-cols-3 gap-3 sm:gap-6">
          {[
            "Free · No signup required",
            "Built with a Special Education Director with 35 years of experience",
            "Used by parents in Connecticut and beyond",
          ].map((t) => (
            <div
              key={t}
              className="flex items-start gap-2"
              style={{ color: MUTED, fontSize: "13px", lineHeight: 1.5 }}
            >
              <Check className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: NAVY }} strokeWidth={2.5} />
              <span>{t}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

function QuizCard({
  question,
  index,
  total,
  selected,
  progress,
  onSelect,
  onNext,
  onBack,
  isLast,
}: {
  question: Question;
  index: number;
  total: number;
  selected: number | null;
  progress: number;
  onSelect: (i: number) => void;
  onNext: () => void;
  onBack: () => void;
  isLast: boolean;
}) {
  return (
    <>
      {/* Progress */}
      <div className="mb-2 flex items-center justify-between" style={{ fontSize: "12px", color: MUTED }}>
        <span className="font-semibold uppercase" style={{ letterSpacing: "0.1em" }}>
          Question {index + 1} of {total}
        </span>
      </div>
      <div
        className="rounded-full overflow-hidden mb-8"
        style={{ height: "6px", background: "#F3F4F6" }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${progress}%`,
            background: NAVY,
            transition: "width 400ms cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />
      </div>

      <div key={index} className="animate-quiz-in">
        {/* Question */}
        <h2
          className="font-bold mb-6"
          style={{ color: INK, fontSize: "22px", lineHeight: 1.35, letterSpacing: "-0.01em" }}
        >
          {question.prompt}
        </h2>

        {/* Options */}
        <div className="space-y-3">
        {question.options.map((opt, i) => {
          const active = selected === i;
          return (
            <button
              key={i}
              type="button"
              onClick={() => onSelect(i)}
              className="w-full text-left rounded-xl flex items-center justify-between gap-3"
              style={{
                background: active ? NAVY_SUBTLE : "#FFFFFF",
                border: `1px solid ${active ? NAVY : "#D1D5DB"}`,
                padding: "16px 20px",
                color: INK,
                fontSize: "15px",
                lineHeight: 1.5,
                transition: "background 150ms ease, border-color 150ms ease",
              }}
            >
              <span>{opt}</span>
              {active && (
                <CheckCircle2
                  className="flex-shrink-0"
                  size={20}
                  color={NAVY}
                  strokeWidth={2.2}
                />
              )}
            </button>
          );
        })}
        </div>
      </div>

      {/* Nav */}
      <button
        type="button"
        onClick={onNext}
        disabled={selected === null}
        className="btn-press w-full text-white font-semibold rounded-lg mt-8 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        style={{
          background: selected === null ? NAVY : NAVY,
          padding: "14px 24px",
          fontSize: "15px",
        }}
        onMouseEnter={(e) => {
          if (selected !== null) e.currentTarget.style.background = NAVY_HOVER;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = NAVY;
        }}
      >
        {isLast ? "See my results" : "Next"}
      </button>

      {index > 0 && (
        <button
          type="button"
          onClick={onBack}
          className="block mx-auto mt-4 text-sm font-medium hover:underline"
          style={{ color: MUTED }}
        >
          Back
        </button>
      )}
    </>
  );
}

function ResultCard({
  resultKey,
  onRetake,
}: {
  resultKey: ResultKey;
  onRetake: () => void;
}) {
  const r = RESULTS[resultKey];
  const Icon = r.icon;

  return (
    <>
      <div
        className="mx-auto mb-6 rounded-2xl flex items-center justify-center"
        style={{ width: "56px", height: "56px", background: NAVY_SUBTLE }}
      >
        <Icon size={26} color={NAVY} strokeWidth={1.8} />
      </div>

      <h2
        className="font-extrabold font-display mb-4 text-center"
        style={{ color: INK, fontSize: "28px", lineHeight: 1.2, letterSpacing: "-0.02em" }}
      >
        {r.headline}
      </h2>

      <p style={{ color: MUTED, fontSize: "17px", lineHeight: 1.65 }}>{r.body}</p>

      {r.steps && (
        <ol className="mt-6 space-y-4">
          {r.steps.map((s, i) => (
            <li key={i} className="flex gap-3">
              <span
                className="flex-shrink-0 rounded-full flex items-center justify-center font-bold"
                style={{
                  width: "26px",
                  height: "26px",
                  background: NAVY_SUBTLE,
                  color: NAVY,
                  fontSize: "13px",
                }}
              >
                {i + 1}
              </span>
              <span style={{ color: INK, fontSize: "15px", lineHeight: 1.6 }}>{s}</span>
            </li>
          ))}
        </ol>
      )}

      <Link
        href={r.primaryCta.href}
        className="flex items-center justify-center text-white font-semibold rounded-lg mt-8 transition-colors"
        style={{ background: NAVY, padding: "14px 24px", fontSize: "15px" }}
      >
        {r.primaryCta.label}
      </Link>

      {r.footnote && (
        <p className="text-center mt-3" style={{ color: MUTED, fontSize: "12px" }}>
          {r.footnote}
        </p>
      )}

      {r.secondary && (
        <Link
          href={r.secondary.href}
          className="block text-center mt-4 text-sm font-medium hover:underline"
          style={{ color: NAVY }}
        >
          {r.secondary.label} →
        </Link>
      )}

      <p
        className="text-center mt-6 pt-6"
        style={{ color: MUTED, fontSize: "13px", borderTop: "1px solid #F3F4F6" }}
      >
        Free to start. Your child&apos;s report is never stored on our servers.
      </p>

      <button
        type="button"
        onClick={onRetake}
        className="block mx-auto mt-3 text-sm font-medium hover:underline"
        style={{ color: MUTED }}
      >
        Retake the quiz
      </button>
    </>
  );
}
