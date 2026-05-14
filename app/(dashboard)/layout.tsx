import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import NavProgress from "@/components/dashboard/NavProgress";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen" style={{ background: "#FAFAF7" }}>
      <NavProgress />
      <DashboardSidebar email={user.email ?? ""} />
      <div className="lg:pl-[240px] pb-20 lg:pb-0">
        <main className="px-6 py-8 lg:px-10 lg:py-10 max-w-6xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
