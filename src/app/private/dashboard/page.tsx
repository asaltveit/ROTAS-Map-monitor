import type { Metadata } from 'next'
import AlertsTable from '@/components/monitor/AlertsTable'
import ChecksTable from '@/components/monitor/ChecksTable'
import RunCheckButton from '@/components/monitor/RunCheckButton'
import StatusCards from '@/components/monitor/StatusCards'
import { requireAuth } from '@/lib/auth/getUserProfile'
import { createClient } from '@/utils/supabase/server'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'ROTAS Map monitoring dashboard',
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const profile = await requireAuth()
  const params = await searchParams
  const supabase = await createClient()

  const [{ data: latestChecks }, { data: alerts }] = await Promise.all([
    supabase
      .from('monitor_checks')
      .select(
        'id, checked_at, status, map_http_status, map_response_ms, locations_count, rpc_ok',
      )
      .order('checked_at', { ascending: false })
      .limit(10),
    supabase
      .from('monitor_alerts')
      .select('id, severity, alert_type, message, acknowledged_at')
      .order('id', { ascending: false })
      .limit(20),
  ])

  const latestCheck = latestChecks?.[0] ?? null
  const openAlertsCount =
    alerts?.filter((alert) => !alert.acknowledged_at).length ?? 0

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
          <p className="mt-1 text-sm text-blue-100">
            Operational health and data quality for the ROTAS Map.
          </p>
        </div>
        {profile?.role === 'admin' && <RunCheckButton />}
      </div>

      {params.error && (
        <p className="rounded-md bg-red-100 px-3 py-2 text-sm text-red-800">
          {decodeURIComponent(params.error.replace(/\+/g, ' '))}
        </p>
      )}

      <StatusCards
        latestCheck={latestCheck}
        openAlertsCount={openAlertsCount}
      />
      <ChecksTable checks={latestChecks ?? []} />
      <AlertsTable alerts={alerts ?? []} />
    </div>
  )
}
