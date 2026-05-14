"use client";

import { useState } from "react";
import { Lock, CheckCircle, FileText, MessageSquare, Download } from "lucide-react";

interface PaywallGateProps {
  briefId: string;
  childName: string;
}

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

export function PaywallGate({ briefId, childName }: PaywallGateProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ briefId }),
      });
      const { url, error } = await response.json();
      if (error || !url) {
        console.error("Checkout error:", error);
        setIsLoading(false);
        return;
      }
      window.location.href = url;
    } catch (error) {
      console.error("Checkout failed:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="my-12 mx-auto max-w-2xl">
      {/* Blurred preview of what's locked */}
      <div className="relative rounded-2xl overflow-hidden mb-8">
        <div className="blur-sm pointer-events-none select-none p-8 bg-white border border-gray-100 rounded-2xl">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
          <div className="h-3 bg-gray-100 rounded w-full mb-2" />
          <div className="h-3 bg-gray-100 rounded w-5/6 mb-2" />
          <div className="h-3 bg-gray-100 rounded w-4/6 mb-6" />
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4" />
          <div className="h-3 bg-gray-100 rounded w-full mb-2" />
          <div className="h-3 bg-gray-100 rounded w-3/4" />
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm rounded-2xl">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
            style={{ backgroundColor: "#1B3A6B" }}
          >
            <Lock className="w-6 h-6 text-white" />
          </div>
          <p className="text-lg font-bold text-gray-900 mb-1">
            The rest of {childName}&apos;s brief is ready.
          </p>
          <p className="text-gray-500 text-sm">
            Subscribe to unlock all 6 remaining sections.
          </p>
        </div>
      </div>

      {/* Paywall card */}
      <div
        className="bg-white rounded-2xl border-2 p-8 text-center"
        style={{ borderColor: "#1B3A6B" }}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Unlock {childName}&apos;s complete brief
        </h2>
        <p className="text-gray-500 mb-8">
          You&apos;ve seen what the report says. Now get everything you need to
          walk into that meeting prepared.
        </p>

        <div className="grid grid-cols-1 gap-3 mb-8 text-left">
          {FEATURES.map((feature, i) => (
            <div key={i} className="flex items-center gap-3">
              <feature.icon
                className="w-5 h-5 flex-shrink-0"
                style={{ color: "#1B3A6B" }}
              />
              <span className="text-gray-700 text-sm">{feature.text}</span>
            </div>
          ))}
        </div>

        <div className="mb-6">
          <span className="text-5xl font-bold text-gray-900">$27</span>
          <span className="text-gray-500 text-lg">/month</span>
          <p className="text-gray-400 text-sm mt-1">
            Cancel anytime. Money-back guarantee on your first brief.
          </p>
        </div>

        <button
          onClick={handleUpgrade}
          disabled={isLoading}
          className="btn-press w-full py-4 px-8 rounded-xl text-white font-semibold text-lg transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: "#1B3A6B" }}
          onMouseEnter={(e) =>
            !isLoading && (e.currentTarget.style.backgroundColor = "#2B4E8B")
          }
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1B3A6B")}
        >
          {isLoading
            ? "Redirecting to checkout..."
            : "Unlock the full brief — $27/month"}
        </button>

        <p className="text-xs text-gray-400 mt-4">
          Secure payment via Stripe. Your child&apos;s report is never shared or
          sold.
        </p>
      </div>
    </div>
  );
}
