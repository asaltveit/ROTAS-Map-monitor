import { runCheckNow } from '@/app/login/actions'
import { requireAuth } from '@/lib/auth/getUserProfile'

export default async function RunCheckButton() {
  const profile = await requireAuth()

  if (profile.role !== 'admin') {
    return null
  }

  return (
    <form action={runCheckNow}>
      <button
        type="submit"
        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
      >
        Run check now
      </button>
    </form>
  )
}
