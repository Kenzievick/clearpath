import { createClient } from "@/lib/supabase/server";

/**
 * Centralized data access for dashboard pages. Keeping these queries in one
 * place makes it easy to tune selects and add caching later without touching
 * every page. Note: `createClient()` is synchronous in this codebase.
 */

export async function getUserBriefs(userId: string, limit?: number) {
  const supabase = createClient();

  let query = supabase
    .from("briefs")
    .select(
      `
      id,
      status,
      created_at,
      completed_at,
      summary,
      detected_state,
      child_id,
      children(first_name, grade)
    `
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function getUserChildren(userId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("children")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}
