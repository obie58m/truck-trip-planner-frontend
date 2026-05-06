export function localDatetimeToOffsetIso(datetimeLocal: string): string | undefined {
  const v = datetimeLocal.trim()
  if (!v) return undefined
  const [datePart, timePart] = v.split('T')
  if (!datePart || !timePart) return undefined
  const d = new Date(v)
  const offMin = -d.getTimezoneOffset()
  const sign = offMin >= 0 ? '+' : '-'
  const hh = String(Math.floor(Math.abs(offMin) / 60)).padStart(2, '0')
  const mm = String(Math.abs(offMin) % 60).padStart(2, '0')
  return `${datePart}T${timePart}:00${sign}${hh}:${mm}`
}

export function roundDatetimeLocalTo15Min(value: string): string {
  const d = new Date(value)
  const ms = d.getTime()
  const step = 15 * 60 * 1000
  const rounded = Math.round(ms / step) * step
  const out = new Date(rounded)
  const yyyy = out.getFullYear()
  const mm = String(out.getMonth() + 1).padStart(2, '0')
  const dd = String(out.getDate()).padStart(2, '0')
  const hh = String(out.getHours()).padStart(2, '0')
  const min = String(out.getMinutes()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`
}

export function formatRoundedNote(roundedIso: string): string {
  const display = new Date(roundedIso).toLocaleString([], {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
  return `Rounded to nearest 15-minute increment: ${display}`
}
