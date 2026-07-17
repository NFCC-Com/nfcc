import { createFileRoute } from '@tanstack/react-router'

import { PostCard } from '#/components/post-card.tsx'
import { getPublishedPosts } from '#/server/content.ts'

export const Route = createFileRoute('/blog/')({
  component: BlogIndex,
  loader: () => getPublishedPosts(),
  head: () => ({
    meta: [
      { title: 'Blog — NFCC' },
      {
        name: 'description',
        content: 'Write-ups and field notes from NFCC workshops and CTFs.',
      },
    ],
  }),
})

function BlogIndex() {
  const posts = Route.useLoaderData()

  return (
    <section className="page-wrap py-20">
      <div className="eyebrow">Blog</div>
      <h1 className="display-title mt-2 text-4xl font-semibold sm:text-5xl">
        Write-ups & field notes
      </h1>
      <p className="mt-3 max-w-xl text-muted-foreground">
        Methodology breakdowns from our workshops and CTFs — written to teach,
        not to spoil.
      </p>
      {posts.length === 0 ? (
        <p className="mt-10 text-muted-foreground">
          No posts published yet. Check back soon.
        </p>
      ) : (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </section>
  )
}
