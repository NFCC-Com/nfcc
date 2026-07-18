import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { toast } from 'sonner'

import { PageHeader } from '#/components/dashboard/page-header.tsx'
import { FormField, fieldErrors } from '#/components/dashboard/form-field.tsx'
import { Button } from '#/components/ui/button.tsx'
import { Input } from '#/components/ui/input.tsx'
import { Textarea } from '#/components/ui/textarea.tsx'
import { saveSettings } from '#/server/admin.ts'
import { getSettings } from '#/server/content.ts'
import { SkeletonForm } from '#/components/dashboard/skeletons.tsx'

const settingsInput = z.object({
  instagram: z.string().min(1, 'Wajib diisi'),
  website: z.string().min(1, 'Wajib diisi'),
  ctfUrl: z.string().min(1, 'Wajib diisi'),
  discord: z.string(),
  github: z.string(),
  contactEmail: z.string().min(1, 'Wajib diisi'),
  logoPhilosophy: z.string(),
})

export const Route = createFileRoute('/dashboard/_authed/settings')({
  component: SettingsAdmin,
  pendingMs: 200,
  pendingComponent: () => <SkeletonForm fields={4} />,
  loader: () => getSettings(),
})

function SettingsAdmin() {
  const settings = Route.useLoaderData()
  const router = useRouter()

  const form = useForm({
    defaultValues: {
      instagram: settings.instagram,
      website: settings.website,
      ctfUrl: settings.ctfUrl,
      discord: settings.discord,
      github: settings.github,
      contactEmail: settings.contactEmail,
      logoPhilosophy: settings.logoPhilosophy,
    } satisfies z.input<typeof settingsInput>,
    validators: { onChange: settingsInput },
    onSubmit: async ({ value }) => {
      await saveSettings({ data: value })
      toast.success('Pengaturan disimpan')
      router.invalidate()
    },
  })

  return (
    <div>
      <PageHeader title="Pengaturan situs" description="Tautan dan info kontak yang dipakai di seluruh situs." />
      <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); void form.handleSubmit() }} className="flex max-w-lg flex-col gap-4">
        <form.Field name="instagram" validators={{ onChange: z.string().min(1, 'Wajib diisi') }}>
          {(f) => <FormField label="URL Instagram" errors={fieldErrors(f)}><Input value={f.state.value} onChange={(e) => f.handleChange(e.target.value)} onBlur={f.handleBlur} /></FormField>}
        </form.Field>
        <form.Field name="website" validators={{ onChange: z.string().min(1, 'Wajib diisi') }}>
          {(f) => <FormField label="URL Website" errors={fieldErrors(f)}><Input value={f.state.value} onChange={(e) => f.handleChange(e.target.value)} onBlur={f.handleBlur} /></FormField>}
        </form.Field>
        <form.Field name="ctfUrl" validators={{ onChange: z.string().min(1, 'Wajib diisi') }}>
          {(f) => <FormField label="URL Platform CTF" errors={fieldErrors(f)}><Input value={f.state.value} onChange={(e) => f.handleChange(e.target.value)} onBlur={f.handleBlur} /></FormField>}
        </form.Field>
        <form.Field name="discord">
          {(f) => <FormField label="URL Discord"><Input value={f.state.value} onChange={(e) => f.handleChange(e.target.value)} onBlur={f.handleBlur} /></FormField>}
        </form.Field>
        <form.Field name="github">
          {(f) => <FormField label="URL GitHub"><Input value={f.state.value} onChange={(e) => f.handleChange(e.target.value)} onBlur={f.handleBlur} /></FormField>}
        </form.Field>
        <form.Field name="contactEmail" validators={{ onChange: z.string().min(1, 'Wajib diisi') }}>
          {(f) => <FormField label="Email kontak" errors={fieldErrors(f)}><Input type="email" value={f.state.value} onChange={(e) => f.handleChange(e.target.value)} onBlur={f.handleBlur} /></FormField>}
        </form.Field>
        <form.Field name="logoPhilosophy">
          {(f) => <FormField label="Filosofi logo"><Textarea rows={5} value={f.state.value} onChange={(e) => f.handleChange(e.target.value)} onBlur={f.handleBlur} /></FormField>}
        </form.Field>
        <Button type="submit" disabled={form.state.isSubmitting} className="self-start">
          {form.state.isSubmitting ? 'Menyimpan\u2026' : 'Simpan pengaturan'}
        </Button>
      </form>
    </div>
  )
}
