"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const INK = "#0B0E0D";
const MUTED = "#5C6360";

export default function ChangePasswordButton({ email }: { email: string }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function send() {
    setLoading(true);
    setStatus("idle");
    try {
      const supabase = createClient();
      const redirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/login`
          : undefined;
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });
      if (error) {
        setStatus("error");
        setErrorMsg(error.message);
      } else {
        setStatus("sent");
      }
    } catch (e) {
      setStatus("error");
      setErrorMsg(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={send}
        disabled={loading || status === "sent"}
        className="btn-press inline-flex items-center justify-center font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          border: "1px solid #D1D5DB",
          color: INK,
          background: "#FFFFFF",
          padding: "10px 20px",
          fontSize: "14px",
        }}
      >
        {loading
          ? "Sending…"
          : status === "sent"
            ? "Email sent ✓"
            : "Change Password"}
      </button>
      {status === "sent" && (
        <p
          className="mt-3"
          style={{ color: "#065F46", fontSize: "13px" }}
        >
          Password reset email sent. Check your inbox.
        </p>
      )}
      {status === "error" && (
        <p
          className="mt-3"
          style={{ color: "#991B1B", fontSize: "13px" }}
        >
          {errorMsg || "Could not send reset email."}
        </p>
      )}
      {status === "idle" && (
        <p className="mt-3" style={{ color: MUTED, fontSize: "13px" }}>
          You will receive an email with instructions to set a new password.
        </p>
      )}
    </div>
  );
}
