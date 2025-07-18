import Link from 'next/link';
import NavLinks from './NavLinks';
//import { PowerIcon } from '@heroicons/react/24/outline';
import { signOut } from '@/app/login/actions';

export default function SideNav() {
  return (
    <nav role="menu" className="flex h-full flex-col px-3 py-4 md:px-2">
      <div
        className="mb-2 flex h-10 items-end justify-start rounded-md bg-slate-600 p-4 md:h-30"
      >
        <div className="w-32 text-white md:w-40">
          ROTAS Map Monitor
        </div>
      </div>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-slate-600 md:block" role="presentation"></div>
        <form
          action={async () => {
              'use server';
              await signOut();
          }}
        >
          <button role="menuitem" aria-label="sign out button" className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-indigo-800 p-3 text-sm font-medium hover:cursor-pointer hover:bg-indigo-700 hover:text-blue-50 md:flex-none md:justify-start md:p-2 md:px-3">
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form>
      </div>
    </nav>
  );
}