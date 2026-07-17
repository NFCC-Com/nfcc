import { createServerFn } from '@tanstack/react-start'
import { asc, desc, eq, sql } from 'drizzle-orm'
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
export const getPublishedPosts = createServerFn({ method: 'GET' }).handler(
  async () => {
    const rows = await db
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

    return rows.map((row) => ({
      slug: row.slug,
      title: row.title,
      excerpt: row.excerpt,
      tags: row.tags,
      cover: row.cover,
      date: (row.publishedAt ?? row.createdAt).toISOString(),
    }))
  },
)

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

export const getGallery = createServerFn({ method: 'GET' }).handler(
  async () => {
    return db
      .select()
      .from(galleryItems)
      .orderBy(asc(galleryItems.sortOrder), desc(galleryItems.date))
  },
)

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
