import { createClient } from "@/lib/supabase/server";
import Logo from "@/components/Logo";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const displayName =
    user?.user_metadata?.first_name || user?.email?.split("@")[0] || "there";

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Top nav */}
      <nav className="bg-white border-b border-stone-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Logo size="md" linkTo="/dashboard" />
          <div className="flex items-center gap-3">
            <span className="text-sm text-stone-500 hidden sm:block">
              {user?.email}
            </span>
            <form action="/api/auth/signout" method="post">
              <button
                type="submit"
                className="text-sm text-stone-500 hover:text-stone-800 font-medium transition-colors"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </nav>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-6 py-14">
        {/* Welcome */}
        <div className="mb-12">
          <h1 className="text-3xl font-semibold text-stone-900 mb-2">
            You&apos;re in the right place,{" "}
            <span className="text-blue-600">{displayName}.</span>
          </h1>
          <p className="text-stone-500 text-lg">
            Let&apos;s get your child&apos;s meeting brief ready.
          </p>
        </div>

        {/* Upload card */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-10 max-w-xl">
          <div className="flex items-start gap-5 mb-6">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-stone-900 mb-1">
                Upload Your Child&apos;s Report
              </h2>
              <p className="text-stone-500 text-sm leading-relaxed">
                Once you upload your child&apos;s evaluation report, Clearpath
                will read it and build your personalized meeting brief. It takes
                about 3 to 5 minutes.
              </p>
            </div>
          </div>

          <button
            disabled
            className="w-full bg-blue-600 text-white font-medium py-3.5 rounded-xl opacity-70 cursor-not-allowed flex items-center justify-center gap-2"
            title="Coming soon — will be wired up in a future step"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            Upload Report
          </button>

          <p className="text-xs text-stone-400 text-center mt-3">
            Report upload coming soon. Check back shortly.
          </p>
        </div>
      </main>
    </div>
  );
}
