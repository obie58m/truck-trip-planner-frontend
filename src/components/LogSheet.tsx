import type { DailyLog, DutyStatus } from '../types'

const W = 1060

const M = 24
const gridX = 180
const gridY = 320
const gridW = 760
const gridH = 170
const rowH = gridH / 4
const headerBarH = 28
const gridContainerY = gridY - headerBarH

const remarksTitleY = gridY + gridH + 80
const remarksRectY = remarksTitleY + 12
const remarksRectH = 90
const shippingTitleY = remarksRectY + remarksRectH + 6
const instructionY1 = shippingTitleY + 78
const instructionY2 = instructionY1 + 12
const recapTableY = instructionY2 + 14
const recapTableH = 140
const footerY = recapTableY + recapTableH + 24
const H = footerY + 16

function xForMin(min: number) {
  return gridX + (Math.max(0, Math.min(1440, min)) / 1440) * gridW
}

function yForStatus(s: DutyStatus) {
  const rowIndex = s === 'OFF' ? 0 : s === 'SB' ? 1 : s === 'D' ? 2 : 3
  return gridY + rowIndex * rowH + rowH / 2
}

function labelForStatus(s: DutyStatus) {
  switch (s) {
    case 'OFF':
      return '1. Off Duty'
    case 'SB':
      return '2. Sleeper Berth'
    case 'D':
      return '3. Driving'
    case 'ON':
      return '4. On Duty (not driving)'
  }
}

export function LogSheet(props: { log: DailyLog }) {
  const log = props.log
  const parsed = log.date ? new Date(`${log.date}T00:00:00`) : new Date()
  const date = Number.isNaN(parsed.getTime()) ? new Date() : parsed
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const year = String(date.getFullYear())

  const th = log.totalHours ?? {
    offDuty: 0,
    sleeperBerth: 0,
    driving: 0,
    onDuty: 0,
  }
  const total24 = th.offDuty + th.sleeperBerth + th.driving + th.onDuty

  const tp = log.totalHoursPretty ?? {
    offDuty: '0:00',
    sleeperBerth: '0:00',
    driving: '0:00',
    onDuty: '0:00',
  }

  return (
    <div className="w-full">
      <div className="rounded-lg border bg-white p-3">
        <svg
          width="100%"
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label={`Log ${log.date || 'unknown date'}`}
          preserveAspectRatio="xMinYMin meet"
        >
          
          <rect x={1} y={1} width={W - 2} height={H - 2} fill="white" stroke="#0f172a" strokeWidth={1.5} />

          
          <text x={M} y={32} fontSize={18} fontWeight={800} fill="#0f172a">
            Driver&apos;s Daily Log
          </text>
          <text x={M} y={50} fontSize={11} fill="#334155">
            (ONE CALENDAR DAY — 24 HOURS)
          </text>

          <text x={W - M} y={28} fontSize={10} textAnchor="end" fill="#0f172a">
            Original - File at home terminal.
          </text>
          <text x={W - M} y={44} fontSize={10} textAnchor="end" fill="#0f172a">
            Duplicate - Driver retains in his/her possession for 8 days.
          </text>

          
          <text x={M + 8} y={78} fontSize={10} fill="#0f172a">
            (24 hours)
          </text>

          <text x={M + 220} y={78} fontSize={10} fill="#334155">
            (month)
          </text>
          <text x={M + 300} y={78} fontSize={10} fill="#334155">
            (day)
          </text>
          <text x={M + 362} y={78} fontSize={10} fill="#334155">
            (year)
          </text>

          
          <text x={M + 210} y={100} fontSize={16} fontWeight={800} fill="#0f172a">
            {month}
          </text>
          <text x={M + 250} y={100} fontSize={16} fontWeight={800} fill="#0f172a">
            /
          </text>
          <text x={M + 270} y={100} fontSize={16} fontWeight={800} fill="#0f172a">
            {day}
          </text>
          <text x={M + 306} y={100} fontSize={16} fontWeight={800} fill="#0f172a">
            /
          </text>
          <text x={M + 326} y={100} fontSize={16} fontWeight={800} fill="#0f172a">
            {year}
          </text>

          
          <text x={M + 8} y={130} fontSize={12} fontWeight={800} fill="#0f172a">
            From:
          </text>
          <line x1={M + 60} y1={128} x2={M + 430} y2={128} stroke="#0f172a" strokeWidth={1} />
          <text x={M + 64} y={125} fontSize={11} fill="#0f172a">
            {log.fromLocation || 'N/A'}
          </text>
          <text x={M + 460} y={130} fontSize={12} fontWeight={800} fill="#0f172a">
            To:
          </text>
          <line x1={M + 492} y1={128} x2={W - M} y2={128} stroke="#0f172a" strokeWidth={1} />
          <text x={M + 496} y={125} fontSize={11} fill="#0f172a">
            {log.toLocation || 'N/A'}
          </text>

          
          <rect x={M + 18} y={148} width={150} height={40} fill="white" stroke="#0f172a" strokeWidth={1.5} />
          <text x={M + 26} y={204} fontSize={11} fill="#0f172a">
            Total Miles Driving Today
          </text>
          <text x={M + 28} y={174} fontSize={14} fontWeight={800} fill="#0f172a">
            {log.milesDrivingToday}
          </text>

          <rect x={M + 182} y={148} width={150} height={40} fill="white" stroke="#0f172a" strokeWidth={1.5} />
          <text x={M + 190} y={204} fontSize={11} fill="#0f172a">
            Total Mileage Today
          </text>
          <text x={M + 192} y={174} fontSize={14} fontWeight={800} fill="#0f172a">
            {log.milesDrivingToday}
          </text>

          <rect x={M + 18} y={214} width={314} height={44} fill="white" stroke="#0f172a" strokeWidth={1.5} />
          <text x={M + 26} y={274} fontSize={10} fill="#0f172a">
            Truck/Tractor and Trailer Numbers or
          </text>
          <text x={M + 26} y={288} fontSize={10} fill="#0f172a">
            License Plate(s)/State (show each unit)
          </text>
          <text x={M + 26} y={242} fontSize={12} fontWeight={700} fill="#0f172a">
            {log.vehicleNumbers || 'Tractor: N/A  Trailer: N/A'}
          </text>

          
          {(() => {
            const v = log.carrierName || 'N/A'
            const isNA = v.trim().toLowerCase() === 'n/a'
            const x = M + 360
            const yLine = 188
            return (
              <g>
                <line x1={x} y1={yLine} x2={W - M} y2={yLine} stroke="#0f172a" strokeWidth={1} />
                <text x={x} y={yLine - 2} fontSize={12} fontWeight={isNA ? 500 : 700} fill={isNA ? '#64748b' : '#0f172a'}>
                  {v}
                </text>
                <text x={x} y={yLine + 16} fontSize={9} fill="#334155">
                  Name of Carrier or Carriers
                </text>
              </g>
            )
          })()}

          {(() => {
            const v = log.mainOfficeAddress || 'N/A'
            const isNA = v.trim().toLowerCase() === 'n/a'
            const x = M + 360
            const yLine = 230
            return (
              <g>
                <line x1={x} y1={yLine} x2={W - M} y2={yLine} stroke="#0f172a" strokeWidth={1} />
                <text x={x} y={yLine - 2} fontSize={12} fontWeight={isNA ? 500 : 600} fill={isNA ? '#64748b' : '#0f172a'}>
                  {v}
                </text>
                <text x={x} y={yLine + 16} fontSize={9} fill="#334155">
                  Main Office Address
                </text>
              </g>
            )
          })()}

          {(() => {
            const v = log.homeTerminalAddress || 'N/A'
            const isNA = v.trim().toLowerCase() === 'n/a'
            const x = M + 360
            const yLine = 258
            return (
              <g>
                <line x1={x} y1={yLine} x2={W - M} y2={yLine} stroke="#0f172a" strokeWidth={1} />
                <text x={x} y={yLine - 2} fontSize={12} fontWeight={isNA ? 500 : 600} fill={isNA ? '#64748b' : '#0f172a'}>
                  {v}
                </text>
                <text x={x} y={yLine + 16} fontSize={9} fill="#334155">
                  Home Terminal Address
                </text>
              </g>
            )
          })()}

          
          <rect x={M} y={gridContainerY} width={W - 2 * M} height={230} fill="white" stroke="#0f172a" />

          
          <rect x={gridX} y={gridY - headerBarH} width={gridW} height={headerBarH} fill="#0f172a" />
          <text x={gridX + 8} y={gridY - 10} fontSize={9} fontWeight={700} fill="white">
            Mid-
          </text>
          <text x={gridX + 8} y={gridY - 2} fontSize={9} fontWeight={700} fill="white">
            night
          </text>

          
          {(['OFF', 'SB', 'D', 'ON'] as DutyStatus[]).map((s, idx) => (
            <g key={s}>
              <text x={M + 10} y={gridY + idx * rowH + rowH / 2 + 5} fontSize={12} fontWeight={600} fill="#0f172a">
                {labelForStatus(s)}
              </text>
            </g>
          ))}

          
          {Array.from({ length: 25 }).map((_, h) => {
            const x = xForMin(h * 60)
            return (
              <g key={h}>
                <line x1={x} y1={gridY} x2={x} y2={gridY + gridH} stroke="#0f172a" strokeWidth={h % 2 === 0 ? 1.2 : 0.8} opacity={0.8} />
                {h < 24 ? (
                  <text x={x + 2} y={gridY - 8} fontSize={9} fontWeight={700} fill="white">
                    {h === 0 ? '' : h === 12 ? 'Noon' : String(h)}
                  </text>
                ) : null}
              </g>
            )
          })}

          
          {Array.from({ length: 24 * 4 + 1 }).map((_, i) => {
            const x = xForMin(i * 15)
            const isHour = i % 4 === 0
            return (
              <line
                key={i}
                x1={x}
                y1={gridY}
                x2={x}
                y2={gridY + gridH}
                stroke="#0f172a"
                strokeWidth={isHour ? 1.2 : 0.5}
                opacity={isHour ? 0.18 : 0.07}
              />
            )
          })}

          
          {(() => {
            const yOffTop = gridY
            const ySbTop = gridY + rowH
            const yDriveBottom = gridY + rowH * 3
            const yOnBottom = gridY + rowH * 4

            const tickEls: Array<JSX.Element> = []
            for (let i = 0; i <= 24 * 4; i++) {
              const x = xForMin(i * 15)
              const isHour = i % 4 === 0
              const isHalfHour = i % 4 === 2
              const shortLen = Math.round(rowH * 0.3)
              const midLen = Math.round(rowH * 0.7)
              const hourLen = Math.round(rowH * 0.85)
              const len = isHour ? hourLen : isHalfHour ? midLen : shortLen
              const sw = isHour ? 1.2 : 1
              const op = 0.85

              tickEls.push(
                <line
                  key={`off-${i}`}
                  x1={x}
                  y1={yOffTop}
                  x2={x}
                  y2={yOffTop + len}
                  stroke="#0f172a"
                  strokeWidth={sw}
                  opacity={op}
                />,
              )

              tickEls.push(
                <line
                  key={`sb-${i}`}
                  x1={x}
                  y1={ySbTop}
                  x2={x}
                  y2={ySbTop + len}
                  stroke="#0f172a"
                  strokeWidth={sw}
                  opacity={op}
                />,
              )

              tickEls.push(
                <line
                  key={`d-${i}`}
                  x1={x}
                  y1={yDriveBottom}
                  x2={x}
                  y2={yDriveBottom - len}
                  stroke="#0f172a"
                  strokeWidth={sw}
                  opacity={op}
                />,
              )

              tickEls.push(
                <line
                  key={`on-${i}`}
                  x1={x}
                  y1={yOnBottom}
                  x2={x}
                  y2={yOnBottom - len}
                  stroke="#0f172a"
                  strokeWidth={sw}
                  opacity={op}
                />,
              )
            }
            return <g>{tickEls}</g>
          })()}

          
          {Array.from({ length: 25 }).map((_, h) => {
            const x = xForMin(h * 60)
            if (h >= 24) return null
            const label = h === 0 ? 'Mid' : h === 12 ? 'Noon' : String(h)
            return (
              <text key={`btime-${h}`} x={x + 2} y={gridY + gridH + 16} fontSize={10} fill="#334155">
                {label}
              </text>
            )
          })}

          
          {Array.from({ length: 5 }).map((_, i) => (
            <line key={i} x1={gridX} y1={gridY + i * rowH} x2={gridX + gridW} y2={gridY + i * rowH} stroke="#0f172a" strokeWidth={1} opacity={0.35} />
          ))}

          
          {(() => {
            const segs = (log.segments ?? [])
              .slice()
              .sort((a, b) => a.startMin - b.startMin || a.endMin - b.endMin)
              .filter((s) => s.endMin > s.startMin)

            const stroke = '#0f172a'
            const sw = 4

            const lines: Array<JSX.Element> = []
            for (let i = 0; i < segs.length; i++) {
              const s = segs[i]
              const x1 = xForMin(s.startMin)
              const x2 = xForMin(s.endMin)
              const y = yForStatus(s.status)
              lines.push(<line key={`h-${i}`} x1={x1} y1={y} x2={x2} y2={y} stroke={stroke} strokeWidth={sw} />)
              const next = segs[i + 1]
              if (next && next.startMin === s.endMin) {
                const y2 = yForStatus(next.status)
                lines.push(<line key={`v-${i}`} x1={x2} y1={y} x2={x2} y2={y2} stroke={stroke} strokeWidth={sw} />)
              }
            }
            return <g>{lines}</g>
          })()}

          
          <rect x={gridX + gridW} y={gridY - 20} width={W - (gridX + gridW) - M} height={gridH + 40} fill="white" stroke="#0f172a" />
          <text x={gridX + gridW + 12} y={gridY - 2} fontSize={11} fontWeight={800} fill="#0f172a">
            Total
          </text>
          <text x={gridX + gridW + 12} y={gridY + 14} fontSize={11} fontWeight={800} fill="#0f172a">
            Hours
          </text>
          {([
            ['Off', tp.offDuty],
            ['SB', tp.sleeperBerth],
            ['D', tp.driving],
            ['ON', tp.onDuty],
          ] as const).map(([k, v], idx) => (
            <g key={k}>
              <text x={gridX + gridW + 12} y={gridY + idx * rowH + rowH / 2 + 5} fontSize={12} fill="#334155">
                {k}
              </text>
              <text x={gridX + gridW + 48} y={gridY + idx * rowH + rowH / 2 + 5} fontSize={12} fontWeight={700} fill="#0f172a">
                {v}
              </text>
            </g>
          ))}
          <text x={gridX + gridW + 12} y={gridY + gridH + 14} fontSize={11} fill={Math.abs(total24 - 24) < 0.01 ? '#0f172a' : '#b91c1c'}>
            Total: {total24.toFixed(2)}h
          </text>

          
          <text x={M} y={remarksTitleY} fontSize={12} fontWeight={800} fill="#0f172a">
            Remarks
          </text>

          
          {(() => {
            const items = (log.remarks ?? [])
              .slice()
              .filter((r) => typeof r.startMin === 'number')
              .filter((r) => {
                const note = (r.note || '').toLowerCase()
                if (note.includes('fuel')) return true
                if (note.includes('break')) return true
                if (note.includes('pickup')) return true
                if (note.includes('dropoff')) return true
                if (note.includes('pre-trip')) return true
                if (note.includes('post-trip')) return true
                if (note.includes('restart')) return true
                if (note.includes('reset')) return true
                if (note.includes('sleeper')) return true
                if (note.includes('off duty')) return true
                if (note.includes('on duty')) return true
                return false
              })
              .sort((a, b) => (a.startMin ?? 0) - (b.startMin ?? 0))
              .slice(0, 12)

            const laneH = 20
            const stemTop = gridY + gridH + 8
            const stemBottomBase = remarksRectY + 10
            const armLen = 18
            const armUp = 10
            const maxLanes = Math.max(1, Math.floor((remarksRectH - 20) / laneH))
            const minDx = 90

            return (
              <g>
                {(() => {
                  const lastX: number[] = Array.from({ length: maxLanes }).map(() => -1e9)
                  const placed: Array<{ r: (typeof items)[number]; lane: number }> = []

                  for (const r of items) {
                    const x = xForMin(r.startMin as number)
                    let lane = 0
                    while (lane < maxLanes && x - lastX[lane] < minDx) lane++
                    if (lane >= maxLanes) lane = maxLanes - 1
                    lastX[lane] = x
                    placed.push({ r, lane })
                  }

                  return placed.map(({ r, lane }, idx) => {
                    const x = xForMin(r.startMin as number)
                    const laneY = stemBottomBase + lane * laneH
                    const elbowX = x + armLen
                    const labelX = elbowX + 6
                    const labelY = laneY - armUp + 2
                    const text = `${r.location}, ${r.note}`.replace(/\s+—\s+/g, ' ').trim()

                    return (
                      <g key={`${r.time}-${lane}-${idx}`}>
                        
                        <line x1={x} y1={stemTop} x2={x} y2={laneY} stroke="#0f172a" strokeWidth={2} />
                        
                        <line x1={x} y1={laneY} x2={elbowX} y2={laneY} stroke="#0f172a" strokeWidth={2} />
                        
                        <line x1={elbowX} y1={laneY} x2={elbowX} y2={laneY - armUp} stroke="#0f172a" strokeWidth={2} />
                        
                        <text
                          x={labelX}
                          y={labelY}
                          fontSize={11}
                          fontWeight={700}
                          fill="#0f172a"
                          transform={`rotate(-45 ${labelX} ${labelY})`}
                        >
                          {text}
                        </text>
                      </g>
                    )
                  })
                })()}
              </g>
            )
          })()}

          <text x={M} y={shippingTitleY} fontSize={12} fontWeight={800} fill="#0f172a">
            Shipping Documents:
          </text>
          <text x={M} y={shippingTitleY + 18} fontSize={10} fill="#334155">
            DV/Load or Manifest No.:
          </text>
          <line x1={M + 150} y1={shippingTitleY + 16} x2={M + 420} y2={shippingTitleY + 16} stroke="#0f172a" />
          <text x={M + 152} y={shippingTitleY + 12} fontSize={10} fill="#0f172a">
            {log.manifestNumber || 'N/A'}
          </text>
          <text x={M} y={shippingTitleY + 40} fontSize={10} fill="#334155">
            Shipper &amp; Commodity:
          </text>
          <line x1={M + 150} y1={shippingTitleY + 38} x2={W - M} y2={shippingTitleY + 38} stroke="#0f172a" />
          <text x={M + 152} y={shippingTitleY + 34} fontSize={10} fill="#0f172a">
            {log.shipperCommodity || 'N/A'}
          </text>

          
          <text x={W / 2} y={instructionY1} fontSize={10} textAnchor="middle" fill="#0f172a">
            Enter name of place you reported and where released from work and when and where each change of duty occurred.
          </text>
          <text x={W / 2} y={instructionY2} fontSize={10} textAnchor="middle" fill="#0f172a">
            Use time standard of home terminal.
          </text>

          
          <rect x={M} y={recapTableY} width={W - 2 * M} height={recapTableH} fill="white" stroke="#0f172a" />

          <text x={M + 10} y={recapTableY + 18} fontSize={10} fontWeight={800} fill="#0f172a">
            Recap:
          </text>
          <text x={M + 10} y={recapTableY + 32} fontSize={9} fill="#0f172a">
            Complete at end of day
          </text>

          
          <text x={M + 170} y={recapTableY + 18} fontSize={10} fontWeight={800} fill="#0f172a">
            70 Hour / 8 Day Drivers
          </text>
          {(() => {
            const start607 = M + 520
            return (
              <text x={start607} y={recapTableY + 18} fontSize={10} fontWeight={800} fill="#0f172a">
            60 Hour / 7 Day Drivers
          </text>
            )
          })()}
          <text x={W - M - 120} y={recapTableY + 18} fontSize={10} fontWeight={800} fill="#0f172a">
            If you took 34
          </text>

          
          <text x={M + 10} y={recapTableY + 64} fontSize={9} fill="#0f172a">
            On duty hours today,
          </text>
          <text x={M + 10} y={recapTableY + 78} fontSize={9} fill="#0f172a">
            Total lines:
          </text>

          
          {(['A.', 'B.', 'C.'] as const).map((lbl, idx) => {
            const x0 = M + 170 + idx * 120
            return (
              <g key={`708-${lbl}`}>
                <text x={x0} y={recapTableY + 44} fontSize={10} fontWeight={800} fill="#0f172a">
                  {lbl}
                </text>
                <line x1={x0 + 18} y1={recapTableY + 46} x2={x0 + 104} y2={recapTableY + 46} stroke="#0f172a" />
                <text x={x0} y={recapTableY + 68} fontSize={8} fill="#0f172a">
                  Total hours on
                </text>
                <text x={x0} y={recapTableY + 80} fontSize={8} fill="#0f172a">
                  duty last 7 days
                </text>
                <text x={x0} y={recapTableY + 92} fontSize={8} fill="#0f172a">
                  including today.
                </text>
              </g>
            )
          })}

          
          {(['A.', 'B.', 'C.'] as const).map((lbl, idx) => {
            const start607 = M + 520
            const colW = 110
            const x0 = start607 + idx * colW
            return (
              <g key={`607-${lbl}`}>
                <text x={x0} y={recapTableY + 44} fontSize={10} fontWeight={800} fill="#0f172a">
                  {lbl}
                </text>
                <line x1={x0 + 18} y1={recapTableY + 46} x2={x0 + 96} y2={recapTableY + 46} stroke="#0f172a" />
                <text x={x0} y={recapTableY + 68} fontSize={8} fill="#0f172a">
                  Total hours on
                </text>
                <text x={x0} y={recapTableY + 80} fontSize={8} fill="#0f172a">
                  duty last 6 days
                </text>
                <text x={x0} y={recapTableY + 92} fontSize={8} fill="#0f172a">
                  including today.
                </text>
              </g>
            )
          })}

          
          <text x={W - M - 120} y={recapTableY + 44} fontSize={9} fill="#0f172a">
            consecutive
          </text>
          <text x={W - M - 120} y={recapTableY + 56} fontSize={9} fill="#0f172a">
            hours off
          </text>
          <text x={W - M - 120} y={recapTableY + 68} fontSize={9} fill="#0f172a">
            duty you
          </text>
          <text x={W - M - 120} y={recapTableY + 80} fontSize={9} fill="#0f172a">
            have 60/70
          </text>
          <text x={W - M - 120} y={recapTableY + 92} fontSize={9} fill="#0f172a">
            hours available
          </text>

          
          <text x={M} y={footerY} fontSize={11} fill="#334155">
            Recap: driving + on-duty = {(th.driving + th.onDuty).toFixed(1)} hours · Totals must equal 24 hours.
          </text>
        </svg>
      </div>
    </div>
  )
}

