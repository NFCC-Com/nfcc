import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import * as schema from './schema.ts'

type Db = ReturnType<typeof drizzle<typeof schema>>

let instance: Db | undefined

// Lazily connect on first query instead of at module load. Cloudflare Workers
// only expose env vars and allow socket creation inside the request lifecycle,
// so reading `process.env` at import time would break on that runtime.
function getDb(): Db {
  if (instance) return instance

  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error(
      'DATABASE_URL is not set. Copy .env.example to .env and fill in your Supabase Postgres connection string.',
    )
  }

  // Supabase's transaction pooler (port 6543) does not support prepared statements.
  const client = postgres(connectionString, { prepare: false })
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
