"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText } from "lucide-react";
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

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function excerptFor(b: Brief) {
  const s = (b.status ?? "").toLowerCase();
  if (s === "completed") return (b.summary ?? "").slice(0, 100) + ((b.summary?.length ?? 0) > 100 ? "..." : "");
  if (s === "failed") return "Generation failed. Please try again.";
  return "Brief is being generated...";
}

export default function BriefsPage() {
  const [briefs, setBriefs] = useState<Brief[] | null>(null);
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
          profileRes,
        ] = await Promise.all([
          supabase.from("children").select("id, first_name").order("first_name"),
          supabase
            .from("briefs")
            .select("id, status, created_at, child_id, summary, children(first_name)")
            .order("created_at", { ascending: false }),
          user
            ? supabase
                .from("profiles")
                .select("subscription_status")
                .eq("id", user.id)
                .single()
            : Promise.resolve({ data: null }),
        ]);
        if (cErr || bErr) throw cErr || bErr;
        if (cancelled) return;
        setChildren(childRows ?? []);
        setBriefs((briefRows as unknown as Brief[]) ?? []);
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

  const filtered = (briefs ?? []).filter((b) => {
    if (childFilter !== "all" && b.child_id !== childFilter) return false;
    if (statusFilter !== "all" && (b.status ?? "").toLowerCase() !== statusFilter) return false;
    return true;
  });

  return (
    <>
      <PageHeader title="Your Briefs" subtitle="Every brief Clearpath has generated for your children." />

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
            <option key={c.id} value={c.id}>{c.first_name}</option>
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

      {!error && briefs === null && (
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

      {!error && briefs !== null && filtered.length === 0 && (
        <Card className="text-center">
          <div className="py-10">
            <div
              className="mx-auto mb-5 rounded-2xl flex items-center justify-center"
              style={{ width: "60px", height: "60px", background: "#EEF2F9" }}
            >
              <FileText color={NAVY} size={26} strokeWidth={1.8} />
            </div>
            <h3 className="font-bold mb-2" style={{ color: INK, fontSize: "18px" }}>
              No briefs yet
            </h3>
            <p className="mb-6 mx-auto" style={{ color: MUTED, fontSize: "14px", maxWidth: "360px" }}>
              Upload your child&apos;s evaluation report to generate your first
              brief.
            </p>
            <LinkButton href="/dashboard/upload">Upload a Report</LinkButton>
          </div>
        </Card>
      )}

      {!error && briefs !== null && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map((b) => (
            <Card key={b.id} className="card-hover">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3 flex-wrap mb-1.5">
                    <span className="font-bold" style={{ color: INK, fontSize: "16px" }}>
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
              <div className="mt-4 pt-3 flex justify-end" style={{ borderTop: "1px solid #F3F4F6" }}>
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
  );
}
