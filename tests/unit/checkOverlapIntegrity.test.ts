import { describe, expect, it } from 'vitest'
import { checkOverlapIntegrity } from '@/lib/monitor/runChecks'
import { computeDisplayUpdates } from '@/lib/locations/adjustDisplayCoordinates'

describe('checkOverlapIntegrity', () => {
  it('reports no mismatches for a single-member cluster', () => {
    const result = checkOverlapIntegrity([
      {
        id: 1,
        latitude: 41.9,
        longitude: 12.4,
        original_latitude: 41.9,
        original_longitude: 12.4,
        location_type: 'inscription',
        created_year_start: 100,
        created_year_end: 200,
      },
    ])

    expect(result.mismatchCount).toBe(0)
  })

  it('reports mismatches when display coords drift from expected layout', () => {
    const members = [
      {
        id: 1,
        original_latitude: 41.9028,
        original_longitude: 12.4964,
      },
      {
        id: 2,
        original_latitude: 41.9028,
        original_longitude: 12.4964,
      },
    ]
    const expected = computeDisplayUpdates(members, 41.9028, 12.4964)

    const result = checkOverlapIntegrity([
      {
        id: 1,
        latitude: expected[0].latitude,
        longitude: expected[0].longitude,
        original_latitude: 41.9028,
        original_longitude: 12.4964,
        location_type: 'inscription',
        created_year_start: 100,
        created_year_end: 200,
      },
      {
        id: 2,
        latitude: 41.9028,
        longitude: 12.4964,
        original_latitude: 41.9028,
        original_longitude: 12.4964,
        location_type: 'graffito',
        created_year_start: 150,
        created_year_end: 250,
      },
    ])

    expect(result.mismatchCount).toBe(1)
    expect(result.sampleIds).toContain(2)
  })
})
