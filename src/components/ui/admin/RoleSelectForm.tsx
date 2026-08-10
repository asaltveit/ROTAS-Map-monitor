'use client'

import { updateUserRole } from '@/app/login/actions'
import type { UserRole } from '@/lib/auth/types'

type RoleSelectFormProps = {
  userId: string
  currentRole: UserRole
  isCurrentUser: boolean
}

export default function RoleSelectForm({
  userId,
  currentRole,
  isCurrentUser,
}: RoleSelectFormProps) {
  return (
    <form action={updateUserRole} className="flex items-center gap-2">
      <input type="hidden" name="userId" value={userId} />
      <select
        name="role"
        defaultValue={currentRole}
        disabled={isCurrentUser}
        className="rounded-md border border-gray-300 px-2 py-1 text-sm disabled:bg-gray-100"
      >
        <option value="editor">Editor</option>
        <option value="admin">Admin</option>
      </select>
      <button
        type="submit"
        disabled={isCurrentUser}
        className="rounded-md bg-indigo-600 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        Save
      </button>
    </form>
  )
}
