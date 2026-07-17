import { createFileRoute } from '@tanstack/react-router'

import { TimelineItem } from '#/components/timeline-item.tsx'
import { TeamCard } from '#/components/team-card.tsx'
import { getTeam, getTimeline } from '#/server/content.ts'

export const Route = createFileRoute('/about')({
  component: About,
  loader: async () => {
    const [team, timeline] = await Promise.all([getTeam(), getTimeline()])
    return { team, timeline }
  },
  head: () => ({
    meta: [
      { title: 'About — NFCC' },
      {
        name: 'description',
        content:
          'Mission, milestones, and the team behind Nurul Fikri Cybersecurity Community.',
      },
    ],
  }),
})

function About() {
  const { team, timeline } = Route.useLoaderData()
  // Distinct divisions in the order they first appear in the roster.
  const divisions = [...new Set(team.map((member) => member.division))]

  return (
    <>
      <section className="band-dark py-20">
        <div className="grid-texture" />
        <div className="page-wrap relative">
          <div className="eyebrow">About NFCC</div>
          <h1 className="display-title mt-2 max-w-2xl text-4xl font-semibold sm:text-5xl">
            Practical security education, run by students, for students.
          </h1>
          <p className="mt-5 max-w-xl text-white/70">
            NFCC exists so that learning offensive security doesn&apos;t require
            guessing your way through YouTube tutorials alone. We run structured
            workshops, CTFs, and boot-to-root sessions grounded in real
            methodology — always legal, always hands-on.
          </p>
        </div>
      </section>

      <section className="page-wrap py-20">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <div className="eyebrow">Mission</div>
            <h2 className="display-title mt-2 text-2xl font-semibold">
              Why we exist
            </h2>
            <p className="mt-3 text-muted-foreground">
              To give students at STT Terpadu Nurul Fikri a structured, hands-on
              path into cybersecurity — closing the gap between classroom theory
              and the way real attacks and defenses actually work.
            </p>
          </div>
          <div>
            <div className="eyebrow">Vision</div>
            <h2 className="display-title mt-2 text-2xl font-semibold">
              Where we're headed
            </h2>
            <p className="mt-3 text-muted-foreground">
              A community strong enough to run its own CTF platform, mentor
              newer members into specialists, and represent the campus at
              national security competitions.
            </p>
          </div>
        </div>
      </section>

      {timeline.length > 0 && (
        <section className="page-wrap py-20">
          <div className="eyebrow">Milestones</div>
          <h2 className="display-title mt-2 text-3xl font-semibold sm:text-4xl">
            How we got here
          </h2>
          <div className="mt-10 max-w-2xl">
            {timeline.map((entry, index) => (
              <TimelineItem
                key={entry.id}
                entry={entry}
                isLast={index === timeline.length - 1}
              />
            ))}
          </div>
        </section>
      )}

      {team.length > 0 && (
        <section className="page-wrap py-20">
          <div className="eyebrow">The team</div>
          <h2 className="display-title mt-2 text-3xl font-semibold sm:text-4xl">
            Who runs this
          </h2>
          {divisions.map((division) => {
            const members = team.filter(
              (member) => member.division === division,
            )
            return (
              <div key={division} className="mt-10">
                <h3 className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
                  {division}
                </h3>
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {members.map((member) => (
                    <TeamCard key={member.id} member={member} />
                  ))}
                </div>
              </div>
            )
          })}
        </section>
      )}
    </>
  )
}
