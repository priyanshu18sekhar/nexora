export default function InternshipsLoading() {
  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
        <div className="text-center mb-12">
          <div className="h-12 w-72 rounded-xl bg-muted mx-auto mb-4" />
          <div className="h-5 w-96 rounded bg-muted/60 mx-auto" />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-border bg-card p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-muted/70" />
                  <div className="h-3 w-1/2 rounded bg-muted/60" />
                </div>
              </div>
              <div className="h-3 w-full rounded bg-muted/60" />
              <div className="h-3 w-5/6 rounded bg-muted/60" />
              <div className="flex gap-2 pt-2">
                <div className="h-6 w-16 rounded-full bg-muted/70" />
                <div className="h-6 w-20 rounded-full bg-muted/70" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
