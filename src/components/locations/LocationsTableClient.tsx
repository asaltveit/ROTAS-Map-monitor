'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import DeleteLocationButton from '@/components/locations/DeleteLocationButton'
import {
  getCoordinatePreviewLink,
  getRotasMapLink,
  getRotasMapLinkTitle,
} from '@/lib/locations/mapLinks'
import type { Location } from '@/lib/locations/types'

export function formatCoord(value: number | null): string {
  if (value == null) return '—'
  return value.toFixed(4)
}

export function coordsDiffer(location: Location): boolean {
  if (
    location.original_latitude == null ||
    location.original_longitude == null ||
    location.latitude == null ||
    location.longitude == null
  ) {
    return false
  }

  return (
    Number(location.original_latitude) !== Number(location.latitude) ||
    Number(location.original_longitude) !== Number(location.longitude)
  )
}

type OverlapFilter = 'all' | 'offset' | 'same'

type LocationsTableClientProps = {
  locations: Location[]
}

export default function LocationsTableClient({
  locations,
}: LocationsTableClientProps) {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [overlapFilter, setOverlapFilter] = useState<OverlapFilter>('all')

  const locationTypes = useMemo(() => {
    const types = new Set<string>()
    for (const location of locations) {
      if (location.location_type) {
        types.add(location.location_type)
      }
    }
    return [...types].sort()
  }, [locations])

  const filteredLocations = useMemo(() => {
    const query = search.trim().toLowerCase()

    return locations.filter((location) => {
      if (typeFilter && location.location_type !== typeFilter) {
        return false
      }

      const differs = coordsDiffer(location)
      if (overlapFilter === 'offset' && !differs) {
        return false
      }
      if (overlapFilter === 'same' && differs) {
        return false
      }

      if (!query) {
        return true
      }

      const haystack = [
        String(location.id),
        location.place,
        location.location,
        location.text,
        location.first_word,
        location.shelfmark,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return haystack.includes(query)
    })
  }, [locations, search, typeFilter, overlapFilter])

  if (locations.length === 0) {
    return (
      <p className="rounded-lg bg-white p-6 text-sm text-gray-500 shadow-sm ring-1 ring-gray-200">
        No locations yet.{' '}
        <Link href="/private/locations/new" className="text-indigo-600 hover:underline">
          Add the first location
        </Link>
        .
      </p>
    )
  }

  const isFiltered = filteredLocations.length !== locations.length

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-4 rounded-lg bg-white p-4 shadow-sm ring-1 ring-gray-200">
        <div className="min-w-[200px] flex-1">
          <label htmlFor="location-search" className="block text-xs font-medium text-gray-500">
            Search
          </label>
          <input
            id="location-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ID, place, text, shelfmark…"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="type-filter" className="block text-xs font-medium text-gray-500">
            Type
          </label>
          <select
            id="type-filter"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="mt-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">All types</option>
            {locationTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="overlap-filter" className="block text-xs font-medium text-gray-500">
            Overlap
          </label>
          <select
            id="overlap-filter"
            value={overlapFilter}
            onChange={(e) => setOverlapFilter(e.target.value as OverlapFilter)}
            className="mt-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="all">All</option>
            <option value="offset">Display offset</option>
            <option value="same">Same as original</option>
          </select>
        </div>
      </div>

      {isFiltered && (
        <p className="text-sm text-blue-100">
          Showing {filteredLocations.length} of {locations.length} locations
        </p>
      )}

      <div className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500">ID</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Type</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Place</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Original coords</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Display coords</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Years</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Map</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredLocations.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    No locations match your filters.
                  </td>
                </tr>
              ) : (
                filteredLocations.map((location) => {
                  const displayLat = location.latitude ?? location.original_latitude
                  const displayLng = location.longitude ?? location.original_longitude

                  return (
                    <tr key={location.id}>
                      <td className="px-4 py-3">{location.id}</td>
                      <td className="px-4 py-3 capitalize">
                        {location.location_type ?? '—'}
                      </td>
                      <td className="px-4 py-3">
                        {location.place ?? location.location ?? '—'}
                      </td>
                      <td className="px-4 py-3">
                        {formatCoord(location.original_latitude)},{' '}
                        {formatCoord(location.original_longitude)}
                      </td>
                      <td className="px-4 py-3">
                        {coordsDiffer(location)
                          ? `${formatCoord(location.latitude)}, ${formatCoord(location.longitude)}`
                          : 'Same as original'}
                      </td>
                      <td className="px-4 py-3">
                        {location.created_year_start ?? '—'}
                        {location.created_year_end
                          ? `–${location.created_year_end}`
                          : ''}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <a
                            href={getRotasMapLink(location)}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={getRotasMapLinkTitle(location)}
                            className="text-indigo-600 hover:underline"
                          >
                            ROTAS Map
                          </a>
                          {displayLat != null && displayLng != null && (
                            <a
                              href={getCoordinatePreviewLink(
                                Number(displayLat),
                                Number(displayLng),
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-500 hover:underline"
                            >
                              Coords
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <DeleteLocationButton location={location} />
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
