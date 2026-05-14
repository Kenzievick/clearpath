import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card, INK, MUTED, NAVY } from "@/components/dashboard/ui";
import {
  UpgradeButton,
  ManageSubscriptionButton,
} from "@/components/SubscriptionButtons";
import { CheckCircle, FileText, MessageSquare, Download } from "lucide-react";

const FEATURES = [
  { icon: FileText, text: "Your child's scores explained in plain English" },
  { icon: CheckCircle, text: "Services your child's profile typically supports" },
  { icon: CheckCircle, text: "Accommodations worth requesting, by category" },
  { icon: CheckCircle, text: "10 specific questions to bring to the meeting" },
  { icon: CheckCircle, text: "What to watch for in the proposed IEP" },
  { icon: CheckCircle, text: "Your state-specific rights and timelines" },
  { icon: MessageSquare, text: "Unlimited chat grounded in your child's report" },
  { icon: Download, text: "Downloadable PDF to bring to the meeting" },
];

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function SettingsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_status, subscription_current_period_end")
    .eq("id", user?.id ?? "")
    .single();

  const isSubscribed = profile?.subscription_status === "active";
  const periodEnd = profile?.subscription_current_period_end
    ? formatDate(profile.subscription_current_period_end)
    : null;

  return (
    <>
      <PageHeader title="Account Settings" subtitle="Your subscription and account." />

      {/* Subscription */}
      <Card className="max-w-xl mb-6">
        {isSubscribed ? (
          <>
            <div className="flex items-center justify-between gap-3 flex-wrap mb-2">
              <div
                className="text-xs font-semibold uppercase"
                style={{ color: MUTED, letterSpacing: "0.08em" }}
              >
                Clearpath Membership
              </div>
              <span
                className="rounded-full font-semibold uppercase"
                style={{
                  background: "#DCFCE7",
                  color: "#166534",
                  fontSize: "11px",
                  padding: "3px 10px",
                  letterSpacing: "0.04em",
                }}
              >
                Active
              </span>
            </div>
            <p className="mb-5" style={{ color: INK, fontSize: "15px" }}>
              {periodEnd
                ? `Your subscription renews on ${periodEnd}.`
                : "Your subscription is active."}
            </p>
            <ManageSubscriptionButton />
            <p className="mt-3" style={{ color: MUTED, fontSize: "13px" }}>
              To cancel, update payment method, or download invoices, use the
              customer portal.
            </p>
          </>
        ) : (
          <>
            <div
              className="text-xs font-semibold uppercase mb-2"
              style={{ color: MUTED, letterSpacing: "0.08em" }}
            >
              Free Plan
            </div>
            <p className="mb-5" style={{ color: INK, fontSize: "15px", lineHeight: 1.6 }}>
              You currently have access to Section 1 — the plain-English summary
              — of each brief you generate. Upgrade to unlock everything else.
            </p>

            <div className="grid grid-cols-1 gap-2.5 mb-6">
              {FEATURES.map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  <f.icon className="w-4 h-4 flex-shrink-0" style={{ color: NAVY }} />
                  <span style={{ color: "#374151", fontSize: "13.5px" }}>{f.text}</span>
                </div>
              ))}
            </div>

            <UpgradeButton label="Upgrade to full access — $27/month" />
          </>
        )}
      </Card>

      {/* Account */}
      <Card className="max-w-xl">
        <div
          className="text-xs font-semibold uppercase mb-1"
          style={{ color: MUTED, letterSpacing: "0.08em" }}
        >
          Email
        </div>
        <div className="mb-5" style={{ color: INK, fontSize: "15px" }}>
          {user?.email}
        </div>
        <form action="/api/auth/signout" method="post">
          <button
            type="submit"
            className="btn-press inline-flex items-center justify-center font-semibold rounded-lg transition-colors"
            style={{
              border: "1px solid #D1D5DB",
              color: INK,
              background: "#FFFFFF",
              padding: "10px 20px",
              fontSize: "14px",
            }}
          >
            Sign out
          </button>
        </form>
      </Card>
    </>
  );
}
