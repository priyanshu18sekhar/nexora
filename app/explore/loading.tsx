export default function ExploreLoading() {
  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
        <div className="text-center mb-12">
          <div className="h-12 w-96 rounded-xl bg-muted mx-auto mb-4" />
          <div className="h-5 w-[28rem] rounded bg-muted/60 mx-auto" />
        </div>
        {[1, 2, 3].map((s) => (
          <div key={s} className="mb-10">
            <div className="h-6 w-44 rounded bg-muted mb-5" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-border bg-card overflow-hidden">
                  <div className="h-36 bg-muted" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 w-3/4 rounded bg-muted/70" />
                    <div className="h-3 w-1/2 rounded bg-muted/60" />
                    <div className="flex justify-between pt-2">
                      <div className="h-4 w-10 rounded bg-muted/70" />
                      <div className="h-4 w-14 rounded bg-muted/70" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
