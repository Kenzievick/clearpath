import { createClient } from "@/lib/supabase/server";

export async function getUserSubscriptionStatus(): Promise<{
  isSubscribed: boolean;
  status: string;
  currentPeriodEnd: Date | null;
}> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { isSubscribed: false, status: "free", currentPeriodEnd: null };

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_status, subscription_current_period_end")
    .eq("id", user.id)
    .single();

  if (!profile) return { isSubscribed: false, status: "free", currentPeriodEnd: null };

  const isSubscribed = profile.subscription_status === "active";

  return {
    isSubscribed,
    status: profile.subscription_status || "free",
    currentPeriodEnd: profile.subscription_current_period_end
      ? new Date(profile.subscription_current_period_end)
      : null,
  };
}
