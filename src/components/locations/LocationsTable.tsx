import Link from 'next/link'
import { deleteLocation } from '@/app/private/locations/actions'
import type { Location } from '@/lib/locations/types'

function formatCoord(value: number | null): string {
  if (value == null) return '—'
  return value.toFixed(4)
}

function coordsDiffer(location: Location): boolean {
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

export default function LocationsTable({
  locations,
}: {
  locations: Location[]
}) {
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

  return (
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
              <th className="px-4 py-3 text-left font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {locations.map((location) => (
              <tr key={location.id}>
                <td className="px-4 py-3">{location.id}</td>
                <td className="px-4 py-3 capitalize">
                  {location.location_type ?? '—'}
                </td>
                <td className="px-4 py-3">{location.place ?? location.location ?? '—'}</td>
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
                  <form action={deleteLocation}>
                    <input type="hidden" name="id" value={location.id} />
                    <button
                      type="submit"
                      className="rounded-md bg-red-100 px-3 py-1 text-xs font-semibold text-red-800 hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
