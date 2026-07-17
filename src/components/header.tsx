import * as React from 'react'
import { Link } from '@tanstack/react-router'
import { MenuIcon, XIcon } from 'lucide-react'

import { Button } from '#/components/ui/button.tsx'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '#/components/ui/sheet.tsx'
import { useScroll } from '#/hooks/use-scroll'
import { cn } from '#/lib/utils.ts'

const NAV_LINKS = [
  { to: '/', label: 'Beranda' },
  { to: '/about', label: 'Tentang' },
  { to: '/gallery', label: 'Galeri' },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Kontak' },
] as const

function Wordmark({ invert }: { invert: boolean }) {
  return (
    <Link to="/" className="group flex items-center gap-2.5">
      <img
        src="/logo.png"
        alt="NFCC"
        className="size-9 rounded-lg transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3"
      />
      <span
        style={invert ? { color: '#fff', mixBlendMode: 'difference' } : undefined}
        className={cn(
          'text-lg font-semibold tracking-tight transition-colors',
          !invert && 'text-stone-900',
        )}
      >
        NFCC
      </span>
    </Link>
  )
}

function NavLink({
  to,
  label,
  isActive,
  invert,
}: {
  to: string
  label: string
  isActive: boolean
  invert: boolean
}) {
  return (
    <Link
      to={to}
      style={invert ? { color: '#fff', mixBlendMode: 'difference' } : undefined}
      className={cn(
        'relative py-2 text-sm font-medium transition-colors',
        invert ? 'hover:opacity-70' : 'text-stone-600 hover:text-stone-900',
      )}
      activeOptions={{ exact: to === '/' }}
      activeProps={!invert ? { className: 'text-stone-900' } : undefined}
    >
      {label}
      <span
        className={`absolute bottom-0 left-0 h-0.5 bg-orange-500 transition-all duration-300 ${isActive ? 'w-full' : 'w-0'
          }`}
      />
    </Link>
  )
}

export function Header({ darkHero = false }: { darkHero?: boolean }) {
  const [open, setOpen] = React.useState(false)
  const { scrolled, scrollDirection } = useScroll()

  const isHidden = scrollDirection === 'down' && scrolled
  // Only invert (blend against hero) while unscrolled + over a hero image.
  // Once scrolled, we're on a solid bg, so use normal dark text instead.
  const invert = darkHero && !scrolled

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-stone-200/60 bg-white/80 shadow-sm backdrop-blur-lg'
          : 'border-b border-transparent bg-transparent',
        isHidden ? '-translate-y-full' : 'translate-y-0',
      )}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Wordmark invert={invert} />

          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                label={link.label}
                isActive={false}
                invert={invert}
              />
            ))}
          </nav>

          <div className="hidden md:block">
            <Button asChild size="sm">
              <Link to="/contact">Gabung NFCC</Link>
            </Button>
          </div>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Buka menu"
                style={invert ? { color: '#fff', mixBlendMode: 'difference' } : undefined}
                className={cn('rounded-full', !invert && 'hover:bg-stone-100')}
              >
                {open ? (
                  <XIcon className="size-5" />
                ) : (
                  <MenuIcon className="size-5" />
                )}
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-80 border-l border-stone-200 p-0"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center px-6 py-4 border-b border-stone-100">
                  <SheetTitle className="font-semibold text-stone-900">
                    Menu
                  </SheetTitle>
                </div>

                <nav className="flex flex-col gap-1 px-6 py-4 flex-1">
                  {NAV_LINKS.map((link, index) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium text-stone-700 hover:bg-stone-50 hover:text-stone-900 transition-all duration-200"
                      style={{ animationDelay: `${index * 50}ms` }}
                      activeOptions={{ exact: link.to === '/' }}
                      activeProps={{
                        className: 'bg-orange-50 text-orange-600 font-semibold',
                      }}
                    >
                      <span>{link.label}</span>
                      <span className="text-stone-400">→</span>
                    </Link>
                  ))}
                </nav>

                <div className="px-6 pb-6 pt-4 border-t border-stone-100">
                  <Button
                    asChild
                    onClick={() => setOpen(false)}
                  >
                    <Link to="/contact">
                      Gabung NFCC
                      <span className="ml-2">→</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}