import type { PlanResponse } from './types'

export type PlanTripInput = {
  currentLocation: string
  pickupLocation: string
  dropoffLocation: string
  currentCycleUsedHours: number
  startDateTime?: string

  // Paper log details (optional but used to fill the sheet)
  carrierName?: string
  mainOfficeAddress?: string
  homeTerminalAddress?: string
  tractorNumber?: string
  trailerNumber?: string
  manifestNumber?: string
  shipperName?: string
  commodity?: string
}

function planEndpointUrl(): string {
  const base = __BACKEND_ORIGIN__.replace(/\/$/, '')
  // Empty → `/api/plan/` on the page’s host. On Vercel, `frontend/vercel.json` rewrites that to Render.
  // Or set VITE_API_BASE_URL / API_BASE_URL at build time to call Render directly.
  return base ? `${base}/api/plan/` : '/api/plan/'
}

export async function planTrip(input: PlanTripInput): Promise<PlanResponse> {
  const controller = new AbortController()
  const timeoutMs = 30_000
  const t = window.setTimeout(() => controller.abort(), timeoutMs)
  const res = await fetch(planEndpointUrl(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
    signal: controller.signal,
  }).finally(() => window.clearTimeout(t))
  const data = (await res.json()) as any
  if (!res.ok) {
    throw new Error(data?.error || `Request failed (${res.status})`)
  }
  return data as PlanResponse
}

