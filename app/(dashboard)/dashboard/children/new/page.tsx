import { PageHeader } from "@/components/dashboard/ui";
import ChildForm from "@/components/dashboard/ChildForm";
import { createChild } from "../actions";

export default function NewChildPage() {
  return (
    <>
      <PageHeader
        title="Add a Child"
        subtitle="Create a profile so Clearpath can personalize every brief."
      />
      <ChildForm mode="create" onSubmit={createChild} />
    </>
  );
}
