import * as React from 'react'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'

import { Button } from '#/components/ui/button.tsx'
import { Input } from '#/components/ui/input.tsx'
import { FormField, fieldErrors } from '#/components/dashboard/form-field.tsx'
import { signIn } from '#/server/admin.ts'

const loginSchema = z.object({
  email: z.string().email('Email yang valid ya'),
  password: z.string().min(1, 'Password wajib diisi'),
})

export const Route = createFileRoute('/dashboard/login')({
  component: Login,
  head: () => ({ meta: [{ title: 'Login \u2014 NFCC Admin' }] }),
})

function Login() {
  const router = useRouter()
  const [error, setError] = React.useState<string | null>(null)

  const form = useForm({
    defaultValues: { email: '', password: '' },
    validators: { onChange: loginSchema },
    onSubmit: async ({ value }) => {
      setError(null)
      const result = await signIn({ data: value })
      if (!result.ok) {
        setError(result.error)
        return
      }
      await router.navigate({ to: '/dashboard' })
      router.invalidate()
    },
  })

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <img src="/logo.png" alt="NFCC" className="size-12 rounded-xl" />
          <h1 className="display-title text-2xl font-semibold">NFCC Admin</h1>
          <p className="text-sm text-muted-foreground">
            Login buat ngelola situs.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            void form.handleSubmit()
          }}
          className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6"
        >
          <form.Field name="email" validators={{ onChange: z.string().email('Email yang valid ya') }}>
            {(field) => (
              <FormField label="Email" htmlFor="email" errors={fieldErrors(field)}>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
              </FormField>
            )}
          </form.Field>

          <form.Field name="password" validators={{ onChange: z.string().min(1, 'Password wajib diisi') }}>
            {(field) => (
              <FormField label="Password" htmlFor="password" errors={fieldErrors(field)}>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
              </FormField>
            )}
          </form.Field>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" disabled={form.state.isSubmitting}>
            {form.state.isSubmitting ? 'Login\u2026' : 'Login'}
          </Button>
        </form>
      </div>
    </div>
  )
}
