export function isValidCityStateFormat(value: string): boolean {
  const s = value.trim()
  return /^[^,]+,\s*([A-Za-z]{2}|[A-Za-z][A-Za-z .'-]{2,})$/.test(s)
}

export function locationFieldMessage(
  current: string,
  pickup: string,
  dropoff: string,
): string | null {
  if (!current.trim() || !pickup.trim() || !dropoff.trim()) {
    return 'Please fill Current, Pickup, and Dropoff locations.'
  }
  if (
    !isValidCityStateFormat(current) ||
    !isValidCityStateFormat(pickup) ||
    !isValidCityStateFormat(dropoff)
  ) {
    return 'Locations must be full city/state, like "Chicago, IL".'
  }
  return null
}
