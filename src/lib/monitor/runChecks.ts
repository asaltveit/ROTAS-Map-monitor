import {
  clusterKey,
  computeDisplayUpdates,
} from '@/lib/locations/adjustDisplayCoordinates'
import { createAdminClient } from '@/utils/supabase/admin'
import type { SupabaseClient } from '@supabase/supabase-js'
import {
  COUNT_DRIFT_THRESHOLD,
  MAP_RESPONSE_DEGRADED_MS,
  type MonitorCheckResult,
} from './thresholds'

const ROTAS_MAP_URL =
  process.env.ROTAS_MAP_URL ?? 'https://rotas-squares-map.vercel.app'

const COORD_TOLERANCE = 1e-4

const RPC_NAMES = [
  'get_distinct_type',
  'get_distinct_script',
  'get_distinct_location',
  'get_distinct_text',
  'get_distinct_place',
  'get_distinct_first_word',
] as const

const FILTER_RPC_NAMES = RPC_NAMES.filter((name) => name !== 'get_distinct_type')

type LocationRow = {
  id: number
  latitude: number | null
  longitude: number | null
  original_latitude: number | null
  original_longitude: number | null
  location_type: string | null
  created_year_start: number | null
  created_year_end: number | null
}

type RpcResult = {
  ok: boolean
  error: string | null
}

async function checkMapUptime(): Promise<{
  status: number | null
  responseMs: number | null
  error: string | null
}> {
  const start = Date.now()
  try {
    const response = await fetch(ROTAS_MAP_URL, {
      method: 'GET',
      cache: 'no-store',
    })
    return {
      status: response.status,
      responseMs: Date.now() - start,
      error: null,
    }
  } catch (error) {
    return {
      status: null,
      responseMs: Date.now() - start,
      error: error instanceof Error ? error.message : 'Map fetch failed',
    }
  }
}

export async function runRpcSmokeTests(
  supabase: SupabaseClient,
): Promise<{ rpcOk: boolean; rpcResults: Record<string, RpcResult> }> {
  const results = await Promise.all(
    RPC_NAMES.map(async (name) => {
      const { data, error } = await supabase.rpc(name)
      const ok = !error && Array.isArray(data)
      return [
        name,
        {
          ok,
          error: error?.message ?? (ok ? null : `${name} returned no data`),
        },
      ] as const
    }),
  )

  const rpcResults = Object.fromEntries(results) as Record<string, RpcResult>
  const rpcOk = results.every(([, result]) => result.ok)

  return { rpcOk, rpcResults }
}

export function checkOverlapIntegrity(rows: LocationRow[]): {
  mismatchCount: number
  sampleIds: number[]
} {
  const clusters = new Map<string, LocationRow[]>()

  for (const row of rows) {
    if (row.original_latitude == null || row.original_longitude == null) {
      continue
    }
    const key = clusterKey(
      Number(row.original_latitude),
      Number(row.original_longitude),
    )
    const members = clusters.get(key) ?? []
    members.push(row)
    clusters.set(key, members)
  }

  const mismatchedIds: number[] = []

  for (const members of clusters.values()) {
    if (members.length <= 1) {
      continue
    }

    const originalLat = Number(members[0].original_latitude)
    const originalLng = Number(members[0].original_longitude)
    const expected = computeDisplayUpdates(
      members.map((m) => ({
        id: m.id,
        original_latitude: originalLat,
        original_longitude: originalLng,
      })),
      originalLat,
      originalLng,
    )

    for (const update of expected) {
      const row = members.find((m) => m.id === update.id)
      if (!row || row.latitude == null || row.longitude == null) {
        mismatchedIds.push(update.id)
        continue
      }

      const latDiff = Math.abs(Number(row.latitude) - update.latitude)
      const lngDiff = Math.abs(Number(row.longitude) - update.longitude)

      if (latDiff > COORD_TOLERANCE || lngDiff > COORD_TOLERANCE) {
        mismatchedIds.push(update.id)
      }
    }
  }

  return {
    mismatchCount: mismatchedIds.length,
    sampleIds: mismatchedIds.slice(0, 10),
  }
}

export async function runMonitorChecks(): Promise<MonitorCheckResult> {
  const supabase = createAdminClient()
  const alerts: MonitorCheckResult['alerts'] = []
  const details: Record<string, unknown> = {}

  const mapCheck = await checkMapUptime()
  details.map = mapCheck

  if (mapCheck.error || mapCheck.status !== 200) {
    alerts.push({
      severity: 'critical',
      alert_type: 'map_down',
      message: mapCheck.error ?? `ROTAS Map returned HTTP ${mapCheck.status}`,
    })
  } else if (
    mapCheck.responseMs != null &&
    mapCheck.responseMs > MAP_RESPONSE_DEGRADED_MS
  ) {
    alerts.push({
      severity: 'warning',
      alert_type: 'slow_response',
      message: `ROTAS Map responded in ${mapCheck.responseMs}ms`,
    })
  }

  const { count: locationsCount, error: countError } = await supabase
    .from('locations')
    .select('*', { count: 'exact', head: true })

  if (countError) {
    alerts.push({
      severity: 'critical',
      alert_type: 'supabase_error',
      message: `Failed to count locations: ${countError.message}`,
    })
  }

  const { data: locations, error: locationsError } = await supabase
    .from('locations')
    .select(
      'id, latitude, longitude, original_latitude, original_longitude, location_type, created_year_start, created_year_end',
    )

  if (locationsError) {
    alerts.push({
      severity: 'critical',
      alert_type: 'supabase_error',
      message: `Failed to read locations: ${locationsError.message}`,
    })
  }

  const rows = (locations ?? []) as LocationRow[]
  const missingCoords = rows.filter(
    (row) => row.latitude == null || row.longitude == null,
  ).length
  const missingOriginals = rows.filter(
    (row) => row.original_latitude == null || row.original_longitude == null,
  ).length
  const invalidYears = rows.filter(
    (row) =>
      row.created_year_end != null &&
      row.created_year_start != null &&
      row.created_year_end < row.created_year_start,
  ).length
  const missingType = rows.filter(
    (row) => !row.location_type || row.location_type.trim() === '',
  ).length

  if (missingCoords > 0) {
    alerts.push({
      severity: 'warning',
      alert_type: 'missing_coords',
      message: `${missingCoords} location(s) missing display coordinates`,
    })
  }

  if (missingOriginals > 0) {
    alerts.push({
      severity: 'warning',
      alert_type: 'missing_original_coords',
      message: `${missingOriginals} location(s) missing original coordinates`,
    })
  }

  if (invalidYears > 0) {
    alerts.push({
      severity: 'warning',
      alert_type: 'invalid_years',
      message: `${invalidYears} location(s) have invalid year ranges`,
    })
  }

  if (missingType > 0) {
    alerts.push({
      severity: 'warning',
      alert_type: 'missing_type',
      message: `${missingType} location(s) missing location type`,
    })
  }

  const clusterCounts = new Map<string, number>()
  for (const row of rows) {
    if (row.original_latitude == null || row.original_longitude == null) {
      continue
    }
    const key = clusterKey(
      Number(row.original_latitude),
      Number(row.original_longitude),
    )
    clusterCounts.set(key, (clusterCounts.get(key) ?? 0) + 1)
  }

  const overlapClusters = [...clusterCounts.values()].filter(
    (count) => count > 1,
  ).length

  const overlapIntegrity = checkOverlapIntegrity(rows)
  if (overlapIntegrity.mismatchCount > 0) {
    alerts.push({
      severity: 'warning',
      alert_type: 'overlap_mismatch',
      message: `${overlapIntegrity.mismatchCount} location(s) have display coords out of sync with overlap layout`,
    })
  }

  const { rpcOk, rpcResults } = await runRpcSmokeTests(supabase)
  details.rpcs = rpcResults
  details.overlapIntegrity = overlapIntegrity

  const typeRpc = rpcResults.get_distinct_type
  if (!typeRpc?.ok) {
    alerts.push({
      severity: 'critical',
      alert_type: 'rpc_failed',
      message:
        typeRpc?.error ?? 'get_distinct_type RPC returned no data',
    })
  }

  const failedFilterRpcs = FILTER_RPC_NAMES.filter(
    (name) => !rpcResults[name]?.ok,
  )
  if (failedFilterRpcs.length > 0) {
    alerts.push({
      severity: 'warning',
      alert_type: 'filter_rpc_failed',
      message: `${failedFilterRpcs.length} filter RPC(s) failed: ${failedFilterRpcs.join(', ')}`,
    })
  }

  const { data: lastHealthy } = await supabase
    .from('monitor_checks')
    .select('locations_count')
    .eq('status', 'healthy')
    .order('checked_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (
    lastHealthy?.locations_count != null &&
    locationsCount != null &&
    lastHealthy.locations_count > 0
  ) {
    const drop =
      (lastHealthy.locations_count - locationsCount) /
      lastHealthy.locations_count
    if (drop > COUNT_DRIFT_THRESHOLD) {
      alerts.push({
        severity: 'warning',
        alert_type: 'count_drop',
        message: `Location count dropped from ${lastHealthy.locations_count} to ${locationsCount}`,
      })
    }
  }

  details.dataQuality = {
    missingCoords,
    missingOriginals,
    invalidYears,
    missingType,
    overlapClusters,
  }

  let status: MonitorCheckResult['status'] = 'healthy'
  if (
    alerts.some((a) => a.severity === 'critical') ||
    mapCheck.error ||
    mapCheck.status !== 200 ||
    countError ||
    locationsError
  ) {
    status = 'down'
  } else if (alerts.length > 0) {
    status = 'degraded'
  }

  return {
    status,
    map_http_status: mapCheck.status,
    map_response_ms: mapCheck.responseMs,
    locations_count: locationsCount,
    locations_missing_coords: missingCoords,
    locations_invalid_years: invalidYears,
    locations_overlap_clusters: overlapClusters,
    rpc_ok: rpcOk,
    details,
    error_message: mapCheck.error ?? countError?.message ?? locationsError?.message ?? null,
    alerts,
  }
}

export async function persistMonitorCheck(
  result: MonitorCheckResult,
): Promise<number> {
  const supabase = createAdminClient()

  const { data: check, error: checkError } = await supabase
    .from('monitor_checks')
    .insert({
      status: result.status,
      map_http_status: result.map_http_status,
      map_response_ms: result.map_response_ms,
      locations_count: result.locations_count,
      locations_missing_coords: result.locations_missing_coords,
      locations_invalid_years: result.locations_invalid_years,
      locations_overlap_clusters: result.locations_overlap_clusters,
      rpc_ok: result.rpc_ok,
      details: result.details,
      error_message: result.error_message,
    })
    .select('id')
    .single()

  if (checkError || !check) {
    throw new Error(checkError?.message ?? 'Failed to save monitor check')
  }

  if (result.alerts.length > 0) {
    const { error: alertsError } = await supabase.from('monitor_alerts').insert(
      result.alerts.map((alert) => ({
        check_id: check.id,
        severity: alert.severity,
        alert_type: alert.alert_type,
        message: alert.message,
      })),
    )

    if (alertsError) {
      throw new Error(alertsError.message)
    }
  }

  return check.id
}
