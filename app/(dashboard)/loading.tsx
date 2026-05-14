// Default loading state for every dashboard route that doesn't define its own.
// Renders inside the layout's <main>, so the sidebar/chrome stays put — only
// the content area shows the skeleton. No outer padding/max-width here.
export default function DashboardLoading() {
  return (
    <div>
      {/* Skeleton header */}
      <div className="mb-8">
        <div className="h-8 w-48 rounded-lg skeleton mb-2" />
        <div className="h-4 w-72 rounded skeleton" />
      </div>
      {/* Skeleton cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-6"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
          >
            <div className="h-5 w-32 rounded skeleton mb-3" />
            <div className="h-4 w-full rounded skeleton mb-2" />
            <div className="h-4 w-3/4 rounded skeleton" />
          </div>
        ))}
      </div>
    </div>
  );
}
