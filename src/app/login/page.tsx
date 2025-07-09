
import LoginForm from '@/components/LoginForm';
import { Suspense } from 'react';
import { Metadata } from "next";
// Don't show root layout with side bar when not logged in

export const metadata: Metadata = {
  title: "Login Page",
  description: "This is the ROTAS Map Monitor login page",
};

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
          <div className="w-32 text-white md:w-36">
            Logo
          </div>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}