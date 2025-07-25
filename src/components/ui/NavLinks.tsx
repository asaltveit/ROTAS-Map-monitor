'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  //{ name: 'Home', href: '/' },
  {
    name: 'Dashboard',
    href: '/private/dashboard',
  },
  { name: 'Admin', href: '/private/admin' },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        return (
          <Link
            key={link.name}
            href={link.href}
            role="menuitem"
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-indigo-800 p-3 text-sm font-medium hover:bg-indigo-700 hover:text-blue-50 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-indigo-700 text-blue-50': pathname === link.href,
              },
            )}
          >
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}