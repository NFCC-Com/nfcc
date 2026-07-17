import * as React from 'react'
import { Link } from '@tanstack/react-router'
import { MenuIcon, ShieldIcon } from 'lucide-react'

import { Button } from '#/components/ui/button.tsx'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '#/components/ui/sheet.tsx'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Contact' },
] as const

function Wordmark() {
  return (
    <Link
      to="/"
      className="flex items-center gap-2 font-display text-lg font-semibold text-foreground"
    >
      <span className="flex size-8 items-center justify-center rounded-md bg-brand-navy text-brand-orange">
        <ShieldIcon className="size-4.5" strokeWidth={2.25} />
      </span>
      NFCC
    </Link>
  )
}

export function Header() {
  const [open, setOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="page-wrap flex h-16 items-center justify-between">
        <Wordmark />

        <nav className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="nav-link text-sm"
              activeOptions={{ exact: link.to === '/' }}
              activeProps={{ className: 'is-active' }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button asChild size="sm">
            <Link to="/contact">Join NFCC</Link>
          </Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="outline" size="icon" aria-label="Open menu">
              <MenuIcon className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetTitle className="px-4 pt-4 font-display">Navigate</SheetTitle>
            <nav className="flex flex-col gap-1 px-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
                  activeProps={{ className: 'bg-muted text-brand-orange' }}
                >
                  {link.label}
                </Link>
              ))}
              <Button asChild className="mt-3" onClick={() => setOpen(false)}>
                <Link to="/contact">Join NFCC</Link>
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
