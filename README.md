# NFCC — Nurul Fikri Cybersecurity Community

Public website + admin dashboard for the Nurul Fikri Cybersecurity Community.

- **Public site**: landing, about (mission/timeline/team), gallery, blog (markdown + Shiki-highlighted code), contact.
- **Admin dashboard** (`/dashboard`): manage blog posts, gallery, team, timeline, stats, and site links — no code changes or redeploys needed.

## Stack

- [TanStack Start](https://tanstack.com/start) (React 19, file-based routing, SSR) + TypeScript (strict)
- [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- [Drizzle ORM](https://orm.drizzle.team/) + PostgreSQL (via [Supabase](https://supabase.com/))
- Supabase Auth (dashboard login) + Supabase Storage (image uploads)
- Markdown rendering: unified / remark / rehype + [Shiki](https://shiki.style/)

## Quick start

```bash
pnpm install
cp .env.example .env   # then fill in the values (see below)
pnpm db:migrate        # create tables
pnpm db:seed           # load starter content
pnpm dev               # http://localhost:3000
```

## Environment setup (Supabase)

1. Create a project at [supabase.com](https://supabase.com/).
2. **Database** → Settings → Database → Connection string:
   - `DATABASE_URL` — the **transaction pooler** URL (port `6543`), used at runtime.
   - `DIRECT_URL` — the **session / direct** URL (port `5432`), used by `drizzle-kit` for migrations.
3. **API** → Settings → API:
   - `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY` (`sb_publishable_…`), and `SUPABASE_SECRET_KEY` (`sb_secret_…`). (Legacy `SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY` names are still accepted as fallbacks.)
   - ⚠️ The secret key is **server-only** — it is used solely in `src/server/admin.ts` and is never bundled to the client. Keep it secret.
4. **Storage** → create a **public** bucket named `media` (or set `SUPABASE_STORAGE_BUCKET` to your bucket name). Image uploads from the dashboard land here.
5. Copy `.env.example` → `.env` and fill in all of the above.

All variables are documented in [`.env.example`](.env.example).

### Creating an admin user

Dashboard login uses Supabase Auth (email + password). Create your admin account in the Supabase console: **Authentication → Users → Add user** (set "Auto Confirm"). Anyone in the Supabase `auth.users` table can sign in to `/dashboard`.

## Database

Schema lives in [`src/db/schema.ts`](src/db/schema.ts). Common commands:

```bash
pnpm db:generate   # generate a migration after editing schema.ts
pnpm db:migrate    # apply migrations (uses DIRECT_URL)
pnpm db:push       # push schema without a migration file (dev only)
pnpm db:seed       # load starter content (idempotent; posts upsert on slug)
pnpm db:studio     # open Drizzle Studio
```

### Local Postgres (without Supabase)

You can develop the **public site** against any Postgres (auth/dashboard still need Supabase). Example with Docker:

```bash
docker run -d --name nfcc-pg -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=nfcc -p 55432:5432 postgres:16-alpine
# set DATABASE_URL/DIRECT_URL to postgresql://postgres:postgres@127.0.0.1:55432/nfcc
pnpm db:migrate && pnpm db:seed && pnpm dev
```

## Content model

| Section        | Managed at                | Table               |
| -------------- | ------------------------- | ------------------- |
| Blog posts     | `/dashboard/posts`        | `posts`             |
| Gallery        | `/dashboard/gallery`      | `gallery_items`     |
| Team           | `/dashboard/team`         | `team_members`      |
| Timeline       | `/dashboard/timeline`     | `timeline_entries`  |
| Stats          | `/dashboard/stats`        | `stats`             |
| Links / email  | `/dashboard/settings`     | `site_settings`     |

Blog posts are written in **markdown**. Code fences are highlighted with Shiki. The dashboard editor shows a live preview using the same render pipeline the public page uses ([`src/lib/markdown.ts`](src/lib/markdown.ts)).

## Testing, linting, building

```bash
pnpm test    # Vitest (markdown render)
pnpm lint    # ESLint
pnpm build   # production build
```

## Deployment

Built on Nitro; deploy to any Node-compatible host. The intended target is **Vercel** — set the same environment variables in the Vercel project settings, then run migrations against your production database (`pnpm db:migrate`). See https://nitro.build/deploy for other presets.

## Project structure

```
src/
  db/            # Drizzle schema, client, seed
  lib/           # markdown render, Supabase server client, auth guard
  server/        # server functions — content.ts (public reads), admin.ts (guarded writes)
  routes/        # public pages + dashboard/ (login, _authed/ guarded pages)
  components/    # shared UI, dashboard/ widgets, ui/ (shadcn)
drizzle/         # generated migrations
```

## Notes

- Placeholder content (team names, founding date, contact email) is clearly marked and should be replaced with real values via the dashboard before launch.
- The gallery currently uses uploaded/placeholder images; a live Instagram feed integration is a possible future addition.
