import { createServerFn } from '@tanstack/react-start'
import { asc, count, desc, eq, sql } from 'drizzle-orm'
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
import { renderMarkdown } from '#/lib/markdown.ts'

/** Published post summaries (no body), newest first — for public blog list + landing. */
const PUBLISHED_POSTS_PAGE_SIZE = 9

const publishedPostsInput = z.object({ page: z.number().int().min(1).catch(1).default(1) })

export const getPublishedPosts = createServerFn({ method: 'GET' })
  .validator((data: z.input<typeof publishedPostsInput>) =>
    publishedPostsInput.parse(data),
  )
  .handler(async ({ data }) => {
    const [rows, [{ value: total }]] = await Promise.all([
      db
        .select({
          slug: posts.slug,
          title: posts.title,
          excerpt: posts.excerpt,
          tags: posts.tags,
          cover: posts.cover,
          publishedAt: posts.publishedAt,
          createdAt: posts.createdAt,
        })
        .from(posts)
        .where(eq(posts.published, true))
        .orderBy(desc(posts.publishedAt), desc(posts.createdAt))
        .limit(PUBLISHED_POSTS_PAGE_SIZE)
        .offset((data.page - 1) * PUBLISHED_POSTS_PAGE_SIZE),
      db.select({ value: count() }).from(posts).where(eq(posts.published, true)),
    ])

    return {
      rows: rows.map((row) => ({
        slug: row.slug,
        title: row.title,
        excerpt: row.excerpt,
        tags: row.tags,
        cover: row.cover,
        date: (row.publishedAt ?? row.createdAt).toISOString(),
      })),
      total,
      page: data.page,
      pageSize: PUBLISHED_POSTS_PAGE_SIZE,
    }
  })

/** One published post by slug, with markdown rendered to HTML. Null if missing/unpublished. */
export const getPublishedPost = createServerFn({ method: 'GET' })
  .validator((slug: string) => z.string().parse(slug))
  .handler(async ({ data: slug }) => {
    const row = await db.query.posts.findFirst({ where: eq(posts.slug, slug) })
    if (!row || !row.published) return null

    const html = await renderMarkdown(row.body)
    return {
      slug: row.slug,
      title: row.title,
      excerpt: row.excerpt,
      tags: row.tags,
      cover: row.cover,
      author: row.author,
      date: (row.publishedAt ?? row.createdAt).toISOString(),
      html,
    }
  })

const GALLERY_PUBLIC_PAGE_SIZE = 12

const galleryPublicInput = z.object({ page: z.number().int().min(1).catch(1).default(1) })

export const getGallery = createServerFn({ method: 'GET' })
  .validator((data: z.input<typeof galleryPublicInput>) =>
    galleryPublicInput.parse(data),
  )
  .handler(async ({ data }) => {
    const [rows, [{ value: total }]] = await Promise.all([
      db
        .select()
        .from(galleryItems)
        .orderBy(asc(galleryItems.sortOrder), desc(galleryItems.date))
        .limit(GALLERY_PUBLIC_PAGE_SIZE)
        .offset((data.page - 1) * GALLERY_PUBLIC_PAGE_SIZE),
      db.select({ value: count() }).from(galleryItems),
    ])
    return { rows, total, page: data.page, pageSize: GALLERY_PUBLIC_PAGE_SIZE }
  })

export const getTeam = createServerFn({ method: 'GET' }).handler(async () => {
  return db
    .select()
    .from(teamMembers)
    .orderBy(asc(teamMembers.sortOrder), asc(teamMembers.id))
})

export const getTimeline = createServerFn({ method: 'GET' }).handler(
  async () => {
    return db
      .select()
      .from(timelineEntries)
      .orderBy(asc(timelineEntries.sortOrder), asc(timelineEntries.id))
  },
)

export const getStats = createServerFn({ method: 'GET' }).handler(async () => {
  return db.select().from(stats).orderBy(asc(stats.sortOrder), asc(stats.id))
})

export const getSettings = createServerFn({ method: 'GET' }).handler(
  async () => {
    const row = await db.query.siteSettings.findFirst({
      where: eq(siteSettings.id, 1),
    })
    return (
      row ?? {
        id: 1,
        instagram: 'https://instagram.com/nfcc.id',
        website: 'https://nfcc.my.id',
        ctfUrl: 'https://ctf.nfcd.id',
        contactEmail: 'contact@nfcc.my.id',
        logoPhilosophy: '',
        updatedAt: new Date(),
      }
    )
  },
)

export const resolveShortlink = createServerFn({ method: 'GET' })
  .validator((code: string) => z.string().parse(code))
  .handler(async ({ data: code }) => {
    const existing = await db.query.shortlinks.findFirst({
      where: eq(shortlinks.code, code),
    })
    if (!existing) return null

    await db
      .update(shortlinks)
      .set({
        clicks: sql`${shortlinks.clicks} + 1`,
        lastClickedAt: sql`now()`,
      })
      .where(eq(shortlinks.id, existing.id))

    return existing.url
  })
