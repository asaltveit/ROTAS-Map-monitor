import type { Metadata } from 'next'
import Nav from '@/components/ui/admin/Nav'
import { removeUser } from '@/app/login/actions'
import { requireAdmin } from '@/lib/auth/getUserProfile'

export const metadata: Metadata = {
  title: 'Remove User',
  description: 'Remove a monitor user',
}

export default async function RemoveUserPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>
}) {
  await requireAdmin()
  const params = await searchParams

  return (
    <div className="space-y-4">
      <Nav />
      <h1 className="text-2xl font-semibold text-white">Remove user</h1>
      <p className="text-sm text-blue-100">
        Enter the email of the user to remove from the monitor app.
      </p>

      {params.error && (
        <p className="rounded-md bg-red-100 px-3 py-2 text-sm text-red-800">
          {decodeURIComponent(params.error.replace(/\+/g, ' '))}
        </p>
      )}
      {params.success && (
        <p className="rounded-md bg-green-100 px-3 py-2 text-sm text-green-800">
          {decodeURIComponent(params.success.replace(/\+/g, ' '))}
        </p>
      )}

      <form action={removeUser} className="max-w-sm space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-1 block w-full rounded-md border-0 py-1.5 ps-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
          />
        </div>
        <button
          type="submit"
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
        >
          Remove user
        </button>
      </form>
    </div>
  )
}
