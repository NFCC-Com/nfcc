import { Link } from '@tanstack/react-router'
import { InstagramIcon, GlobeIcon, TerminalIcon } from 'lucide-react'

import type { SiteSettings } from '#/db/schema.ts'

const LINKS = [
  { to: '/about', label: 'Tentang' },
  { to: '/gallery', label: 'Galeri' },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Kontak' },
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
    <footer className="band-dark overflow-hidden">
      <img
        src="/footer.webp"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-60"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-brand-navy via-brand-navy/65 to-brand-navy" />
      <div className="page-wrap relative py-14">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2 font-display text-lg font-semibold">
              <img src="/logo.png" alt="NFCC" className="size-8 rounded-md" />
              Nurul Fikri Cybersecurity Community
            </div>
            <p className="mt-3 max-w-sm text-sm text-white/65">
              Komunitas mahasiswa buat praktik offensive security langsung —
              workshop, CTF, dan sesi boot-to-root di STT Terpadu Nurul Fikri.
            </p>
          </div>

          <div>
            <div className="eyebrow">Jelajah</div>
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
            <div className="eyebrow">Temuin kita</div>
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
            &copy; {new Date().getFullYear()} NFCC. Hak cipta dilindungi.
          </span>
          <span>STT Terpadu Nurul Fikri</span>
        </div>
      </div>
    </footer>
  )
}
