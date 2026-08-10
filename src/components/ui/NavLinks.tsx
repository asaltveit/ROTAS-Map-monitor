'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

const baseLinks = [
  { name: 'Dashboard', href: '/private/dashboard' },
  { name: 'Locations', href: '/private/locations' },
]

export default function NavLinks({ isAdmin = false }: { isAdmin?: boolean }) {
  const pathname = usePathname()
  const links = isAdmin
    ? [...baseLinks, { name: 'Admin', href: '/private/admin' }]
    : baseLinks

  return (
    <>
      {links.map((link) => {
        const isActive =
          pathname === link.href || pathname.startsWith(`${link.href}/`)

        return (
          <Link
            key={link.name}
            href={link.href}
            role="menuitem"
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-indigo-800 p-3 text-sm font-medium hover:bg-indigo-700 hover:text-blue-50 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-indigo-700 text-blue-50': isActive,
              },
            )}
          >
            <p className="hidden md:block">{link.name}</p>
          </Link>
        )
      })}
    </>
  )
}
