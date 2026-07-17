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
      'Recon, scanning, enumeration, eksploitasi — metodologi inti di balik setiap workshop dan CTF yang kita adain.',
  },
  {
    icon: SwordIcon,
    title: 'CTF & Boot-to-Root',
    description:
      'Challenge hands-on rutin, dari box yang cocok buat pemula sampai kompetisi hunt-and-report berbatas waktu.',
  },
  {
    icon: UsersIcon,
    title: 'Komunitas & Event',
    description:
      'Kelompok belajar, mentorship, dan acara kampus yang bikin komunitas terus belajar di antara sesi.',
  },
]

export function ProgramCard({
  program,
  index,
}: {
  program: Program
  index: number
}) {
  const Icon = program.icon
  return (
    <div className="grid grid-cols-[2rem_1fr] gap-x-4 border-t border-border py-6 first:border-t-0 sm:grid-cols-[3.5rem_1fr] sm:gap-x-8 sm:py-8">
      <div className="pt-1 font-mono text-xs text-muted-foreground/70 tabular-nums sm:text-sm">
        {String(index + 1).padStart(2, '0')}
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-brand-orange-deep">
            <Icon className="size-4.5" strokeWidth={2.25} />
          </span>
          <h3 className="font-display text-lg font-semibold sm:text-2xl">
            {program.title}
          </h3>
        </div>
        <p className="mt-3 text-muted-foreground sm:max-w-xl sm:text-lg">
          {program.description}
        </p>
      </div>
    </div>
  )
}
