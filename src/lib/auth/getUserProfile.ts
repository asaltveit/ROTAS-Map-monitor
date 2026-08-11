import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import type { UserProfile, UserRole } from './types'

export async function getUserProfile(): Promise<UserProfile | null> {
  const supabase = await createClient()

  let user
  try {
    const result = await supabase.auth.getUser()
    if (result.error || !result.data.user) {
      return null
    }
    user = result.data.user
  } catch {
    return null
  }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('user_id, role, created_at')
    .eq('user_id', user.id)
    .single()

  return profile as UserProfile | null
}

export async function requireAuth(): Promise<UserProfile> {
  const profile = await getUserProfile()

  if (!profile || !isAllowedRole(profile.role)) {
    redirect('/unauthorized')
  }

  return profile
}

export async function requireAdmin(): Promise<UserProfile> {
  const profile = await requireAuth()

  if (profile.role !== 'admin') {
    redirect('/unauthorized')
  }

  return profile
}

function isAllowedRole(role: UserRole): boolean {
  return role === 'editor' || role === 'admin'
}
