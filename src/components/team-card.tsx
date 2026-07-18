import { GithubIcon, InstagramIcon, LinkedinIcon } from '#/components/brand-icons.tsx'
import { Avatar, AvatarFallback, AvatarImage } from '#/components/ui/avatar.tsx'
import type { TeamMember } from '#/db/schema.ts'

export function TeamCard({ member }: { member: TeamMember }) {
  const initials = member.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)

  const socials = [
    { href: member.instagram, label: 'Instagram', Icon: InstagramIcon },
    { href: member.linkedin, label: 'LinkedIn', Icon: LinkedinIcon },
    { href: member.github, label: 'GitHub', Icon: GithubIcon },
  ].filter((s) => s.href)

  return (
    <div className="group flex flex-col items-center gap-3 text-center">
      <Avatar className="size-16 ring-1 ring-border transition-all duration-200 group-hover:ring-2 group-hover:ring-brand-orange/60 sm:size-20">
        <AvatarImage src={member.photo} alt="" className="object-cover" />
        <AvatarFallback className="bg-brand-navy text-sm font-medium text-brand-orange-soft">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div>
        <div className="font-display text-sm leading-tight font-semibold sm:text-base">
          {member.name}
        </div>
        <div className="mt-1 text-xs text-brand-orange sm:text-sm">
          {member.role}
        </div>
      </div>
      {socials.length > 0 && (
        <div className="flex gap-2">
          {socials.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="text-muted-foreground transition-colors hover:text-brand-orange"
            >
              <Icon className="size-4" />
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
