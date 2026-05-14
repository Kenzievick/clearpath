// Loading state for /dashboard/children — mirrors the page: header with an
// action button, then a two-column grid of child profile cards.
export default function ChildrenLoading() {
  return (
    <div>
      {/* Skeleton header + action */}
      <div className="flex items-start justify-between gap-4 flex-wrap mb-8">
        <div>
          <div className="h-8 w-44 rounded-lg skeleton mb-2" />
          <div className="h-4 w-72 rounded skeleton" />
        </div>
        <div className="h-11 w-32 rounded-lg skeleton" />
      </div>
      {/* Skeleton card grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-6"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
          >
            <div className="h-5 w-28 rounded skeleton mb-2" />
            <div className="h-3 w-40 rounded skeleton mb-4" />
            <div className="flex gap-2">
              <div className="h-6 w-20 rounded-full skeleton" />
              <div className="h-6 w-24 rounded-full skeleton" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
