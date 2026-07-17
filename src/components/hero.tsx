import { Link } from '@tanstack/react-router'
import { ArrowRightIcon, TerminalIcon } from 'lucide-react'

import { Button } from '#/components/ui/button.tsx'

export function Hero() {
  return (
    <section className="band-dark overflow-hidden">
      <div className="grid-texture" />
      <div
        className="pointer-events-none absolute -top-24 right-[-10%] size-[520px] rounded-full opacity-30 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, var(--brand-orange) 0%, transparent 70%)',
        }}
      />
      <div className="page-wrap relative flex flex-col gap-8 py-20 md:py-28">
        <div className="rise-in eyebrow flex items-center gap-2">
          <TerminalIcon className="size-3.5" />
          Nurul Fikri Cybersecurity Community
        </div>

        <h1
          className="display-title rise-in max-w-3xl text-4xl leading-[1.08] font-semibold sm:text-5xl md:text-6xl"
          style={{ animationDelay: '80ms' }}
        >
          Think like an attacker.
          <br />
          <span className="text-brand-orange-soft">
            Defend like it&apos;s your job.
          </span>
        </h1>

        <p
          className="rise-in max-w-xl text-base text-white/70 sm:text-lg"
          style={{ animationDelay: '160ms' }}
        >
          Hands-on offensive security workshops, CTFs, and boot-to-root sessions
          for students at STT Terpadu Nurul Fikri — legal, practical, and built
          around real attack methodology.
        </p>

        <div
          className="rise-in flex flex-wrap items-center gap-3"
          style={{ animationDelay: '240ms' }}
        >
          <Button asChild size="lg">
            <Link to="/contact">
              Join the community
              <ArrowRightIcon className="size-4" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white/20 bg-transparent text-white hover:bg-white/10"
          >
            <Link to="/blog">Read our write-ups</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
