import { createServerClient } from '@supabase/ssr'
import type { CookieOptions } from '@supabase/ssr'
import { createAdminClient } from '@supabase/server/core'
import { getCookies, setCookie } from '@tanstack/react-start/server'

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(
      `${name} is not set. Copy .env.example to .env and fill in your Supabase values.`,
    )
  }
  return value
}

// New Supabase publishable key (sb_publishable_…), with legacy anon fallback.
function publishableKey(): string {
  const value =
    process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_ANON_KEY
  if (!value) {
    throw new Error(
      'SUPABASE_PUBLISHABLE_KEY is not set. Copy .env.example to .env and fill it in.',
    )
  }
  return value
}

/**
 * Cookie-bound Supabase client (@supabase/ssr) for the current request. Owns the
 * session cookie lifecycle — used for password sign-in/out and reading/refreshing
 * the session. Only call inside a server function / server route context.
 */
export function getSsrClient() {
  return createServerClient(requireEnv('SUPABASE_URL'), publishableKey(), {
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
  })
}

/**
 * Privileged service-role client (@supabase/server), reads SUPABASE_SECRET_KEY.
 * SERVER-ONLY — bypasses RLS and must never be imported into client code. Used for
 * Storage uploads / privileged writes in src/server/admin.ts.
 */
export function getSupabaseAdminClient() {
  return createAdminClient()
}
