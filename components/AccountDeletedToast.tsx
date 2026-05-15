"use client";

import { useEffect, useState } from "react";
import { CheckCircle, X } from "lucide-react";

export default function AccountDeletedToast() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Strip ?deleted=true so refresh doesn't re-show it.
    const url = new URL(window.location.href);
    url.searchParams.delete("deleted");
    window.history.replaceState({}, "", url.toString());

    const t = setTimeout(() => setShow(false), 8000);
    return () => clearTimeout(t);
  }, []);

  if (!show) return null;

  return (
    <div
      className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] max-w-md w-[calc(100%-32px)] rounded-xl bg-white shadow-lg"
      style={{ border: "1px solid #E5E7EB", padding: "14px 16px" }}
      role="status"
    >
      <div className="flex items-start gap-3">
        <CheckCircle
          className="w-5 h-5 flex-shrink-0 mt-0.5"
          style={{ color: "#065F46" }}
        />
        <div className="flex-1">
          <p
            className="font-semibold"
            style={{ color: "#0B0E0D", fontSize: "14px" }}
          >
            Your account has been deleted.
          </p>
          <p style={{ color: "#5C6360", fontSize: "13px", marginTop: 2 }}>
            All data has been removed.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShow(false)}
          aria-label="Dismiss"
          className="flex-shrink-0 rounded-md p-1 hover:bg-gray-100 transition-colors"
        >
          <X className="w-4 h-4" style={{ color: "#5C6360" }} />
        </button>
      </div>
    </div>
  );
}
