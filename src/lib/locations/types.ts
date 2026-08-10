export const LOCATION_TYPES = [
  'graffito',
  'inscription',
  'amulet',
  'dipinto',
  'manuscript',
] as const

export type LocationType = (typeof LOCATION_TYPES)[number]

export type Location = {
  id: number
  latitude: number | null
  longitude: number | null
  original_latitude: number | null
  original_longitude: number | null
  location_type: string | null
  created_year_start: number | null
  created_year_end: number | null
  discovered_year: number | null
  script: string | null
  text: string | null
  place: string | null
  location: string | null
  first_word: string | null
  shelfmark: string | null
  created_by: string | null
  updated_at: string | null
}

export type LocationInput = {
  original_latitude: number
  original_longitude: number
  location_type: LocationType
  created_year_start: number
  created_year_end?: number | null
  discovered_year?: number | null
  script?: string | null
  text?: string | null
  place?: string | null
  location?: string | null
  first_word?: string | null
  shelfmark?: string | null
}
