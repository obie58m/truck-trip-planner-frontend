import { normalizePlanResponse } from './normalizePlan'
import type { PlanResponse } from '../types'

export type PlanTripInput = {
  currentLocation: string
  pickupLocation: string
  dropoffLocation: string
  currentCycleUsedHours: number
  startDateTime?: string
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
  return base ? `${base}/api/plan/` : '/api/plan/'
}

function parseErrorBody(text: string, fallback: string): string {
  const t = text.trim()
  if (!t) return fallback
  try {
    const j = JSON.parse(t) as { error?: string }
    if (typeof j?.error === 'string' && j.error) return j.error
  } catch {
    return t.slice(0, 280)
  }
  return t.slice(0, 280)
}

export async function planTrip(input: PlanTripInput): Promise<PlanResponse> {
  const controller = new AbortController()
  const timeoutMs = 30_000
  const t = window.setTimeout(() => controller.abort(), timeoutMs)
  let res: Response
  try {
    res = await fetch(planEndpointUrl(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
      signal: controller.signal,
    })
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') {
      throw new Error('Request timed out. Try again or check your connection.')
    }
    throw e instanceof Error ? e : new Error('Network error')
  } finally {
    window.clearTimeout(t)
  }

  const rawText = await res.text()

  if (!res.ok) {
    const fallback = `Request failed (${res.status})`
    throw new Error(parseErrorBody(rawText, fallback))
  }

  let parsed: unknown
  try {
    parsed = rawText.trim() ? JSON.parse(rawText) : null
  } catch {
    throw new Error('Server returned invalid JSON')
  }

  return normalizePlanResponse(parsed)
}
