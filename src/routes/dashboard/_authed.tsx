import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

import { DashboardSidebar } from '#/components/dashboard/sidebar.tsx'
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
    <div className="flex min-h-screen">
      <div className="hidden w-64 shrink-0 md:block">
        <DashboardSidebar email={user.email} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="mx-auto max-w-5xl px-5 py-8">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
