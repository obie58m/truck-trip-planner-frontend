import { useCallback, useState } from 'react'
import { planTrip, type PlanTripInput } from '../api/planTrip'
import type { PlanResponse } from '../types'

export function usePlanTrip() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<PlanResponse | null>(null)

  const run = useCallback(async (input: PlanTripInput) => {
    setLoading(true)
    setError(null)
    try {
      const r = await planTrip(input)
      setResult(r)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Request failed')
    } finally {
      setLoading(false)
    }
  }, [])

  const clearError = useCallback(() => setError(null), [])

  const reset = useCallback(() => {
    setResult(null)
    setError(null)
  }, [])

  return { loading, error, result, run, clearError, reset }
}
