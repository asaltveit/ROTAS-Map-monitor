import { describe, expect, it } from 'vitest'
import { parseLocationForm } from '@/lib/locations/parseLocationForm'

function form(entries: Record<string, string>): FormData {
  const formData = new FormData()
  for (const [key, value] of Object.entries(entries)) {
    formData.set(key, value)
  }
  return formData
}

const validBase = {
  original_latitude: '41.9028',
  original_longitude: '12.4964',
  location_type: 'inscription',
  created_year_start: '100',
}

describe('parseLocationForm', () => {
  it('parses a valid form', () => {
    const result = parseLocationForm(form(validBase))
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data.original_latitude).toBe(41.9028)
      expect(result.data.location_type).toBe('inscription')
    }
  })

  it('rejects missing latitude', () => {
    const result = parseLocationForm(
      form({ ...validBase, original_latitude: '' }),
    )
    expect(result).toEqual({ ok: false, error: 'Original latitude is required' })
  })

  it('rejects invalid latitude range', () => {
    const result = parseLocationForm(
      form({ ...validBase, original_latitude: '95' }),
    )
    expect(result).toEqual({
      ok: false,
      error: 'Latitude must be between -90 and 90',
    })
  })

  it('rejects invalid longitude range', () => {
    const result = parseLocationForm(
      form({ ...validBase, original_longitude: '200' }),
    )
    expect(result).toEqual({
      ok: false,
      error: 'Longitude must be between -180 and 180',
    })
  })

  it('rejects invalid location type', () => {
    const result = parseLocationForm(
      form({ ...validBase, location_type: 'invalid' }),
    )
    expect(result).toEqual({
      ok: false,
      error: 'A valid location type is required',
    })
  })

  it('rejects year end before year start', () => {
    const result = parseLocationForm(
      form({
        ...validBase,
        created_year_start: '200',
        created_year_end: '100',
      }),
    )
    expect(result).toEqual({
      ok: false,
      error: 'Created year end cannot be before created year start',
    })
  })
})
