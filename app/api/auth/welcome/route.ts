import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendWelcomeEmail } from "@/lib/email/send";

export const dynamic = "force-dynamic";

/**
 * Called by the signup page after a successful supabase.auth.signUp.
 * Sends the welcome email if Resend is configured. Always returns 200 so
 * the client never sees email infrastructure failures.
 */
export async function POST() {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user?.email) {
      await sendWelcomeEmail({ to: user.email });
    }
  } catch (error) {
    console.error("welcome route error:", error);
  }
  return NextResponse.json({ ok: true });
}
