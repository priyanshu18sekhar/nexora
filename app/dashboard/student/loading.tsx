export default function StudentDashboardLoading() {
  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-5xl mx-auto animate-pulse">
      <div className="space-y-2">
        <div className="h-7 w-72 rounded-lg bg-muted" />
        <div className="h-4 w-64 rounded bg-muted/60" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-muted" />
            <div className="flex-1 space-y-1.5">
              <div className="h-5 w-10 rounded bg-muted/70" />
              <div className="h-3 w-20 rounded bg-muted/60" />
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-border bg-card">
        <div className="p-4 border-b border-border/50 flex justify-between items-center">
          <div className="h-4 w-32 rounded bg-muted/70" />
          <div className="h-4 w-16 rounded bg-muted/60" />
        </div>
        <div className="divide-y divide-border/50">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-14 h-10 rounded-lg bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/5 rounded bg-muted/70" />
                  <div className="h-1.5 w-32 rounded-full bg-muted/60" />
                </div>
              </div>
              <div className="h-8 w-20 rounded-lg bg-muted/70" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
