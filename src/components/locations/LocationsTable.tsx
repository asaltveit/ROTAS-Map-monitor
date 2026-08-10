import LocationsTableClient from '@/components/locations/LocationsTableClient'
import type { Location } from '@/lib/locations/types'

export default function LocationsTable({
  locations,
}: {
  locations: Location[]
}) {
  return <LocationsTableClient locations={locations} />
}
