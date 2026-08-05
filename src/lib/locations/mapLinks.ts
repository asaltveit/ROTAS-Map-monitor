import type { Location } from '@/lib/locations/types'

const DEFAULT_ROTAS_MAP_URL = 'https://rotas-squares-map.vercel.app'

export function getRotasMapLink(_location: Location): string {
  return process.env.NEXT_PUBLIC_ROTAS_MAP_URL ?? DEFAULT_ROTAS_MAP_URL
}

export function getRotasMapLinkTitle(location: Location): string {
  const place = location.place ?? location.location ?? 'Unknown place'
  const lat = location.latitude ?? location.original_latitude
  const lng = location.longitude ?? location.original_longitude
  const coords =
    lat != null && lng != null
      ? `display ${Number(lat).toFixed(4)}, ${Number(lng).toFixed(4)}`
      : 'coordinates unavailable'
  return `Location #${location.id} — ${place} (${coords})`
}

export function getCoordinatePreviewLink(lat: number, lng: number): string {
  return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=6/${lat}/${lng}`
}
