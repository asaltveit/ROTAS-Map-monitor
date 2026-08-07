import { beforeEach, describe, expect, it } from 'vitest'
import {
  createAdminClient,
  createAnonClient,
  ensureTestUsers,
} from '../helpers/supabase'

describe('RLS policies', () => {
  beforeEach(async () => {
    await ensureTestUsers()
  })

  it('denies anonymous reads of monitor checks', async () => {
    const anon = createAnonClient()
    const { data, error } = await anon.from('monitor_checks').select('id').limit(1)
    expect(data ?? []).toEqual([])
    expect(error).toBeNull()
  })

  it('allows service role to read monitor checks', async () => {
    const admin = createAdminClient()
    const { error } = await admin.from('monitor_checks').select('id').limit(1)
    expect(error).toBeNull()
  })
})
