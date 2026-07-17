import { redirect } from '@tanstack/react-router'
import { verifyCredentials } from '@supabase/server/core'

import { getSsrClient } from './supabase/server.ts'

export type AdminUser = { id: string; email: string }

/**
 * Returns the current admin user, or null. Reads the (@supabase/ssr) session cookie
 * for the access token, then verifies the JWT locally against the project JWKS via
 * @supabase/server (no network round-trip, timing-safe). Never throws.
 */
export async function getCurrentUser(): Promise<AdminUser | null> {
  const supabase = getSsrClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const token = session?.access_token ?? null
  if (!token) return null

  const { data: auth, error } = await verifyCredentials(
    { token, apikey: null },
    { auth: 'user' },
  )
  if (error || !auth.userClaims) return null

  return {
    id: auth.userClaims.id,
    email: auth.userClaims.email ?? '',
  }
}

/**
 * Guard for admin-only server functions. Returns the verified user, or throws a
 * redirect to the login page. Call at the top of every privileged/mutating server
 * function — never rely on the route guard alone.
 */
export async function requireAdmin(): Promise<AdminUser> {
  const user = await getCurrentUser()
  if (!user) {
    throw redirect({ to: '/dashboard/login' })
  }
  return user
}
