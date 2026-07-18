import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import { getRequest } from '@tanstack/react-start/server'

import * as schema from './schema.ts'

type Db = ReturnType<typeof drizzle<typeof schema>>
type CloudflareRequest = Request & {
  runtime?: { cloudflare?: { env?: { HYPERDRIVE?: { connectionString?: string } } } }
}

let instance: Db | undefined

// On Cloudflare Workers, raw TCP to Supabase's pooler over the polyfilled
// node:net/tls can hang indefinitely (SSL upgrade never completes), so route
// through Hyperdrive instead when its binding is present. Everywhere else
// (Vercel, local dev) falls back to DATABASE_URL.
function resolveConnectionString(): string {
  try {
    const req = getRequest() as CloudflareRequest
    const hyperdriveUrl = req.runtime?.cloudflare?.env?.HYPERDRIVE?.connectionString
    if (hyperdriveUrl) return hyperdriveUrl
  } catch {
    // Not inside a request (drizzle-kit, seed script) — fall through.
  }

  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error(
      'DATABASE_URL is not set. Copy .env.example to .env and fill in your Supabase Postgres connection string.',
    )
  }
  return connectionString
}

// Lazily connect on first query instead of at module load. Cloudflare Workers
// only expose env vars/bindings and allow socket creation inside the request
// lifecycle, so reading env at import time would break on that runtime.
function getDb(): Db {
  if (instance) return instance

  // Supabase's transaction pooler (and Hyperdrive, which also pools in
  // transaction mode) does not support prepared statements.
  const client = postgres(resolveConnectionString(), { prepare: false })
  instance = drizzle(client, { schema })
  return instance
}

export const db: Db = new Proxy({} as Db, {
  get(_target, prop) {
    const db = getDb()
    return Reflect.get(db, prop, db)
  },
})
export { schema }
