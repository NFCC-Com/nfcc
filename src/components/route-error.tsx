import { Link } from '@tanstack/react-router'
import { AlertTriangleIcon } from 'lucide-react'

import { Button } from '#/components/ui/button.tsx'

export function RouteError({ error }: { error: unknown }) {
  const message =
    error instanceof Error ? error.message : 'Something went wrong.'

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-accent text-brand-orange-deep">
        <AlertTriangleIcon className="size-6" />
      </span>
      <h1 className="display-title text-3xl font-semibold">Unexpected error</h1>
      <p className="max-w-md text-sm text-muted-foreground">{message}</p>
      <Button asChild className="mt-2">
        <Link to="/">Back to home</Link>
      </Button>
    </div>
  )
}
