import { createFileRoute } from '@tanstack/react-router'

import { TimelineItem } from '#/components/timeline-item.tsx'
import { TeamCard } from '#/components/team-card.tsx'
import { getSettings, getTeam, getTimeline } from '#/server/content.ts'

export const Route = createFileRoute('/about')({
  component: About,
  loader: async () => {
    const [team, timeline, settings] = await Promise.all([
      getTeam(),
      getTimeline(),
      getSettings(),
    ])
    return { team, timeline, settings }
  },
  head: () => ({
    meta: [
      { title: 'Tentang — NFCC' },
      {
        name: 'description',
        content:
          'Misi, tonggak sejarah, dan tim di balik Nurul Fikri Cybersecurity Community.',
      },
    ],
  }),
})

function About() {
  const { team, timeline, settings } = Route.useLoaderData()
  // Distinct periode (blank -> "Umum" bucket) in first-appearance order, each holding
  // its own distinct-division breakdown.
  const periodeKey = (p: string) => p || 'Umum'
  const periodes = [...new Set(team.map((member) => periodeKey(member.periode)))]

  return (
    <>
      <section className="band-dark py-20">
        <div className="grid-texture" />
        <div className="page-wrap relative">
          <div className="eyebrow">Tentang NFCC</div>
          <h1 className="display-title mt-2 max-w-2xl text-4xl font-semibold sm:text-5xl">
            Edukasi keamanan praktis, dari mahasiswa, buat mahasiswa.
          </h1>
          <p className="mt-5 max-w-xl text-white/70">
            NFCC hadir biar belajar offensive security gak cuma nebak-nebak
            lewat tutorial YouTube doang. Kita ngadain workshop terstruktur,
            CTF, dan sesi boot-to-root yang based on metodologi beneran —
            legal, hands-on.
          </p>
        </div>
      </section>

      <section className="page-wrap py-20">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <div className="eyebrow">Misi</div>
            <h2 className="display-title mt-2 text-2xl font-semibold">
              Kenapa kita ada
            </h2>
            <p className="mt-3 text-muted-foreground">
              Ngasih mahasiswa STT Terpadu Nurul Fikri jalur terstruktur dan
              hands-on ke dunia cybersecurity — ngejembatanin celah antara teori
              kelas sama cara kerja serangan dan pertahanan di dunia nyata.
            </p>
          </div>
          <div>
            <div className="eyebrow">Visi</div>
            <h2 className="display-title mt-2 text-2xl font-semibold">
              Arah yang dituju
            </h2>
            <p className="mt-3 text-muted-foreground">
              Jadi komunitas yang cukup kuat buat ngejalanin platform CTF
              sendiri, mentori anggota baru jadi spesialis, dan ngewakilin
              kampus di kompetisi keamanan nasional.
            </p>
          </div>
        </div>
      </section>

      {settings.logoPhilosophy && (
        <section className="page-wrap py-20">
          <div className="eyebrow">Filosofi Logo</div>
          <h2 className="display-title mt-2 max-w-2xl text-2xl font-semibold">
            Kenapa logonya begitu
          </h2>
          <p className="mt-3 max-w-2xl whitespace-pre-line text-muted-foreground">
            {settings.logoPhilosophy}
          </p>
        </section>
      )}

      {timeline.length > 0 && (
        <section className="page-wrap py-20">
          <div className="eyebrow">Tonggak sejarah</div>
          <h2 className="display-title mt-2 text-3xl font-semibold sm:text-4xl">
            Perjalanan kita
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
          <div className="eyebrow">Tim</div>
          <h2 className="display-title mt-2 text-3xl font-semibold sm:text-4xl">
            Yang ngurus ini semua
          </h2>
          <div className="mt-12 flex flex-col gap-16">
            {periodes.map((periode) => {
              const periodeMembers = team.filter(
                (member) => periodeKey(member.periode) === periode,
              )
              const divisions = [
                ...new Set(periodeMembers.map((member) => member.division)),
              ]
              return (
                <div key={periode}>
                  <h3 className="font-mono text-sm tracking-wide text-brand-orange uppercase">
                    Periode {periode}
                  </h3>
                  <div className="mt-8 flex flex-col gap-12">
                    {divisions.map((division) => {
                      const members = periodeMembers.filter(
                        (member) => member.division === division,
                      )
                      return (
                        <div key={division}>
                          <div className="flex items-center gap-4">
                            <h4 className="shrink-0 font-mono text-xs tracking-wide text-muted-foreground uppercase">
                              {division}
                            </h4>
                            <div className="h-px flex-1 bg-border" />
                          </div>
                          <div className="mt-7 grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                            {members.map((member) => (
                              <TeamCard key={member.id} member={member} />
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}
    </>
  )
}
