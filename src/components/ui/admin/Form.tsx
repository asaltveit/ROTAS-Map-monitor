'use client'

import { useActionState } from 'react'
import type { AuthActionState } from '@/app/login/actions'

type FormProps = {
  action: (
    prevState: AuthActionState,
    formData: FormData,
  ) => Promise<AuthActionState>
  submitText: string
  includeEmail?: boolean
  includePassword?: boolean
  includeRole?: boolean
  children?: React.ReactNode
}

const initialState: AuthActionState = {}

export default function Form({
  action,
  submitText,
  includeEmail = false,
  includePassword = false,
  includeRole = false,
  children,
}: FormProps) {
  const [state, formAction, pending] = useActionState(action, initialState)

  return (
    <div>
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <form action={formAction} className="space-y-6">
          {state.error && (
            <p className="rounded-md bg-red-100 px-3 py-2 text-sm text-red-800">
              {state.error}
            </p>
          )}
          {state.success && (
            <p className="rounded-md bg-green-100 px-3 py-2 text-sm text-green-800">
              {state.success}
            </p>
          )}

          {includeEmail && (
            <div className="pt-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-400"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="block w-full rounded-md border-0 py-1.5 ps-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          )}

          {includePassword && (
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-400"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  type="password"
                  name="password"
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md border-0 py-1.5 ps-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          )}

          {includeRole && (
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-400"
              >
                Role
              </label>
              <div className="mt-1">
                <select
                  id="role"
                  name="role"
                  defaultValue="editor"
                  className="block w-full rounded-md border-0 py-1.5 ps-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                >
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
          )}

          {children}

          <div className="pt-4">
            <button
              type="submit"
              disabled={pending}
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-60"
            >
              {pending ? 'Working…' : submitText}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
