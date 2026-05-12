"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
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
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Logo size="lg" />
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8">
          <div className="mb-7">
            <h1 className="text-2xl font-semibold text-stone-900 mb-2">
              Let&apos;s get you ready for the meeting.
            </h1>
            <p className="text-stone-500 text-sm">
              Create your free account to upload your child&apos;s evaluation
              report and get your plain-English brief.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="email"
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />

            <Input
              id="password"
              label="Password"
              type="password"
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />

            <div className="pt-2">
              <Button
                type="submit"
                fullWidth
                size="lg"
                loading={loading}
              >
                {loading ? "Creating your account…" : "Create free account"}
              </Button>
            </div>
          </form>

          <p className="text-xs text-stone-400 mt-5 text-center leading-relaxed">
            By creating an account, you agree to our Terms of Service and
            Privacy Policy.
          </p>
        </div>

        <p className="text-center text-sm text-stone-500 mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Log in.
          </Link>
        </p>
      </div>
    </div>
  );
}
