import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import * as schema from './schema.ts'

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error(
    'DATABASE_URL is not set. Copy .env.example to .env and fill in your Supabase Postgres connection string.',
  )
}

// Supabase's transaction pooler (port 6543) does not support prepared statements.
const client = postgres(connectionString, { prepare: false })

export const db = drizzle(client, { schema })
export { schema }
