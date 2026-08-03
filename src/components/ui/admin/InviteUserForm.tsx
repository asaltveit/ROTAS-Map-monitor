'use client'

import Form from '@/components/ui/admin/Form'
import { inviteUser } from '@/app/login/actions'

export default function InviteUserForm() {
  return (
    <Form
      action={inviteUser}
      submitText="Invite user"
      includeEmail
      includeRole
    />
  )
}
