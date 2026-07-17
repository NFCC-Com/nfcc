import { createServerFn } from '@tanstack/react-start'
import { asc, desc, eq } from 'drizzle-orm'
import { z } from 'zod'

import { db } from '#/db/index.ts'
import {
  galleryItems,
  posts,
  siteSettings,
  stats,
  teamMembers,
  timelineEntries,
} from '#/db/schema.ts'
import { requireAdmin } from '#/lib/auth.ts'
import { renderMarkdown } from '#/lib/markdown.ts'
import {
  getSupabaseAdminClient,
  getSupabaseServerClient,
} from '#/lib/supabase/server.ts'

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export const signIn = createServerFn({ method: 'POST' })
  .validator((data: { email: string; password: string }) =>
    z
      .object({ email: z.string().email(), password: z.string().min(1) })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()
    const { error } = await supabase.auth.signInWithPassword(data)
    if (error) return { ok: false as const, error: error.message }
    return { ok: true as const }
  })

export const signOut = createServerFn({ method: 'POST' }).handler(async () => {
  const supabase = getSupabaseServerClient()
  await supabase.auth.signOut()
  return { ok: true as const }
})

export const getSessionUser = createServerFn({ method: 'GET' }).handler(
  async () => {
    const supabase = getSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    return user ? { id: user.id, email: user.email ?? '' } : null
  },
)

// ─── Posts ───────────────────────────────────────────────────────────────────

export const listAllPosts = createServerFn({ method: 'GET' }).handler(
  async () => {
    await requireAdmin()
    return db
      .select({
        id: posts.id,
        slug: posts.slug,
        title: posts.title,
        published: posts.published,
        updatedAt: posts.updatedAt,
      })
      .from(posts)
      .orderBy(desc(posts.updatedAt))
  },
)

export const renderPreview = createServerFn({ method: 'POST' })
  .validator((markdown: string) => z.string().parse(markdown))
  .handler(async ({ data: markdown }) => {
    await requireAdmin()
    return renderMarkdown(markdown)
  })

export const getPostById = createServerFn({ method: 'GET' })
  .validator((id: number) => z.number().int().parse(id))
  .handler(async ({ data: id }) => {
    await requireAdmin()
    return (await db.query.posts.findFirst({ where: eq(posts.id, id) })) ?? null
  })

const postInput = z.object({
  id: z.number().int().optional(),
  title: z.string().min(1),
  slug: z.string().optional(),
  excerpt: z.string().default(''),
  body: z.string().default(''),
  cover: z.string().nullable().default(null),
  tags: z.array(z.string()).default([]),
  author: z.string().default('NFCC Team'),
  published: z.boolean().default(false),
})

export const savePost = createServerFn({ method: 'POST' })
  .validator((data: z.input<typeof postInput>) => postInput.parse(data))
  .handler(async ({ data }) => {
    await requireAdmin()
    const slug =
      data.slug && data.slug.length > 0
        ? slugify(data.slug)
        : slugify(data.title)
    const now = new Date()

    const values = {
      slug,
      title: data.title,
      excerpt: data.excerpt,
      body: data.body,
      cover: data.cover,
      tags: data.tags,
      author: data.author,
      published: data.published,
      publishedAt: data.published ? now : null,
      updatedAt: now,
    }

    if (data.id) {
      const [row] = await db
        .update(posts)
        .set(values)
        .where(eq(posts.id, data.id))
        .returning({ id: posts.id, slug: posts.slug })
      return row
    }

    const [row] = await db
      .insert(posts)
      .values(values)
      .returning({ id: posts.id, slug: posts.slug })
    return row
  })

export const deletePost = createServerFn({ method: 'POST' })
  .validator((id: number) => z.number().int().parse(id))
  .handler(async ({ data: id }) => {
    await requireAdmin()
    await db.delete(posts).where(eq(posts.id, id))
    return { ok: true as const }
  })

// ─── Gallery ───────────────────────────────────────────────────────────────

const galleryInput = z.object({
  id: z.number().int().optional(),
  image: z.string().min(1),
  caption: z.string().default(''),
  tag: z.string().default('General'),
  date: z.string().default(''),
  sortOrder: z.number().int().default(0),
})

export const saveGalleryItem = createServerFn({ method: 'POST' })
  .validator((data: z.input<typeof galleryInput>) => galleryInput.parse(data))
  .handler(async ({ data }) => {
    await requireAdmin()
    const { id, ...values } = data
    if (id) {
      await db.update(galleryItems).set(values).where(eq(galleryItems.id, id))
    } else {
      await db.insert(galleryItems).values(values)
    }
    return { ok: true as const }
  })

export const deleteGalleryItem = createServerFn({ method: 'POST' })
  .validator((id: number) => z.number().int().parse(id))
  .handler(async ({ data: id }) => {
    await requireAdmin()
    await db.delete(galleryItems).where(eq(galleryItems.id, id))
    return { ok: true as const }
  })

export const listGallery = createServerFn({ method: 'GET' }).handler(
  async () => {
    await requireAdmin()
    return db
      .select()
      .from(galleryItems)
      .orderBy(asc(galleryItems.sortOrder), asc(galleryItems.id))
  },
)

// ─── Team ────────────────────────────────────────────────────────────────────

const teamInput = z.object({
  id: z.number().int().optional(),
  name: z.string().min(1),
  role: z.string().default(''),
  division: z.string().default('Core Team'),
  photo: z.string().default('/placeholders/avatar.svg'),
  sortOrder: z.number().int().default(0),
})

export const saveTeamMember = createServerFn({ method: 'POST' })
  .validator((data: z.input<typeof teamInput>) => teamInput.parse(data))
  .handler(async ({ data }) => {
    await requireAdmin()
    const { id, ...values } = data
    if (id) {
      await db.update(teamMembers).set(values).where(eq(teamMembers.id, id))
    } else {
      await db.insert(teamMembers).values(values)
    }
    return { ok: true as const }
  })

export const deleteTeamMember = createServerFn({ method: 'POST' })
  .validator((id: number) => z.number().int().parse(id))
  .handler(async ({ data: id }) => {
    await requireAdmin()
    await db.delete(teamMembers).where(eq(teamMembers.id, id))
    return { ok: true as const }
  })

export const listTeam = createServerFn({ method: 'GET' }).handler(async () => {
  await requireAdmin()
  return db
    .select()
    .from(teamMembers)
    .orderBy(asc(teamMembers.sortOrder), asc(teamMembers.id))
})

// ─── Timeline ────────────────────────────────────────────────────────────────

const timelineInput = z.object({
  id: z.number().int().optional(),
  year: z.string().default(''),
  title: z.string().min(1),
  description: z.string().default(''),
  sortOrder: z.number().int().default(0),
})

export const saveTimelineEntry = createServerFn({ method: 'POST' })
  .validator((data: z.input<typeof timelineInput>) => timelineInput.parse(data))
  .handler(async ({ data }) => {
    await requireAdmin()
    const { id, ...values } = data
    if (id) {
      await db
        .update(timelineEntries)
        .set(values)
        .where(eq(timelineEntries.id, id))
    } else {
      await db.insert(timelineEntries).values(values)
    }
    return { ok: true as const }
  })

export const deleteTimelineEntry = createServerFn({ method: 'POST' })
  .validator((id: number) => z.number().int().parse(id))
  .handler(async ({ data: id }) => {
    await requireAdmin()
    await db.delete(timelineEntries).where(eq(timelineEntries.id, id))
    return { ok: true as const }
  })

export const listTimeline = createServerFn({ method: 'GET' }).handler(
  async () => {
    await requireAdmin()
    return db
      .select()
      .from(timelineEntries)
      .orderBy(asc(timelineEntries.sortOrder), asc(timelineEntries.id))
  },
)

// ─── Stats ───────────────────────────────────────────────────────────────────

const statInput = z.object({
  id: z.number().int().optional(),
  label: z.string().min(1),
  value: z.string().default(''),
  sortOrder: z.number().int().default(0),
})

export const saveStat = createServerFn({ method: 'POST' })
  .validator((data: z.input<typeof statInput>) => statInput.parse(data))
  .handler(async ({ data }) => {
    await requireAdmin()
    const { id, ...values } = data
    if (id) {
      await db.update(stats).set(values).where(eq(stats.id, id))
    } else {
      await db.insert(stats).values(values)
    }
    return { ok: true as const }
  })

export const deleteStat = createServerFn({ method: 'POST' })
  .validator((id: number) => z.number().int().parse(id))
  .handler(async ({ data: id }) => {
    await requireAdmin()
    await db.delete(stats).where(eq(stats.id, id))
    return { ok: true as const }
  })

export const listStats = createServerFn({ method: 'GET' }).handler(async () => {
  await requireAdmin()
  return db.select().from(stats).orderBy(asc(stats.sortOrder), asc(stats.id))
})

// ─── Site settings ─────────────────────────────────────────────────────────

const settingsInput = z.object({
  instagram: z.string(),
  website: z.string(),
  ctfUrl: z.string(),
  contactEmail: z.string(),
})

export const saveSettings = createServerFn({ method: 'POST' })
  .validator((data: z.input<typeof settingsInput>) => settingsInput.parse(data))
  .handler(async ({ data }) => {
    await requireAdmin()
    await db
      .insert(siteSettings)
      .values({ id: 1, ...data, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: siteSettings.id,
        set: { ...data, updatedAt: new Date() },
      })
    return { ok: true as const }
  })

// ─── Image upload (Supabase Storage) ─────────────────────────────────────────

const uploadInput = z.object({
  fileName: z.string().min(1),
  contentType: z.string().min(1),
  dataBase64: z.string().min(1),
})

export const uploadImage = createServerFn({ method: 'POST' })
  .validator((data: z.input<typeof uploadInput>) => uploadInput.parse(data))
  .handler(async ({ data }) => {
    await requireAdmin()
    const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? 'media'
    const supabase = getSupabaseAdminClient()

    const safeName = data.fileName.replace(/[^a-zA-Z0-9._-]/g, '_')
    const path = `${Date.now()}-${safeName}`
    const bytes = Buffer.from(data.dataBase64, 'base64')

    const { error } = await supabase.storage
      .from(bucket)
      .upload(path, bytes, { contentType: data.contentType, upsert: false })
    if (error) return { ok: false as const, error: error.message }

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(path)
    return { ok: true as const, url: publicUrl }
  })
