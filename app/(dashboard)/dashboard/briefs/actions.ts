"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteBrief(formData: FormData) {
  const id = formData.get("id") as string;
  const supabase = createClient();
  await supabase.from("briefs").delete().eq("id", id);
  revalidatePath("/dashboard/briefs");
  revalidatePath("/dashboard");
}
