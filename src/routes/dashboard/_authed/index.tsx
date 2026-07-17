import { createFileRoute, Link } from '@tanstack/react-router'
import {
  FileTextIcon,
  ImageIcon,
  UsersIcon,
  MilestoneIcon,
  BarChart3Icon,
  SettingsIcon,
} from 'lucide-react'

import { PageHeader } from '#/components/dashboard/page-header.tsx'
import {
  listAllPosts,
  listGallery,
  listTeam,
  listTimeline,
  listStats,
} from '#/server/admin.ts'

export const Route = createFileRoute('/dashboard/_authed/')({
  component: Overview,
  loader: async () => {
    const [posts, gallery, team, timeline, stats] = await Promise.all([
      listAllPosts(),
      listGallery(),
      listTeam(),
      listTimeline(),
      listStats(),
    ])
    return {
      counts: {
        posts: posts.length,
        published: posts.filter((p) => p.published).length,
        gallery: gallery.length,
        team: team.length,
        timeline: timeline.length,
        stats: stats.length,
      },
    }
  },
})

function Overview() {
  const { counts } = Route.useLoaderData()

  const cards = [
    {
      to: '/dashboard/posts',
      label: 'Blog posts',
      value: `${counts.published}/${counts.posts} published`,
      icon: FileTextIcon,
    },
    {
      to: '/dashboard/gallery',
      label: 'Gallery items',
      value: String(counts.gallery),
      icon: ImageIcon,
    },
    {
      to: '/dashboard/team',
      label: 'Team members',
      value: String(counts.team),
      icon: UsersIcon,
    },
    {
      to: '/dashboard/timeline',
      label: 'Timeline entries',
      value: String(counts.timeline),
      icon: MilestoneIcon,
    },
    {
      to: '/dashboard/stats',
      label: 'Stats',
      value: String(counts.stats),
      icon: BarChart3Icon,
    },
    {
      to: '/dashboard/settings',
      label: 'Site settings',
      value: 'Edit links',
      icon: SettingsIcon,
    },
  ] as const

  return (
    <div>
      <PageHeader
        title="Overview"
        description="Manage everything on the NFCC public site."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.to}
            to={card.to}
            className="group rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md"
          >
            <span className="flex size-10 items-center justify-center rounded-lg bg-accent text-brand-orange-deep">
              <card.icon className="size-5" />
            </span>
            <div className="mt-4 text-sm text-muted-foreground">
              {card.label}
            </div>
            <div className="font-display text-xl font-semibold group-hover:text-brand-orange">
              {card.value}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
