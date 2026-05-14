"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Upload, CheckCircle2, AlertTriangle, FileText } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { PageHeader, Card, NAVY, INK, MUTED, inputClass, inputStyle } from "@/components/dashboard/ui";

type ChildLite = { id: string; first_name: string };

type Status = "idle" | "uploading" | "processing" | "complete" | "error";

const PROCESSING_MESSAGES = [
  "Reading assessment scores...",
  "Identifying evaluation batteries...",
  "Translating scores into plain English...",
  "Generating services recommendations...",
  "Building your meeting questions...",
  "Preparing your brief...",
];

function formatBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1024 / 1024).toFixed(1)} MB`;
}

export default function UploadPage() {
  const [children, setChildren] = useState<ChildLite[] | null>(null);
  const [selectedChildId, setSelectedChildId] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [briefId, setBriefId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load children
  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const { data } = await supabase
        .from("children")
        .select("id, first_name")
        .order("first_name");
      setChildren(data ?? []);
    })();
  }, []);

  // Rotate processing messages
  useEffect(() => {
    if (status !== "processing") return;
    const t = setInterval(() => {
      setMessageIndex((i) => (i + 1) % PROCESSING_MESSAGES.length);
    }, 4000);
    return () => clearInterval(t);
  }, [status]);

  // Poll status when processing
  useEffect(() => {
    if (status !== "processing" || !briefId) return;
    let cancelled = false;
    const tick = async () => {
      try {
        const res = await fetch(`/api/briefs/${briefId}/status`, { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        if (data.status === "completed") setStatus("complete");
        else if (data.status === "failed") {
          setStatus("error");
          setErrorMessage("Brief generation failed. Please try again.");
        }
      } catch {
        /* ignore transient errors during polling */
      }
    };
    const interval = setInterval(tick, 5000);
    tick();
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [status, briefId]);

  const onPickFile = useCallback((f: File | null | undefined) => {
    if (!f) return;
    if (f.type !== "application/pdf") {
      setErrorMessage("File must be a PDF.");
      setStatus("error");
      return;
    }
    if (f.size > 50 * 1024 * 1024) {
      setErrorMessage("File size must be under 50MB.");
      setStatus("error");
      return;
    }
    setSelectedFile(f);
    setErrorMessage(null);
  }, []);

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    onPickFile(e.dataTransfer.files?.[0]);
  }

  function reset() {
    setStatus("idle");
    setErrorMessage(null);
    setSelectedFile(null);
    setBriefId(null);
  }

  async function submit() {
    if (!selectedFile || !selectedChildId) return;
    setErrorMessage(null);
    setStatus("uploading");

    const form = new FormData();
    form.append("file", selectedFile);
    form.append("childId", selectedChildId);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setStatus("error");
        setErrorMessage(data.error ?? "Upload failed.");
        return;
      }
      setBriefId(data.briefId);
      setStatus("processing");
    } catch (e) {
      setStatus("error");
      setErrorMessage(e instanceof Error ? e.message : "Network error.");
    }
  }

  const childName = children?.find((c) => c.id === selectedChildId)?.first_name ?? "";
  const hasChildren = (children?.length ?? 0) > 0;

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader
        title="Upload Evaluation Report"
        subtitle="Upload your child's neuropsychological or psychoeducational evaluation report. Clearpath will read every score and generate your personalized meeting brief in about 3 to 5 minutes."
      />

      {status === "processing" && (
        <Card className="text-center">
          <div className="py-10">
            <div
              className="mx-auto mb-6 rounded-full animate-breathe"
              style={{
                width: "80px",
                height: "80px",
                background: "#EEF2F9",
              }}
            />
            <h2 className="font-bold mb-2" style={{ color: INK, fontSize: "20px" }}>
              Clearpath is reading {childName ? `${childName}'s` : "your child's"} report...
            </h2>
            <p
              key={messageIndex}
              className="mb-6 mx-auto"
              style={{
                color: NAVY,
                fontSize: "15px",
                maxWidth: "360px",
                fontWeight: 500,
                animation: "messageSlideIn 300ms cubic-bezier(0, 0, 0.2, 1) both",
              }}
            >
              {PROCESSING_MESSAGES[messageIndex]}
            </p>
            <p style={{ color: MUTED, fontSize: "13px" }}>
              This usually takes 3 to 5 minutes. Don&apos;t close this tab.
            </p>
          </div>
        </Card>
      )}

      {status === "complete" && (
        <Card className="text-center">
          <div className="py-10">
            <div
              className="mx-auto mb-6 rounded-full flex items-center justify-center animate-success"
              style={{ width: "80px", height: "80px", background: "#EEF2F9" }}
            >
              <CheckCircle2 color={NAVY} size={42} strokeWidth={1.8} />
            </div>
            <h2 className="font-bold mb-3" style={{ color: INK, fontSize: "24px" }}>
              Your brief is ready.
            </h2>
            <p className="mb-6 mx-auto" style={{ color: MUTED, fontSize: "15px", maxWidth: "420px", lineHeight: 1.6 }}>
              Clearpath has finished reading {childName ? `${childName}'s` : "your child's"} evaluation
              report. Your personalized meeting brief is ready to read.
            </p>
            <Link
              href={`/dashboard/briefs/${briefId}`}
              className="inline-flex items-center justify-center text-white font-semibold rounded-lg"
              style={{ background: NAVY, padding: "12px 28px", fontSize: "15px" }}
            >
              View My Brief
            </Link>
            <div className="mt-4">
              <button
                type="button"
                onClick={reset}
                className="text-sm font-medium hover:underline"
                style={{ color: MUTED }}
              >
                Upload another report
              </button>
            </div>
          </div>
        </Card>
      )}

      {status === "error" && (
        <Card>
          <div className="flex items-start gap-3 mb-5">
            <AlertTriangle className="flex-shrink-0 mt-0.5" color="#C04A3A" size={22} strokeWidth={2} />
            <div>
              <h3 className="font-bold mb-1" style={{ color: INK, fontSize: "16px" }}>
                Something went wrong
              </h3>
              <p style={{ color: MUTED, fontSize: "14px" }}>
                {errorMessage ?? "Please try again."}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={reset}
            className="text-white font-semibold rounded-lg"
            style={{ background: NAVY, padding: "10px 20px", fontSize: "14px" }}
          >
            Try again
          </button>
        </Card>
      )}

      {(status === "idle" || status === "uploading") && (
        <>
          <Card className="mb-5">
            <label className="block mb-2 font-medium" style={{ color: INK, fontSize: "14px" }}>
              Which child is this report for?
            </label>
            {children === null ? (
              <div className="rounded-lg animate-pulse" style={{ height: "44px", background: "#F3F4F6" }} />
            ) : hasChildren ? (
              <select
                value={selectedChildId}
                onChange={(e) => setSelectedChildId(e.target.value)}
                disabled={status === "uploading"}
                className={inputClass}
                style={inputStyle}
              >
                <option value="">Select a child</option>
                {children.map((c) => (
                  <option key={c.id} value={c.id}>{c.first_name}</option>
                ))}
              </select>
            ) : (
              <p style={{ color: MUTED, fontSize: "14px" }}>
                Add a child profile first.{" "}
                <Link
                  href="/dashboard/children/new"
                  className="font-semibold hover:underline"
                  style={{ color: NAVY }}
                >
                  Create one now →
                </Link>
              </p>
            )}
          </Card>

          {/* Upload zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`rounded-2xl text-center bg-white cursor-pointer ${dragOver ? "animate-drag" : ""}`}
            style={{
              border: `1.5px dashed ${dragOver || selectedFile ? NAVY : "#D1D5DB"}`,
              background: dragOver ? "#EEF2F9" : selectedFile ? "#F9FAFB" : "#FFFFFF",
              padding: "60px 24px",
              transition: "all 150ms ease",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={(e) => onPickFile(e.target.files?.[0])}
              className="hidden"
            />
            <div
              className="mx-auto mb-5 rounded-2xl flex items-center justify-center"
              style={{ width: "72px", height: "72px", background: "#EEF2F9" }}
            >
              {selectedFile ? (
                <CheckCircle2 color={NAVY} size={32} strokeWidth={1.8} />
              ) : (
                <Upload color={NAVY} size={32} strokeWidth={1.8} />
              )}
            </div>
            {selectedFile ? (
              <>
                <p className="font-semibold mb-1" style={{ color: INK, fontSize: "15px" }}>
                  {selectedFile.name}
                </p>
                <p style={{ color: MUTED, fontSize: "13px" }}>
                  {formatBytes(selectedFile.size)} · Click to choose a different file
                </p>
              </>
            ) : (
              <>
                <p className="font-bold mb-1" style={{ color: INK, fontSize: "17px" }}>
                  Drop your PDF here or click to browse
                </p>
                <p style={{ color: MUTED, fontSize: "14px" }}>
                  Any standard psychoeducational or neuropsychological evaluation
                </p>
              </>
            )}
          </div>
          <p className="text-center mt-3 mb-6" style={{ color: MUTED, fontSize: "12px" }}>
            PDF up to 50MB · Processed in memory · Never stored on our servers
          </p>

          {status === "uploading" && (
            <div className="mb-4">
              <p className="mb-2 text-center" style={{ color: NAVY, fontSize: "14px", fontWeight: 600 }}>
                Uploading your report...
              </p>
              <div className="rounded-full overflow-hidden" style={{ height: "6px", background: "#F3F4F6" }}>
                <div
                  className="h-full rounded-full"
                  style={{ width: "100%", background: NAVY, animation: "shimmer 1.5s ease-in-out infinite" }}
                />
              </div>
              <style>{`
                @keyframes shimmer {
                  0% { transform: translateX(-100%); }
                  100% { transform: translateX(0); }
                }
              `}</style>
            </div>
          )}

          <button
            type="button"
            onClick={submit}
            disabled={!selectedFile || !selectedChildId || status === "uploading"}
            className="w-full text-white font-semibold rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: NAVY, padding: "14px 24px", fontSize: "15px" }}
          >
            {status === "uploading" ? (
              <>
                <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="white" strokeOpacity="0.3" strokeWidth="3" />
                  <path d="M12 2 a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                </svg>
                Uploading...
              </>
            ) : (
              <>
                <FileText size={18} strokeWidth={2} />
                Generate My Brief
              </>
            )}
          </button>
        </>
      )}
    </div>
  );
}
