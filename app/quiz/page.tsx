import type { Metadata } from "next";
import QuizClient from "@/components/quiz/QuizClient";

export const metadata: Metadata = {
  title: "Do I Need an IEP Evaluation? Free 5-Question Quiz | Clearpath",
  description:
    "Answer 5 questions about your child and find out whether to request a special education evaluation, what your child's IEP report means, or how to prepare for your next IEP meeting.",
};

export default function QuizPage() {
  return <QuizClient />;
}
