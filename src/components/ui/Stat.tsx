export function Stat(props: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-slate-50 px-3 py-2">
      <div className="text-xs font-medium text-slate-500">{props.label}</div>
      <div className="mt-0.5 text-sm font-semibold tabular-nums">{props.value}</div>
    </div>
  )
}
