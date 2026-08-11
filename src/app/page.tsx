import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export default async function Home() {
  const supabase = await createClient()

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (!error && user) {
      redirect('/private/dashboard')
    }
  } catch {
    // Ignore broken auth cookies and send the user to login.
  }

  redirect('/login')
}
