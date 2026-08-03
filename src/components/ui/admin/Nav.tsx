import Link from 'next/link'

export default function Nav() {
  return (
    <div className="mb-6 flex flex-col gap-2">
      <Link
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
        href="/private/admin/add-user"
      >
        Add user
      </Link>
      <Link
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
        href="/private/admin/remove-user"
      >
        Remove user
      </Link>
    </div>
  )
}
