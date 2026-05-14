"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type ChildInput = {
  first_name: string;
  age: number;
  grade: string;
  school_name: string | null;
  school_district: string | null;
  state: string;
  evaluation_type: string;
  disability_categories: string[];
  additional_context: string | null;
};

export async function createChild(input: ChildInput) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase.from("children").insert({
    ...input,
    user_id: user.id,
  });
  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/children");
  redirect("/dashboard/children");
}

export async function updateChild(id: string, input: ChildInput) {
  const supabase = createClient();
  const { error } = await supabase.from("children").update(input).eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/children");
  redirect("/dashboard/children");
}

export async function deleteChild(formData: FormData) {
  const id = formData.get("id") as string;
  const supabase = createClient();
  await supabase.from("children").delete().eq("id", id);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/children");
}
