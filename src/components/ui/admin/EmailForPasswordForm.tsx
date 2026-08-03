'use client'

import Form from '@/components/ui/admin/Form'
import { emailForPassword } from '@/app/login/actions'

export default function EmailForPasswordForm() {
  return (
    <Form
      action={emailForPassword}
      submitText="Send reset email"
      includeEmail
    />
  )
}
