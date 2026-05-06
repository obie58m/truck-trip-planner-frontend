import type { DailyLog, DutyStatus, PlanResponse, RouteLeg, TimelineItem } from '../types'

const dutySet = new Set<DutyStatus>(['OFF', 'SB', 'D', 'ON'])

function asDutyStatus(v: unknown): DutyStatus {
  return typeof v === 'string' && dutySet.has(v as DutyStatus) ? (v as DutyStatus) : 'OFF'
}

function normalizeLeg(raw: unknown, index: number): RouteLeg {
  const x = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {}
  const geom = x.geometry && typeof x.geometry === 'object' ? (x.geometry as Record<string, unknown>) : {}
  const coordsRaw = geom.coordinates
  const coordinates: Array<[number, number]> = []
  if (Array.isArray(coordsRaw)) {
    for (const pair of coordsRaw) {
      if (Array.isArray(pair) && pair.length >= 2) {
        const lon = Number(pair[0])
        const lat = Number(pair[1])
        if (Number.isFinite(lon) && Number.isFinite(lat)) {
          coordinates.push([lon, lat])
        }
      }
    }
  }
  return {
    from: typeof x.from === 'string' ? x.from : `Leg ${index + 1}`,
    to: typeof x.to === 'string' ? x.to : '',
    distanceMiles: Number(x.distanceMiles) || 0,
    durationHours: Number(x.durationHours) || 0,
    geometry: {
      type: 'LineString',
      coordinates: coordinates.length ? coordinates : [[0, 0]],
    },
  }
}

function normalizeTimelineItem(raw: unknown): TimelineItem {
  const x = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {}
  return {
    status: asDutyStatus(x.status),
    start: typeof x.start === 'string' ? x.start : '',
    end: typeof x.end === 'string' ? x.end : '',
    location: typeof x.location === 'string' ? x.location : '',
    note: typeof x.note === 'string' ? x.note : '',
    minutes: Number(x.minutes) || 0,
  }
}

function normalizeDailyLog(raw: unknown): DailyLog {
  const x = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {}
  const th = x.totalHours && typeof x.totalHours === 'object' ? (x.totalHours as Record<string, unknown>) : {}
  const tp =
    x.totalHoursPretty && typeof x.totalHoursPretty === 'object'
      ? (x.totalHoursPretty as Record<string, unknown>)
      : {}
  const segmentsRaw = x.segments
  const segments: DailyLog['segments'] = []
  if (Array.isArray(segmentsRaw)) {
    for (const s of segmentsRaw) {
      const seg = s && typeof s === 'object' ? (s as Record<string, unknown>) : {}
      const startMin = Number(seg.startMin)
      const endMin = Number(seg.endMin)
      if (!Number.isFinite(startMin) || !Number.isFinite(endMin)) continue
      segments.push({
        status: asDutyStatus(seg.status),
        startMin,
        endMin,
      })
    }
  }
  const remarksRaw = x.remarks
  const remarks: DailyLog['remarks'] = []
  if (Array.isArray(remarksRaw)) {
    for (const r of remarksRaw) {
      const o = r && typeof r === 'object' ? (r as Record<string, unknown>) : {}
      remarks.push({
        time: typeof o.time === 'string' ? o.time : '',
        startMin: typeof o.startMin === 'number' ? o.startMin : undefined,
        location: typeof o.location === 'string' ? o.location : '',
        note: typeof o.note === 'string' ? o.note : '',
      })
    }
  }
  return {
    date: typeof x.date === 'string' ? x.date : '',
    milesDrivingToday: Number(x.milesDrivingToday) || 0,
    totalMileageToday: typeof x.totalMileageToday === 'number' ? x.totalMileageToday : undefined,
    fromLocation: typeof x.fromLocation === 'string' ? x.fromLocation : undefined,
    toLocation: typeof x.toLocation === 'string' ? x.toLocation : undefined,
    carrierName: typeof x.carrierName === 'string' ? x.carrierName : undefined,
    mainOfficeAddress: typeof x.mainOfficeAddress === 'string' ? x.mainOfficeAddress : undefined,
    homeTerminalAddress: typeof x.homeTerminalAddress === 'string' ? x.homeTerminalAddress : undefined,
    vehicleNumbers: typeof x.vehicleNumbers === 'string' ? x.vehicleNumbers : undefined,
    manifestNumber: typeof x.manifestNumber === 'string' ? x.manifestNumber : undefined,
    shipperCommodity: typeof x.shipperCommodity === 'string' ? x.shipperCommodity : undefined,
    onDutyHoursToday: typeof x.onDutyHoursToday === 'number' ? x.onDutyHoursToday : undefined,
    segments,
    remarks,
    totalHours: {
      offDuty: Number(th.offDuty) || 0,
      sleeperBerth: Number(th.sleeperBerth) || 0,
      driving: Number(th.driving) || 0,
      onDuty: Number(th.onDuty) || 0,
    },
    totalHoursPretty: {
      offDuty: String(tp.offDuty ?? '0:00'),
      sleeperBerth: String(tp.sleeperBerth ?? '0:00'),
      driving: String(tp.driving ?? '0:00'),
      onDuty: String(tp.onDuty ?? '0:00'),
    },
  }
}

export function normalizePlanResponse(data: unknown): PlanResponse {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid server response')
  }
  const root = data as Record<string, unknown>
  const routeRaw = root.route
  if (!routeRaw || typeof routeRaw !== 'object') {
    throw new Error('Invalid server response')
  }
  const route = routeRaw as Record<string, unknown>
  const legsRaw = route.legs
  const legs = Array.isArray(legsRaw)
    ? legsRaw.map((leg, i) => normalizeLeg(leg, i))
    : []

  return {
    route: {
      totalDistanceMiles: Number(route.totalDistanceMiles) || 0,
      totalDurationHours: Number(route.totalDurationHours) || 0,
      legs,
    },
    timeline: Array.isArray(root.timeline)
      ? root.timeline.map(normalizeTimelineItem)
      : [],
    dailyLogs: Array.isArray(root.dailyLogs)
      ? root.dailyLogs.map(normalizeDailyLog)
      : [],
    warnings: Array.isArray(root.warnings)
      ? root.warnings.filter((w): w is string => typeof w === 'string')
      : [],
  }
}
