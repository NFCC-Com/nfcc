import { Link, useRouter, useRouterState } from '@tanstack/react-router'
import type { LucideIcon } from 'lucide-react'
import {
  LayoutDashboardIcon,
  FileTextIcon,
  ImageIcon,
  UsersIcon,
  MilestoneIcon,
  BarChart3Icon,
  SettingsIcon,
  LogOutIcon,
  ExternalLinkIcon,
  LinkIcon,
} from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from '#/components/ui/sidebar.tsx'
import { signOut } from '#/server/admin.ts'

type NavItem = {
  to: string
  label: string
  icon: LucideIcon
  exact?: boolean
}

const NAV_GROUPS: { label: string; items: NavItem[] }[] = [
  {
    label: 'Utama',
    items: [
      { to: '/dashboard', label: 'Ringkasan', icon: LayoutDashboardIcon, exact: true },
    ],
  },
  {
    label: 'Konten',
    items: [
      { to: '/dashboard/posts', label: 'Post blog', icon: FileTextIcon },
      { to: '/dashboard/gallery', label: 'Galeri', icon: ImageIcon },
      { to: '/dashboard/team', label: 'Tim', icon: UsersIcon },
      { to: '/dashboard/timeline', label: 'Timeline', icon: MilestoneIcon },
      { to: '/dashboard/stats', label: 'Statistik', icon: BarChart3Icon },
    ],
  },
  {
    label: 'Situs',
    items: [
      { to: '/dashboard/settings', label: 'Pengaturan situs', icon: SettingsIcon },
      { to: '/dashboard/shortlinks', label: 'Shortlink', icon: LinkIcon },
    ],
  },
]

function isNavItemActive(item: NavItem, pathname: string) {
  return item.exact ? pathname === item.to : pathname.startsWith(item.to)
}

function NavGroup({
  label,
  items,
  pathname,
  onNavigate,
}: {
  label: string
  items: NavItem[]
  pathname: string
  onNavigate: () => void
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.to}>
              <SidebarMenuButton
                asChild
                isActive={isNavItemActive(item, pathname)}
                tooltip={item.label}
              >
                <Link to={item.to} onClick={onNavigate}>
                  <item.icon className="size-4" />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

export function AppSidebar({ email }: { email: string }) {
  const router = useRouter()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const { isMobile, setOpenMobile } = useSidebar()

  function closeMobile() {
    if (isMobile) setOpenMobile(false)
  }

  async function handleSignOut() {
    closeMobile()
    await signOut()
    await router.navigate({ to: '/dashboard/login' })
    router.invalidate()
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link
          to="/dashboard"
          onClick={closeMobile}
          className="flex items-center gap-2 px-2 pt-3 pb-2 font-display text-base font-semibold"
        >
          <img src="/logo.png" alt="NFCC" className="size-7 shrink-0 rounded-md" />
          NFCC Admin
        </Link>
        <Link
          to="/dashboard"
          onClick={closeMobile}
          className="hidden items-center justify-center py-2"
        >
          <img src="/logo.png" alt="NFCC" className="size-7 rounded-md" />
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {NAV_GROUPS.map((group) => (
          <NavGroup
            key={group.label}
            label={group.label}
            items={group.items}
            pathname={pathname}
            onNavigate={closeMobile}
          />
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Lihat situs">
              <a href="/" target="_blank" rel="noreferrer" onClick={closeMobile}>
                <ExternalLinkIcon className="size-4" />
                <span>Lihat situs</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <div className="mt-auto px-3 pb-2">
          <p
            className="truncate px-2 text-xs text-muted-foreground group-data-[collapsible=icon]:hidden"
            title={email}
          >
            {email}
          </p>
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2"
          >
            <LogOutIcon className="size-4 shrink-0" />
            <span className="group-data-[collapsible=icon]:hidden">Keluar</span>
          </button>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
