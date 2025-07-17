import Link from 'next/link';

export default function Nav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <Link
        className="mb-2 flex items-end justify-start rounded-md bg-blue-600 p-3"
        href="/private/admin/signup"
      >
        Add user
      </Link>
      <Link
        className="mb-2 flex items-end justify-start rounded-md bg-blue-600 p-3"
        href="/private/admin/remove-user"
      >
        Remove user
      </Link>
    </div>
  );
}