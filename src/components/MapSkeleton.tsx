export function MapSkeleton() {
  return (
    <div
      className="flex h-full w-full animate-pulse flex-col items-center justify-center gap-2 bg-slate-100 text-slate-500 motion-reduce:animate-none"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="h-8 w-8 rounded-full border-2 border-indigo-200 border-t-indigo-600 motion-safe:animate-spin motion-reduce:animate-none" />
      <span className="text-sm font-medium">Loading map…</span>
    </div>
  )
}
