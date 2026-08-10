import Link from 'next/link'

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-sky-900 p-6">
      <div className="max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
        <h1 className="text-2xl font-semibold text-gray-900">Access denied</h1>
        <p className="mt-3 text-sm text-gray-600">
          Your account does not have editor or admin access to ROTAS Map Monitor.
          Contact an administrator if you need access.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-block rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          Back to login
        </Link>
      </div>
    </div>
  )
}
