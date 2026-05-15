"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

const RED = "#C04A3A";
const INK = "#0B0E0D";
const MUTED = "#5C6360";

export default function DeleteAccountSection() {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function confirmDelete() {
    setDeleting(true);
    setError("");
    try {
      const res = await fetch("/api/account/delete", { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.error || "Could not delete account.");
        setDeleting(false);
        return;
      }
      window.location.href = "/?deleted=true";
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error.");
      setDeleting(false);
    }
  }

  return (
    <div
      className="bg-white rounded-2xl"
      style={{
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        padding: "32px",
        borderLeft: `3px solid ${RED}`,
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Trash2 className="w-5 h-5" style={{ color: RED }} />
        <h2 className="font-bold" style={{ color: RED, fontSize: "18px" }}>
          Delete Account
        </h2>
      </div>

      <p
        className="mb-5"
        style={{ color: "#374151", fontSize: "14.5px", lineHeight: 1.7 }}
      >
        Permanently delete your Clearpath account and all associated data.
        This includes all child profiles, evaluation briefs, IEP analyses, and
        chat history. This action cannot be undone.
      </p>

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn-press inline-flex items-center justify-center font-semibold rounded-lg transition-colors"
        style={{
          border: `1px solid ${RED}`,
          color: RED,
          background: "#FFFFFF",
          padding: "10px 20px",
          fontSize: "14px",
        }}
      >
        Delete My Account
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: "rgba(11,14,13,0.55)" }}
          onClick={() => {
            if (!deleting) setOpen(false);
          }}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-md"
            style={{
              padding: "28px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.18)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              className="font-bold mb-3"
              style={{ color: INK, fontSize: "20px" }}
            >
              Are you sure?
            </h3>
            <p
              className="mb-6"
              style={{ color: "#374151", fontSize: "14.5px", lineHeight: 1.7 }}
            >
              This will permanently delete your account and all data associated
              with it. Your subscription will be canceled immediately. This
              cannot be undone.
            </p>

            {error && (
              <p
                className="mb-4"
                style={{ color: "#991B1B", fontSize: "13px" }}
              >
                {error}
              </p>
            )}

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={deleting}
                className="btn-press inline-flex items-center justify-center font-semibold rounded-lg transition-colors disabled:opacity-50"
                style={{
                  border: "1px solid #D1D5DB",
                  color: MUTED,
                  background: "#FFFFFF",
                  padding: "10px 20px",
                  fontSize: "14px",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleting}
                className="btn-press inline-flex items-center justify-center font-semibold rounded-lg text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: RED,
                  padding: "10px 20px",
                  fontSize: "14px",
                }}
              >
                {deleting ? "Deleting…" : "Yes, delete everything"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
