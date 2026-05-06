import type { TimelineItem } from '../types'

function fmt(dtIso: string) {
  const d = new Date(dtIso)
  return d.toLocaleString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })
}

function statusLabel(s: TimelineItem['status']) {
  switch (s) {
    case 'OFF':
      return 'Off duty'
    case 'SB':
      return 'Sleeper berth'
    case 'D':
      return 'Driving'
    case 'ON':
      return 'On duty (not driving)'
  }
}

function badgeClass(s: TimelineItem['status']) {
  switch (s) {
    case 'OFF':
      return 'bg-slate-100 text-slate-700 border-slate-200'
    case 'SB':
      return 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200'
    case 'D':
      return 'bg-indigo-50 text-indigo-700 border-indigo-200'
    case 'ON':
      return 'bg-amber-50 text-amber-800 border-amber-200'
  }
}

export function TimelineList(props: { timeline: TimelineItem[] }) {
  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="grid grid-cols-12 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600">
        <div className="col-span-3">Time</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-7">Details</div>
      </div>
      <div className="divide-y">
        {props.timeline.map((t, i) => (
          <div key={`${t.start}-${i}`} className="grid grid-cols-12 items-start gap-2 px-3 py-2 text-sm">
            <div className="col-span-3 text-slate-700">
              <div className="font-medium">{fmt(t.start)}</div>
              <div className="text-xs text-slate-500">
                → {fmt(t.end)} · {Math.round(t.minutes)} min
              </div>
            </div>
            <div className="col-span-2">
              <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold ${badgeClass(t.status)}`}>
                {statusLabel(t.status)}
              </span>
            </div>
            <div className="col-span-7">
              <div className="font-medium text-slate-900">{t.note}</div>
              <div className="text-xs text-slate-600">{t.location}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

