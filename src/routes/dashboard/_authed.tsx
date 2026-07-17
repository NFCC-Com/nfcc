import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

import { AppSidebar } from '#/components/dashboard/sidebar.tsx'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '#/components/ui/sidebar.tsx'
import { Separator } from '#/components/ui/separator.tsx'
import { getSessionUser } from '#/server/admin.ts'

export const Route = createFileRoute('/dashboard/_authed')({
  component: AuthedLayout,
  beforeLoad: async () => {
    const user = await getSessionUser()
    if (!user) {
      throw redirect({ to: '/dashboard/login' })
    }
    return { user }
  },
  loader: ({ context }) => ({ user: context.user }),
})

function AuthedLayout() {
  const { user } = Route.useLoaderData()

  return (
    <SidebarProvider>
      <AppSidebar email={user.email} />

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <span className="truncate text-sm font-medium text-muted-foreground">
              {user.email}
            </span>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-4 pt-6 md:p-6">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
