import { redirect } from '@tanstack/react-router'

import { getSupabaseServerClient } from './supabase/server.ts'

/**
 * Returns the currently authenticated Supabase user, or null. Never throws.
 * Use in server functions where you want to branch on auth state.
 */
export async function getCurrentUser() {
  const supabase = getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

/**
 * Guard for admin-only server functions. Returns the user if authenticated,
 * otherwise throws a redirect to the login page. Call at the top of every
 * privileged/mutating server function — never rely on the route guard alone.
 */
export async function requireAdmin() {
  const user = await getCurrentUser()
  if (!user) {
    throw redirect({ to: '/dashboard/login' })
  }
  return user
}
