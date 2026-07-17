import * as React from 'react'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { ShieldIcon } from 'lucide-react'

import { Button } from '#/components/ui/button.tsx'
import { Input } from '#/components/ui/input.tsx'
import { Label } from '#/components/ui/label.tsx'
import { signIn } from '#/server/admin.ts'

export const Route = createFileRoute('/dashboard/login')({
  component: Login,
  head: () => ({ meta: [{ title: 'Sign in — NFCC Admin' }] }),
})

function Login() {
  const router = useRouter()
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)
  const [pending, setPending] = React.useState(false)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setPending(true)
    setError(null)
    const result = await signIn({ data: { email, password } })
    setPending(false)
    if (!result.ok) {
      setError(result.error)
      return
    }
    await router.navigate({ to: '/dashboard' })
    router.invalidate()
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <span className="flex size-12 items-center justify-center rounded-xl bg-brand-navy text-brand-orange">
            <ShieldIcon className="size-6" strokeWidth={2.25} />
          </span>
          <h1 className="display-title text-2xl font-semibold">NFCC Admin</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to manage the site.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6"
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={pending}>
            {pending ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
      </div>
    </div>
  )
}
