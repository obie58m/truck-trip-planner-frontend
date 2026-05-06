import type { DailyLog, DutyStatus } from '../types'

const W = 1060

// Layout tuned to resemble the provided blank paper log.
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
// We don't draw a big remarks "box" like the paper sample; keep only enough height
// for the angled callouts so Shipping Documents sits directly below.
const remarksRectH = 90
// Keep Shipping Documents tight under remarks (like the paper form).
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
  const date = new Date(props.log.date + 'T00:00:00')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const year = String(date.getFullYear())

  const total24 =
    props.log.totalHours.offDuty +
    props.log.totalHours.sleeperBerth +
    props.log.totalHours.driving +
    props.log.totalHours.onDuty

  return (
    <div className="w-full">
      <div className="rounded-lg border bg-white p-3">
        <svg
          width="100%"
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label={`Log ${props.log.date}`}
          preserveAspectRatio="xMinYMin meet"
        >
          {/* Outer */}
          <rect x={1} y={1} width={W - 2} height={H - 2} fill="white" stroke="#0f172a" strokeWidth={1.5} />

          {/* Title block (matches paper form) */}
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

          {/* Date (month/day/year) row like blank form */}
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

          {/* Show as month/day/year blanks with slashes */}
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

          {/* From/To lines on their own row */}
          <text x={M + 8} y={130} fontSize={12} fontWeight={800} fill="#0f172a">
            From:
          </text>
          <line x1={M + 60} y1={128} x2={M + 430} y2={128} stroke="#0f172a" strokeWidth={1} />
          <text x={M + 64} y={125} fontSize={11} fill="#0f172a">
            {props.log.fromLocation || 'N/A'}
          </text>
          <text x={M + 460} y={130} fontSize={12} fontWeight={800} fill="#0f172a">
            To:
          </text>
          <line x1={M + 492} y1={128} x2={W - M} y2={128} stroke="#0f172a" strokeWidth={1} />
          <text x={M + 496} y={125} fontSize={11} fill="#0f172a">
            {props.log.toLocation || 'N/A'}
          </text>

          {/* Top info boxes (match blank layout) */}
          <rect x={M + 18} y={148} width={150} height={40} fill="white" stroke="#0f172a" strokeWidth={1.5} />
          <text x={M + 26} y={204} fontSize={11} fill="#0f172a">
            Total Miles Driving Today
          </text>
          <text x={M + 28} y={174} fontSize={14} fontWeight={800} fill="#0f172a">
            {props.log.milesDrivingToday}
          </text>

          <rect x={M + 182} y={148} width={150} height={40} fill="white" stroke="#0f172a" strokeWidth={1.5} />
          <text x={M + 190} y={204} fontSize={11} fill="#0f172a">
            Total Mileage Today
          </text>
          <text x={M + 192} y={174} fontSize={14} fontWeight={800} fill="#0f172a">
            {props.log.milesDrivingToday}
          </text>

          <rect x={M + 18} y={214} width={314} height={44} fill="white" stroke="#0f172a" strokeWidth={1.5} />
          <text x={M + 26} y={274} fontSize={10} fill="#0f172a">
            Truck/Tractor and Trailer Numbers or
          </text>
          <text x={M + 26} y={288} fontSize={10} fill="#0f172a">
            License Plate(s)/State (show each unit)
          </text>
          <text x={M + 26} y={242} fontSize={12} fontWeight={700} fill="#0f172a">
            {props.log.vehicleNumbers || 'Tractor: N/A  Trailer: N/A'}
          </text>

          {/* Right-side carrier/address lines (not boxed) */}
          {(() => {
            const v = props.log.carrierName || 'N/A'
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
            const v = props.log.mainOfficeAddress || 'N/A'
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
            const v = props.log.homeTerminalAddress || 'N/A'
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

          {/* Grid container */}
          <rect x={M} y={gridContainerY} width={W - 2 * M} height={230} fill="white" stroke="#0f172a" />

          {/* Black time header bar (paper style) */}
          <rect x={gridX} y={gridY - headerBarH} width={gridW} height={headerBarH} fill="#0f172a" />
          <text x={gridX + 8} y={gridY - 10} fontSize={9} fontWeight={700} fill="white">
            Mid-
          </text>
          <text x={gridX + 8} y={gridY - 2} fontSize={9} fontWeight={700} fill="white">
            night
          </text>

          {/* Duty labels */}
          {(['OFF', 'SB', 'D', 'ON'] as DutyStatus[]).map((s, idx) => (
            <g key={s}>
              <text x={M + 10} y={gridY + idx * rowH + rowH / 2 + 5} fontSize={12} fontWeight={600} fill="#0f172a">
                {labelForStatus(s)}
              </text>
            </g>
          ))}

          {/* Vertical hour lines + hour labels (top) */}
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

          {/* 15-min tick marks */}
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

          {/* Paper-style tick rulers (match blank sheet):
              - OFF: ticks at top edge (down)
              - SB: ticks at top edge (down)
              - D: ticks at bottom edge of driving row (up)
              - ON: ticks at bottom edge (up)
           */}
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
              // Match paper feel: within each hour the 3 inner ticks are:
              // 15-min (short ~30%), 30-min (tall ~70%), 45-min (short ~30%).
              const shortLen = Math.round(rowH * 0.3)
              const midLen = Math.round(rowH * 0.7)
              const hourLen = Math.round(rowH * 0.85)
              const len = isHour ? hourLen : isHalfHour ? midLen : shortLen
              const sw = isHour ? 1.2 : 1
              const op = 0.85

              // OFF top ticks (down)
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

              // SB top ticks (down)
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

              // Driving bottom ticks (up)
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

              // On-duty bottom ticks (up)
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

          {/* Bottom time labels (paper form shows time scale on bottom too) */}
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

          {/* Horizontal row separators */}
          {Array.from({ length: 5 }).map((_, i) => (
            <line key={i} x1={gridX} y1={gridY + i * rowH} x2={gridX + gridW} y2={gridY + i * rowH} stroke="#0f172a" strokeWidth={1} opacity={0.35} />
          ))}

          {/* Duty line (step-style like paper log) */}
          {(() => {
            const segs = props.log.segments
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

          {/* Totals column */}
          <rect x={gridX + gridW} y={gridY - 20} width={W - (gridX + gridW) - M} height={gridH + 40} fill="white" stroke="#0f172a" />
          <text x={gridX + gridW + 12} y={gridY - 2} fontSize={11} fontWeight={800} fill="#0f172a">
            Total
          </text>
          <text x={gridX + gridW + 12} y={gridY + 14} fontSize={11} fontWeight={800} fill="#0f172a">
            Hours
          </text>
          {([
            ['Off', props.log.totalHoursPretty.offDuty],
            ['SB', props.log.totalHoursPretty.sleeperBerth],
            ['D', props.log.totalHoursPretty.driving],
            ['ON', props.log.totalHoursPretty.onDuty],
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

          {/* Remarks + Shipping documents (paper-style lower section) */}
          <text x={M} y={remarksTitleY} fontSize={12} fontWeight={800} fill="#0f172a">
            Remarks
          </text>

          {/* Paper-style remarks callouts (time-aligned with the grid) */}
          {(() => {
            // Root cause of the "broken" look: too many remark entries land at very similar
            // x-positions (duty segments can be numerous), so rotated labels overlap.
            // Fix: keep only meaningful events + auto-pack into lanes to avoid collisions.
            const items = props.log.remarks
              .slice()
              .filter((r) => typeof r.startMin === 'number')
              .filter((r) => {
                const note = (r.note || '').toLowerCase()
                // Keep key non-driving events only (matches the paper sample style).
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
                // Otherwise: likely "Drive ..." or generic enroute; skip to avoid clutter.
                return false
              })
              .sort((a, b) => (a.startMin ?? 0) - (b.startMin ?? 0))
              .slice(0, 12)

            const laneH = 20
            const stemTop = gridY + gridH + 8 // start just below the graph area (like the paper ruler)
            const stemBottomBase = remarksRectY + 10
            const armLen = 18
            const armUp = 10
            const maxLanes = Math.max(1, Math.floor((remarksRectH - 20) / laneH))
            const minDx = 90 // minimum horizontal spacing between labels in same lane

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
                        {/* stem from ruler into remarks */}
                        <line x1={x} y1={stemTop} x2={x} y2={laneY} stroke="#0f172a" strokeWidth={2} />
                        {/* small arm (right) */}
                        <line x1={x} y1={laneY} x2={elbowX} y2={laneY} stroke="#0f172a" strokeWidth={2} />
                        {/* small up-tick at elbow (paper-style bracket) */}
                        <line x1={elbowX} y1={laneY} x2={elbowX} y2={laneY - armUp} stroke="#0f172a" strokeWidth={2} />
                        {/* angled label (no time text on paper sample) */}
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
            {props.log.manifestNumber || 'N/A'}
          </text>
          <text x={M} y={shippingTitleY + 40} fontSize={10} fill="#334155">
            Shipper &amp; Commodity:
          </text>
          <line x1={M + 150} y1={shippingTitleY + 38} x2={W - M} y2={shippingTitleY + 38} stroke="#0f172a" />
          <text x={M + 152} y={shippingTitleY + 34} fontSize={10} fill="#0f172a">
            {props.log.shipperCommodity || 'N/A'}
          </text>

          {/* Paper-style instruction line (sits ABOVE the recap table in the blank form) */}
          <text x={W / 2} y={instructionY1} fontSize={10} textAnchor="middle" fill="#0f172a">
            Enter name of place you reported and where released from work and when and where each change of duty occurred.
          </text>
          <text x={W / 2} y={instructionY2} fontSize={10} textAnchor="middle" fill="#0f172a">
            Use time standard of home terminal.
          </text>

          {/* Bottom recap table (70/8 + 60/7 + 34h restart) */}
          <rect x={M} y={recapTableY} width={W - 2 * M} height={recapTableH} fill="white" stroke="#0f172a" />

          <text x={M + 10} y={recapTableY + 18} fontSize={10} fontWeight={800} fill="#0f172a">
            Recap:
          </text>
          <text x={M + 10} y={recapTableY + 32} fontSize={9} fill="#0f172a">
            Complete at end of day
          </text>

          {/* Column headings */}
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

          {/* Left row: on duty today */}
          <text x={M + 10} y={recapTableY + 64} fontSize={9} fill="#0f172a">
            On duty hours today,
          </text>
          <text x={M + 10} y={recapTableY + 78} fontSize={9} fill="#0f172a">
            Total lines:
          </text>

          {/* A/B/C blocks for 70/8 */}
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

          {/* A/B/C blocks for 60/7 */}
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

          {/* 34-hour restart note block */}
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

          {/* Footer recap */}
          <text x={M} y={footerY} fontSize={11} fill="#334155">
            Recap: driving + on-duty = {(props.log.totalHours.driving + props.log.totalHours.onDuty).toFixed(1)} hours · Totals must equal 24 hours.
          </text>
        </svg>
      </div>
    </div>
  )
}

