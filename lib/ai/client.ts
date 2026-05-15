import Anthropic from "@anthropic-ai/sdk";

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error("ANTHROPIC_API_KEY is not set in environment variables");
}

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const MAIN_MODEL = 'claude-sonnet-4-20250514';
export const FAST_MODEL = "claude-haiku-4-5-20251001";

/**
 * Calls the Anthropic Messages API with a small retry on transient failures
 * (429 rate limits, 5xx, overloaded). Returns `{ response }` so callers can
 * read `response.content`. `label` is used only for error context.
 */
export async function callWithRetry(
  params: Anthropic.MessageCreateParamsNonStreaming,
  label: string,
  maxRetries = 2
): Promise<{ response: Anthropic.Message }> {
  let lastErr: unknown;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await anthropic.messages.create(params);
      return { response };
    } catch (err) {
      lastErr = err;
      const status = (err as { status?: number })?.status;
      // Only retry transient errors — bail immediately on 4xx (except 429).
      if (status && status !== 429 && status < 500) break;
      if (attempt < maxRetries) {
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
      }
    }
  }
  throw new Error(
    `AI call failed (${label}): ${lastErr instanceof Error ? lastErr.message : "unknown error"}`
  );
}

/**
 * Parses a model JSON response, tolerating ```json fences and surrounding
 * whitespace. Throws with section context on malformed JSON.
 */
export function parseJSONResponse<T>(text: string, section: string): T {
  const cleaned = text
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    throw new Error(`${section} returned invalid JSON`);
  }
}
