import { createClient, type SupabaseClient } from '@supabase/supabase-js'

export const TEST_PASSWORD = 'test-password-123'

export const TEST_USERS = {
  editor: {
    email: 'editor@test.local',
    role: 'editor' as const,
  },
  admin: {
    email: 'admin@test.local',
    role: 'admin' as const,
  },
  admin2: {
    email: 'admin2@test.local',
    role: 'admin' as const,
  },
}

function getSupabaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL ??
    process.env.API_URL ??
    'http://127.0.0.1:54321'
  )
}

function getServiceRoleKey(): string {
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SERVICE_ROLE_KEY
  if (!key) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for tests')
  }
  return key
}

function getAnonKey(): string {
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.ANON_KEY
  if (!key) {
    throw new Error('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is required for tests')
  }
  return key
}

export function createAdminClient(): SupabaseClient {
  return createClient(getSupabaseUrl(), getServiceRoleKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

export function createAnonClient(): SupabaseClient {
  return createClient(getSupabaseUrl(), getAnonKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

export async function isSupabaseAvailable(): Promise<boolean> {
  try {
    const admin = createAdminClient()
    const { error } = await admin.from('locations').select('id').limit(1)
    return !error
  } catch {
    return false
  }
}

export async function ensureTestUsers(): Promise<void> {
  const admin = createAdminClient()

  for (const user of Object.values(TEST_USERS)) {
    const { data: listed } = await admin.auth.admin.listUsers()
    const existing = listed?.users.find(
      (entry) => entry.email?.toLowerCase() === user.email.toLowerCase(),
    )

    let userId = existing?.id

    if (!userId) {
      const { data, error } = await admin.auth.admin.createUser({
        email: user.email,
        password: TEST_PASSWORD,
        email_confirm: true,
      })
      if (error || !data.user) {
        throw new Error(`Failed to create test user ${user.email}: ${error?.message}`)
      }
      userId = data.user.id
    }

    const { data: profile } = await admin
      .from('user_profiles')
      .select('user_id')
      .eq('user_id', userId)
      .maybeSingle()

    if (!profile) {
      const { error: profileError } = await admin.from('user_profiles').insert({
        user_id: userId,
        role: user.role,
      })
      if (profileError) {
        throw new Error(
          `Failed to create profile for ${user.email}: ${profileError.message}`,
        )
      }
    }
  }
}

export async function resetMonitorTables(): Promise<void> {
  const admin = createAdminClient()
  await admin.from('monitor_alerts').delete().neq('id', 0)
  await admin.from('monitor_checks').delete().neq('id', 0)
}

export async function signInTestUser(
  email: string,
): Promise<{ accessToken: string; refreshToken: string; userId: string }> {
  const client = createAnonClient()
  const { data, error } = await client.auth.signInWithPassword({
    email,
    password: TEST_PASSWORD,
  })

  if (error || !data.session || !data.user) {
    throw new Error(`Failed to sign in ${email}: ${error?.message}`)
  }

  return {
    accessToken: data.session.access_token,
    refreshToken: data.session.refresh_token,
    userId: data.user.id,
  }
}
