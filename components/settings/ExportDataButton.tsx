"use client";

const INK = "#0B0E0D";

export default function ExportDataButton() {
  return (
    <button
      type="button"
      disabled
      title="Coming soon — we&apos;re working on this."
      className="inline-flex items-center justify-center font-semibold rounded-lg transition-colors cursor-not-allowed"
      style={{
        border: "1px solid #D1D5DB",
        color: INK,
        background: "#F9FAFB",
        padding: "10px 20px",
        fontSize: "14px",
        opacity: 0.6,
      }}
    >
      Export My Data
    </button>
  );
}
