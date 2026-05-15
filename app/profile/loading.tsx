export default function ProfileLoading() {
  return (
    <div className="p-6 lg:p-10 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
        <div className="space-y-2">
          <div className="h-9 w-48 rounded-lg bg-muted" />
          <div className="h-4 w-80 rounded bg-muted/70" />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-muted mb-4" />
              <div className="h-5 w-32 rounded bg-muted mb-2" />
              <div className="h-3 w-20 rounded bg-muted/60 mb-6" />
              <div className="w-full space-y-3 pt-4 border-t border-border">
                <div className="h-3 w-full rounded bg-muted/60" />
                <div className="h-3 w-3/4 rounded bg-muted/60" />
                <div className="h-3 w-2/3 rounded bg-muted/60" />
              </div>
            </div>
          </div>
          <div className="md:col-span-2 space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
              <div className="h-5 w-44 rounded bg-muted" />
              <div className="h-4 w-64 rounded bg-muted/60" />
              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                <div className="h-10 rounded-lg bg-muted/70" />
                <div className="h-10 rounded-lg bg-muted/70" />
              </div>
              <div className="h-28 rounded-lg bg-muted/70" />
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="h-10 rounded-lg bg-muted/70" />
                <div className="h-10 rounded-lg bg-muted/70" />
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
              <div className="h-5 w-24 rounded bg-muted" />
              <div className="flex flex-wrap gap-2">
                {[60, 80, 70, 90, 65].map((w, i) => (
                  <div key={i} className="h-7 rounded-lg bg-muted/70" style={{ width: w }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
