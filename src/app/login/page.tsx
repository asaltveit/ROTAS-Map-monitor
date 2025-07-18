
import LoginForm from '@/components/LoginForm';
import { Suspense } from 'react'; // why the suspense?
import { Metadata } from "next";
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Login Page",
  description: "This is the ROTAS Map Monitor login page",
}; // w-32 md:w-36 h-20 md:h-36

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex w-full justify-center items-center rounded-lg bg-slate-700 p-3 h-10 md:h-20">
          <div className="text-white text-sm font-semibold">
            ROTAS Map Monitor
          </div>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
        <Link
          className="mb-2 flex items-end justify-center text-sm shadow-sm font-semibold py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 p-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          href="/reset-password/send_email"
        >
          Reset password
        </Link>
      </div>
    </div>
  );
}