import { createFileRoute, Link } from '@tanstack/react-router'
import {
  FileTextIcon,
  ImageIcon,
  UsersIcon,
  MilestoneIcon,
  BarChart3Icon,
  SettingsIcon,
  LinkIcon,
} from 'lucide-react'

import { PageHeader } from '#/components/dashboard/page-header.tsx'
import { SkeletonCardGrid } from '#/components/dashboard/skeletons.tsx'
import { SlidingNumber } from '#/components/animate-ui/primitives/texts/sliding-number.tsx'
import {
  listAllPosts,
  listGallery,
  listTeam,
  listTimeline,
  listStats,
  listShortlinks,
} from '#/server/admin.ts'

export const Route = createFileRoute('/dashboard/_authed/')({
  component: Overview,
  pendingMs: 200,
  pendingComponent: () => <SkeletonCardGrid />,
  loader: async () => {
    const [posts, gallery, team, timeline, stats, shortlinks] =
      await Promise.all([
        listAllPosts(),
        listGallery(),
        listTeam(),
        listTimeline(),
        listStats(),
        listShortlinks(),
      ])
    return {
      counts: {
        posts: posts.length,
        published: posts.filter((p) => p.published).length,
        gallery: gallery.length,
        team: team.length,
        timeline: timeline.length,
        stats: stats.length,
        shortlinks: shortlinks.length,
      },
    }
  },
})

function Overview() {
  const { counts } = Route.useLoaderData()

  const statCards = [
    { to: '/dashboard/posts', label: 'Post blog', icon: FileTextIcon, number: counts.posts, suffix: counts.published === counts.posts ? `${counts.published} dipublikasi` : `${counts.published}/${counts.posts} dipublikasi` },
    { to: '/dashboard/gallery', label: 'Item galeri', icon: ImageIcon, number: counts.gallery },
    { to: '/dashboard/team', label: 'Anggota tim', icon: UsersIcon, number: counts.team },
    { to: '/dashboard/timeline', label: 'Entri timeline', icon: MilestoneIcon, number: counts.timeline },
    { to: '/dashboard/stats', label: 'Statistik', icon: BarChart3Icon, number: counts.stats },
    { to: '/dashboard/shortlinks', label: 'Shortlink', icon: LinkIcon, number: counts.shortlinks },
  ] as const

  return (
    <div>
      <PageHeader
        title="Ringkasan"
        description="Kelola semua konten di situs publik NFCC."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card) => (
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
            <div className="font-display text-xl font-semibold tabular-nums group-hover:text-brand-orange">
              <SlidingNumber
                number={card.number}
                inViewOnce
                inViewMargin="-40px"
                transition={{ stiffness: 200, damping: 20, mass: 0.4 }}
              />
            </div>
            {'suffix' in card && card.suffix && (
              <div className="mt-0.5 text-xs text-muted-foreground tabular-nums">
                {card.suffix}
              </div>
            )}
          </Link>
        ))}
        <Link
          to="/dashboard/settings"
          className="group rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md"
        >
          <span className="flex size-10 items-center justify-center rounded-lg bg-accent text-brand-orange-deep">
            <SettingsIcon className="size-5" />
          </span>
          <div className="mt-4 text-sm text-muted-foreground">
            Site settings
          </div>
          <div className="font-display text-xl font-semibold group-hover:text-brand-orange">
            Edit tautan
          </div>
        </Link>
      </div>
    </div>
  )
}
