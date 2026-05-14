"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function CopyQuestions({ questions }: { questions: string[] }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    const text = questions.map((q, i) => `${i + 1}. ${q}`).join("\n\n");
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-1.5 font-semibold rounded-lg"
      style={{
        border: "1px solid #1B3A6B",
        color: "#1B3A6B",
        padding: "6px 12px",
        fontSize: "12px",
      }}
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? "Copied" : "Copy all questions"}
    </button>
  );
}
