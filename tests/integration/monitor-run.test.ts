import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { GET, POST } from '@/app/api/monitor/run/route'
import {
  createAdminClient,
  ensureTestUsers,
  resetMonitorTables,
} from '../helpers/supabase'
import { startMapMock, stopMapMock } from '../helpers/mapMock'

describe('monitor run API', () => {
  beforeEach(async () => {
    process.env.CRON_SECRET = 'test-cron-secret'
    startMapMock()
    await ensureTestUsers()
    await resetMonitorTables()
  })

  afterEach(() => {
    stopMapMock()
  })

  it.each(['GET', 'POST'] as const)('rejects unauthorized %s requests', async (method) => {
    const request = new Request('http://localhost/api/monitor/run', { method })
    const response =
      method === 'GET' ? await GET(request) : await POST(request)
    expect(response.status).toBe(401)
  })

  it.each(['GET', 'POST'] as const)('runs monitor checks with valid bearer token', async (method) => {
    const request = new Request('http://localhost/api/monitor/run', {
      method,
      headers: { Authorization: 'Bearer test-cron-secret' },
    })
    const response =
      method === 'GET' ? await GET(request) : await POST(request)
    expect(response.status).toBe(200)

    const body = await response.json()
    expect(body.ok).toBe(true)
    expect(body.checkId).toBeTypeOf('number')

    const admin = createAdminClient()
    const { count } = await admin
      .from('monitor_checks')
      .select('*', { count: 'exact', head: true })
    expect(count).toBe(1)
  })
})
