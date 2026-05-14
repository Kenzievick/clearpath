// Loading state for /dashboard/briefs — mirrors the page: header, filter row,
// then a list of full-width brief rows. Prevents layout shift on load.
export default function BriefsLoading() {
  return (
    <div>
      {/* Skeleton header */}
      <div className="mb-8">
        <div className="h-8 w-44 rounded-lg skeleton mb-2" />
        <div className="h-4 w-80 rounded skeleton" />
      </div>
      {/* Skeleton filter row */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="h-11 w-[240px] rounded-lg skeleton" />
        <div className="h-11 w-[180px] rounded-lg skeleton" />
      </div>
      {/* Skeleton list rows */}
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-6"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="h-4 w-28 rounded skeleton" />
              <div className="h-4 w-20 rounded-full skeleton" />
            </div>
            <div className="h-3 w-32 rounded skeleton mb-3" />
            <div className="h-4 w-full rounded skeleton" />
          </div>
        ))}
      </div>
    </div>
  );
}
