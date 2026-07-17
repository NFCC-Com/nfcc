import { Outlet, createFileRoute } from '@tanstack/react-router'

import { Toaster } from '#/components/ui/sonner.tsx'

export const Route = createFileRoute('/dashboard')({
  component: DashboardRoot,
  head: () => ({ meta: [{ title: 'NFCC Admin' }] }),
})

function DashboardRoot() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Outlet />
      <Toaster position="top-right" richColors />
    </div>
  )
}
