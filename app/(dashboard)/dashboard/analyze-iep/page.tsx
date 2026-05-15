import { ClipboardCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card, LinkButton, NAVY, INK, MUTED } from "@/components/dashboard/ui";

type Analysis = {
  id: string;
  status: string | null;
  created_at: string;
  completed_at: string | null;
  overall_rating: string | null;
  brief_id: string | null;
  children?: { first_name: string } | null;
};

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

export default async function AnalyzeIEPListPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = user
    ? await supabase
        .from("iep_analyses")
        .select("id, status, created_at, completed_at, overall_rating, brief_id, children(first_name)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
    : { data: null };

  const analyses: Analysis[] = (data as unknown as Analysis[]) ?? [];

  return (
    <>
      <PageHeader
        title="IEP Analyzer"
        subtitle="Every proposed IEP Clearpath has analyzed for your children."
        action={<LinkButton href="/dashboard/analyze-iep/new">Analyze New IEP</LinkButton>}
      />

      {analyses.length === 0 ? (
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
            <p className="mb-6 mx-auto" style={{ color: MUTED, fontSize: "14px", maxWidth: "380px" }}>
              No IEP analyses yet. Upload a proposed IEP to get started.
            </p>
            <LinkButton href="/dashboard/analyze-iep/new">Analyze an IEP</LinkButton>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {analyses.map((a) => {
            const rating = a.overall_rating
              ? RATING_BADGE[a.overall_rating]
              : null;
            const isReady = a.status === "completed";
            return (
              <Card key={a.id} className="card-hover">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3 flex-wrap mb-1.5">
                      <span className="font-bold" style={{ color: INK, fontSize: "16px" }}>
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
                            background: a.status === "failed" ? "#FEE2E2" : "#FEF3C7",
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
  );
}
