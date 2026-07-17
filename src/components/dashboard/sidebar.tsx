import { Link, useRouter, useRouterState } from '@tanstack/react-router'
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

const NAV_MAIN = [
  { to: '/dashboard', label: 'Ringkasan', icon: LayoutDashboardIcon, exact: true },
]

const NAV_CONTENT = [
  { to: '/dashboard/posts', label: 'Post blog', icon: FileTextIcon },
  { to: '/dashboard/gallery', label: 'Galeri', icon: ImageIcon },
  { to: '/dashboard/team', label: 'Tim', icon: UsersIcon },
  { to: '/dashboard/timeline', label: 'Timeline', icon: MilestoneIcon },
  { to: '/dashboard/stats', label: 'Statistik', icon: BarChart3Icon },
]

const NAV_SITE = [
  { to: '/dashboard/settings', label: 'Pengaturan situs', icon: SettingsIcon },
  { to: '/dashboard/shortlinks', label: 'Shortlink', icon: LinkIcon },
] as const

export function AppSidebar({ email }: { email: string }) {
  const router = useRouter()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const { isMobile, setOpenMobile } = useSidebar()

  async function handleSignOut() {
    await signOut()
    await router.navigate({ to: '/dashboard/login' })
    router.invalidate()
  }

  function closeMobile() {
    if (isMobile) setOpenMobile(false)
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link
          to="/dashboard"
          onClick={closeMobile}
          className="flex items-center gap-2 px-2 pt-3 pb-2 font-display text-base font-semibold group-data-[collapsible=icon]:hidden"
        >
          <img src="/logo.png" alt="NFCC" className="size-7 shrink-0 rounded-md" />
          NFCC Admin
        </Link>
        <Link
          to="/dashboard"
          onClick={closeMobile}
          className="hidden items-center justify-center py-2 group-data-[collapsible=icon]:flex"
        >
          <img src="/logo.png" alt="NFCC" className="size-7 rounded-md" />
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Utama</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_MAIN.map((item) => {
                const active = 'exact' in item && item.exact
                  ? pathname === item.to
                  : pathname.startsWith(item.to)
                return (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton asChild isActive={active} tooltip={item.label}>
                      <Link to={item.to} onClick={closeMobile}>
                        <item.icon className="size-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Konten</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_CONTENT.map((item) => {
                const active = pathname.startsWith(item.to)
                return (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton asChild isActive={active} tooltip={item.label}>
                      <Link to={item.to} onClick={closeMobile}>
                        <item.icon className="size-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Situs</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_SITE.map((item) => {
                const active = pathname.startsWith(item.to)
                return (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton asChild isActive={active} tooltip={item.label}>
                      <Link to={item.to} onClick={closeMobile}>
                        <item.icon className="size-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Lihat situs">
              <a href="/" target="_blank" rel="noreferrer">
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
