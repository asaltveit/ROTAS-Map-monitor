import SignupForm from "@/components/ui/admin/SignupForm";
import { Suspense } from 'react';

export default function Page() {
  return (
    <div>
        <p> Add user</p>
        <Suspense>
            <SignupForm />
        </Suspense>
    </div>
  )
}