import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import { getRequest } from '@tanstack/react-start/server'

import * as schema from './schema.ts'

type Db = ReturnType<typeof drizzle<typeof schema>>
type CloudflareRequest = Request & {
  runtime?: { cloudflare?: { env?: { HYPERDRIVE?: { connectionString?: string } } } }
}

function buildDb(connectionString: string): Db {
  // Supabase's transaction pooler (and Hyperdrive, which also pools in
  // transaction mode) does not support prepared statements.
  const client = postgres(connectionString, { prepare: false })
  return drizzle(client, { schema })
}

// Cloudflare Workers can keep a warm isolate around across many unrelated
// requests. If a cached client's TCP connection ever wedges (the polyfilled
// node:net/tls over Workers sockets can hang), caching it at module scope
// would poison every later request on that isolate. So on Workers we key one
// client per request instead (Cloudflare's own Hyperdrive guidance: creating
// a client per request is cheap since Hyperdrive pools the real connection
// server-side) — it's discarded once the request's Request object is GC'd.
const perRequest = new WeakMap<Request, Db>()

// Outside Workers (Vercel, local dev) there's no isolate-reuse hazard and no
// per-request Request object to key off reliably, so a single long-lived
// client is simpler and avoids reconnecting on every call.
let nodeInstance: Db | undefined

function getDb(): Db {
  let req: CloudflareRequest | undefined
  try {
    req = getRequest() as CloudflareRequest
  } catch {
    req = undefined
  }

  const hyperdriveUrl = req?.runtime?.cloudflare?.env?.HYPERDRIVE?.connectionString
  if (req && hyperdriveUrl) {
    let db = perRequest.get(req)
    if (!db) {
      db = buildDb(hyperdriveUrl)
      perRequest.set(req, db)
    }
    return db
  }

  if (nodeInstance) return nodeInstance

  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error(
      'DATABASE_URL is not set. Copy .env.example to .env and fill in your Supabase Postgres connection string.',
    )
  }
  nodeInstance = buildDb(connectionString)
  return nodeInstance
}

export const db: Db = new Proxy({} as Db, {
  get(_target, prop) {
    const db = getDb()
    return Reflect.get(db, prop, db)
  },
})
export { schema }
