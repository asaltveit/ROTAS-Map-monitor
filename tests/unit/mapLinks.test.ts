import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Location } from '@/lib/locations/types'
import {
  getCoordinatePreviewLink,
  getRotasMapLink,
  getRotasMapLinkTitle,
} from '@/lib/locations/mapLinks'

describe('mapLinks', () => {
  const sampleLocation: Location = {
    id: 42,
    latitude: 41.9028,
    longitude: 12.4964,
    original_latitude: 41.9028,
    original_longitude: 12.4964,
    location_type: 'inscription',
    created_year_start: 100,
    created_year_end: 200,
    discovered_year: null,
    script: null,
    text: null,
    place: 'Rome',
    location: 'Forum',
    first_word: null,
    shelfmark: null,
    created_by: null,
    updated_at: null,
  }

  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_ROTAS_MAP_URL', 'https://test-map.example.com')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('uses env map URL when set', () => {
    expect(getRotasMapLink(sampleLocation)).toBe('https://test-map.example.com')
  })

  it('builds a descriptive link title', () => {
    expect(getRotasMapLinkTitle(sampleLocation)).toBe(
      'Location #42 — Rome (display 41.9028, 12.4964)',
    )
  })

  it('builds an OpenStreetMap preview link', () => {
    expect(getCoordinatePreviewLink(41.9028, 12.4964)).toBe(
      'https://www.openstreetmap.org/?mlat=41.9028&mlon=12.4964#map=6/41.9028/12.4964',
    )
  })
})
