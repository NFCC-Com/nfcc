import { Avatar, AvatarFallback, AvatarImage } from '#/components/ui/avatar.tsx'
import type { TeamMember } from '#/db/schema.ts'

export function TeamCard({ member }: { member: TeamMember }) {
  const initials = member.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)

  return (
    <div className="flex flex-col items-center rounded-xl border border-border bg-card p-6 text-center transition-shadow hover:shadow-md">
      <Avatar size="lg" className="size-16">
        <AvatarImage src={member.photo} alt="" />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="mt-3 font-display font-semibold">{member.name}</div>
      <div className="mt-0.5 text-sm text-brand-orange">{member.role}</div>
    </div>
  )
}
