import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { runMonitorChecks } from '@/lib/monitor/runChecks'
import {
  mockMapDown,
  mockMapSlow,
  resetMapMock,
  startMapMock,
  stopMapMock,
} from '../helpers/mapMock'

const mockFrom = vi.fn()
const mockRpc = vi.fn()

vi.mock('@/utils/supabase/admin', () => ({
  createAdminClient: () => ({
    from: mockFrom,
    rpc: mockRpc,
  }),
}))

const sampleLocations = [
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
  {
    id: 2,
    latitude: null,
    longitude: null,
    original_latitude: 48.8,
    original_longitude: 2.3,
    location_type: 'graffito',
    created_year_start: 100,
    created_year_end: 200,
  },
]

function mockLocationsTable() {
  mockFrom.mockImplementation((table: string) => {
    if (table === 'locations') {
      return {
        select: vi.fn((_cols?: string, opts?: { head?: boolean }) => {
          if (opts?.head) {
            return Promise.resolve({ count: sampleLocations.length, error: null })
          }
          return Promise.resolve({ data: sampleLocations, error: null })
        }),
      }
    }

    if (table === 'monitor_checks') {
      return {
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            order: vi.fn(() => ({
              limit: vi.fn(() => ({
                maybeSingle: vi.fn(() =>
                  Promise.resolve({ data: null, error: null }),
                ),
              })),
            })),
          })),
        })),
      }
    }

    return {
      select: vi.fn(() => Promise.resolve({ data: null, error: null })),
    }
  })
}

describe('runMonitorChecks', () => {
  beforeEach(() => {
    startMapMock()
    vi.clearAllMocks()
    mockLocationsTable()
    mockRpc.mockResolvedValue({ data: [], error: null })
  })

  afterEach(() => {
    resetMapMock()
    stopMapMock()
  })

  it('returns degraded when data quality warnings exist', async () => {
    const result = await runMonitorChecks()
    expect(result.status).toBe('degraded')
    expect(result.alerts.some((a) => a.alert_type === 'missing_coords')).toBe(
      true,
    )
  })

  it('marks map down when fetch fails', async () => {
    mockMapDown()
    const result = await runMonitorChecks()
    expect(result.status).toBe('down')
    expect(result.alerts.some((a) => a.alert_type === 'map_down')).toBe(true)
  })

  it('warns on slow map response', async () => {
    mockMapSlow()
    const result = await runMonitorChecks()
    expect(result.alerts.some((a) => a.alert_type === 'slow_response')).toBe(
      true,
    )
  })
})
