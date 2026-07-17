import * as React from 'react'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'

import { PageHeader } from '#/components/dashboard/page-header.tsx'
import { Button } from '#/components/ui/button.tsx'
import { Input } from '#/components/ui/input.tsx'
import { Label } from '#/components/ui/label.tsx'
import { saveSettings } from '#/server/admin.ts'
import { getSettings } from '#/server/content.ts'

export const Route = createFileRoute('/dashboard/_authed/settings')({
  component: SettingsAdmin,
  loader: () => getSettings(),
})

function SettingsAdmin() {
  const settings = Route.useLoaderData()
  const router = useRouter()
  const [instagram, setInstagram] = React.useState(settings.instagram)
  const [website, setWebsite] = React.useState(settings.website)
  const [ctfUrl, setCtfUrl] = React.useState(settings.ctfUrl)
  const [contactEmail, setContactEmail] = React.useState(settings.contactEmail)
  const [saving, setSaving] = React.useState(false)

  async function handleSave() {
    setSaving(true)
    try {
      await saveSettings({ data: { instagram, website, ctfUrl, contactEmail } })
      toast.success('Settings saved')
      router.invalidate()
    } catch {
      toast.error('Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Site settings"
        description="Links and contact info used across the site."
      />
      <div className="flex max-w-lg flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label>Instagram URL</Label>
          <Input
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Website URL</Label>
          <Input value={website} onChange={(e) => setWebsite(e.target.value)} />
        </div>
        <div className="flex flex-col gap-2">
          <Label>CTF platform URL</Label>
          <Input value={ctfUrl} onChange={(e) => setCtfUrl(e.target.value)} />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Contact email</Label>
          <Input
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
          />
        </div>
        <Button onClick={handleSave} disabled={saving} className="self-start">
          {saving ? 'Saving…' : 'Save settings'}
        </Button>
      </div>
    </div>
  )
}
