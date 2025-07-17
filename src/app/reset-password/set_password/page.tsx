import { Suspense } from 'react';
import { Metadata } from "next";
import { resetPassword } from '@/app/login/actions';
import Form from '@/components/ui/admin/Form';
// TODO: add a reset pword page separate from sending email to reset pword
export const metadata: Metadata = {
  title: "Reset Password Page",
  description: "This is the reset password page",
};

export default function Page() {
  return (
    <div className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
          <div className="w-32 text-white md:w-36">
            Set new password
          </div>
        </div>
        <Suspense>
          <Form action={resetPassword} submitText="Set new password" includePassword />
        </Suspense>
      </div>
    </div>
  );
}