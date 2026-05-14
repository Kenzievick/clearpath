"use client";

import { useState } from "react";
import { Download } from "lucide-react";

export default function DownloadPDFButton({
  briefId,
  childName,
}: {
  briefId: string;
  childName: string;
}) {
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    setLoading(true);
    try {
      const res = await fetch(`/api/briefs/${briefId}/pdf`);
      if (!res.ok) throw new Error("Failed to generate PDF");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${childName.replace(/[^a-zA-Z0-9-_]/g, "")}-IEP-Brief.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert("Couldn't generate PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={loading}
      className="inline-flex items-center gap-2 font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
      style={{
        border: "1px solid #1B3A6B",
        color: "#1B3A6B",
        padding: "10px 18px",
        fontSize: "13px",
      }}
    >
      <Download size={14} strokeWidth={2} />
      {loading ? "Generating..." : "Download PDF"}
    </button>
  );
}
