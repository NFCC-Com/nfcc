import { Link, useRouter } from '@tanstack/react-router'
import {
  LayoutDashboardIcon,
  FileTextIcon,
  ImageIcon,
  UsersIcon,
  MilestoneIcon,
  BarChart3Icon,
  SettingsIcon,
  LogOutIcon,
  ShieldIcon,
  ExternalLinkIcon,
} from 'lucide-react'

import { Button } from '#/components/ui/button.tsx'
import { signOut } from '#/server/admin.ts'

const NAV = [
  {
    to: '/dashboard',
    label: 'Overview',
    icon: LayoutDashboardIcon,
    exact: true,
  },
  {
    to: '/dashboard/posts',
    label: 'Blog posts',
    icon: FileTextIcon,
    exact: false,
  },
  { to: '/dashboard/gallery', label: 'Gallery', icon: ImageIcon, exact: false },
  { to: '/dashboard/team', label: 'Team', icon: UsersIcon, exact: false },
  {
    to: '/dashboard/timeline',
    label: 'Timeline',
    icon: MilestoneIcon,
    exact: false,
  },
  { to: '/dashboard/stats', label: 'Stats', icon: BarChart3Icon, exact: false },
  {
    to: '/dashboard/settings',
    label: 'Site settings',
    icon: SettingsIcon,
    exact: false,
  },
] as const

export function DashboardSidebar({ email }: { email: string }) {
  const router = useRouter()

  async function handleSignOut() {
    await signOut()
    await router.navigate({ to: '/dashboard/login' })
    router.invalidate()
  }

  return (
    <aside className="flex h-full flex-col gap-1 border-r border-border bg-card px-3 py-4">
      <Link
        to="/dashboard"
        className="flex items-center gap-2 px-2 py-2 font-display text-lg font-semibold"
      >
        <span className="flex size-8 items-center justify-center rounded-md bg-brand-navy text-brand-orange">
          <ShieldIcon className="size-4.5" strokeWidth={2.25} />
        </span>
        NFCC Admin
      </Link>

      <nav className="mt-4 flex flex-1 flex-col gap-1">
        {NAV.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            activeOptions={{ exact: item.exact }}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            activeProps={{
              className: 'bg-accent text-brand-orange-deep hover:bg-accent',
            }}
          >
            <item.icon className="size-4" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-2 border-t border-border pt-3">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <ExternalLinkIcon className="size-4" />
          View site
        </a>
        <div
          className="truncate px-3 text-xs text-muted-foreground"
          title={email}
        >
          {email}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSignOut}
          className="justify-start"
        >
          <LogOutIcon className="size-4" />
          Sign out
        </Button>
      </div>
    </aside>
  )
}
