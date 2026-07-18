import {
  MailIcon,
  GlobeIcon,
  TerminalIcon,
  MapPinIcon,
} from 'lucide-react'

import { DiscordIcon, GithubIcon, InstagramIcon } from '#/components/brand-icons.tsx'
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
    ...(settings.discord
      ? [{ label: displayHandle(settings.discord), href: settings.discord, icon: DiscordIcon }]
      : []),
    ...(settings.github
      ? [{ label: displayHandle(settings.github), href: settings.github, icon: GithubIcon }]
      : []),
  ]

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <div className="rounded-xl border border-border bg-card p-6">
        <span className="flex size-10 items-center justify-center rounded-lg bg-accent text-brand-orange-deep">
          <MailIcon className="size-5" />
        </span>
        <h3 className="mt-4 font-display text-lg font-semibold">Email</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Pertanyaan seputar gabung, partnership, atau workshop.
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
        <h3 className="mt-4 font-display text-lg font-semibold">Lokasi</h3>
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
              className="group inline-flex items-center gap-2.5 text-sm font-medium text-foreground transition-colors hover:text-brand-orange"
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-accent text-brand-orange-deep transition-colors group-hover:bg-brand-orange/15">
                <channel.icon className="size-3.5" />
              </span>
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
