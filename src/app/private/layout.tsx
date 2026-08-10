import type { Metadata } from 'next'
import SideNav from '@/components/ui/SideNav'
import { requireAuth } from '@/lib/auth/getUserProfile'

export const metadata: Metadata = {
  title: 'Monitor Home',
  description: 'Home page of ROTAS Map Monitoring',
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await requireAuth()

  return (
    <div className="flex h-screen flex-col bg-sky-900 md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  )
}
