import { memo } from 'react'
import type { TimelineItem } from '../types'

function fmt(dtIso: string) {
  const d = new Date(dtIso)
  if (Number.isNaN(d.getTime())) {
    return '—'
  }
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

const Row = memo(function Row(props: { item: TimelineItem }) {
  const t = props.item
  return (
    <div className="grid grid-cols-1 items-start gap-3 px-3 py-3 text-sm sm:grid-cols-12 sm:gap-2 sm:py-2 motion-safe:transition-colors hover:bg-slate-50/80">
      <div className="sm:col-span-3">
        <div className="font-medium text-slate-700">{fmt(t.start)}</div>
        <div className="text-xs text-slate-500">
          → {fmt(t.end)} · {Math.round(Number.isFinite(t.minutes) ? t.minutes : 0)} min
        </div>
      </div>
      <div className="sm:col-span-2">
        <span
          className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold ${badgeClass(t.status)}`}
        >
          {statusLabel(t.status)}
        </span>
      </div>
      <div className="sm:col-span-7">
        <div className="font-medium text-slate-900">{t.note || '—'}</div>
        <div className="text-xs text-slate-600">{t.location || '—'}</div>
      </div>
    </div>
  )
})

export function TimelineList(props: { timeline: TimelineItem[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200">
      <div className="hidden grid-cols-12 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 sm:grid">
        <div className="col-span-3">Time</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-7">Details</div>
      </div>
      <div className="divide-y divide-slate-100">
        {props.timeline.map((t, i) => (
          <Row key={`${t.start}-${t.end}-${i}`} item={t} />
        ))}
      </div>
    </div>
  )
}
