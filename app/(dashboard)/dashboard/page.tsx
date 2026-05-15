import Link from "next/link";
import { ClipboardCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getUserBriefs, getUserChildren } from "@/lib/data/briefs";
import { PageHeader, Card, LinkButton, StatusBadge, NAVY, INK, MUTED } from "@/components/dashboard/ui";
import { UpgradeButton } from "@/components/SubscriptionButtons";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

type Child = {
  id: string;
  first_name: string;
  grade: string | null;
  state: string | null;
};

type Brief = {
  id: string;
  status: string | null;
  created_at: string;
  child_id: string;
  children?: { first_name: string } | null;
};

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // The (dashboard) layout already redirects unauthenticated users; this is a
  // type guard so the parallel fetch below can rely on `user`.
  if (!user) return null;

  const displayName =
    user.user_metadata?.first_name || user.email?.split("@")[0] || "there";

  // Fetch children, all briefs, and subscription status in parallel rather
  // than sequentially. One briefs query now serves both the "Recent Briefs"
  // list (sliced) and the per-child counts — eliminating a redundant query.
  const [childrenData, allBriefs, profileRes] = await Promise.all([
    getUserChildren(user.id),
    getUserBriefs(user.id),
    supabase
      .from("profiles")
      .select("subscription_status")
      .eq("id", user.id)
      .single(),
  ]);

  const children: Child[] = (childrenData as unknown as Child[]) ?? [];
  const allBriefsTyped = (allBriefs as unknown as Brief[]) ?? [];
  const briefs: Brief[] = allBriefsTyped.slice(0, 5);

  const briefCountByChild = new Map<string, number>();
  allBriefsTyped.forEach((b) => {
    if (!b.child_id) return;
    briefCountByChild.set(b.child_id, (briefCountByChild.get(b.child_id) ?? 0) + 1);
  });

  // Upgrade prompt: only for free users who have already generated a brief.
  const profile = profileRes.data as { subscription_status?: string } | null;
  const isSubscribed = profile?.subscription_status === "active";
  const showUpgradePrompt = !isSubscribed && allBriefsTyped.length > 0;

  return (
    <>
      <PageHeader
        title={`${greeting()}, ${displayName}.`}
        subtitle="Here is where things stand for your children."
      />

      {showUpgradePrompt && (
        <div
          className="rounded-xl mb-8 flex items-center justify-between gap-4 flex-wrap"
          style={{
            background: "#EEF2F9",
            borderLeft: `4px solid ${NAVY}`,
            padding: "16px 20px",
          }}
        >
          <p style={{ color: INK, fontSize: "14px", lineHeight: 1.55, maxWidth: "560px" }}>
            You&apos;re on the free plan. Upgrade to unlock your child&apos;s
            complete brief, accommodations, meeting questions, and chat.
          </p>
          <UpgradeButton label="Upgrade — $27/month" />
        </div>
      )}

      {/* IEP Analyzer card — paid feature, only shown to subscribers */}
      {isSubscribed && (
        <Card className="card-hover mb-12">
          <div className="flex items-start gap-4 flex-wrap">
            <div
              className="rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ width: "52px", height: "52px", background: "#EEF2F9" }}
            >
              <ClipboardCheck color={NAVY} size={26} strokeWidth={1.8} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold mb-1" style={{ color: INK, fontSize: "17px" }}>
                IEP Document Analyzer
              </h3>
              <p className="mb-4" style={{ color: MUTED, fontSize: "14px", lineHeight: 1.6 }}>
                Have a proposed IEP? Upload it and Clearpath will analyze every
                goal, flag vague language, and tell you what to push back on
                before you sign.
              </p>
              <LinkButton href="/dashboard/analyze-iep/new">Analyze an IEP</LinkButton>
            </div>
          </div>
        </Card>
      )}

      {children.length === 0 ? (
        <Card className="max-w-2xl mx-auto text-center">
          <div className="py-8">
            <div
              className="mx-auto mb-6 rounded-2xl flex items-center justify-center"
              style={{ width: "72px", height: "72px", background: "#EEF2F9" }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={NAVY} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 11h-6M19 8v6" />
              </svg>
            </div>
            <h2 className="font-bold mb-3" style={{ color: INK, fontSize: "22px" }}>
              Start by adding your child.
            </h2>
            <p className="mb-6 mx-auto" style={{ color: MUTED, fontSize: "15px", maxWidth: "420px", lineHeight: 1.6 }}>
              Create a profile for your child so Clearpath can personalize every
              brief to their specific situation.
            </p>
            <LinkButton href="/dashboard/children/new">Add Your First Child</LinkButton>
          </div>
        </Card>
      ) : (
        <>
          <h2 className="font-bold mb-4" style={{ color: INK, fontSize: "18px" }}>
            Your Children
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {children.map((c) => (
              <Card key={c.id} className="card-hover">
                <div className="font-bold mb-1" style={{ color: INK, fontSize: "22px" }}>
                  {c.first_name}
                </div>
                <p className="mb-3" style={{ color: MUTED, fontSize: "13px" }}>
                  {[c.grade, c.state].filter(Boolean).join(" · ") || "—"}
                </p>
                <p className="mb-4" style={{ color: MUTED, fontSize: "13px" }}>
                  {briefCountByChild.get(c.id) ?? 0} brief
                  {(briefCountByChild.get(c.id) ?? 0) === 1 ? "" : "s"} generated
                </p>
                <div className="flex items-center gap-3 flex-wrap">
                  <LinkButton href="/dashboard/upload" className="!px-4 !py-2 !text-[13px]">
                    New Brief
                  </LinkButton>
                  <Link
                    href={`/dashboard/children/${c.id}/edit`}
                    className="text-sm font-medium hover:underline"
                    style={{ color: MUTED }}
                  >
                    View Profile
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      <h2 className="font-bold mb-4" style={{ color: INK, fontSize: "18px" }}>
        Recent Briefs
      </h2>
      {briefs.length === 0 ? (
        <Card>
          <p style={{ color: MUTED, fontSize: "14px" }}>
            No briefs yet. Upload an evaluation report to get started.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {briefs.map((b) => (
            <Card key={b.id} className="!p-5 card-hover">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="min-w-0">
                  <div className="font-bold mb-0.5" style={{ color: INK, fontSize: "15px" }}>
                    {b.children?.first_name ?? "—"}
                  </div>
                  <p style={{ color: MUTED, fontSize: "13px" }}>
                    {formatDate(b.created_at)}
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <StatusBadge status={b.status ?? "processing"} />
                  <LinkButton href="/dashboard/briefs" className="!px-4 !py-2 !text-[13px]">
                    View Brief
                  </LinkButton>
                  <button
                    type="button"
                    className="font-semibold rounded-lg transition-colors"
                    style={{
                      border: `1px solid ${NAVY}`,
                      color: NAVY,
                      padding: "8px 16px",
                      fontSize: "13px",
                    }}
                  >
                    Download PDF
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
