import type { Metadata } from 'next'
import Nav from '@/components/ui/admin/Nav'
import RoleSelectForm from '@/components/ui/admin/RoleSelectForm'
import { requireAdmin } from '@/lib/auth/getUserProfile'
import { createAdminClient } from '@/utils/supabase/admin'
import { createClient } from '@/utils/supabase/server'

export const metadata: Metadata = {
  title: 'Manage Users',
  description: 'Change monitor user roles',
}

export default async function ManageUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>
}) {
  await requireAdmin()
  const params = await searchParams
  const admin = createAdminClient()
  const supabase = await createClient()

  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser()

  const { data: usersData, error: listError } = await admin.auth.admin.listUsers()
  const { data: profiles, error: profilesError } = await admin
    .from('user_profiles')
    .select('user_id, role')

  if (listError || profilesError) {
    return (
      <div className="space-y-4">
        <Nav />
        <p className="rounded-md bg-red-100 px-3 py-2 text-sm text-red-800">
          Failed to load users: {listError?.message ?? profilesError?.message}
        </p>
      </div>
    )
  }

  const profileByUserId = new Map(
    (profiles ?? []).map((entry) => [entry.user_id, entry.role]),
  )

  const users = (usersData?.users ?? [])
    .filter((user) => profileByUserId.has(user.id))
    .map((user) => ({
      id: user.id,
      email: user.email ?? '—',
      role: profileByUserId.get(user.id)!,
    }))
    .sort((a, b) => a.email.localeCompare(b.email))

  return (
    <div className="space-y-4">
      <Nav />
      <div>
        <h1 className="text-2xl font-semibold text-white">Manage users</h1>
        <p className="mt-1 text-sm text-blue-100">
          Change editor and admin roles for monitor users.
        </p>
      </div>

      {params.error && (
        <p className="rounded-md bg-red-100 px-3 py-2 text-sm text-red-800">
          {decodeURIComponent(params.error.replace(/\+/g, ' '))}
        </p>
      )}

      {params.success && (
        <p className="rounded-md bg-green-100 px-3 py-2 text-sm text-green-800">
          {decodeURIComponent(params.success.replace(/\+/g, ' '))}
        </p>
      )}

      <div className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Email</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Role</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3 capitalize">{user.role}</td>
                <td className="px-4 py-3">
                  <RoleSelectForm
                    userId={user.id}
                    currentRole={user.role}
                    isCurrentUser={user.id === currentUser?.id}
                  />
                  {user.id === currentUser?.id && (
                    <p className="mt-1 text-xs text-gray-500">
                      You cannot change your own role.
                    </p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
