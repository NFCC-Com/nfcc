import { createFileRoute } from '@tanstack/react-router'

import { TimelineItem } from '#/components/timeline-item.tsx'
import { TeamCard } from '#/components/team-card.tsx'
import { formatPeriode } from '#/lib/periode.ts'
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

const MISI = [
  {
    title: 'Pendidikan & Mentoring',
    body: 'Menyediakan ruang belajar bareng dari dasar dan mengkurasi resource berkualitas, memastikan setiap anggota berkembang tanpa ada yang tertinggal.',
  },
  {
    title: 'Prestasi & Kompetensi',
    body: 'Mendorong partisipasi aktif dalam CTF dan eksplorasi Bug Bounty, mengasah skill teknis dan mental juara yang siap bersaing.',
  },
  {
    title: 'Jejaring Eksternal',
    body: 'Membangun relasi strategis dengan komunitas siber luar kampus untuk memperluas wawasan, referensi belajar, dan nama NFCC.',
  },
  {
    title: 'Edukasi Sosial',
    body: 'Memanfaatkan media sosial untuk membagikan konten literasi keamanan digital yang ringan dan aplikatif, wujud kepedulian ke mahasiswa dan masyarakat umum.',
  },
]

function About() {
  const { team, timeline, settings } = Route.useLoaderData()
  // Rows arrive pre-sorted newest periode first (see getTeam), so distinct-in-
  // appearance-order here already reads newest -> oldest, "Umum" last.
  const periodes = [
    ...new Set(team.map((member) => formatPeriode(member.periodeStart, member.periodeEnd))),
  ]

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
        <div className="eyebrow">Visi</div>
        <h2 className="display-title mt-2 max-w-2xl text-2xl font-semibold sm:text-3xl">
          Arah yang dituju
        </h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Menjadi komunitas mahasiswa unggulan di bidang keamanan siber yang
          kolaboratif dan suportif — wadah tumbuh bersama untuk mencetak
          talenta berprestasi yang berkontribusi nyata bagi literasi digital
          masyarakat.
        </p>

        <div className="eyebrow mt-16">Misi</div>
        <h2 className="display-title mt-2 text-2xl font-semibold sm:text-3xl">
          Kenapa kita ada
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {MISI.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-md"
            >
              <h3 className="font-semibold">{item.title}</h3>
              <p className="mt-2 text-muted-foreground">{item.body}</p>
            </div>
          ))}
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
                (member) => formatPeriode(member.periodeStart, member.periodeEnd) === periode,
              )
              const divisions = [
                ...new Set(periodeMembers.map((member) => member.division)),
              ]
              return (
                <div key={periode}>
                  <h3 className="font-mono text-sm tracking-wide text-brand-orange uppercase">
                    {periode === 'Umum' ? 'Umum' : `Periode ${periode}`}
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
