import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/dashboard/ui";
import ChildForm from "@/components/dashboard/ChildForm";
import { updateChild, type ChildInput } from "../../actions";

export default async function EditChildPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const { data } = await supabase
    .from("children")
    .select(
      "first_name, age, grade, school_name, school_district, state, evaluation_type, disability_categories, additional_context"
    )
    .eq("id", params.id)
    .single();

  if (!data) notFound();

  const initial = {
    first_name: data.first_name ?? "",
    age: data.age != null ? String(data.age) : "",
    grade: data.grade ?? "",
    school_name: data.school_name ?? "",
    school_district: data.school_district ?? "",
    state: data.state ?? "",
    evaluation_type: data.evaluation_type ?? "Initial Evaluation",
    disability_categories: data.disability_categories ?? [],
    additional_context: data.additional_context ?? "",
  };

  async function save(input: ChildInput) {
    "use server";
    return updateChild(params.id, input);
  }

  return (
    <>
      <PageHeader
        title={`Edit ${initial.first_name}`}
        subtitle="Update this child's profile."
      />
      <ChildForm mode="edit" initial={initial} onSubmit={save} />
    </>
  );
}
