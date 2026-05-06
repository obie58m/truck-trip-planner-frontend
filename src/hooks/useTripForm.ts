import { useMemo, useState } from 'react'
import type { PlanTripInput } from '../api/planTrip'
import {
  formatRoundedNote,
  localDatetimeToOffsetIso,
  roundDatetimeLocalTo15Min,
} from '../utils/datetime'
import { locationFieldMessage } from '../utils/location'

function clampCycleHours(n: number): number {
  if (!Number.isFinite(n) || n < 0) return 0
  return Math.min(n, 70)
}

export function useTripForm() {
  const [currentLocation, setCurrentLocation] = useState('')
  const [pickupLocation, setPickupLocation] = useState('')
  const [dropoffLocation, setDropoffLocation] = useState('')
  const [currentCycleUsedHours, setCurrentCycleUsedHours] = useState(0)
  const [startDateTime, setStartDateTime] = useState(() =>
    new Date().toISOString().slice(0, 16),
  )
  const [startTimeRoundedNote, setStartTimeRoundedNote] = useState<string | null>(null)

  const [carrierName, setCarrierName] = useState('N/A')
  const [mainOfficeAddress, setMainOfficeAddress] = useState('N/A')
  const [homeTerminalAddress, setHomeTerminalAddress] = useState('')
  const [tractorNumber, setTractorNumber] = useState('N/A')
  const [trailerNumber, setTrailerNumber] = useState('N/A')
  const [manifestNumber, setManifestNumber] = useState('')
  const [shipperName, setShipperName] = useState('')
  const [commodity, setCommodity] = useState('General freight')

  const locationError = useMemo(
    () => locationFieldMessage(currentLocation, pickupLocation, dropoffLocation),
    [currentLocation, pickupLocation, dropoffLocation],
  )

  const startIso = useMemo(() => localDatetimeToOffsetIso(startDateTime), [startDateTime])

  function onStartDateTimeChange(raw: string) {
    if (!raw) {
      setStartTimeRoundedNote(null)
      setStartDateTime(raw)
      return
    }
    const rounded = roundDatetimeLocalTo15Min(raw)
    setStartDateTime(rounded)
    if (rounded !== raw) {
      setStartTimeRoundedNote(formatRoundedNote(rounded))
    } else {
      setStartTimeRoundedNote(null)
    }
  }

  function onStartDateTimeBlur() {
    const v = startDateTime.trim()
    if (!v) return
    const rounded = roundDatetimeLocalTo15Min(v)
    if (rounded !== v) {
      setStartDateTime(rounded)
      setStartTimeRoundedNote(formatRoundedNote(rounded))
    }
  }

  function buildPlanInput(): PlanTripInput {
    const cycle = clampCycleHours(currentCycleUsedHours)
    return {
      currentLocation,
      pickupLocation,
      dropoffLocation,
      currentCycleUsedHours: cycle,
      startDateTime: startIso,
      carrierName,
      mainOfficeAddress,
      homeTerminalAddress: homeTerminalAddress || currentLocation,
      tractorNumber,
      trailerNumber,
      manifestNumber: manifestNumber || undefined,
      shipperName: shipperName || undefined,
      commodity: commodity || undefined,
    }
  }

  return {
    currentLocation,
    setCurrentLocation,
    pickupLocation,
    setPickupLocation,
    dropoffLocation,
    setDropoffLocation,
    currentCycleUsedHours,
    setCurrentCycleUsedHours,
    startDateTime,
    startTimeRoundedNote,
    onStartDateTimeChange,
    onStartDateTimeBlur,
    carrierName,
    setCarrierName,
    mainOfficeAddress,
    setMainOfficeAddress,
    homeTerminalAddress,
    setHomeTerminalAddress,
    tractorNumber,
    setTractorNumber,
    trailerNumber,
    setTrailerNumber,
    manifestNumber,
    setManifestNumber,
    shipperName,
    setShipperName,
    commodity,
    setCommodity,
    locationError,
    buildPlanInput,
  }
}
