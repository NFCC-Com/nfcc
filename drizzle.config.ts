import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

// Migrations run against the direct/session connection (DIRECT_URL) rather than the
// transaction pooler, which does not support the DDL migrations require.
const url = process.env.DIRECT_URL ?? process.env.DATABASE_URL

if (!url) {
  throw new Error(
    'DIRECT_URL (or DATABASE_URL) must be set to run drizzle-kit.',
  )
}

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: { url },
  casing: 'snake_case',
})
