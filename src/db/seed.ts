/**
 * Seeds the database with the original phase-1 content (3 blog posts + placeholder
 * gallery/team/timeline/stats + the site settings row). Idempotent: posts upsert on
 * slug; other tables are only populated when empty. Run with: pnpm db:seed
 */
import { sql } from 'drizzle-orm'
import type { PgTable } from 'drizzle-orm/pg-core'

import { db } from './index.ts'
import {
  galleryItems,
  posts,
  siteSettings,
  stats,
  teamMembers,
  timelineEntries,
} from './schema.ts'

const POSTS = [
  {
    slug: 'offensive-security-basics',
    title: 'Offensive Security Basics: Think Like an Attacker, Legally',
    excerpt:
      "A field guide to the four-phase methodology we teach in NFCC's Offensive Security Basic workshop: recon, scanning, enumeration, exploitation.",
    tags: ['offensive-security', 'methodology', 'workshop'],
    author: 'Tim NFCC',
    publishedAt: new Date('2026-06-01'),
    body: `Offensive security isn't about breaking things for fun — it's a disciplined way of testing whether a system holds up under the same pressure a real attacker would apply, so it can be fixed before someone with worse intentions finds it first. Every legal engagement follows the same rough shape:

## 1. Reconnaissance

Passive information gathering — no packets touching the target yet. DNS records, WHOIS, public code repositories, job postings, leaked credentials. The goal is a map of what exists before you start knocking on doors.

## 2. Scanning

Now you touch the target, carefully. A basic host and port sweep looks like this:

\`\`\`bash
nmap -sV -sC -oA scan/initial 10.10.10.0/24
\`\`\`

\`-sV\` fingerprints service versions, \`-sC\` runs Nmap's default script set, and \`-oA\` writes output in every format so later tooling can parse it.

## 3. Enumeration

Scanning tells you a port is open; enumeration tells you what's actually running behind it — directory structure on a web server, share permissions on SMB, valid usernames on an authentication endpoint. This phase produces the most leads and takes the most patience.

## 4. Exploitation

Only after the first three phases converge on a real, understood weakness do you attempt to exploit it — and only against systems you're authorized to test. The point is proof and remediation, not access for its own sake.

## Tools we cover in the workshop

- **Nmap** — network discovery and service fingerprinting
- **Dirb / Gobuster** — web content discovery
- **Burp Suite** — intercepting proxy for manual web testing

If you want hands-on practice with this exact flow, our Mini Workshop series walks through it end to end.`,
  },
  {
    slug: 'privilege-escalation-linux-cheatsheet',
    title: 'Privilege Escalation on Linux: SUID, Sudo, and the Kernel',
    excerpt:
      'The three misconfigurations we drilled in Pertemuan 3 — SUID abuse, NOPASSWD sudo, and kernel exploits — plus how to close each one off.',
    tags: ['privilege-escalation', 'linux', 'cheatsheet'],
    author: 'Tim NFCC',
    publishedAt: new Date('2026-06-15'),
    body: `Getting a low-privilege shell is usually the easy part. Turning it into \`root\` is where most of a real engagement's time goes. Here are the three misconfigurations we cover in the Privilege Escalation session, and — just as important — how to fix each one.

## 1. SUID (Set User ID) misconfiguration

A SUID binary runs with the file owner's privileges, not the caller's. If a SUID-root binary can be abused to spawn a shell, you inherit root:

\`\`\`bash
find / -perm -4000 -type f 2>/dev/null
\`\`\`

Cross-reference anything unusual against GTFOBins — an enormous catalog of legitimate binaries that can be abused for privilege escalation when misconfigured.

**Fix:** strip the SUID bit (\`chmod u-s\`) from anything that doesn't strictly need it.

## 2. Sudo NOPASSWD misconfiguration

\`\`\`bash
sudo -l
\`\`\`

If this lists a binary the current user can run as root with \`NOPASSWD\`, and that binary can read files, write files, or spawn a shell, it's game over.

**Fix:** scope \`sudo\` rules to the exact command and arguments needed, never a whole binary with a wildcard.

## 3. Kernel vulnerability exploitation

An outdated kernel is a fixed, known attack surface:

\`\`\`bash
uname -a
\`\`\`

Cross-reference the version against public kernel CVEs. A matching public exploit can mean local root in one command.

**Fix:** patch. The most boring and most effective mitigation on this entire list.

## The pattern behind all three

Every privilege escalation vector here comes from the same root cause: something running with more trust than it needs.`,
  },
  {
    slug: 'boot-to-root-field-notes',
    title: 'Boot to Root: Field Notes From Zero to Root',
    excerpt:
      'General field notes on the enumeration-to-privesc pipeline behind our Boot to Root session, without spoiling any specific box.',
    tags: ['ctf', 'boot-to-root', 'walkthrough'],
    author: 'Tim NFCC',
    publishedAt: new Date('2026-06-22'),
    body: `"Boot to root" challenges hand you a booted machine and one goal: get to \`root\` (or \`Administrator\`). No hints about which service is vulnerable, no hand-holding. Here's the general shape most boxes follow — deliberately kept generic since spoiling an active box isn't the point.

## Enumeration first, always

Before touching any exploit code, map every open service:

\`\`\`bash
nmap -p- -T4 -A target.box
\`\`\`

A full port sweep (\`-p-\`) matters — plenty of boxes hide the interesting service on a non-standard port specifically to punish people who only scan the top 1000.

## Web shells, conceptually

If a box exposes a web app with a file upload or an admin panel with weak auth, an uploaded web shell is often the fastest route to a foothold: get arbitrary code running server-side, then upgrade to something interactive. In our session we walk through *why* this works rather than handing out a ready-made payload.

## Reverse shells: getting interactive

A web shell is clunky to work with one command at a time. The next step is almost always upgrading to an interactive reverse shell back to an attacker-controlled listener. We demo this live in the workshop.

## From foothold to root

This is where enumeration starts again, but locally: \`SUID\` binaries, misconfigured \`sudo\` rights, writable cron jobs, kernel version against known CVEs.`,
  },
]

const GALLERY = [
  {
    image: '/placeholders/gallery-1.svg',
    caption: 'Boot to Root: From Zero to Root',
    tag: 'CTF',
    date: '2026-06-21',
    sortOrder: 0,
  },
  {
    image: '/placeholders/gallery-2.svg',
    caption: 'Offensive Security Basic — recon & enumeration session',
    tag: 'Workshop',
    date: '2026-06-07',
    sortOrder: 1,
  },
  {
    image: '/placeholders/gallery-3.svg',
    caption: 'Mini Workshop: Privilege Escalation — taking control',
    tag: 'Workshop',
    date: '2026-06-21',
    sortOrder: 2,
  },
  {
    image: '/placeholders/gallery-1.svg',
    caption: 'SEVIMA Security Challenge briefing',
    tag: 'CTF',
    date: '2026-05-20',
    sortOrder: 3,
  },
  {
    image: '/placeholders/gallery-2.svg',
    caption: 'Re-registration day for the offensive security series',
    tag: 'Komunitas',
    date: '2026-06-21',
    sortOrder: 4,
  },
  {
    image: '/placeholders/gallery-3.svg',
    caption: 'Kernel exploitation walkthrough',
    tag: 'Workshop',
    date: '2026-06-14',
    sortOrder: 5,
  },
]

const TEAM = [
  {
    name: 'Member One',
    role: 'Community Lead',
    division: 'Tim Inti',
    photo: '/placeholders/avatar.svg',
    sortOrder: 0,
  },
  {
    name: 'Member Two',
    role: 'Vice Lead',
    division: 'Tim Inti',
    photo: '/placeholders/avatar.svg',
    sortOrder: 1,
  },
  {
    name: 'Member Three',
    role: 'Secretary',
    division: 'Tim Inti',
    photo: '/placeholders/avatar.svg',
    sortOrder: 2,
  },
  {
    name: 'Member Four',
    role: 'Division Head',
    division: 'Offensive Security',
    photo: '/placeholders/avatar.svg',
    sortOrder: 3,
  },
  {
    name: 'Member Five',
    role: 'Mentor',
    division: 'Offensive Security',
    photo: '/placeholders/avatar.svg',
    sortOrder: 4,
  },
  {
    name: 'Member Six',
    role: 'Member',
    division: 'Offensive Security',
    photo: '/placeholders/avatar.svg',
    sortOrder: 5,
  },
  {
    name: 'Member Seven',
    role: 'Division Head',
    division: 'Community & Events',
    photo: '/placeholders/avatar.svg',
    sortOrder: 6,
  },
  {
    name: 'Member Eight',
    role: 'Member',
    division: 'Community & Events',
    photo: '/placeholders/avatar.svg',
    sortOrder: 7,
  },
]

const TIMELINE = [
  {
    year: '—',
    title: 'NFCC berdiri',
    description:
      'Berdiri di STT Terpadu Nurul Fikri sebagai komunitas mahasiswa untuk praktik cybersecurity hands-on. (Placeholder — ganti dengan tanggal pendirian asli.)',
    sortOrder: 0,
  },
  {
    year: '2026',
    title: 'Offensive Security Basic — Mini Workshop series',
    description:
      'Three-week hands-on series covering reconnaissance, scanning, enumeration, and exploitation fundamentals.',
    sortOrder: 1,
  },
  {
    year: 'Jun 2026',
    title: 'Boot to Root: From Zero to Root',
    description:
      'Hands-on boot-to-root session covering enumeration, PHP web shells, reverse shells, and SUID/kernel privilege escalation.',
    sortOrder: 2,
  },
  {
    year: '2026',
    title: 'SEVIMA Security Challenge',
    description:
      'Hunt-and-report challenge against academic applications, run alongside National Technology Awakening Day.',
    sortOrder: 3,
  },
]

const STATS = [
  { label: 'Anggota aktif', value: '80+', sortOrder: 0 },
  { label: 'Workshop & CTF', value: '20+', sortOrder: 1 },
  { label: 'Tahun aktif', value: '5', sortOrder: 2 },
  { label: 'Event partner', value: '6', sortOrder: 3 },
]

async function seedIfEmpty<T extends { length: number }>(
  name: string,
  rows: T,
  count: () => Promise<number>,
  insert: () => Promise<unknown>,
) {
  const existing = await count()
  if (existing > 0) {
    console.log(`• ${name}: ${existing} rows already present, skipping`)
    return
  }
  await insert()
  console.log(`✓ ${name}: seeded ${rows.length} rows`)
}

async function tableCount(table: PgTable) {
  const rows = await db.select({ n: sql<number>`count(*)::int` }).from(table)
  return rows[0]?.n ?? 0
}

async function main() {
  // Posts — upsert on slug so re-seeding refreshes bodies without duplicating.
  for (const post of POSTS) {
    await db
      .insert(posts)
      .values({ ...post, published: true, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: posts.slug,
        set: {
          title: post.title,
          excerpt: post.excerpt,
          body: post.body,
          tags: post.tags,
          author: post.author,
          published: true,
          publishedAt: post.publishedAt,
          updatedAt: new Date(),
        },
      })
  }
  console.log(`✓ posts: upserted ${POSTS.length} rows`)

  await seedIfEmpty(
    'gallery_items',
    GALLERY,
    () => tableCount(galleryItems),
    () => db.insert(galleryItems).values(GALLERY),
  )
  await seedIfEmpty(
    'team_members',
    TEAM,
    () => tableCount(teamMembers),
    () => db.insert(teamMembers).values(TEAM),
  )
  await seedIfEmpty(
    'timeline_entries',
    TIMELINE,
    () => tableCount(timelineEntries),
    () => db.insert(timelineEntries).values(TIMELINE),
  )
  await seedIfEmpty(
    'stats',
    STATS,
    () => tableCount(stats),
    () => db.insert(stats).values(STATS),
  )

  await db
    .insert(siteSettings)
    .values({ id: 1, updatedAt: new Date() })
    .onConflictDoNothing({ target: siteSettings.id })
  console.log('✓ site_settings: ensured singleton row')

  console.log('\nSeed complete.')
  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
