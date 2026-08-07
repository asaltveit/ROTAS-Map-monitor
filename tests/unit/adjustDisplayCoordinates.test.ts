import { describe, expect, it } from 'vitest'
import {
  clusterKey,
  computeDisplayUpdates,
  displayCoordsForIndex,
} from '@/lib/locations/adjustDisplayCoordinates'

describe('adjustDisplayCoordinates', () => {
  it('builds stable cluster keys', () => {
    expect(clusterKey(41.9028, 12.4964)).toBe('41.9028,12.4964')
  })

  it('keeps index 0 at original coordinates', () => {
    expect(displayCoordsForIndex(10, 20, 0)).toEqual({
      latitude: 10,
      longitude: 20,
    })
  })

  it('offsets index 1 on the first ring', () => {
    const coords = displayCoordsForIndex(0, 0, 1)
    expect(coords.latitude).toBeCloseTo(0.15, 4)
    expect(coords.longitude).toBeCloseTo(0, 4)
  })

  it('sorts members by id when computing display updates', () => {
    const updates = computeDisplayUpdates(
      [
        { id: 2, original_latitude: 1, original_longitude: 2 },
        { id: 1, original_latitude: 1, original_longitude: 2 },
      ],
      1,
      2,
    )

    expect(updates.map((entry) => entry.id)).toEqual([1, 2])
    expect(updates[0].latitude).toBe(1)
    expect(updates[1].latitude).not.toBe(1)
  })
})
