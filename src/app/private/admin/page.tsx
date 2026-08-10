import type { Metadata } from 'next'
import Nav from '@/components/ui/admin/Nav'
import { requireAdmin } from '@/lib/auth/getUserProfile'

export const metadata: Metadata = {
  title: 'Admin',
  description: 'Administration for ROTAS Map Monitor',
}

export default async function AdminPage() {
  await requireAdmin()

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-white">Admin</h1>
        <p className="mt-1 text-sm text-blue-100">
          Manage monitor users and run administrative tasks.
        </p>
      </div>
      <Nav />
    </div>
  )
}
