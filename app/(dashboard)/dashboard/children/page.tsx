import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card, LinkButton, INK, MUTED, NAVY } from "@/components/dashboard/ui";
import { deleteChild } from "./actions";

type Child = {
  id: string;
  first_name: string;
  grade: string | null;
  state: string | null;
  disability_categories: string[] | null;
  created_at: string;
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function ChildrenPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from("children")
    .select("id, first_name, grade, state, disability_categories, created_at")
    .order("created_at", { ascending: false });

  const children: Child[] = data ?? [];

  return (
    <>
      <PageHeader
        title="My Children"
        subtitle="Profiles you have created for personalized briefs."
        action={<LinkButton href="/dashboard/children/new">Add Child</LinkButton>}
      />

      {children.length === 0 ? (
        <Card className="text-center">
          <div className="py-8">
            <p className="mb-6" style={{ color: MUTED, fontSize: "15px" }}>
              No children added yet.
            </p>
            <LinkButton href="/dashboard/children/new">Add Your First Child</LinkButton>
          </div>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {children.map((c) => (
            <Card key={c.id} className="card-hover">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-bold mb-0.5" style={{ color: INK, fontSize: "20px" }}>
                    {c.first_name}
                  </div>
                  <p style={{ color: MUTED, fontSize: "13px" }}>
                    {[c.grade, c.state].filter(Boolean).join(" · ") || "—"}
                  </p>
                </div>
                <p style={{ color: MUTED, fontSize: "12px" }}>
                  Added {formatDate(c.created_at)}
                </p>
              </div>

              {c.disability_categories && c.disability_categories.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {c.disability_categories.slice(0, 4).map((d) => (
                    <span
                      key={d}
                      className="rounded-full"
                      style={{
                        background: "#EEF2F9",
                        color: NAVY,
                        fontSize: "11px",
                        padding: "3px 10px",
                        fontWeight: 600,
                      }}
                    >
                      {d}
                    </span>
                  ))}
                  {c.disability_categories.length > 4 && (
                    <span style={{ color: MUTED, fontSize: "11px", padding: "3px 6px" }}>
                      +{c.disability_categories.length - 4} more
                    </span>
                  )}
                </div>
              )}

              <div className="flex items-center gap-4 pt-3" style={{ borderTop: "1px solid #F3F4F6" }}>
                <Link
                  href={`/dashboard/children/${c.id}/edit`}
                  className="text-sm font-semibold hover:underline"
                  style={{ color: NAVY }}
                >
                  Edit
                </Link>
                <form action={deleteChild}>
                  <input type="hidden" name="id" value={c.id} />
                  <button
                    type="submit"
                    className="text-sm font-medium hover:underline"
                    style={{ color: "#C04A3A" }}
                  >
                    Delete
                  </button>
                </form>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
