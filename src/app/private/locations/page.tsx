import type { Metadata } from 'next'
import Link from 'next/link'
import LocationsTable from '@/components/locations/LocationsTable'
import { requireAuth } from '@/lib/auth/getUserProfile'
import type { Location } from '@/lib/locations/types'
import { createClient } from '@/utils/supabase/server'

export const metadata: Metadata = {
  title: 'Locations',
  description: 'Manage ROTAS Map locations',
}

export default async function LocationsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  await requireAuth()
  const params = await searchParams
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('locations')
    .select(
      'id, latitude, longitude, original_latitude, original_longitude, location_type, created_year_start, created_year_end, discovered_year, script, text, place, location, first_word, shelfmark, created_by, updated_at',
    )
    .order('id', { ascending: true })

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Locations</h1>
          <p className="mt-1 text-sm text-blue-100">
            Add and delete inscription locations on the ROTAS Map.
          </p>
        </div>
        <Link
          href="/private/locations/new"
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          Add location
        </Link>
      </div>

      {params.error && (
        <p className="rounded-md bg-red-100 px-3 py-2 text-sm text-red-800">
          {decodeURIComponent(params.error.replace(/\+/g, ' '))}
        </p>
      )}

      {error ? (
        <p className="rounded-md bg-red-100 px-3 py-2 text-sm text-red-800">
          Failed to load locations: {error.message}
        </p>
      ) : (
        <LocationsTable locations={(data ?? []) as Location[]} />
      )}
    </div>
  )
}
