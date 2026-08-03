'use client'

import Form from '@/components/ui/admin/Form'
import { login } from '@/app/login/actions'

export default function LoginForm() {
  return <Form action={login} submitText="Sign in" includeEmail includePassword />
}
