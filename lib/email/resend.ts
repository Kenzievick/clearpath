import { Resend } from "resend";

/**
 * Resend client for transactional email.
 *
 * Before emails will send from hello@itsclearpath.com:
 *   1. Create an account at resend.com
 *   2. Add itsclearpath.com as a sending domain
 *   3. Add the DNS records Resend provides to Namecheap Advanced DNS
 *   4. Verify the domain in Resend
 *   5. Add the API key to Vercel env vars as RESEND_API_KEY
 *
 * If RESEND_API_KEY is missing or still a placeholder, `resend` is `null` and
 * all send calls become no-ops (logged but never thrown). This keeps signup,
 * brief generation, and Stripe webhooks working even when email isn't
 * configured.
 */

function makeClient(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key || key === "your_resend_api_key") {
    return null;
  }
  return new Resend(key);
}

export const resend = makeClient();

export const FROM_EMAIL = "Clearpath <hello@itsclearpath.com>";
export const REPLY_TO = "hello@itsclearpath.com";

export function isEmailConfigured() {
  return resend !== null;
}
