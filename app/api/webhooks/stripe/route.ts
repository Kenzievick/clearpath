import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe/client";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendSubscriptionConfirmedEmail } from "@/lib/email/send";
import { trackServerEvent } from "@/lib/analytics/posthog";

export const dynamic = "force-dynamic";

// `current_period_end` lives on the subscription object for API version
// 2024-06-20, but the installed `stripe` package's TS types may not surface it.
// Read it defensively so a types drift never breaks the build.
function periodEndISO(subscription: Stripe.Subscription): string | null {
  const raw = (subscription as unknown as { current_period_end?: number })
    .current_period_end;
  return typeof raw === "number" ? new Date(raw * 1000).toISOString() : null;
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.supabase_user_id;
        if (!userId) break;

        if (session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          );

          await supabaseAdmin
            .from("profiles")
            .update({
              stripe_subscription_id: subscription.id,
              subscription_status: "active",
              subscription_current_period_end: periodEndISO(subscription),
              subscribed_at: new Date().toISOString(),
            })
            .eq("id", userId);

          await trackServerEvent({
            userId,
            event: "subscription_started",
            properties: { briefId: session.metadata?.brief_id },
          });

          // Best-effort welcome-to-paid email. Prefer Stripe's collected
          // billing email; fall back to the Supabase auth record.
          try {
            let toEmail = session.customer_details?.email ?? null;
            if (!toEmail) {
              const { data: authData } =
                await supabaseAdmin.auth.admin.getUserById(userId);
              toEmail = authData?.user?.email ?? null;
            }
            if (toEmail) {
              await sendSubscriptionConfirmedEmail({ to: toEmail });
            }
          } catch (emailError) {
            console.error(
              "subscription confirmed email failed:",
              emailError
            );
          }
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.supabase_user_id;

        if (userId) {
          await supabaseAdmin
            .from("profiles")
            .update({
              subscription_status: subscription.status,
              subscription_current_period_end: periodEndISO(subscription),
            })
            .eq("id", userId);
          break;
        }

        // Fall back to looking the user up by Stripe customer id.
        const { data: profile } = await supabaseAdmin
          .from("profiles")
          .select("id")
          .eq("stripe_customer_id", subscription.customer as string)
          .single();

        if (profile) {
          await supabaseAdmin
            .from("profiles")
            .update({
              subscription_status: subscription.status,
              subscription_current_period_end: periodEndISO(subscription),
            })
            .eq("id", profile.id);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        const { data: profile } = await supabaseAdmin
          .from("profiles")
          .select("id")
          .eq("stripe_customer_id", subscription.customer as string)
          .single();

        if (profile) {
          await supabaseAdmin
            .from("profiles")
            .update({
              subscription_status: "canceled",
              stripe_subscription_id: null,
            })
            .eq("id", profile.id);
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;

        const { data: profile } = await supabaseAdmin
          .from("profiles")
          .select("id")
          .eq("stripe_customer_id", invoice.customer as string)
          .single();

        if (profile) {
          await supabaseAdmin
            .from("profiles")
            .update({ subscription_status: "past_due" })
            .eq("id", profile.id);
        }
        break;
      }
    }
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
