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
    <>
      <Hero />
      <StatsBand stats={stats} />

      <section className="page-wrap py-20">
        <div className="eyebrow">What we do</div>
        <h2 className="display-title mt-2 text-3xl font-semibold sm:text-4xl">
          Three ways to get your hands dirty
        </h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {PROGRAMS.map((program) => (
            <ProgramCard key={program.title} program={program} />
          ))}
        </div>
      </section>

      {posts.length > 0 && (
        <section className="page-wrap py-20">
          <div className="flex items-baseline justify-between gap-4">
            <div>
              <div className="eyebrow">Write-ups</div>
              <h2 className="display-title mt-2 text-3xl font-semibold sm:text-4xl">
                Latest from the blog
              </h2>
            </div>
            <Button asChild variant="ghost" className="hidden sm:inline-flex">
              <Link to="/blog">
                All posts
                <ArrowRightIcon className="size-4" />
              </Link>
            </Button>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      )}

      <section className="band-dark py-20">
        <div className="grid-texture" />
        <div className="page-wrap relative flex flex-col items-center gap-4 text-center">
          <h2 className="display-title text-3xl font-semibold sm:text-4xl">
            Ready to start?
          </h2>
          <p className="max-w-md text-white/65">
            No prior experience required — just curiosity and a willingness to
            break things legally.
          </p>
          <Button asChild size="lg" className="mt-2">
            <Link to="/contact">
              Join the community
              <ArrowRightIcon className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  )
}
