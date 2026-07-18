import { createServerFn } from '@tanstack/react-start'
import { getRequestIP } from '@tanstack/react-start/server'
import { and, asc, count, desc, eq, isNull, sql } from 'drizzle-orm'
import { z } from 'zod'

import { db } from '#/db/index.ts'
import {
  galleryItems,
  posts,
  shortlinks,
  siteSettings,
  stats,
  teamMembers,
  timelineEntries,
} from '#/db/schema.ts'
import { getCurrentUser, requireAdmin } from '#/lib/auth.ts'
import { renderMarkdown } from '#/lib/markdown.ts'
import { formatPeriode, parsePeriodeFilter } from '#/lib/periode.ts'
import { generateCode, isSafeTargetUrl, isValidCode } from '#/lib/shortlink.ts'
import { getSsrClient, getSupabaseAdminClient } from '#/lib/supabase/server.ts'
import { verifyTurnstile } from '#/lib/turnstile.ts'

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
  .validator((data: { email: string; password: string; turnstileToken: string }) =>
    z
      .object({
        email: z.string().email(),
        password: z.string().min(1),
        turnstileToken: z.string().min(1, 'Verifikasi captcha wajib diisi'),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const verified = await verifyTurnstile(data.turnstileToken, getRequestIP())
    if (!verified) {
      return { ok: false as const, error: 'Verifikasi captcha gagal, coba lagi.' }
    }

    const supabase = getSsrClient()
    const { error } = await supabase.auth.signInWithPassword(data)
    if (error) return { ok: false as const, error: error.message }
    return { ok: true as const }
  })

export const signOut = createServerFn({ method: 'POST' }).handler(async () => {
  const supabase = getSsrClient()
  await supabase.auth.signOut()
  return { ok: true as const }
})

export const getSessionUser = createServerFn({ method: 'GET' }).handler(
  async () => getCurrentUser(),
)

// ─── Posts ───────────────────────────────────────────────────────────────────

const POSTS_PAGE_SIZE = 10

const listInput = z.object({ page: z.number().int().min(1).default(1) })

export const listAllPosts = createServerFn({ method: 'GET' })
  .validator((data: z.input<typeof listInput>) => listInput.parse(data))
  .handler(async ({ data }) => {
    await requireAdmin()
    const [rows, [{ value: total }]] = await Promise.all([
      db
        .select({
          id: posts.id,
          slug: posts.slug,
          title: posts.title,
          published: posts.published,
          updatedAt: posts.updatedAt,
        })
        .from(posts)
        .orderBy(desc(posts.updatedAt))
        .limit(POSTS_PAGE_SIZE)
        .offset((data.page - 1) * POSTS_PAGE_SIZE),
      db.select({ value: count() }).from(posts),
    ])
    return { rows, total, page: data.page, pageSize: POSTS_PAGE_SIZE }
  })

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
  author: z.string().default('Tim NFCC'),
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
  tag: z.string().default('Umum'),
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

const GALLERY_PAGE_SIZE = 12

export const listGallery = createServerFn({ method: 'GET' })
  .validator((data: z.input<typeof listInput>) => listInput.parse(data))
  .handler(async ({ data }) => {
    await requireAdmin()
    const [rows, [{ value: total }]] = await Promise.all([
      db
        .select()
        .from(galleryItems)
        .orderBy(asc(galleryItems.sortOrder), asc(galleryItems.id))
        .limit(GALLERY_PAGE_SIZE)
        .offset((data.page - 1) * GALLERY_PAGE_SIZE),
      db.select({ value: count() }).from(galleryItems),
    ])
    return { rows, total, page: data.page, pageSize: GALLERY_PAGE_SIZE }
  })

// ─── Dashboard overview ──────────────────────────────────────────────────────

export const getDashboardCounts = createServerFn({ method: 'GET' }).handler(
  async () => {
    await requireAdmin()
    const [
      [{ value: postsTotal }],
      [{ value: publishedTotal }],
      [{ value: galleryTotal }],
      [{ value: teamTotal }],
      [{ value: timelineTotal }],
      [{ value: statsTotal }],
      [{ value: shortlinksTotal }],
    ] = await Promise.all([
      db.select({ value: count() }).from(posts),
      db
        .select({ value: count() })
        .from(posts)
        .where(eq(posts.published, true)),
      db.select({ value: count() }).from(galleryItems),
      db.select({ value: count() }).from(teamMembers),
      db.select({ value: count() }).from(timelineEntries),
      db.select({ value: count() }).from(stats),
      db.select({ value: count() }).from(shortlinks),
    ])
    return {
      posts: postsTotal,
      published: publishedTotal,
      gallery: galleryTotal,
      team: teamTotal,
      timeline: timelineTotal,
      stats: statsTotal,
      shortlinks: shortlinksTotal,
    }
  },
)

// ─── Team ────────────────────────────────────────────────────────────────────

const teamInput = z.object({
  id: z.number().int().optional(),
  name: z.string().min(1),
  role: z.string().default(''),
  division: z.string().default('Tim Inti'),
  periodeStart: z.number().int().nullable().default(null),
  periodeEnd: z.number().int().nullable().default(null),
  photo: z.string().default('/placeholders/avatar.svg'),
  instagram: z.string().default(''),
  linkedin: z.string().default(''),
  github: z.string().default(''),
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

const TEAM_PAGE_SIZE = 12

const teamListInput = z.object({
  page: z.number().int().min(1).default(1),
  periode: z.string().optional(),
  division: z.string().optional(),
})

export const listTeam = createServerFn({ method: 'GET' })
  .validator((data: z.input<typeof teamListInput>) => teamListInput.parse(data))
  .handler(async ({ data }) => {
    await requireAdmin()
    const periodeFilter = data.periode ? parsePeriodeFilter(data.periode) : null
    const conditions = [
      periodeFilter && periodeFilter.start == null
        ? isNull(teamMembers.periodeStart)
        : undefined,
      periodeFilter && periodeFilter.start != null
        ? eq(teamMembers.periodeStart, periodeFilter.start)
        : undefined,
      periodeFilter && periodeFilter.start != null
        ? periodeFilter.end == null
          ? isNull(teamMembers.periodeEnd)
          : eq(teamMembers.periodeEnd, periodeFilter.end)
        : undefined,
      data.division ? eq(teamMembers.division, data.division) : undefined,
    ].filter((c) => c !== undefined)
    const where = conditions.length > 0 ? and(...conditions) : undefined

    const periodeYearDesc = sql`${teamMembers.periodeStart} DESC NULLS LAST`
    const periodeEndDesc = sql`${teamMembers.periodeEnd} DESC NULLS LAST`

    const [rows, [{ value: total }], periodeRows, divisionRows] =
      await Promise.all([
        db
          .select()
          .from(teamMembers)
          .where(where)
          .orderBy(
            periodeYearDesc,
            periodeEndDesc,
            asc(teamMembers.division),
            asc(teamMembers.sortOrder),
            asc(teamMembers.id),
          )
          .limit(TEAM_PAGE_SIZE)
          .offset((data.page - 1) * TEAM_PAGE_SIZE),
        db.select({ value: count() }).from(teamMembers).where(where),
        db
          .selectDistinct({
            periodeStart: teamMembers.periodeStart,
            periodeEnd: teamMembers.periodeEnd,
          })
          .from(teamMembers)
          .orderBy(periodeYearDesc, periodeEndDesc),
        db
          .selectDistinct({ division: teamMembers.division })
          .from(teamMembers),
      ])

    return {
      rows,
      total,
      page: data.page,
      pageSize: TEAM_PAGE_SIZE,
      periodeOptions: periodeRows
        .map((r) => formatPeriode(r.periodeStart, r.periodeEnd))
        .filter((p) => p !== 'Umum'),
      divisionOptions: divisionRows.map((r) => r.division),
    }
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

const TIMELINE_PAGE_SIZE = 10

export const listTimeline = createServerFn({ method: 'GET' })
  .validator((data: z.input<typeof listInput>) => listInput.parse(data))
  .handler(async ({ data }) => {
    await requireAdmin()
    const [rows, [{ value: total }]] = await Promise.all([
      db
        .select()
        .from(timelineEntries)
        .orderBy(asc(timelineEntries.sortOrder), asc(timelineEntries.id))
        .limit(TIMELINE_PAGE_SIZE)
        .offset((data.page - 1) * TIMELINE_PAGE_SIZE),
      db.select({ value: count() }).from(timelineEntries),
    ])
    return { rows, total, page: data.page, pageSize: TIMELINE_PAGE_SIZE }
  })

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

const STATS_PAGE_SIZE = 8

export const listStats = createServerFn({ method: 'GET' })
  .validator((data: z.input<typeof listInput>) => listInput.parse(data))
  .handler(async ({ data }) => {
    await requireAdmin()
    const [rows, [{ value: total }]] = await Promise.all([
      db
        .select()
        .from(stats)
        .orderBy(asc(stats.sortOrder), asc(stats.id))
        .limit(STATS_PAGE_SIZE)
        .offset((data.page - 1) * STATS_PAGE_SIZE),
      db.select({ value: count() }).from(stats),
    ])
    return { rows, total, page: data.page, pageSize: STATS_PAGE_SIZE }
  })

// ─── Site settings ─────────────────────────────────────────────────────────

const settingsInput = z.object({
  instagram: z.string(),
  website: z.string(),
  ctfUrl: z.string(),
  discord: z.string().default(''),
  github: z.string().default(''),
  contactEmail: z.string(),
  logoPhilosophy: z.string().default(''),
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

// ─── Shortlinks ──────────────────────────────────────────────────────────────

const SHORTLINKS_PAGE_SIZE = 10

export const listShortlinks = createServerFn({ method: 'GET' })
  .validator((data: z.input<typeof listInput>) => listInput.parse(data))
  .handler(async ({ data }) => {
    await requireAdmin()
    const [rows, [{ value: total }]] = await Promise.all([
      db
        .select()
        .from(shortlinks)
        .orderBy(desc(shortlinks.createdAt))
        .limit(SHORTLINKS_PAGE_SIZE)
        .offset((data.page - 1) * SHORTLINKS_PAGE_SIZE),
      db.select({ value: count() }).from(shortlinks),
    ])
    return { rows, total, page: data.page, pageSize: SHORTLINKS_PAGE_SIZE }
  })

const shortlinkInput = z.object({
  id: z.number().int().optional(),
  url: z.string().min(1),
  code: z.string().optional(),
})

export const saveShortlink = createServerFn({ method: 'POST' })
  .validator((data: z.input<typeof shortlinkInput>) =>
    shortlinkInput.parse(data),
  )
  .handler(async ({ data }) => {
    await requireAdmin()

    const url = data.url.trim()

    if (!isSafeTargetUrl(url)) {
      throw new Error('URL tujuan harus diawali http:// atau https://')
    }

    let code = (data.code ?? '').trim()

    if (data.id) {
      const existing = await db.query.shortlinks.findFirst({
        where: eq(shortlinks.id, data.id),
      })
      if (!existing) throw new Error('Shortlink tidak ditemukan')

      const finalCode = code || existing.code

      if (!isValidCode(finalCode)) {
        throw new Error(
          'Kode tidak valid. Gunakan huruf, angka, strip, underscore (1-64 karakter). Kata yang di-reserve tidak diizinkan.',
        )
      }

      const [row] = await db
        .update(shortlinks)
        .set({ url, code: finalCode })
        .where(eq(shortlinks.id, data.id))
        .returning({ id: shortlinks.id, code: shortlinks.code })
      return row
    }

    if (!code) {
      for (let attempts = 0; attempts < 5; attempts++) {
        code = generateCode()
        const conflict = await db.query.shortlinks.findFirst({
          where: eq(shortlinks.code, code),
        })
        if (!conflict) break
      }
    }

    if (!isValidCode(code)) {
      throw new Error(
        'Kode tidak valid. Gunakan huruf, angka, strip, underscore (1-64 karakter). Kata yang di-reserve tidak diizinkan.',
      )
    }

    const exists = await db.query.shortlinks.findFirst({
      where: eq(shortlinks.code, code),
    })
    if (exists) {
      throw new Error(`Kode "${code}" sudah dipakai.`)
    }

    const [row] = await db
      .insert(shortlinks)
      .values({ code, url })
      .returning({ id: shortlinks.id, code: shortlinks.code })
    return row
  })

export const deleteShortlink = createServerFn({ method: 'POST' })
  .validator((id: number) => z.number().int().parse(id))
  .handler(async ({ data: id }) => {
    await requireAdmin()
    await db.delete(shortlinks).where(eq(shortlinks.id, id))
    return { ok: true as const }
  })
