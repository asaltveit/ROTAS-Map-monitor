import { describe, expect, it } from 'vitest'
import type { Location } from '@/lib/locations/types'
import {
  coordsDiffer,
  formatCoord,
} from '@/components/locations/LocationsTableClient'

describe('LocationsTableClient helpers', () => {
  it('formats coordinates', () => {
    expect(formatCoord(null)).toBe('—')
    expect(formatCoord(41.9028)).toBe('41.9028')
  })

  it('detects when display coords differ from originals', () => {
    const offsetLocation: Location = {
      id: 1,
      latitude: 41.903,
      longitude: 12.497,
      original_latitude: 41.9028,
      original_longitude: 12.4964,
      location_type: 'inscription',
      created_year_start: 100,
      created_year_end: 200,
      discovered_year: null,
      script: null,
      text: null,
      place: null,
      location: null,
      first_word: null,
      shelfmark: null,
      created_by: null,
      updated_at: null,
    }

    expect(coordsDiffer(offsetLocation)).toBe(true)
    expect(
      coordsDiffer({
        ...offsetLocation,
        latitude: offsetLocation.original_latitude,
        longitude: offsetLocation.original_longitude,
      }),
    ).toBe(false)
  })
})
