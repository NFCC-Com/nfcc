import { Link } from '@tanstack/react-router'
import {
  InstagramIcon,
  GlobeIcon,
  TerminalIcon,
  ShieldIcon,
} from 'lucide-react'

import type { SiteSettings } from '#/db/schema.ts'

const LINKS = [
  { to: '/about', label: 'About' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Contact' },
] as const

function displayHandle(url: string): string {
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '')
}

export function Footer({ settings }: { settings: SiteSettings }) {
  const socials = [
    {
      label: `@${displayHandle(settings.instagram).replace(/^instagram\.com\//, '')}`,
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
    <footer className="band-dark">
      <div className="grid-texture" />
      <div className="page-wrap relative py-14">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2 font-display text-lg font-semibold">
              <span className="flex size-8 items-center justify-center rounded-md bg-white/10 text-brand-orange-soft">
                <ShieldIcon className="size-4.5" strokeWidth={2.25} />
              </span>
              Nurul Fikri Cybersecurity Community
            </div>
            <p className="mt-3 max-w-sm text-sm text-white/65">
              A student community for hands-on offensive security practice —
              workshops, CTFs, and boot-to-root sessions at STT Terpadu Nurul
              Fikri.
            </p>
          </div>

          <div>
            <div className="eyebrow">Explore</div>
            <ul className="mt-3 space-y-2 text-sm text-white/75">
              {LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="hover:text-brand-orange-soft">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="eyebrow">Find us</div>
            <ul className="mt-3 space-y-2 text-sm text-white/75">
              {socials.map((social) => (
                <li key={social.href}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-2 hover:text-brand-orange-soft"
                  >
                    <social.icon className="size-4" />
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 font-mono text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <span>
            &copy; {new Date().getFullYear()} NFCC. All rights reserved.
          </span>
          <span>STT Terpadu Nurul Fikri</span>
        </div>
      </div>
    </footer>
  )
}
