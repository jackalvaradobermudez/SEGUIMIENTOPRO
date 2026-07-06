export default function DashboardLoading() {
  return (
    <div className="dashboard-page animate-fade-in">
      <div className="page-header">
        <div className="flex flex-col gap-2">
          <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-100" />
          <div className="h-4 w-64 animate-pulse rounded-lg bg-slate-100" />
        </div>
      </div>

      <div className="sp-kpi-grid">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="sp-kpi-card">
            <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
            <div className="mt-3 h-7 w-32 animate-pulse rounded bg-slate-100" />
          </div>
        ))}
      </div>

      <div className="mt-8 sp-card">
        <div className="sp-card-content">
          <div className="flex flex-col gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-14 w-full animate-pulse rounded-2xl bg-slate-50" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
