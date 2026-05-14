"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  Upload,
  Settings,
  LogOut,
} from "lucide-react";

const NAV = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, exact: true },
  { label: "My Children", href: "/dashboard/children", icon: Users },
  { label: "My Briefs", href: "/dashboard/briefs", icon: FileText },
  { label: "Upload Report", href: "/dashboard/upload", icon: Upload },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardSidebar({ email }: { email: string }) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex fixed left-0 top-0 bottom-0 w-[240px] flex-col z-40"
        style={{ background: "#0B0E0D" }}
      >
        <div className="px-6 pt-6 pb-8">
          <Link href="/dashboard" prefetch className="font-bold tracking-tight text-2xl">
            <span className="text-white">Clear</span>
            <span className="text-white">path</span>
          </Link>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {NAV.map(({ label, href, icon: Icon, exact }) => {
            const active = isActive(href, exact);
            return (
              <Link
                key={href}
                href={href}
                prefetch
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
                style={{
                  background: active ? "#1B3A6B" : "transparent",
                  color: active ? "#FFFFFF" : "#A8B0AC",
                }}
              >
                <Icon className="w-[18px] h-[18px]" strokeWidth={1.8} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 py-5" style={{ borderTop: "1px solid #1A1F1E" }}>
          <p
            className="text-[11px] mb-2 truncate"
            style={{ color: "#A8B0AC", letterSpacing: "0.04em" }}
            title={email}
          >
            {email}
          </p>
          <form action="/api/auth/signout" method="post">
            <button
              type="submit"
              className="inline-flex items-center gap-2 text-xs font-medium transition-colors hover:text-white"
              style={{ color: "#A8B0AC" }}
            >
              <LogOut className="w-3.5 h-3.5" strokeWidth={1.8} />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header
        className="lg:hidden sticky top-0 z-40 flex items-center justify-between px-4 py-3"
        style={{ background: "#0B0E0D" }}
      >
        <Link href="/dashboard" prefetch className="font-bold tracking-tight text-xl text-white">
          <span>Clear</span>
          <span>path</span>
        </Link>
        <form action="/api/auth/signout" method="post">
          <button
            type="submit"
            className="text-xs font-medium"
            style={{ color: "#A8B0AC" }}
          >
            Sign out
          </button>
        </form>
      </header>

      {/* Mobile bottom nav */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around"
        style={{ background: "#0B0E0D", borderTop: "1px solid #1A1F1E", paddingBottom: "max(8px, env(safe-area-inset-bottom))", paddingTop: "8px" }}
      >
        {NAV.map(({ label, href, icon: Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              prefetch
              className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-md"
              style={{ color: active ? "#FFFFFF" : "#A8B0AC" }}
            >
              <Icon className="w-5 h-5" strokeWidth={1.8} />
              <span style={{ fontSize: "10px" }}>{label.split(" ")[0]}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
