import type { Metadata } from 'next'
import LocationForm from '@/components/locations/LocationForm'
import { requireAuth } from '@/lib/auth/getUserProfile'

export const metadata: Metadata = {
  title: 'Add Location',
  description: 'Add a new ROTAS Map location',
}

export default async function NewLocationPage() {
  await requireAuth()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Add location</h1>
        <p className="mt-1 text-sm text-blue-100">
          New entries appear on the public ROTAS Map after coordinates are
          adjusted for overlap.
        </p>
      </div>
      <LocationForm />
    </div>
  )
}
