import { useMemo } from 'react'
import { MapContainer, TileLayer, Polyline, CircleMarker, Tooltip } from 'react-leaflet'
import type { PlanResponse } from '../types'

export function MapView(props: { result: PlanResponse | null }) {
  const coords = useMemo(() => {
    const legs = props.result?.route.legs ?? []
    const all: Array<[number, number]> = []
    for (const leg of legs) {
      for (const [lon, lat] of leg.geometry.coordinates) {
        all.push([lat, lon])
      }
    }
    return all
  }, [props.result])

  const bounds = useMemo(() => {
    if (!coords.length) return undefined
    let minLat = coords[0][0]
    let maxLat = coords[0][0]
    let minLon = coords[0][1]
    let maxLon = coords[0][1]
    for (const [lat, lon] of coords) {
      minLat = Math.min(minLat, lat)
      maxLat = Math.max(maxLat, lat)
      minLon = Math.min(minLon, lon)
      maxLon = Math.max(maxLon, lon)
    }
    return [
      [minLat, minLon],
      [maxLat, maxLon],
    ] as [[number, number], [number, number]]
  }, [coords])

  const center: [number, number] = coords.length ? coords[Math.floor(coords.length / 2)] : [39.5, -98.35]

  return (
    <MapContainer
      center={center}
      zoom={coords.length ? 6 : 4}
      style={{ height: '100%', width: '100%' }}
      bounds={bounds}
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {coords.length ? (
        <>
          <Polyline positions={coords} pathOptions={{ color: '#4f46e5', weight: 5, opacity: 0.8 }} />

          <CircleMarker center={coords[0]} radius={7} pathOptions={{ color: '#0f172a', fillColor: '#22c55e', fillOpacity: 1 }}>
            <Tooltip direction="top" offset={[0, -8]} opacity={1}>
              Start
            </Tooltip>
          </CircleMarker>
          <CircleMarker
            center={coords[coords.length - 1]}
            radius={7}
            pathOptions={{ color: '#0f172a', fillColor: '#ef4444', fillOpacity: 1 }}
          >
            <Tooltip direction="top" offset={[0, -8]} opacity={1}>
              End
            </Tooltip>
          </CircleMarker>
        </>
      ) : null}
    </MapContainer>
  )
}

