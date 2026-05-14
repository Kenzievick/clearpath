"use client";

import { useState } from "react";

const NAVY = "#1B3A6B";
const NAVY_HOVER = "#2B4E8B";

/** Starts a Stripe Checkout session and redirects the browser to it. */
export function UpgradeButton({
  label = "Upgrade — $27/month",
  briefId,
  className = "",
  style,
}: {
  label?: string;
  briefId?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [loading, setLoading] = useState(false);

  async function go() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(briefId ? { briefId } : {}),
      });
      const { url, error } = await res.json();
      if (error || !url) {
        console.error("Checkout error:", error);
        setLoading(false);
        return;
      }
      window.location.href = url;
    } catch (e) {
      console.error("Checkout failed:", e);
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={go}
      disabled={loading}
      className={`btn-press inline-flex items-center justify-center font-semibold rounded-lg text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      style={{ background: NAVY, padding: "12px 22px", fontSize: "14px", ...style }}
      onMouseEnter={(e) => {
        if (!loading) e.currentTarget.style.background = NAVY_HOVER;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = NAVY;
      }}
    >
      {loading ? "Redirecting…" : label}
    </button>
  );
}

/** Opens the Stripe customer portal for an existing subscriber. */
export function ManageSubscriptionButton() {
  const [loading, setLoading] = useState(false);

  async function go() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const { url, error } = await res.json();
      if (error || !url) {
        console.error("Portal error:", error);
        setLoading(false);
        return;
      }
      window.location.href = url;
    } catch (e) {
      console.error("Portal failed:", e);
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={go}
      disabled={loading}
      className="btn-press inline-flex items-center justify-center font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      style={{
        border: `1px solid ${NAVY}`,
        color: NAVY,
        background: "#FFFFFF",
        padding: "12px 22px",
        fontSize: "14px",
      }}
    >
      {loading ? "Opening…" : "Manage subscription"}
    </button>
  );
}
