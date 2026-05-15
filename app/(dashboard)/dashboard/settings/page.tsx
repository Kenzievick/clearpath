import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, INK, MUTED, NAVY } from "@/components/dashboard/ui";
import {
  UpgradeButton,
  ManageSubscriptionButton,
} from "@/components/SubscriptionButtons";
import ChangePasswordButton from "@/components/settings/ChangePasswordButton";
import DeleteAccountSection from "@/components/settings/DeleteAccountSection";
import ExportDataButton from "@/components/settings/ExportDataButton";
import {
  CreditCard,
  User,
  Database,
  Lock,
  ExternalLink,
} from "lucide-react";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function Card({
  children,
  borderLeft,
}: {
  children: React.ReactNode;
  borderLeft?: string;
}) {
  return (
    <div
      className="bg-white rounded-2xl mb-6"
      style={{
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        padding: "32px",
        ...(borderLeft ? { borderLeft } : {}),
      }}
    >
      {children}
    </div>
  );
}

function CardHeader({
  icon: Icon,
  title,
  color = INK,
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  title: string;
  color?: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-5">
      <Icon className="w-5 h-5" style={{ color }} />
      <h2 className="font-bold" style={{ color, fontSize: "18px" }}>
        {title}
      </h2>
    </div>
  );
}

function Badge({
  label,
  bg,
  fg,
}: {
  label: string;
  bg: string;
  fg: string;
}) {
  return (
    <span
      className="inline-flex items-center rounded-full font-semibold"
      style={{
        background: bg,
        color: fg,
        padding: "3px 12px",
        fontSize: "11px",
        letterSpacing: "0.04em",
        textTransform: "uppercase",
      }}
    >
      {label}
    </span>
  );
}

const FREE_FEATURES = [
  "Section 1 summary only",
  "No PDF download",
  "No chat",
  "No IEP analyzer",
];
const PAID_FEATURES = [
  "All 7 brief sections",
  "PDF download",
  "Unlimited chat",
  "IEP Document Analyzer",
  "All future features",
];

export default async function SettingsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userId = user?.id ?? "";

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_status, subscription_current_period_end")
    .eq("id", userId)
    .single();

  const status = profile?.subscription_status ?? "free";
  const periodEnd = profile?.subscription_current_period_end
    ? formatDate(profile.subscription_current_period_end)
    : null;

  // Counts for the "Your Data" section
  const [childrenCount, briefsCount, iepsCount, chatCount] = await Promise.all([
    supabase
      .from("children")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId),
    supabase
      .from("briefs")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId),
    supabase
      .from("iep_analyses")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId),
    supabase
      .from("chat_messages")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId),
  ]);

  const counts = {
    children: childrenCount.count ?? 0,
    briefs: briefsCount.count ?? 0,
    ieps: iepsCount.count ?? 0,
    chats: chatCount.count ?? 0,
  };

  return (
    <div style={{ maxWidth: "680px" }}>
      <PageHeader
        title="Account Settings"
        subtitle="Manage your subscription, account, and data."
      />

      {/* ── Section 1 — Subscription ───────────────────────────── */}
      <Card>
        <CardHeader icon={CreditCard} title="Clearpath Membership" />
        {renderSubscription(status, periodEnd)}
      </Card>

      {/* ── Section 2 — Account ────────────────────────────────── */}
      <Card>
        <CardHeader icon={User} title="Account" />

        <label
          className="block mb-2 font-medium"
          style={{ color: INK, fontSize: "14px" }}
        >
          Email address
        </label>
        <div
          className="flex items-center gap-2 rounded-lg mb-6"
          style={{
            border: "1px solid #E5E7EB",
            background: "#F9FAFB",
            padding: "12px",
          }}
        >
          <Lock className="w-4 h-4 flex-shrink-0" style={{ color: MUTED }} />
          <span style={{ color: INK, fontSize: "15px" }}>
            {user?.email ?? "—"}
          </span>
        </div>

        <ChangePasswordButton email={user?.email ?? ""} />
      </Card>

      {/* ── Section 3 — Your Data ──────────────────────────────── */}
      <Card>
        <CardHeader icon={Database} title="Your Data" />

        <ul className="mb-6 divide-y" style={{ borderColor: "#E5E7EB" }}>
          <DataRow
            label="Child profiles"
            count={counts.children}
            href="/dashboard/children"
          />
          <DataRow
            label="Evaluation briefs"
            count={counts.briefs}
            href="/dashboard/briefs"
          />
          <DataRow
            label="IEP analyses"
            count={counts.ieps}
            href="/dashboard/analyze-iep"
          />
          <DataRow label="Chat messages" count={counts.chats} />
        </ul>

        <div className="mb-5">
          <ExportDataButton />
          <p className="mt-3" style={{ color: MUTED, fontSize: "13px" }}>
            Download a copy of all your briefs and child profiles.
          </p>
        </div>

        <a
          href="/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-medium"
          style={{ color: NAVY, fontSize: "14px" }}
        >
          Privacy Policy
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </Card>

      {/* ── Section 4 — Danger Zone ────────────────────────────── */}
      <DeleteAccountSection />
    </div>
  );
}

function DataRow({
  label,
  count,
  href,
}: {
  label: string;
  count: number;
  href?: string;
}) {
  const inner = (
    <div
      className="flex items-center justify-between"
      style={{ padding: "12px 0" }}
    >
      <span style={{ color: "#374151", fontSize: "15px" }}>{label}</span>
      <div className="flex items-center gap-3">
        <span
          className="font-semibold tabular-nums"
          style={{ color: INK, fontSize: "15px" }}
        >
          {count}
        </span>
        {href && (
          <span style={{ color: NAVY, fontSize: "13px" }}>View →</span>
        )}
      </div>
    </div>
  );
  return (
    <li>
      {href ? (
        <Link href={href} className="block hover:bg-gray-50 -mx-2 px-2 rounded-md">
          {inner}
        </Link>
      ) : (
        inner
      )}
    </li>
  );
}

function renderSubscription(status: string, periodEnd: string | null) {
  if (status === "active") {
    return (
      <>
        <div className="mb-4">
          <Badge label="Active" bg="#D1FAE5" fg="#065F46" />
        </div>
        {periodEnd && (
          <p
            className="mb-3"
            style={{ color: MUTED, fontSize: "14px", lineHeight: 1.6 }}
          >
            Your subscription renews on {periodEnd}.
          </p>
        )}
        <p
          className="font-bold mb-5"
          style={{ color: INK, fontSize: "28px", letterSpacing: "-0.02em" }}
        >
          $27 <span style={{ color: MUTED, fontSize: "16px", fontWeight: 500 }}>/ month</span>
        </p>
        <ManageSubscriptionButton />
        <p className="mt-3" style={{ color: MUTED, fontSize: "13px" }}>
          Update payment method, download invoices, or cancel your subscription
          through the secure Stripe portal.
        </p>
      </>
    );
  }

  if (status === "past_due") {
    return (
      <>
        <div className="mb-4">
          <Badge label="Payment Issue" bg="#FEF3C7" fg="#92400E" />
        </div>
        <p
          className="mb-5"
          style={{ color: "#92400E", fontSize: "14.5px", lineHeight: 1.6 }}
        >
          Your last payment failed. Please update your payment method to
          restore access.
        </p>
        <ManageSubscriptionButton />
      </>
    );
  }

  if (status === "canceled") {
    return (
      <>
        <div className="mb-4">
          <Badge label="Canceled" bg="#F3F4F6" fg="#374151" />
        </div>
        <p
          className="mb-5"
          style={{ color: MUTED, fontSize: "14.5px", lineHeight: 1.6 }}
        >
          Your subscription ended. Resubscribe to restore full access.
        </p>
        <UpgradeButton label="Resubscribe — $27/month" />
      </>
    );
  }

  // Free / default
  return (
    <>
      <div className="mb-4">
        <Badge label="Free Plan" bg="#F3F4F6" fg="#374151" />
      </div>
      <p
        className="mb-6"
        style={{ color: MUTED, fontSize: "14.5px", lineHeight: 1.6 }}
      >
        You have access to Section 1 of each brief. Upgrade to unlock
        everything.
      </p>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 rounded-xl"
        style={{ border: "1px solid #E5E7EB", padding: "16px" }}
      >
        <div>
          <div
            className="text-xs font-semibold uppercase mb-3"
            style={{ color: MUTED, letterSpacing: "0.08em" }}
          >
            Free
          </div>
          <ul className="space-y-2">
            {FREE_FEATURES.map((f) => (
              <li
                key={f}
                style={{ color: "#374151", fontSize: "13.5px", lineHeight: 1.5 }}
              >
                • {f}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div
            className="text-xs font-semibold uppercase mb-3"
            style={{ color: NAVY, letterSpacing: "0.08em" }}
          >
            Full Access ($27/mo)
          </div>
          <ul className="space-y-2">
            {PAID_FEATURES.map((f) => (
              <li
                key={f}
                style={{ color: INK, fontSize: "13.5px", lineHeight: 1.5 }}
              >
                ✓ {f}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <UpgradeButton
        label="Upgrade to Full Access — $27/month"
        className="w-full"
      />
      <p
        className="mt-3 text-center"
        style={{ color: MUTED, fontSize: "13px" }}
      >
        Cancel anytime. Money-back guarantee on your first brief.
      </p>
    </>
  );
}
