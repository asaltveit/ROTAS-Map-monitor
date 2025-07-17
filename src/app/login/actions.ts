'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
// TODO: add validation
// TODO: add logging of errors?

export async function login(formData: FormData) {
    const supabase = await createClient()
    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }
    const { error } = await supabase.auth.signInWithPassword(data)
    if (error) {
        redirect('/error')
    }
    revalidatePath('/private/admin', 'layout')
    redirect('/private/admin')
}

export async function signOut() {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()
  if (error) {
    redirect('/error')
  }
  revalidatePath('/login', 'layout')
  redirect('/login')
}

// Should sign up be allowed? set password through link?
export async function signup(formData: FormData) {
  const supabase = await createClient()
  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }
  const { error } = await supabase.auth.signUp(data)
  if (error) {
    redirect('/error') // should errors be shown with snackbar?
  }
  // Is the below needed?
  revalidatePath('/private/admin', 'layout')
  redirect('/private/admin')
}

// TODO: below
export async function emailForPassword(formData: FormData) {
  console.log('TODO: reset password')
  const email = formData.get('email') as string;
  const supabase = await createClient()
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'localhost:3000/reset-password/set_password',
  })

  if (error) {
    redirect('/error') // should errors be shown with snackbar?
  }
}

export async function resetPassword(formData: FormData) {
  console.log('TODO: reset password')
  const new_password = formData.get('password') as string;
  const supabase = await createClient()
  const { data, error } = await supabase.auth.updateUser({
    password: new_password
  })
  if (error) {
    redirect('/error') // should errors be shown with snackbar?
  }
  revalidatePath('/login', 'layout')
  redirect('/login')

}

// TODO: below
export async function removeUser(formData: FormData) {
  console.log('TODO: remove user')
  /*const supabase = await createClient()
  const { error } = await supabase.auth.signOut()
  if (error) {
    redirect('/error')
  }
  revalidatePath('/login', 'layout')
  redirect('/login')*/
}