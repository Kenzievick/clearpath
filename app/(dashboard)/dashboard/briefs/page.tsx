"use client";

import { useEffect, useState } from "react";
import { FileText, ClipboardCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  PageHeader,
  Card,
  LinkButton,
  StatusBadge,
  NAVY,
  INK,
  MUTED,
  inputClass,
  inputStyle,
} from "@/components/dashboard/ui";
import { deleteBrief } from "./actions";
import DownloadPDFButton from "@/components/brief/DownloadPDFButton";

type ChildLite = { id: string; first_name: string };

type Brief = {
  id: string;
  status: string | null;
  created_at: string;
  child_id: string;
  summary: string | null;
  children?: { first_name: string } | null;
};

type IEPAnalysis = {
  id: string;
  status: string | null;
  created_at: string;
  completed_at: string | null;
  overall_rating: string | null;
  brief_id: string | null;
  child_id: string;
  children?: { first_name: string } | null;
};

type Tab = "evaluation" | "iep";

const RATING_BADGE: Record<string, { label: string; bg: string; fg: string }> = {
  strong: { label: "Strong", bg: "#D1FAE5", fg: "#065F46" },
  adequate: { label: "Adequate", bg: "#DBEAFE", fg: "#1E40AF" },
  weak: { label: "Weak", bg: "#FEF3C7", fg: "#92400E" },
  insufficient: { label: "Insufficient", bg: "#FEE2E2", fg: "#991B1B" },
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function excerptFor(b: Brief) {
  const s = (b.status ?? "").toLowerCase();
  if (s === "completed")
    return (b.summary ?? "").slice(0, 100) + ((b.summary?.length ?? 0) > 100 ? "..." : "");
  if (s === "failed") return "Generation failed. Please try again.";
  return "Brief is being generated...";
}

export default function BriefsPage() {
  const [tab, setTab] = useState<Tab>("evaluation");
  const [briefs, setBriefs] = useState<Brief[] | null>(null);
  const [iepAnalyses, setIepAnalyses] = useState<IEPAnalysis[] | null>(null);
  const [children, setChildren] = useState<ChildLite[]>([]);
  const [childFilter, setChildFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [error, setError] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    (async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        const [
          { data: childRows, error: cErr },
          { data: briefRows, error: bErr },
          { data: iepRows, error: iErr },
          profileRes,
        ] = await Promise.all([
          supabase.from("children").select("id, first_name").order("first_name"),
          supabase
            .from("briefs")
            .select("id, status, created_at, child_id, summary, children(first_name)")
            .order("created_at", { ascending: false }),
          supabase
            .from("iep_analyses")
            .select(
              "id, status, created_at, completed_at, overall_rating, brief_id, child_id, children(first_name)"
            )
            .order("created_at", { ascending: false }),
          user
            ? supabase
                .from("profiles")
                .select("subscription_status")
                .eq("id", user.id)
                .single()
            : Promise.resolve({ data: null }),
        ]);
        if (cErr || bErr || iErr) throw cErr || bErr || iErr;
        if (cancelled) return;
        setChildren(childRows ?? []);
        setBriefs((briefRows as unknown as Brief[]) ?? []);
        setIepAnalyses((iepRows as unknown as IEPAnalysis[]) ?? []);
        setIsSubscribed(
          (profileRes?.data as { subscription_status?: string } | null)
            ?.subscription_status === "active"
        );
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load briefs.");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredBriefs = (briefs ?? []).filter((b) => {
    if (childFilter !== "all" && b.child_id !== childFilter) return false;
    if (statusFilter !== "all" && (b.status ?? "").toLowerCase() !== statusFilter)
      return false;
    return true;
  });

  const filteredIEP = (iepAnalyses ?? []).filter((a) => {
    if (childFilter !== "all" && a.child_id !== childFilter) return false;
    if (statusFilter !== "all" && (a.status ?? "").toLowerCase() !== statusFilter)
      return false;
    return true;
  });

  const tabs: { key: Tab; label: string; count: number | null }[] = [
    { key: "evaluation", label: "Evaluation Briefs", count: briefs?.length ?? null },
    { key: "iep", label: "IEP Briefs", count: iepAnalyses?.length ?? null },
  ];

  return (
    <>
      <PageHeader
        title="Your Briefs"
        subtitle="Evaluation briefs and IEP analyses Clearpath has generated for your children."
      />

      {/* Tab switcher */}
      <div
        className="flex gap-1 mb-6 p-1 rounded-xl"
        style={{ background: "#F3F4F6", width: "fit-content" }}
      >
        {tabs.map((t) => {
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className="rounded-lg font-semibold transition-colors"
              style={{
                background: active ? "#FFFFFF" : "transparent",
                color: active ? NAVY : MUTED,
                padding: "8px 16px",
                fontSize: "14px",
                boxShadow: active ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
              }}
            >
              {t.label}
              {t.count !== null && (
                <span style={{ color: MUTED, fontWeight: 500, marginLeft: "6px" }}>
                  {t.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={childFilter}
          onChange={(e) => setChildFilter(e.target.value)}
          className={inputClass}
          style={{ ...inputStyle, maxWidth: "240px" }}
        >
          <option value="all">All Children</option>
          {children.map((c) => (
            <option key={c.id} value={c.id}>
              {c.first_name}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={inputClass}
          style={{ ...inputStyle, maxWidth: "180px" }}
        >
          <option value="all">All statuses</option>
          <option value="completed">Completed</option>
          <option value="processing">Processing</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {error && (
        <Card>
          <p style={{ color: "#C04A3A", fontSize: "14px" }}>
            Couldn&apos;t load briefs: {error}
          </p>
        </Card>
      )}

      {/* ─── Evaluation Briefs tab ─── */}
      {!error && tab === "evaluation" && (
        <>
          {briefs === null && (
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl animate-pulse"
                  style={{ height: "104px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
                />
              ))}
            </div>
          )}

          {briefs !== null && filteredBriefs.length === 0 && (
            <Card className="text-center">
              <div className="py-10">
                <div
                  className="mx-auto mb-5 rounded-2xl flex items-center justify-center"
                  style={{ width: "60px", height: "60px", background: "#EEF2F9" }}
                >
                  <FileText color={NAVY} size={26} strokeWidth={1.8} />
                </div>
                <h3 className="font-bold mb-2" style={{ color: INK, fontSize: "18px" }}>
                  No evaluation briefs yet
                </h3>
                <p
                  className="mb-6 mx-auto"
                  style={{ color: MUTED, fontSize: "14px", maxWidth: "360px" }}
                >
                  Upload your child&apos;s evaluation report to generate your first
                  brief.
                </p>
                <LinkButton href="/dashboard/upload">Upload a Report</LinkButton>
              </div>
            </Card>
          )}

          {briefs !== null && filteredBriefs.length > 0 && (
            <div className="space-y-3">
              {filteredBriefs.map((b) => (
                <Card key={b.id} className="card-hover">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3 flex-wrap mb-1.5">
                        <span
                          className="font-bold"
                          style={{ color: INK, fontSize: "16px" }}
                        >
                          {b.children?.first_name ?? "—"}
                        </span>
                        <StatusBadge status={b.status ?? "processing"} />
                      </div>
                      <p className="mb-2" style={{ color: MUTED, fontSize: "13px" }}>
                        {formatDate(b.created_at)}
                      </p>
                      <p style={{ color: MUTED, fontSize: "14px", lineHeight: 1.6 }}>
                        {excerptFor(b)}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 flex-wrap">
                      <LinkButton
                        href={`/dashboard/briefs/${b.id}`}
                        className="!px-4 !py-2 !text-[13px]"
                      >
                        View Brief
                      </LinkButton>
                      {b.status === "completed" && isSubscribed && (
                        <DownloadPDFButton
                          briefId={b.id}
                          childName={b.children?.first_name ?? "Your Child"}
                        />
                      )}
                    </div>
                  </div>
                  <div
                    className="mt-4 pt-3 flex justify-end"
                    style={{ borderTop: "1px solid #F3F4F6" }}
                  >
                    <form action={deleteBrief}>
                      <input type="hidden" name="id" value={b.id} />
                      <button
                        type="submit"
                        className="text-xs font-medium hover:underline"
                        style={{ color: "#C04A3A" }}
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* ─── IEP Briefs tab ─── */}
      {!error && tab === "iep" && (
        <>
          {iepAnalyses === null && (
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl animate-pulse"
                  style={{ height: "92px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
                />
              ))}
            </div>
          )}

          {iepAnalyses !== null && filteredIEP.length === 0 && (
            <Card className="text-center">
              <div className="py-10">
                <div
                  className="mx-auto mb-5 rounded-2xl flex items-center justify-center"
                  style={{ width: "60px", height: "60px", background: "#EEF2F9" }}
                >
                  <ClipboardCheck color={NAVY} size={26} strokeWidth={1.8} />
                </div>
                <h3 className="font-bold mb-2" style={{ color: INK, fontSize: "18px" }}>
                  No IEP analyses yet
                </h3>
                <p
                  className="mb-6 mx-auto"
                  style={{ color: MUTED, fontSize: "14px", maxWidth: "380px" }}
                >
                  Upload a proposed IEP and Clearpath will analyze every goal and
                  flag what to push back on.
                </p>
                <LinkButton href="/dashboard/analyze-iep/new">Analyze an IEP</LinkButton>
              </div>
            </Card>
          )}

          {iepAnalyses !== null && filteredIEP.length > 0 && (
            <div className="space-y-3">
              {filteredIEP.map((a) => {
                const rating = a.overall_rating ? RATING_BADGE[a.overall_rating] : null;
                const isReady = a.status === "completed";
                return (
                  <Card key={a.id} className="card-hover">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3 flex-wrap mb-1.5">
                          <span
                            className="font-bold"
                            style={{ color: INK, fontSize: "16px" }}
                          >
                            {a.children?.first_name ?? "—"}
                          </span>
                          {isReady && rating ? (
                            <span
                              className="rounded-full font-semibold uppercase"
                              style={{
                                background: rating.bg,
                                color: rating.fg,
                                fontSize: "11px",
                                padding: "3px 10px",
                                letterSpacing: "0.04em",
                              }}
                            >
                              {rating.label} IEP
                            </span>
                          ) : (
                            <span
                              className="rounded-full font-semibold uppercase"
                              style={{
                                background:
                                  a.status === "failed" ? "#FEE2E2" : "#FEF3C7",
                                color: a.status === "failed" ? "#991B1B" : "#92400E",
                                fontSize: "11px",
                                padding: "3px 10px",
                                letterSpacing: "0.04em",
                              }}
                            >
                              {a.status === "failed" ? "Failed" : "Processing"}
                            </span>
                          )}
                          {a.brief_id && (
                            <span
                              className="rounded-full font-semibold"
                              style={{
                                background: "#EEF2F9",
                                color: NAVY,
                                fontSize: "11px",
                                padding: "3px 10px",
                              }}
                            >
                              Cross-referenced with brief
                            </span>
                          )}
                        </div>
                        <p style={{ color: MUTED, fontSize: "13px" }}>
                          {formatDate(a.completed_at ?? a.created_at)}
                        </p>
                      </div>
                      <LinkButton
                        href={`/dashboard/analyze-iep/${a.id}`}
                        className="!px-4 !py-2 !text-[13px]"
                      >
                        View Analysis
                      </LinkButton>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}
    </>
  );
}
