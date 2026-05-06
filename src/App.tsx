import { useMemo, useState } from 'react'
import { planTrip } from './api'
import type { PlanResponse } from './types'
import { MapView } from './components/MapView'
import { TimelineList } from './components/TimelineList'
import { LogSheet } from './components/LogSheet'

export default function App() {
  const [currentLocation, setCurrentLocation] = useState('')
  const [pickupLocation, setPickupLocation] = useState('')
  const [dropoffLocation, setDropoffLocation] = useState('')
  const [currentCycleUsedHours, setCurrentCycleUsedHours] = useState(0)
  const [startDateTime, setStartDateTime] = useState(() =>
    new Date().toISOString().slice(0, 16),
  )
  const [startTimeRoundedNote, setStartTimeRoundedNote] = useState<string | null>(null)

  // Paper log details (optional)
  const [carrierName, setCarrierName] = useState('N/A')
  const [mainOfficeAddress, setMainOfficeAddress] = useState('N/A')
  const [homeTerminalAddress, setHomeTerminalAddress] = useState('')
  const [tractorNumber, setTractorNumber] = useState('N/A')
  const [trailerNumber, setTrailerNumber] = useState('N/A')
  const [manifestNumber, setManifestNumber] = useState('')
  const [shipperName, setShipperName] = useState('')
  const [commodity, setCommodity] = useState('General freight')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<PlanResponse | null>(null)

  function isCityState(v: string) {
    const s = v.trim()
    // Accept "City, ST" (2-letter state) or "City, State" (full name).
    return /^[^,]+,\s*([A-Za-z]{2}|[A-Za-z][A-Za-z .'-]{2,})$/.test(s)
  }

  const locationError =
    !currentLocation.trim() || !pickupLocation.trim() || !dropoffLocation.trim()
      ? 'Please fill Current, Pickup, and Dropoff locations.'
      : !isCityState(currentLocation) || !isCityState(pickupLocation) || !isCityState(dropoffLocation)
        ? 'Locations must be full city/state, like "Chicago, IL".'
        : null

  const startIso = useMemo(() => {
    const v = startDateTime.trim()
    if (!v) return undefined
    // Preserve the user's *home terminal* time base by attaching the local offset
    // (instead of converting to UTC which shifts the log date/grid).
    const [datePart, timePart] = v.split('T')
    if (!datePart || !timePart) return undefined
    const d = new Date(v)
    const offMin = -d.getTimezoneOffset()
    const sign = offMin >= 0 ? '+' : '-'
    const hh = String(Math.floor(Math.abs(offMin) / 60)).padStart(2, '0')
    const mm = String(Math.abs(offMin) % 60).padStart(2, '0')
    return `${datePart}T${timePart}:00${sign}${hh}:${mm}`
  }, [startDateTime])

  function roundDatetimeLocalTo15Min(v: string) {
    // v format: "YYYY-MM-DDTHH:mm"
    const d = new Date(v)
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

  async function onPlan() {
    if (locationError) {
      setError(locationError)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const r = await planTrip({
        currentLocation,
        pickupLocation,
        dropoffLocation,
        currentCycleUsedHours,
        startDateTime: startIso,
        carrierName,
        mainOfficeAddress,
        homeTerminalAddress: homeTerminalAddress || currentLocation,
        tractorNumber,
        trailerNumber,
        manifestNumber: manifestNumber || undefined,
        shipperName: shipperName || undefined,
        commodity: commodity || undefined,
      })
      setResult(r)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Request failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-sm font-medium text-slate-500">
                Full-Stack Assessment
              </div>
              <h1 className="text-2xl font-semibold tracking-tight">
                HOS Trip Planner + Driver Logbook
              </h1>
            </div>
            <div className="text-sm text-slate-600">
              Assumptions: 70/8, property carrier, no adverse conditions
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-12">
        <section className="lg:col-span-4">
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <h2 className="text-base font-semibold">Trip inputs</h2>
            <div className="mt-4 space-y-3">
              <Field
                label="Current location"
                value={currentLocation}
                onChange={setCurrentLocation}
                placeholder="City, ST"
              />
              <Field
                label="Pickup location"
                value={pickupLocation}
                onChange={setPickupLocation}
                placeholder="City, ST"
              />
              <Field
                label="Dropoff location"
                value={dropoffLocation}
                onChange={setDropoffLocation}
                placeholder="City, ST"
              />

              <details className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                <summary className="cursor-pointer text-sm font-semibold text-slate-700">
                  Logbook details (fills paper log)
                </summary>
                <div className="mt-3 space-y-3">
                  <Field label="Carrier name" value={carrierName} onChange={setCarrierName} />
                  <Field label="Main office address" value={mainOfficeAddress} onChange={setMainOfficeAddress} />
                  <Field
                    label="Home terminal address"
                    value={homeTerminalAddress}
                    onChange={setHomeTerminalAddress}
                    placeholder="Defaults to current location"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Tractor #" value={tractorNumber} onChange={setTractorNumber} />
                    <Field label="Trailer #" value={trailerNumber} onChange={setTrailerNumber} />
                  </div>
                  <Field
                    label="Manifest / Load ID"
                    value={manifestNumber}
                    onChange={setManifestNumber}
                    placeholder="Auto-generated if blank"
                  />
                  <Field
                    label="Shipper"
                    value={shipperName}
                    onChange={setShipperName}
                    placeholder="Optional"
                  />
                  <Field label="Commodity" value={commodity} onChange={setCommodity} />
                </div>
              </details>

              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="Cycle used (hrs)"
                  value={String(currentCycleUsedHours)}
                  onChange={(v) => setCurrentCycleUsedHours(Number(v) || 0)}
                  inputMode="decimal"
                />
                <div>
                  <label className="text-xs font-medium text-slate-600">
                    Start time
                  </label>
                  <input
                    type="datetime-local"
                    value={startDateTime}
                    step={900}
                    onChange={(e) => {
                      const raw = e.target.value
                      if (!raw) {
                        setStartTimeRoundedNote(null)
                        setStartDateTime(raw)
                        return
                      }
                      const rounded = roundDatetimeLocalTo15Min(raw)
                      setStartDateTime(rounded)

                      if (rounded !== raw) {
                        const display = new Date(rounded).toLocaleString([], {
                          month: '2-digit',
                          day: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                        setStartTimeRoundedNote(
                          `Rounded to nearest 15-minute increment: ${display}`,
                        )
                      } else {
                        setStartTimeRoundedNote(null)
                      }
                    }}
                    onBlur={() => {
                      const v = startDateTime.trim()
                      if (!v) return
                      const rounded = roundDatetimeLocalTo15Min(v)
                      if (rounded !== v) {
                        setStartDateTime(rounded)
                        const display = new Date(rounded).toLocaleString([], {
                          month: '2-digit',
                          day: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                        setStartTimeRoundedNote(`Rounded to nearest 15-minute increment: ${display}`)
                      }
                    }}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2"
                  />
                  {startTimeRoundedNote ? (
                    <div className="mt-1 text-xs text-slate-500">{startTimeRoundedNote}</div>
                  ) : (
                    <div className="mt-1 text-xs text-slate-500">
                      Quarter-hour increments only (00/15/30/45).
                    </div>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={onPlan}
                disabled={loading}
                className="w-full rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60"
              >
                {loading ? 'Planning…' : 'Plan trip'}
              </button>

              {locationError && !error ? (
                <div className="mt-2 text-xs text-amber-700">{locationError}</div>
              ) : null}

              {error ? (
                <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
                  {error}
                </div>
              ) : null}
              {result?.warnings?.length ? (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                  <div className="font-semibold">Warnings</div>
                  <ul className="mt-1 list-disc space-y-1 pl-5">
                    {result.warnings.map((w) => (
                      <li key={w}>{w}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>

          {result ? (
            <div className="mt-6 rounded-xl border bg-white p-4 shadow-sm">
              <h2 className="text-base font-semibold">Route summary</h2>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <Stat
                  label="Distance"
                  value={`${result.route.totalDistanceMiles.toFixed(0)} mi`}
                />
                <Stat
                  label="Drive time"
                  value={`${result.route.totalDurationHours.toFixed(1)} h`}
                />
              </div>
            </div>
          ) : null}
        </section>

        <section className="lg:col-span-8">
          <div className="rounded-xl border bg-white shadow-sm">
            <div className="border-b px-4 py-3">
              <h2 className="text-base font-semibold">Map</h2>
              <p className="mt-1 text-sm text-slate-600">
                Route drawn with free OpenStreetMap + OSRM.
              </p>
            </div>
            <div className="h-[420px]">
              <MapView result={result} />
            </div>
          </div>

          {result ? (
            <div className="mt-6 grid grid-cols-1 gap-6">
              <div className="rounded-xl border bg-white p-4 shadow-sm">
                <h2 className="text-base font-semibold">Trip events</h2>
                <div className="mt-4">
                  <TimelineList timeline={result.timeline} />
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-6 rounded-xl border bg-white p-10 text-center text-sm text-slate-600 shadow-sm">
              Enter trip details and click <span className="font-semibold">Plan trip</span> to
              generate the route + log sheets.
            </div>
          )}
        </section>

        {result ? (
          <section className="lg:col-span-12">
            <div className="rounded-xl border bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-base font-semibold">
                  Driver’s Daily Log (paper-style)
                </h2>
                <div className="text-xs text-slate-500">
                  Grid is 24h in 15-minute increments
                </div>
              </div>
              <div className="mt-4 space-y-6">
                {result.dailyLogs.map((log) => (
                  <LogSheet key={log.date} log={log} />
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </main>
    </div>
  )
}

function Field(props: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode']
}) {
  return (
    <div>
      <label className="text-xs font-medium text-slate-600">{props.label}</label>
      <input
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        placeholder={props.placeholder}
        inputMode={props.inputMode}
        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2"
      />
    </div>
  )
}

function Stat(props: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-slate-50 px-3 py-2">
      <div className="text-xs font-medium text-slate-500">{props.label}</div>
      <div className="mt-0.5 text-sm font-semibold">{props.value}</div>
    </div>
  )
}
