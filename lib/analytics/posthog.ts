import { PostHog } from "posthog-node";

function makeServer(): PostHog | null {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key || key === "your_posthog_key") {
    return null;
  }
  return new PostHog(key, {
    host: "https://app.posthog.com",
    flushAt: 1,
    flushInterval: 0,
  });
}

export const posthogServer = makeServer();

export async function trackServerEvent(params: {
  userId: string;
  event: string;
  properties?: Record<string, unknown>;
}) {
  if (!posthogServer) return;
  try {
    posthogServer.capture({
      distinctId: params.userId,
      event: params.event,
      properties: params.properties,
    });
    await posthogServer.flush();
  } catch (error) {
    console.error("PostHog server track error:", error);
  }
}
