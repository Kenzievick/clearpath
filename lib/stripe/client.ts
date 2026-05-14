import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

// The installed `stripe` v22 package types `apiVersion` as a strict literal of
// its own native version. We pin to the spec's version (Stripe accepts any
// valid version string at runtime) by casting the whole config object. The
// webhook handler reads version-sensitive fields defensively.
const stripeConfig = {
  apiVersion: "2024-06-20",
} as unknown as ConstructorParameters<typeof Stripe>[1];

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, stripeConfig);

export const PRICE_ID = process.env.STRIPE_PRICE_ID!;
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
