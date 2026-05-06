export type DutyStatus = 'OFF' | 'SB' | 'D' | 'ON'

export type TimelineItem = {
  status: DutyStatus
  start: string
  end: string
  location: string
  note: string
  minutes: number
}

export type DailyLog = {
  date: string
  milesDrivingToday: number
  totalMileageToday?: number
  fromLocation?: string
  toLocation?: string
  carrierName?: string
  mainOfficeAddress?: string
  homeTerminalAddress?: string
  vehicleNumbers?: string
  manifestNumber?: string
  shipperCommodity?: string
  onDutyHoursToday?: number
  segments: Array<{ status: DutyStatus; startMin: number; endMin: number }>
  remarks: Array<{ time: string; startMin?: number; location: string; note: string }>
  totalHours: {
    offDuty: number
    sleeperBerth: number
    driving: number
    onDuty: number
  }
  totalHoursPretty: {
    offDuty: string
    sleeperBerth: string
    driving: string
    onDuty: string
  }
}

export type RouteLeg = {
  from: string
  to: string
  distanceMiles: number
  durationHours: number
  geometry: {
    type: 'LineString'
    coordinates: Array<[number, number]>
  }
}

export type PlanResponse = {
  route: {
    totalDistanceMiles: number
    totalDurationHours: number
    legs: RouteLeg[]
  }
  timeline: TimelineItem[]
  dailyLogs: DailyLog[]
  warnings: string[]
}

