"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Upload, CheckCircle2, AlertTriangle, ClipboardCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { PageHeader, Card, NAVY, INK, MUTED, inputClass, inputStyle } from "@/components/dashboard/ui";

type ChildLite = { id: string; first_name: string };
type BriefLite = { id: string; created_at: string; child_id: string };

type Status = "idle" | "uploading" | "processing" | "complete" | "error";
type Mode = "with-brief" | "iep-only";

const PROCESSING_MESSAGES = [
  "Reading your child's IEP...",
  "Analyzing every goal for measurability...",
  "Identifying gaps between the evaluation and the IEP...",
  "Finding accommodations that should be included...",
  "Flagging language to push back on...",
  "Calculating the overall IEP rating...",
  "Almost done. Preparing your analysis...",
];

function formatBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1024 / 1024).toFixed(1)} MB`;
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function AnalyzeIEPNewPage() {
  const [children, setChildren] = useState<ChildLite[] | null>(null);
  const [briefs, setBriefs] = useState<BriefLite[]>([]);
  const [selectedChildId, setSelectedChildId] = useState("");
  const [mode, setMode] = useState<Mode>("iep-only");
  const [selectedBriefId, setSelectedBriefId] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load children + completed briefs.
  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const [{ data: childRows }, { data: briefRows }] = await Promise.all([
        supabase.from("children").select("id, first_name").order("first_name"),
        supabase
          .from("briefs")
          .select("id, created_at, child_id")
          .eq("status", "completed")
          .order("created_at", { ascending: false }),
      ]);
      setChildren(childRows ?? []);
      setBriefs(briefRows ?? []);
    })();
  }, []);

  // Briefs available for the selected child.
  const childBriefs = briefs.filter((b) => b.child_id === selectedChildId);

  // When the child changes, default to brief mode if they have a brief.
  useEffect(() => {
    if (!selectedChildId) return;
    const available = briefs.filter((b) => b.child_id === selectedChildId);
    if (available.length > 0) {
      setMode("with-brief");
      setSelectedBriefId(available[0].id);
    } else {
      setMode("iep-only");
      setSelectedBriefId("");
    }
  }, [selectedChildId, briefs]);

  // Rotate processing messages.
  useEffect(() => {
    if (status !== "processing") return;
    const t = setInterval(() => {
      setMessageIndex((i) => (i + 1) % PROCESSING_MESSAGES.length);
    }, 4000);
    return () => clearInterval(t);
  }, [status]);

  // Poll analysis status.
  useEffect(() => {
    if (status !== "processing" || !analysisId) return;
    let cancelled = false;
    const tick = async () => {
      try {
        const res = await fetch(`/api/analyze-iep/${analysisId}/status`, {
          cache: "no-store",
        });
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        if (data.status === "completed") setStatus("complete");
        else if (data.status === "failed") {
          setStatus("error");
          setErrorMessage("Analysis failed. Please try again.");
        }
      } catch {
        /* ignore transient polling errors */
      }
    };
    const interval = setInterval(tick, 6000);
    tick();
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [status, analysisId]);

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
    setAnalysisId(null);
  }

  async function submit() {
    if (!selectedFile || !selectedChildId) return;
    setErrorMessage(null);
    setStatus("uploading");

    const useBriefContext = mode === "with-brief" && !!selectedBriefId;
    const form = new FormData();
    form.append("file", selectedFile);
    form.append("childId", selectedChildId);
    form.append("useBriefContext", useBriefContext ? "true" : "false");
    if (useBriefContext) form.append("briefId", selectedBriefId);

    try {
      const res = await fetch("/api/analyze-iep", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setStatus("error");
        setErrorMessage(data.error ?? "Upload failed.");
        return;
      }
      setAnalysisId(data.analysisId);
      setStatus("processing");
    } catch (e) {
      setStatus("error");
      setErrorMessage(e instanceof Error ? e.message : "Network error.");
    }
  }

  const childName = children?.find((c) => c.id === selectedChildId)?.first_name ?? "";
  const hasChildren = (children?.length ?? 0) > 0;
  const canSubmit = !!selectedFile && !!selectedChildId && status !== "uploading";

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader
        title="IEP Document Analyzer"
        subtitle="Upload your child's proposed IEP. Clearpath will analyze every goal, flag vague language, and tell you exactly what to push back on before you sign."
      />

      {status === "processing" && (
        <Card className="text-center">
          <div className="py-10">
            <div
              className="mx-auto mb-6 rounded-full animate-breathe"
              style={{ width: "80px", height: "80px", background: "#EEF2F9" }}
            />
            <h2 className="font-bold mb-2" style={{ color: INK, fontSize: "20px" }}>
              Clearpath is analyzing {childName ? `${childName}'s` : "the"} IEP...
            </h2>
            <p
              key={messageIndex}
              className="mb-6 mx-auto"
              style={{
                color: NAVY,
                fontSize: "15px",
                maxWidth: "380px",
                fontWeight: 500,
                animation: "messageSlideIn 300ms cubic-bezier(0, 0, 0.2, 1) both",
              }}
            >
              {PROCESSING_MESSAGES[messageIndex]}
            </p>
            <p style={{ color: MUTED, fontSize: "13px" }}>
              This usually takes 2 to 4 minutes. Don&apos;t close this tab.
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
              Your IEP analysis is ready.
            </h2>
            <p
              className="mb-6 mx-auto"
              style={{ color: MUTED, fontSize: "15px", maxWidth: "420px", lineHeight: 1.6 }}
            >
              Clearpath has finished reviewing {childName ? `${childName}'s` : "the"} IEP —
              every goal, every gap, and the language worth pushing back on.
            </p>
            <Link
              href={`/dashboard/analyze-iep/${analysisId}`}
              className="inline-flex items-center justify-center text-white font-semibold rounded-lg"
              style={{ background: NAVY, padding: "12px 28px", fontSize: "15px" }}
            >
              View Analysis
            </Link>
            <div className="mt-4">
              <button
                type="button"
                onClick={reset}
                className="text-sm font-medium hover:underline"
                style={{ color: MUTED }}
              >
                Analyze another IEP
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
          {/* Step 1 — child selector */}
          <Card className="mb-5">
            <label className="block mb-2 font-medium" style={{ color: INK, fontSize: "14px" }}>
              Which child is this IEP for?
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

          {/* Step 2 — brief cross-reference selector */}
          {selectedChildId && (
            <Card className="mb-5">
              <label className="block mb-3 font-medium" style={{ color: INK, fontSize: "14px" }}>
                How should Clearpath analyze this IEP?
              </label>
              <div className="space-y-3">
                {/* Option A — with brief */}
                <button
                  type="button"
                  onClick={() => childBriefs.length > 0 && setMode("with-brief")}
                  disabled={childBriefs.length === 0}
                  className="w-full text-left rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    border: `1px solid ${mode === "with-brief" ? NAVY : "#D1D5DB"}`,
                    background: mode === "with-brief" ? "#EEF2F9" : "#FFFFFF",
                    padding: "16px",
                    transition: "all 150ms ease",
                  }}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-semibold" style={{ color: INK, fontSize: "14px" }}>
                      Analyze with evaluation brief
                    </span>
                    {mode === "with-brief" && (
                      <CheckCircle2 size={18} color={NAVY} strokeWidth={2.2} />
                    )}
                  </div>
                  <p style={{ color: MUTED, fontSize: "13px", lineHeight: 1.5 }}>
                    {childBriefs.length > 0
                      ? "Clearpath will compare the IEP against your child's evaluation findings and identify gaps between what the scores support and what the IEP offers. This is the more powerful analysis."
                      : "No completed evaluation briefs for this child yet. Upload an evaluation report first to unlock this option."}
                  </p>
                  {mode === "with-brief" && childBriefs.length > 0 && (
                    <select
                      value={selectedBriefId}
                      onChange={(e) => setSelectedBriefId(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className={inputClass}
                      style={{ ...inputStyle, marginTop: "12px" }}
                    >
                      {childBriefs.map((b) => (
                        <option key={b.id} value={b.id}>
                          Brief generated on {formatDate(b.created_at)}
                        </option>
                      ))}
                    </select>
                  )}
                </button>

                {/* Option B — IEP only */}
                <button
                  type="button"
                  onClick={() => setMode("iep-only")}
                  className="w-full text-left rounded-xl"
                  style={{
                    border: `1px solid ${mode === "iep-only" ? NAVY : "#D1D5DB"}`,
                    background: mode === "iep-only" ? "#EEF2F9" : "#FFFFFF",
                    padding: "16px",
                    transition: "all 150ms ease",
                  }}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-semibold" style={{ color: INK, fontSize: "14px" }}>
                      Analyze IEP only
                    </span>
                    {mode === "iep-only" && (
                      <CheckCircle2 size={18} color={NAVY} strokeWidth={2.2} />
                    )}
                  </div>
                  <p style={{ color: MUTED, fontSize: "13px", lineHeight: 1.5 }}>
                    Clearpath will analyze the IEP on its own without cross-referencing
                    evaluation findings. You can still get a full goal analysis, language
                    review, and rating.
                  </p>
                </button>
              </div>
            </Card>
          )}

          {/* Step 3 — file upload */}
          <label className="block mb-2 font-medium" style={{ color: INK, fontSize: "14px" }}>
            Upload the proposed IEP document
          </label>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
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
                  Drop the IEP PDF here or click to browse
                </p>
                <p style={{ color: MUTED, fontSize: "14px" }}>
                  The proposed IEP document your district sent home
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
                Uploading the IEP...
              </p>
              <div className="rounded-full overflow-hidden" style={{ height: "6px", background: "#F3F4F6" }}>
                <div
                  className="h-full rounded-full"
                  style={{ width: "100%", background: NAVY }}
                />
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={submit}
            disabled={!canSubmit}
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
                <ClipboardCheck size={18} strokeWidth={2} />
                Analyze My IEP
              </>
            )}
          </button>
        </>
      )}
    </div>
  );
}
