import { NextRequest } from 'next/server'
import { describe, expect, it } from 'vitest'
import { updateSession } from '@/utils/supabase/middleware'

describe('session gate', () => {
  it('redirects unauthenticated users away from private routes', async () => {
    const request = new NextRequest('http://localhost/private/dashboard')
    const response = await updateSession(request)
    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toContain('/login')
  })

  it('allows public login route without session', async () => {
    const request = new NextRequest('http://localhost/login')
    const response = await updateSession(request)
    expect(response.status).toBe(200)
  })

  it('allows monitor cron route without session', async () => {
    const request = new NextRequest('http://localhost/api/monitor/run')
    const response = await updateSession(request)
    expect(response.status).toBe(200)
  })
})
