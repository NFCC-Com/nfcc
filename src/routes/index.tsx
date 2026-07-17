import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRightIcon } from 'lucide-react'

import { Hero } from '#/components/hero.tsx'
import { StatsBand } from '#/components/stats-band.tsx'
import { PROGRAMS, ProgramCard } from '#/components/program-card.tsx'
import { PostCard } from '#/components/post-card.tsx'
import { Button } from '#/components/ui/button.tsx'
import { getPublishedPosts, getStats } from '#/server/content.ts'

export const Route = createFileRoute('/')({
  component: Home,
  loader: async () => {
    const [posts, stats] = await Promise.all([getPublishedPosts(), getStats()])
    return { posts: posts.slice(0, 3), stats }
  },
})

function Home() {
  const { posts, stats } = Route.useLoaderData()

  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <StatsBand stats={stats} />

      <section className="py-24 sm:py-28">
        <div className="page-wrap">
          <div className="max-w-xl">
            <div className="eyebrow">Metodologi</div>
            <h2 className="display-title mt-3 text-3xl font-semibold sm:text-4xl">
              Apa yang kami lakukan
            </h2>
            <p className="mt-3 text-lg text-muted-foreground">
              Tiga fokus utama untuk melatih kemampuan teknis keamanan siber secara nyata.
            </p>
          </div>
          <div className="mt-4 border-t border-border sm:mt-6">
            {PROGRAMS.map((program, index) => (
              <ProgramCard key={program.title} program={program} index={index} />
            ))}
          </div>
        </div>
      </section>

      {posts.length > 0 && (
        <section className="border-t border-border bg-card py-24 sm:py-28">
          <div className="page-wrap">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div className="max-w-xl">
                <div className="eyebrow">Dari komunitas</div>
                <h2 className="display-title mt-3 text-3xl font-semibold sm:text-4xl">
                  Tulisan terbaru
                </h2>
                <p className="mt-3 text-lg text-muted-foreground">
                  Catatan teknis dan pembahasan langsung dari anggota komunitas.
                </p>
              </div>
              <Button asChild variant="ghost" className="hidden sm:inline-flex">
                <Link to="/blog">
                  Lihat semua
                  <ArrowRightIcon className="ml-2 size-4" />
                </Link>
              </Button>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
            <Button asChild variant="ghost" className="mt-8 w-full sm:hidden">
              <Link to="/blog">
                Lihat semua tulisan
                <ArrowRightIcon className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
        </section>
      )}

      <section className="band-dark relative overflow-hidden">
        <div className="grid-texture" />
        <div className="page-wrap relative py-24 text-center sm:py-28">
          <div className="eyebrow">Gabung sekarang</div>
          <h2 className="display-title mx-auto mt-4 max-w-2xl text-3xl font-semibold sm:text-4xl md:text-5xl">
            Siap pahami cara kerja serangan sesungguhnya?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/70">
            Terbuka untuk semua mahasiswa STT Terpadu Nurul Fikri. Tidak perlu
            pengalaman sebelumnya, cukup rasa ingin tahu.
          </p>
          <Button asChild size="lg" className="mt-10">
            <Link to="/contact">
              Gabung komunitas
              <ArrowRightIcon className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="border-t border-border py-12">
        <div className="page-wrap">
          <p className="eyebrow text-center">Didukung oleh</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            {['Kampus', 'Partner', 'Sponsor'].map((label) => (
              <div
                key={label}
                className="flex h-11 w-32 items-center justify-center rounded-md border border-dashed border-border font-mono text-[0.65rem] tracking-wide text-muted-foreground/60 uppercase"
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}