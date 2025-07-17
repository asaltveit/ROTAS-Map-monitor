import Form from "@/components/ui/admin/Form";
import { Suspense } from 'react';
import { removeUser } from '@/app/login/actions'

export default function Page() {
    // TODO: likely want to double check they want to do this
  return (
    <div>
        <p> Remove user</p>
        <Suspense>
            <Form action={removeUser} submitText='Remove user' />
        </Suspense>
    </div>
  )
}