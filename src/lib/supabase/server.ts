import { createServerClient } from '@supabase/ssr'
import type { CookieOptions } from '@supabase/ssr'
import { getCookies, setCookie } from '@tanstack/react-start/server'

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(
      `${name} is not set. Copy .env.example to .env and fill in your Supabase keys.`,
    )
  }
  return value
}

/**
 * Supabase client bound to the current request's cookies (via TanStack Start's
 * request-scoped cookie helpers). Uses the anon key + user session — safe for auth.
 * Only call inside a server function / server route context.
 */
export function getSupabaseServerClient() {
  return createServerClient(
    requireEnv('SUPABASE_URL'),
    requireEnv('SUPABASE_ANON_KEY'),
    {
      cookies: {
        getAll() {
          return Object.entries(getCookies()).map(([name, value]) => ({
            name,
            value,
          }))
        },
        setAll(
          cookies: Array<{
            name: string
            value: string
            options?: CookieOptions
          }>,
        ) {
          for (const { name, value, options } of cookies) {
            setCookie(name, value, options)
          }
        },
      },
    },
  )
}

/**
 * Privileged admin client using the service-role key. SERVER-ONLY — bypasses RLS and
 * must never be imported into client code. Used for Storage uploads / privileged writes.
 */
export function getSupabaseAdminClient() {
  return createServerClient(
    requireEnv('SUPABASE_URL'),
    requireEnv('SUPABASE_SERVICE_ROLE_KEY'),
    {
      cookies: { getAll: () => [], setAll: () => {} },
    },
  )
}
