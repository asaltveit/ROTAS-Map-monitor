
import EmailForPasswordForm from '@/components/ui/admin/EmailForPasswordForm';
import { Suspense } from 'react'; // why the suspense?
import { Metadata } from "next";
// TODO: add a reset pword page separate from sending email to reset pword
export const metadata: Metadata = {
  title: "Reset Password Page",
  description: "This is the ROTAS Map Monitor reset password page",
};

export default function Page() {
  return (
    <div className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
          <div className="w-32 text-white md:w-36">
            Send email to reset password
          </div>
        </div>
        <Suspense>
          <EmailForPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}