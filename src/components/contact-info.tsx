import {
  MailIcon,
  InstagramIcon,
  GlobeIcon,
  TerminalIcon,
  MapPinIcon,
} from 'lucide-react'

import { Button } from '#/components/ui/button.tsx'
import type { SiteSettings } from '#/db/schema.ts'

export function ContactInfo({ settings }: { settings: SiteSettings }) {
  const channels = [
    {
      label: displayHandle(settings.instagram),
      href: settings.instagram,
      icon: InstagramIcon,
    },
    {
      label: displayHandle(settings.website),
      href: settings.website,
      icon: GlobeIcon,
    },
    {
      label: displayHandle(settings.ctfUrl),
      href: settings.ctfUrl,
      icon: TerminalIcon,
    },
  ]

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <div className="rounded-xl border border-border bg-card p-6">
        <span className="flex size-10 items-center justify-center rounded-lg bg-accent text-brand-orange-deep">
          <MailIcon className="size-5" />
        </span>
        <h3 className="mt-4 font-display text-lg font-semibold">Email us</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Questions about joining, partnerships, or workshops.
        </p>
        <Button asChild className="mt-4" variant="outline">
          <a href={`mailto:${settings.contactEmail}`}>
            {settings.contactEmail}
          </a>
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <span className="flex size-10 items-center justify-center rounded-lg bg-accent text-brand-orange-deep">
          <MapPinIcon className="size-5" />
        </span>
        <h3 className="mt-4 font-display text-lg font-semibold">Find us</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          STT Terpadu Nurul Fikri, Depok, Indonesia.
        </p>
        <div className="mt-4 flex flex-col gap-2">
          {channels.map((channel) => (
            <a
              key={channel.href}
              href={channel.href}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-brand-orange"
            >
              <channel.icon className="size-4" />
              {channel.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

/** Strip protocol/@-prefix noise so links read as handles (nfcc.my.id, @nfcc.id). */
function displayHandle(url: string): string {
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '')
}
