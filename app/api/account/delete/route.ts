import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { stripe } from "@/lib/stripe/client";

export const dynamic = "force-dynamic";

export async function DELETE() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id, stripe_subscription_id")
    .eq("id", user.id)
    .single();

  if (profile?.stripe_subscription_id) {
    try {
      await stripe.subscriptions.cancel(profile.stripe_subscription_id);
    } catch (error) {
      console.error("Failed to cancel subscription:", error);
    }
  }

  // Delete the auth user via the service-role admin client. Foreign-key
  // cascades on profiles/children/briefs/iep_analyses/chat_messages handle
  // the user-owned rows.
  const { error: adminDeleteError } =
    await supabaseAdmin.auth.admin.deleteUser(user.id);
  if (adminDeleteError) {
    console.error("Failed to delete auth user:", adminDeleteError);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }

  // Belt-and-suspenders: ensure the profile row is gone in case the
  // auth.users → profiles FK is set to SET NULL rather than CASCADE.
  await supabaseAdmin.from("profiles").delete().eq("id", user.id);

  await supabase.auth.signOut();

  return NextResponse.json({ success: true });
}
