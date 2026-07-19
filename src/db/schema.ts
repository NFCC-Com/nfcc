import { sql } from 'drizzle-orm'
import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core'

export const shortlinks = pgTable(
  'shortlinks',
  {
    id: serial('id').primaryKey(),
    code: text('code').notNull(),
    url: text('url').notNull(),
    clicks: integer('clicks').notNull().default(0),
    lastClickedAt: timestamp('last_clicked_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [uniqueIndex('shortlinks_code_idx').on(table.code)],
)

export const posts = pgTable(
  'posts',
  {
    id: serial('id').primaryKey(),
    slug: text('slug').notNull(),
    title: text('title').notNull(),
    excerpt: text('excerpt').notNull().default(''),
    body: text('body').notNull().default(''),
    cover: text('cover'),
    tags: text('tags')
      .array()
      .notNull()
      .default(sql`ARRAY[]::text[]`),
    author: text('author').notNull().default('Tim NFCC'),
    published: boolean('published').notNull().default(false),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [uniqueIndex('posts_slug_idx').on(table.slug)],
)

export const galleryItems = pgTable('gallery_items', {
  id: serial('id').primaryKey(),
  image: text('image').notNull(),
  caption: text('caption').notNull().default(''),
  tag: text('tag').notNull().default('Umum'),
  date: text('date').notNull().default(''),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export const teamMembers = pgTable('team_members', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  role: text('role').notNull().default(''),
  division: text('division').notNull().default('Tim Inti'),
  periodeStart: integer('periode_start'),
  periodeEnd: integer('periode_end'),
  photo: text('photo').notNull().default('/placeholders/avatar.svg'),
  instagram: text('instagram').notNull().default(''),
  linkedin: text('linkedin').notNull().default(''),
  github: text('github').notNull().default(''),
  sortOrder: integer('sort_order').notNull().default(0),
})

export const timelineEntries = pgTable('timeline_entries', {
  id: serial('id').primaryKey(),
  year: text('year').notNull().default(''),
  title: text('title').notNull(),
  description: text('description').notNull().default(''),
  sortOrder: integer('sort_order').notNull().default(0),
})

export const stats = pgTable('stats', {
  id: serial('id').primaryKey(),
  label: text('label').notNull(),
  value: text('value').notNull().default(''),
  sortOrder: integer('sort_order').notNull().default(0),
})

// Singleton row (id = 1) holding site-wide links/settings.
export const siteSettings = pgTable('site_settings', {
  id: integer('id').primaryKey().default(1),
  instagram: text('instagram')
    .notNull()
    .default('https://instagram.com/nfcc.id'),
  website: text('website').notNull().default('https://nfcc.my.id'),
  ctfUrl: text('ctf_url').notNull().default('https://ctf.nfcc.my.id'),
  discord: text('discord').notNull().default(''),
  github: text('github').notNull().default(''),
  contactEmail: text('contact_email').notNull().default('contact@nfcc.my.id'),
  logoPhilosophy: text('logo_philosophy').notNull().default(''),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export type Post = typeof posts.$inferSelect
export type NewPost = typeof posts.$inferInsert
export type GalleryItem = typeof galleryItems.$inferSelect
export type TeamMember = typeof teamMembers.$inferSelect
export type TimelineEntry = typeof timelineEntries.$inferSelect
export type Stat = typeof stats.$inferSelect
export type SiteSettings = typeof siteSettings.$inferSelect
export type Shortlink = typeof shortlinks.$inferSelect
