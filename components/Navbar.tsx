"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 bg-[#0B0E0D] transition-all duration-300 ${
        scrolled ? "border-b border-white/10" : ""
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Logo size="md" variant="dark" linkTo="/" />
        <div className="flex items-center gap-6">
          <Link
            href="/login"
            className="text-[#A8B0AC] hover:text-white text-sm font-medium transition-colors"
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
