export const MAP_RESPONSE_DEGRADED_MS = 3000
export const COUNT_DRIFT_THRESHOLD = 0.05

export type CheckStatus = 'healthy' | 'degraded' | 'down'
export type AlertSeverity = 'warning' | 'critical'

export type MonitorCheckResult = {
  status: CheckStatus
  map_http_status: number | null
  map_response_ms: number | null
  locations_count: number | null
  locations_missing_coords: number | null
  locations_invalid_years: number | null
  locations_overlap_clusters: number | null
  rpc_ok: boolean | null
  details: Record<string, unknown>
  error_message: string | null
  alerts: Array<{
    severity: AlertSeverity
    alert_type: string
    message: string
  }>
}
