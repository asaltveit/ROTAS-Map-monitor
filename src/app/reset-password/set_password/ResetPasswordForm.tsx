'use client'

import { Suspense } from 'react'
import Form from '@/components/ui/admin/Form'
import { resetPassword } from '@/app/login/actions'

export default function ResetPasswordForm() {
  return (
    <Suspense>
      <Form action={resetPassword} submitText="Set new password" includePassword />
    </Suspense>
  )
}
