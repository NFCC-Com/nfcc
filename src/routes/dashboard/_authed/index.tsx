import { createFileRoute, Link } from '@tanstack/react-router'
import type { LucideIcon } from 'lucide-react'
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
import { getDashboardCounts } from '#/server/admin.ts'

export const Route = createFileRoute('/dashboard/_authed/')({
  component: Overview,
  pendingMs: 200,
  pendingComponent: () => <SkeletonCardGrid />,
  loader: async () => ({ counts: await getDashboardCounts() }),
})

function StatCard({
  to,
  label,
  icon: Icon,
  number,
  suffix,
  value,
}: {
  to: string
  label: string
  icon: LucideIcon
  number?: number
  suffix?: string
  value?: string
}) {
  return (
    <Link
      to={to}
      className="group rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md"
    >
      <span className="flex size-10 items-center justify-center rounded-lg bg-accent text-brand-orange-deep">
        <Icon className="size-5" />
      </span>
      <div className="mt-4 text-sm text-muted-foreground">{label}</div>
      <div className="font-display text-xl font-semibold tabular-nums group-hover:text-brand-orange">
        {number != null ? (
          <SlidingNumber
            number={number}
            inViewOnce
            inViewMargin="-40px"
            transition={{ stiffness: 200, damping: 20, mass: 0.4 }}
          />
        ) : (
          value
        )}
      </div>
      {suffix && (
        <div className="mt-0.5 text-xs text-muted-foreground tabular-nums">
          {suffix}
        </div>
      )}
    </Link>
  )
}

function Overview() {
  const { counts } = Route.useLoaderData()

  const statCards = [
    { to: '/dashboard/posts', label: 'Post blog', icon: FileTextIcon, number: counts.posts, suffix: counts.published === counts.posts ? `${counts.published} dipublikasi` : `${counts.published}/${counts.posts} dipublikasi` },
    { to: '/dashboard/gallery', label: 'Item galeri', icon: ImageIcon, number: counts.gallery },
    { to: '/dashboard/team', label: 'Anggota tim', icon: UsersIcon, number: counts.team },
    { to: '/dashboard/timeline', label: 'Entri timeline', icon: MilestoneIcon, number: counts.timeline },
    { to: '/dashboard/stats', label: 'Statistik', icon: BarChart3Icon, number: counts.stats },
    { to: '/dashboard/shortlinks', label: 'Shortlink', icon: LinkIcon, number: counts.shortlinks },
  ]

  return (
    <div>
      <PageHeader
        title="Ringkasan"
        description="Kelola semua konten di situs publik NFCC."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card) => (
          <StatCard key={card.to} {...card} />
        ))}
        <StatCard
          to="/dashboard/settings"
          label="Site settings"
          icon={SettingsIcon}
          value="Edit tautan"
        />
      </div>
    </div>
  )
}
