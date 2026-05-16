import { resend, FROM_EMAIL, REPLY_TO } from "./resend";
import {
  welcomeEmail,
  briefReadyEmail,
  subscriptionConfirmedEmail,
} from "./templates";

async function safeSend(to: string, subject: string, html: string, label: string) {
  if (!resend) {
    console.log(`[email] ${label} skipped — RESEND_API_KEY not configured`);
    return;
  }
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
      replyTo: REPLY_TO,
    });
    console.log(`[email] ${label} sent to ${to}`);
  } catch (error) {
    // Never throw — email failure must not break the app flow.
    console.error(`[email] ${label} failed:`, error);
  }
}

export async function sendWelcomeEmail(params: {
  to: string;
  firstName?: string;
}) {
  const template = welcomeEmail({ firstName: params.firstName });
  await safeSend(params.to, template.subject, template.html, "welcome");
}

export async function sendBriefReadyEmail(params: {
  to: string;
  firstName?: string;
  childName: string;
  briefId: string;
  isSubscribed: boolean;
}) {
  const template = briefReadyEmail(params);
  await safeSend(params.to, template.subject, template.html, "brief-ready");
}

export async function sendSubscriptionConfirmedEmail(params: {
  to: string;
  firstName?: string;
}) {
  const template = subscriptionConfirmedEmail({ firstName: params.firstName });
  await safeSend(
    params.to,
    template.subject,
    template.html,
    "subscription-confirmed"
  );
}
