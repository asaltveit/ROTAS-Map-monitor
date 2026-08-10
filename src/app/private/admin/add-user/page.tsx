import type { Metadata } from 'next'
import InviteUserForm from '@/components/ui/admin/InviteUserForm'
import Nav from '@/components/ui/admin/Nav'
import { requireAdmin } from '@/lib/auth/getUserProfile'

export const metadata: Metadata = {
  title: 'Add User',
  description: 'Invite a monitor user',
}

export default async function AddUserPage() {
  await requireAdmin()

  return (
    <div className="space-y-4">
      <Nav />
      <h1 className="text-2xl font-semibold text-white">Invite user</h1>
      <InviteUserForm />
    </div>
  )
}
