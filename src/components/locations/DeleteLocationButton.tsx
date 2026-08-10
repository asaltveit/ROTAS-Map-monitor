'use client'

import { useState } from 'react'
import { deleteLocation } from '@/app/private/locations/actions'
import type { Location } from '@/lib/locations/types'

type DeleteLocationButtonProps = {
  location: Location
}

export default function DeleteLocationButton({
  location,
}: DeleteLocationButtonProps) {
  const [open, setOpen] = useState(false)
  const label = location.place ?? location.location ?? 'this location'

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md bg-red-100 px-3 py-1 text-xs font-semibold text-red-800 hover:bg-red-200"
      >
        Delete
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div
            className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-location-title"
          >
            <h2
              id="delete-location-title"
              className="text-lg font-semibold text-gray-900"
            >
              Delete location #{location.id}?
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              This will permanently remove <strong>{label}</strong> from the
              ROTAS Map database. Overlapping markers at the same site will be
              repositioned.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <form action={deleteLocation}>
                <input type="hidden" name="id" value={location.id} />
                <button
                  type="submit"
                  className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
                >
                  Delete
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
