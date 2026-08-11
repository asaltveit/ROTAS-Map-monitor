import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { getSupabaseAnonKey, getSupabaseUrl } from './env'

const publicPrefixes = [
  '/login',
  '/auth',
  '/reset-password',
  '/unauthorized',
  '/api/monitor/run',
]

function isPublicPath(pathname: string): boolean {
  return publicPrefixes.some((prefix) => pathname.startsWith(prefix))
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value)
        })
        supabaseResponse = NextResponse.next({
          request,
        })
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        )
      },
    },
  })

  let user = null

  try {
    const { data, error } = await supabase.auth.getUser()
    if (!error) {
      user = data.user
    }
  } catch {
    // Treat malformed auth responses (e.g. empty JSON from a bad session) as logged out.
    user = null
  }

  if (!user && !isPublicPath(request.nextUrl.pathname)) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
