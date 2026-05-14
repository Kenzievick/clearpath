"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex">
      {/* ── Left panel (desktop only) ── */}
      <div
        className="hidden md:flex md:w-1/2 relative bg-[#0F1117] flex-col"
        style={{ overflow: "hidden", position: "relative" }}
      >
        <div className="absolute inset-0 ken-burns">
          <Image
            src="https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=1600&q=90&auto=format&fit=crop"
            alt="A warm, candid moment between a mother and her child"
            fill
            quality={90}
            priority
            className="object-cover"
            style={{ objectPosition: "center top" }}
          />
        </div>
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)",
          }}
        />
        {/* Quote */}
        <div className="relative mt-auto p-12">
          <svg className="w-10 h-10 text-[#1B3A6B] mb-4 opacity-60" fill="currentColor" viewBox="0 0 32 32">
            <path d="M10 8C5.6 8 2 11.6 2 16s3.6 8 8 8c1.4 0 2.7-.4 3.8-1-.3 1.7-1.1 3.2-2.3 4.4l1.4 1.4C15.1 26.6 16 23.4 16 20V8h-6zm16 0c-4.4 0-8 3.6-8 8s3.6 8 8 8c1.4 0 2.7-.4 3.8-1-.3 1.7-1.1 3.2-2.3 4.4l1.4 1.4C31.1 26.6 32 23.4 32 20V8h-6z" />
          </svg>
          <blockquote className="text-white text-xl font-medium leading-relaxed mb-5">
            I finally understood what my daughter&apos;s scores meant. I walked
            into that meeting knowing exactly what to ask for.
          </blockquote>
          <cite className="text-[#9CA3AF] text-sm not-italic">
            — Parent, Connecticut
          </cite>
        </div>
      </div>

      {/* ── Right panel: form ── */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center px-8 py-16 bg-white auth-form-enter">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <Logo size="md" variant="light" />
          </div>

          <h1 className="text-3xl font-bold text-[#0F1117] mb-2" style={{ letterSpacing: "-0.02em" }}>
            Let&apos;s get you ready for the meeting.
          </h1>
          <p className="text-[#6B7280] text-base mb-8">
            Create your free account and upload your child&apos;s evaluation
            report.
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#374151] mb-1.5"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] text-[#0F1117] placeholder-[#9CA3AF] text-base transition-colors focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/40 focus:border-[#1B3A6B] hover:border-[#D1D5DB]"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#374151] mb-1.5"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] text-[#0F1117] placeholder-[#9CA3AF] text-base transition-colors focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/40 focus:border-[#1B3A6B] hover:border-[#D1D5DB]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-press w-full bg-[#1B3A6B] hover:bg-[#152D54] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl text-base transition-colors flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Creating your account…
                </>
              ) : (
                "Create free account"
              )}
            </button>
          </form>

          <p className="text-xs text-[#9CA3AF] text-center mt-5 leading-relaxed">
            By creating an account you agree to our Terms of Service and Privacy
            Policy.
          </p>

          <p className="text-center text-sm text-[#6B7280] mt-5">
            Already have an account?{" "}
            <Link href="/login" className="text-[#1B3A6B] font-medium hover:underline">
              Log in.
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
