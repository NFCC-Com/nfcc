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
        content: 'Write-up dan catatan lapangan dari workshop dan CTF NFCC.',
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
        Write-up & catatan lapangan
      </h1>
      <p className="mt-3 max-w-xl text-muted-foreground">
        Bedah metodologi dari workshop dan CTF kita — ditulis buat ngajarin,
        bukan buat spoiler.
      </p>
      {posts.length === 0 ? (
        <p className="mt-10 text-muted-foreground">
          Belum ada post yang dipublish. Cek lagi nanti ya.
        </p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </section>
  )
}
