import { createClient } from '@/utils/supabase/server'
import {
  clusterKey,
  computeDisplayUpdates,
} from '@/lib/locations/adjustDisplayCoordinates'
import type { Location } from '@/lib/locations/types'

export async function fetchClusterMembers(
  originalLat: number,
  originalLng: number,
): Promise<Location[]> {
  const supabase = await createClient()
  const key = clusterKey(originalLat, originalLng)

  const { data, error } = await supabase
    .from('locations')
    .select(
      'id, original_latitude, original_longitude, latitude, longitude, location_type, created_year_start, created_year_end, discovered_year, script, text, place, location, first_word, shelfmark, created_by, updated_at',
    )
    .not('original_latitude', 'is', null)
    .not('original_longitude', 'is', null)

  if (error) {
    throw new Error(`Failed to fetch cluster members: ${error.message}`)
  }

  return (data ?? []).filter((row) => {
    if (row.original_latitude == null || row.original_longitude == null) {
      return false
    }
    return (
      clusterKey(Number(row.original_latitude), Number(row.original_longitude)) ===
      key
    )
  }) as Location[]
}

export async function recomputeClusterDisplayCoords(
  originalLat: number,
  originalLng: number,
): Promise<void> {
  const members = await fetchClusterMembers(originalLat, originalLng)

  if (members.length === 0) {
    return
  }

  const updates = computeDisplayUpdates(
    members.map((m) => ({
      id: m.id,
      original_latitude: Number(m.original_latitude),
      original_longitude: Number(m.original_longitude),
    })),
    originalLat,
    originalLng,
  )

  const supabase = await createClient()

  for (const update of updates) {
    const { error } = await supabase
      .from('locations')
      .update({
        latitude: update.latitude,
        longitude: update.longitude,
        updated_at: new Date().toISOString(),
      })
      .eq('id', update.id)

    if (error) {
      throw new Error(`Failed to update display coordinates: ${error.message}`)
    }
  }
}
