import { lazy, Suspense } from 'react'
import { useTripForm } from './hooks/useTripForm'
import { usePlanTrip } from './hooks/usePlanTrip'
import { TimelineList } from './components/TimelineList'
import { LogSheet } from './components/LogSheet'
import { MapSkeleton } from './components/MapSkeleton'
import { TextField } from './components/ui/TextField'
import { Stat } from './components/ui/Stat'

const MapView = lazy(async () => {
  const m = await import('./components/MapView')
  return { default: m.MapView }
})

export default function App() {
  const form = useTripForm()
  const plan = usePlanTrip()

  async function onPlan() {
    if (form.locationError) {
      return
    }
    await plan.run(form.buildPlanInput())
  }

  const result = plan.result
  const hasTimeline = Boolean(result?.timeline?.length)
  const cycleClampedNote =
    form.currentCycleUsedHours > 70
      ? 'Values above 70 hours are treated as 70 for this planner.'
      : null

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-slate-500">Full-Stack Assessment</p>
              <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
                HOS Trip Planner + Driver Logbook
              </h1>
            </div>
            <p className="max-w-md text-sm leading-snug text-slate-600">
              Assumptions: 70/8, property carrier, no adverse conditions
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-12 lg:gap-8">
        <section className="lg:col-span-4" aria-labelledby="trip-inputs-heading">
          <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm motion-safe:transition-shadow motion-safe:duration-200 hover:shadow-md">
            <h2 id="trip-inputs-heading" className="text-base font-semibold text-slate-900">
              Trip inputs
            </h2>
            <div className="mt-4 space-y-3">
              <TextField
                id="trip-current"
                label="Current location"
                value={form.currentLocation}
                onChange={form.setCurrentLocation}
                placeholder="City, ST"
                autoComplete="address-level2"
              />
              <TextField
                id="trip-pickup"
                label="Pickup location"
                value={form.pickupLocation}
                onChange={form.setPickupLocation}
                placeholder="City, ST"
                autoComplete="address-level2"
              />
              <TextField
                id="trip-dropoff"
                label="Dropoff location"
                value={form.dropoffLocation}
                onChange={form.setDropoffLocation}
                placeholder="City, ST"
                autoComplete="address-level2"
              />

              <details className="rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-2 motion-safe:transition-colors open:bg-slate-50">
                <summary className="cursor-pointer text-sm font-semibold text-slate-700 outline-none ring-indigo-500 focus-visible:rounded-md focus-visible:ring-2">
                  Logbook details (fills paper log)
                </summary>
                <div className="mt-3 space-y-3">
                  <TextField
                    id="trip-carrier"
                    label="Carrier name"
                    value={form.carrierName}
                    onChange={form.setCarrierName}
                  />
                  <TextField
                    id="trip-office"
                    label="Main office address"
                    value={form.mainOfficeAddress}
                    onChange={form.setMainOfficeAddress}
                  />
                  <TextField
                    id="trip-terminal"
                    label="Home terminal address"
                    value={form.homeTerminalAddress}
                    onChange={form.setHomeTerminalAddress}
                    placeholder="Defaults to current location"
                  />
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <TextField
                      id="trip-tractor"
                      label="Tractor #"
                      value={form.tractorNumber}
                      onChange={form.setTractorNumber}
                    />
                    <TextField
                      id="trip-trailer"
                      label="Trailer #"
                      value={form.trailerNumber}
                      onChange={form.setTrailerNumber}
                    />
                  </div>
                  <TextField
                    id="trip-manifest"
                    label="Manifest / Load ID"
                    value={form.manifestNumber}
                    onChange={form.setManifestNumber}
                    placeholder="Auto-generated if blank"
                  />
                  <TextField
                    id="trip-shipper"
                    label="Shipper"
                    value={form.shipperName}
                    onChange={form.setShipperName}
                    placeholder="Optional"
                  />
                  <TextField
                    id="trip-commodity"
                    label="Commodity"
                    value={form.commodity}
                    onChange={form.setCommodity}
                  />
                </div>
              </details>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <TextField
                    id="trip-cycle"
                    label="Cycle used (hrs)"
                    value={String(form.currentCycleUsedHours)}
                    onChange={(v) => form.setCurrentCycleUsedHours(Number(v) || 0)}
                    inputMode="decimal"
                  />
                  {cycleClampedNote ? (
                    <p className="mt-1 text-xs text-amber-800">{cycleClampedNote}</p>
                  ) : null}
                </div>
                <div>
                  <label htmlFor="trip-start" className="text-xs font-medium text-slate-600">
                    Start time
                  </label>
                  <input
                    id="trip-start"
                    type="datetime-local"
                    value={form.startDateTime}
                    step={900}
                    onChange={(e) => form.onStartDateTimeChange(e.target.value)}
                    onBlur={form.onStartDateTimeBlur}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-indigo-500 transition-colors focus:ring-2 motion-safe:transition-shadow"
                  />
                  {form.startTimeRoundedNote ? (
                    <p className="mt-1 text-xs text-slate-500">{form.startTimeRoundedNote}</p>
                  ) : (
                    <p className="mt-1 text-xs text-slate-500">
                      Quarter-hour increments only (00/15/30/45).
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={onPlan}
                disabled={plan.loading || Boolean(form.locationError)}
                aria-busy={plan.loading}
                className="w-full rounded-lg bg-indigo-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:pointer-events-none disabled:opacity-60 motion-safe:active:scale-[0.99] motion-reduce:active:scale-100"
              >
                {plan.loading ? 'Planning…' : 'Plan trip'}
              </button>

              {form.locationError && !plan.error ? (
                <p className="mt-2 text-xs text-amber-800">{form.locationError}</p>
              ) : null}

              <div role="status" aria-live="polite" className="min-h-0">
                {plan.error ? (
                  <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-900">
                    {plan.error}
                  </div>
                ) : null}
              </div>

              {result?.warnings?.length ? (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950">
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
            <div className="mt-6 rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
              <h2 className="text-base font-semibold text-slate-900">Route summary</h2>
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

        <section className="lg:col-span-8" aria-labelledby="map-heading">
          <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-4 py-3 sm:px-5">
              <h2 id="map-heading" className="text-base font-semibold text-slate-900">
                Map
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Route drawn with OpenStreetMap tiles and OSRM routing.
              </p>
            </div>
            <div className="h-[min(420px,55vh)] min-h-[280px] sm:h-[420px]">
              <Suspense fallback={<MapSkeleton />}>
                <MapView result={result} />
              </Suspense>
            </div>
          </div>

          {result ? (
            <div className="mt-6 grid grid-cols-1 gap-6">
              <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
                <h2 className="text-base font-semibold text-slate-900">Trip events</h2>
                <div className="mt-4">
                  {hasTimeline ? (
                    <TimelineList timeline={result.timeline} />
                  ) : (
                    <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-600">
                      No timeline segments were returned for this trip.
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-6 rounded-xl border border-slate-200/80 bg-white p-10 text-center shadow-sm">
              <p className="mx-auto max-w-sm text-sm leading-relaxed text-slate-600">
                Enter trip details and choose <span className="font-semibold text-slate-800">Plan trip</span>{' '}
                to generate the route and log sheets.
              </p>
            </div>
          )}
        </section>

        {result ? (
          <section className="lg:col-span-12" aria-labelledby="logs-heading">
            <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 id="logs-heading" className="text-base font-semibold text-slate-900">
                  Driver&apos;s Daily Log (paper-style)
                </h2>
                <p className="text-xs text-slate-500">Grid is 24h in 15-minute increments</p>
              </div>
              <div className="mt-4 space-y-6">
                {result.dailyLogs.length ? (
                  result.dailyLogs.map((log, index) => (
                    <LogSheet key={log.date ? `${log.date}-${index}` : `log-${index}`} log={log} />
                  ))
                ) : (
                  <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-600">
                    No daily log pages were generated.
                  </p>
                )}
              </div>
            </div>
          </section>
        ) : null}
      </main>
    </div>
  )
}
