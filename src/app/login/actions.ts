'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { requireAdmin, requireAuth } from '@/lib/auth/getUserProfile'
import { createAdminClient } from '@/utils/supabase/admin'

export type AuthActionState = {
  error?: string
  success?: string
}

export async function login(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const supabase = await createClient()
  const email = formData.get('email')
  const password = formData.get('password')

  if (typeof email !== 'string' || typeof password !== 'string') {
    return { error: 'Email and password are required' }
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/private', 'layout')
  redirect('/private/dashboard')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/login', 'layout')
  redirect('/login')
}

export async function emailForPassword(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = formData.get('email')

  if (typeof email !== 'string' || email.trim() === '') {
    return { error: 'Email is required' }
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${appUrl}/reset-password/set_password`,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: 'Check your email for a password reset link' }
}

export async function resetPassword(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const password = formData.get('password')

  if (typeof password !== 'string' || password.length < 8) {
    return { error: 'Password must be at least 8 characters' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/login', 'layout')
  redirect('/login')
}

export async function inviteUser(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  await requireAdmin()

  const email = formData.get('email')
  const role = formData.get('role')

  if (typeof email !== 'string' || email.trim() === '') {
    return { error: 'Email is required' }
  }

  if (role !== 'editor' && role !== 'admin') {
    return { error: 'Role must be editor or admin' }
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const admin = createAdminClient()

  const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${appUrl}/login`,
  })

  if (error || !data.user) {
    return { error: error?.message ?? 'Failed to invite user' }
  }

  const { error: profileError } = await admin.from('user_profiles').insert({
    user_id: data.user.id,
    role,
  })

  if (profileError) {
    return { error: profileError.message }
  }

  revalidatePath('/private/admin')
  return { success: `Invited ${email} as ${role}` }
}

export async function removeUser(formData: FormData): Promise<void> {
  await requireAdmin()

  const email = formData.get('email')

  if (typeof email !== 'string' || email.trim() === '') {
    redirect('/private/admin/remove-user?error=Email+is+required')
  }

  const admin = createAdminClient()
  const { data: users, error: listError } = await admin.auth.admin.listUsers()

  if (listError) {
    redirect('/private/admin/remove-user?error=Failed+to+list+users')
  }

  const user = users.users.find(
    (entry) => entry.email?.toLowerCase() === email.toLowerCase(),
  )

  if (!user) {
    redirect('/private/admin/remove-user?error=User+not+found')
  }

  const { error: deleteError } = await admin.auth.admin.deleteUser(user.id)

  if (deleteError) {
    redirect('/private/admin/remove-user?error=Failed+to+remove+user')
  }

  revalidatePath('/private/admin')
  redirect('/private/admin/remove-user?success=User+removed')
}

export async function acknowledgeAlert(formData: FormData): Promise<void> {
  const profile = await requireAuth()
  const alertId = formData.get('alertId')

  if (typeof alertId !== 'string') {
    redirect('/private/dashboard?error=Invalid+alert')
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from('monitor_alerts')
    .update({
      acknowledged_at: new Date().toISOString(),
      acknowledged_by: profile.user_id,
    })
    .eq('id', alertId)
    .is('acknowledged_at', null)

  if (error) {
    redirect('/private/dashboard?error=Failed+to+acknowledge+alert')
  }

  revalidatePath('/private/dashboard')
  redirect('/private/dashboard')
}

export async function updateUserRole(formData: FormData): Promise<void> {
  const currentProfile = await requireAdmin()

  const userId = formData.get('userId')
  const role = formData.get('role')

  if (typeof userId !== 'string' || userId.trim() === '') {
    redirect('/private/admin/manage-users?error=Invalid+user')
  }

  if (role !== 'editor' && role !== 'admin') {
    redirect('/private/admin/manage-users?error=Role+must+be+editor+or+admin')
  }

  if (userId === currentProfile.user_id) {
    redirect('/private/admin/manage-users?error=You+cannot+change+your+own+role')
  }

  const admin = createAdminClient()

  const { data: targetProfile, error: profileError } = await admin
    .from('user_profiles')
    .select('user_id, role')
    .eq('user_id', userId)
    .maybeSingle()

  if (profileError || !targetProfile) {
    redirect('/private/admin/manage-users?error=User+not+found')
  }

  if (targetProfile.role === 'admin' && role === 'editor') {
    const { count, error: countError } = await admin
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'admin')

    if (countError) {
      redirect('/private/admin/manage-users?error=Failed+to+verify+admin+count')
    }

    if (count != null && count <= 1) {
      redirect('/private/admin/manage-users?error=Cannot+demote+the+last+admin')
    }
  }

  const { error: updateError } = await admin
    .from('user_profiles')
    .update({ role })
    .eq('user_id', userId)

  if (updateError) {
    redirect('/private/admin/manage-users?error=Failed+to+update+role')
  }

  revalidatePath('/private/admin/manage-users')
  redirect('/private/admin/manage-users?success=Role+updated')
}

export async function runCheckNow(): Promise<void> {
  await requireAdmin()

  const { persistMonitorCheck, runMonitorChecks } = await import(
    '@/lib/monitor/runChecks'
  )
  const result = await runMonitorChecks()
  await persistMonitorCheck(result)

  revalidatePath('/private/dashboard')
  redirect('/private/dashboard')
}
