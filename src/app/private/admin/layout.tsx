import type { Metadata } from 'next'
import { requireAdmin } from '@/lib/auth/getUserProfile'

export const metadata: Metadata = {
  title: 'Admin',
  description: 'Administration for the ROTAS Map Monitor',
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireAdmin()

  return <div>{children}</div>
}
