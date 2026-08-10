import { LOCATION_TYPES, type LocationInput, type LocationType } from '@/lib/locations/types'

export type ParsedLocationResult =
  | { ok: true; data: LocationInput }
  | { ok: false; error: string }

function parseOptionalString(value: FormDataEntryValue | null): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function parseOptionalInt(value: FormDataEntryValue | null): number | null {
  if (typeof value !== 'string' || value.trim() === '') return null
  const parsed = Number.parseInt(value, 10)
  return Number.isNaN(parsed) ? null : parsed
}

function parseFloatField(value: FormDataEntryValue | null): number | null {
  if (typeof value !== 'string' || value.trim() === '') return null
  const parsed = Number.parseFloat(value)
  return Number.isNaN(parsed) ? null : parsed
}

function parseRequiredFloat(
  value: FormDataEntryValue | null,
  fieldName: string,
):
  | { ok: false; error: string }
  | { ok: true; value: number } {
  const parsed = parseFloatField(value)

  if (typeof value === 'string' && value.trim() !== '' && parsed == null) {
    return { ok: false, error: `${fieldName} must be a valid number` }
  }

  if (parsed == null) {
    return { ok: false, error: `${fieldName} is required` }
  }

  return { ok: true, value: parsed }
}

export function parseLocationForm(formData: FormData): ParsedLocationResult {
  const latitudeResult = parseRequiredFloat(
    formData.get('original_latitude'),
    'Original latitude',
  )
  if (!latitudeResult.ok) {
    return latitudeResult
  }

  const longitudeResult = parseRequiredFloat(
    formData.get('original_longitude'),
    'Original longitude',
  )
  if (!longitudeResult.ok) {
    return longitudeResult
  }

  const original_latitude = latitudeResult.value
  const original_longitude = longitudeResult.value

  if (original_latitude < -90 || original_latitude > 90) {
    return { ok: false, error: 'Latitude must be between -90 and 90' }
  }

  if (original_longitude < -180 || original_longitude > 180) {
    return { ok: false, error: 'Longitude must be between -180 and 180' }
  }

  const location_type = formData.get('location_type') as string
  if (!LOCATION_TYPES.includes(location_type as LocationType)) {
    return { ok: false, error: 'A valid location type is required' }
  }

  const created_year_start = parseOptionalInt(formData.get('created_year_start'))
  if (created_year_start == null) {
    return { ok: false, error: 'Created year start is required' }
  }

  const created_year_end = parseOptionalInt(formData.get('created_year_end'))
  if (created_year_end != null && created_year_end < created_year_start) {
    return {
      ok: false,
      error: 'Created year end cannot be before created year start',
    }
  }

  return {
    ok: true,
    data: {
      original_latitude,
      original_longitude,
      location_type: location_type as LocationType,
      created_year_start,
      created_year_end,
      discovered_year: parseOptionalInt(formData.get('discovered_year')),
      script: parseOptionalString(formData.get('script')),
      text: parseOptionalString(formData.get('text')),
      place: parseOptionalString(formData.get('place')),
      location: parseOptionalString(formData.get('location')),
      first_word: parseOptionalString(formData.get('first_word')),
      shelfmark: parseOptionalString(formData.get('shelfmark')),
    },
  }
}
