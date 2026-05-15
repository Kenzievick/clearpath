"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";

export default function Navbar() {
  // `dark` = true once the dark hero section is behind the navbar. While the
  // warm-white intro section is behind it, the navbar stays transparent so it
  // always contrasts with whatever is behind it.
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      // The intro section is full-viewport; the dark hero starts ~1 viewport
      // down. Switch to the dark treatment a little before it reaches the top.
      setDark(window.scrollY > window.innerHeight - 90);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        dark ? "bg-[#0B0E0D] border-b border-white/10" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Logo size="md" variant={dark ? "dark" : "light"} linkTo="/" />
        <div className="flex items-center gap-6">
          <Link
            href="/login"
            className={`text-sm font-medium transition-colors ${
              dark
                ? "text-[#A8B0AC] hover:text-white"
                : "text-[#5C6360] hover:text-[#0B0E0D]"
            }`}
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="btn-press bg-[#1B3A6B] hover:bg-[#152D54] text-white text-sm font-semibold px-5 py-2 rounded-full transition-colors"
          >
            Translate my report
          </Link>
        </div>
      </div>
    </nav>
  );
}
