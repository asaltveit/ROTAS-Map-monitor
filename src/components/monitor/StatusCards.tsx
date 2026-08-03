import Link from 'next/link'
import type { MonitorCheckResult } from '@/lib/monitor/thresholds'

type StatusCardsProps = {
  latestCheck: {
    status: MonitorCheckResult['status']
    checked_at: string
    map_response_ms: number | null
    locations_count: number | null
  } | null
  openAlertsCount: number
}

const statusStyles: Record<MonitorCheckResult['status'], string> = {
  healthy: 'bg-green-100 text-green-800',
  degraded: 'bg-yellow-100 text-yellow-800',
  down: 'bg-red-100 text-red-800',
}

export default function StatusCards({
  latestCheck,
  openAlertsCount,
}: StatusCardsProps) {
  const status = latestCheck?.status ?? 'down'

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-gray-200">
        <p className="text-sm text-gray-500">Overall status</p>
        <p className={`mt-2 inline-block rounded-full px-3 py-1 text-sm font-semibold capitalize ${statusStyles[status]}`}>
          {status}
        </p>
      </div>
      <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-gray-200">
        <p className="text-sm text-gray-500">Last check</p>
        <p className="mt-2 text-lg font-semibold text-gray-900">
          {latestCheck
            ? new Date(latestCheck.checked_at).toLocaleString()
            : 'Never'}
        </p>
      </div>
      <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-gray-200">
        <p className="text-sm text-gray-500">Map response</p>
        <p className="mt-2 text-lg font-semibold text-gray-900">
          {latestCheck?.map_response_ms != null
            ? `${latestCheck.map_response_ms} ms`
            : '—'}
        </p>
      </div>
      <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-gray-200">
        <p className="text-sm text-gray-500">Locations / open alerts</p>
        <p className="mt-2 text-lg font-semibold text-gray-900">
          {latestCheck?.locations_count ?? '—'} / {openAlertsCount}
        </p>
      </div>
      <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-gray-200 sm:col-span-2 xl:col-span-4">
        <div className="flex flex-wrap gap-3">
          <Link
            href="https://rotas-squares-map.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-amber-700 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-800"
          >
            Open ROTAS Map
          </Link>
          <Link
            href="/private/locations"
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Manage locations
          </Link>
        </div>
      </div>
    </div>
  )
}
