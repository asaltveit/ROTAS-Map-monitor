'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import {
  addLocation,
  type ActionState,
} from '@/app/private/locations/actions'
import { LOCATION_TYPES } from '@/lib/locations/types'

const initialState: ActionState = {}

const inputClassName =
  'block w-full rounded-md border-0 py-1.5 ps-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'

export default function LocationForm() {
  const [state, formAction, pending] = useActionState(addLocation, initialState)

  return (
    <form action={formAction} className="mx-auto max-w-2xl space-y-6">
      {state.error && (
        <p className="rounded-md bg-red-100 px-3 py-2 text-sm text-red-800">
          {state.error}
        </p>
      )}

      <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Original coordinates
        </h2>
        <p className="mb-4 text-sm text-gray-600">
          Enter the true historical site location. If another inscription shares
          these coordinates, markers will be offset automatically on the public
          map while originals are preserved.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="original_latitude" className="block text-sm font-medium text-gray-700">
              Original latitude
            </label>
            <input
              id="original_latitude"
              name="original_latitude"
              type="number"
              step="any"
              required
              className={`${inputClassName} mt-1`}
            />
          </div>
          <div>
            <label htmlFor="original_longitude" className="block text-sm font-medium text-gray-700">
              Original longitude
            </label>
            <input
              id="original_longitude"
              name="original_longitude"
              type="number"
              step="any"
              required
              className={`${inputClassName} mt-1`}
            />
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Details</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="location_type" className="block text-sm font-medium text-gray-700">
              Type
            </label>
            <select
              id="location_type"
              name="location_type"
              required
              className={`${inputClassName} mt-1`}
            >
              <option value="">Select type</option>
              {LOCATION_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="created_year_start" className="block text-sm font-medium text-gray-700">
              Created year start
            </label>
            <input
              id="created_year_start"
              name="created_year_start"
              type="number"
              required
              className={`${inputClassName} mt-1`}
            />
          </div>
          <div>
            <label htmlFor="created_year_end" className="block text-sm font-medium text-gray-700">
              Created year end
            </label>
            <input
              id="created_year_end"
              name="created_year_end"
              type="number"
              className={`${inputClassName} mt-1`}
            />
          </div>
          <div>
            <label htmlFor="discovered_year" className="block text-sm font-medium text-gray-700">
              Discovered year
            </label>
            <input
              id="discovered_year"
              name="discovered_year"
              type="number"
              className={`${inputClassName} mt-1`}
            />
          </div>
          <div>
            <label htmlFor="script" className="block text-sm font-medium text-gray-700">
              Script
            </label>
            <input id="script" name="script" type="text" className={`${inputClassName} mt-1`} />
          </div>
          <div>
            <label htmlFor="first_word" className="block text-sm font-medium text-gray-700">
              First word
            </label>
            <input id="first_word" name="first_word" type="text" className={`${inputClassName} mt-1`} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="text" className="block text-sm font-medium text-gray-700">
              Text
            </label>
            <textarea id="text" name="text" rows={3} className={`${inputClassName} mt-1`} />
          </div>
          <div>
            <label htmlFor="place" className="block text-sm font-medium text-gray-700">
              Place
            </label>
            <input id="place" name="place" type="text" className={`${inputClassName} mt-1`} />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input id="location" name="location" type="text" className={`${inputClassName} mt-1`} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="shelfmark" className="block text-sm font-medium text-gray-700">
              Shelfmark
            </label>
            <input id="shelfmark" name="shelfmark" type="text" className={`${inputClassName} mt-1`} />
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
        >
          {pending ? 'Adding…' : 'Add location'}
        </button>
        <Link
          href="/private/locations"
          className="rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-300"
        >
          Cancel
        </Link>
      </div>
    </form>
  )
}
