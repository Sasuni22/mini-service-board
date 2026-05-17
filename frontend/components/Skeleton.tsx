export function JobCardSkeleton() {
  return (
    <div className="card p-5 space-y-3 animate-pulse">
      <div className="flex justify-between">
        <div className="h-3 w-20 rounded bg-slate-200" />
        <div className="h-5 w-20 rounded bg-slate-200" />
      </div>
      <div className="h-5 w-4/5 rounded bg-slate-200" />
      <div className="space-y-1.5">
        <div className="h-3 w-full rounded bg-slate-100" />
        <div className="h-3 w-3/4 rounded bg-slate-100" />
      </div>
      <div className="flex gap-2 mt-2">
        <div className="h-5 w-16 rounded bg-slate-200" />
        <div className="h-5 w-24 rounded bg-slate-100" />
      </div>
      <div className="border-t border-slate-100 pt-3 flex justify-between">
        <div className="h-3 w-20 rounded bg-slate-100" />
        <div className="h-3 w-20 rounded bg-slate-200" />
      </div>
    </div>
  );
}

export function JobGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => <JobCardSkeleton key={i} />)}
    </div>
  );
}

export function JobDetailSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-4 w-24 rounded bg-slate-200" />
      <div className="card p-7 space-y-4">
        <div className="flex gap-3">
          <div className="h-5 w-20 rounded bg-slate-200" />
          <div className="h-5 w-20 rounded bg-slate-200" />
        </div>
        <div className="h-8 w-2/3 rounded bg-slate-200" />
        <div className="grid grid-cols-3 gap-4">
          <div className="h-10 rounded bg-slate-100" />
          <div className="h-10 rounded bg-slate-100" />
          <div className="h-10 rounded bg-slate-100" />
        </div>
        <div className="space-y-2 pt-4">
          <div className="h-4 w-full rounded bg-slate-100" />
          <div className="h-4 w-5/6 rounded bg-slate-100" />
          <div className="h-4 w-4/6 rounded bg-slate-100" />
        </div>
      </div>
    </div>
  );
}
