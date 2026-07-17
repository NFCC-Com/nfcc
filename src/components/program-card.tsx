import type { LucideIcon } from 'lucide-react'
import { SwordIcon, UsersIcon, CrosshairIcon } from 'lucide-react'

export type Program = {
  icon: LucideIcon
  title: string
  description: string
}

export const PROGRAMS: Program[] = [
  {
    icon: CrosshairIcon,
    title: 'Offensive Security',
    description:
      'Recon, scanning, enumeration, exploitation — the core methodology behind every workshop and CTF we run.',
  },
  {
    icon: SwordIcon,
    title: 'CTFs & Boot-to-Root',
    description:
      'Regular hands-on challenges, from beginner-friendly boxes to timed hunt-and-report competitions.',
  },
  {
    icon: UsersIcon,
    title: 'Community & Events',
    description:
      'Study groups, mentorship, and campus events that keep the community learning between sessions.',
  },
]

export function ProgramCard({ program }: { program: Program }) {
  const Icon = program.icon
  return (
    <div className="rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-md">
      <span className="flex size-10 items-center justify-center rounded-lg bg-accent text-brand-orange-deep">
        <Icon className="size-5" strokeWidth={2.25} />
      </span>
      <h3 className="mt-4 font-display text-lg font-semibold">
        {program.title}
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">
        {program.description}
      </p>
    </div>
  )
}
