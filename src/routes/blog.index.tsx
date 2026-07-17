import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'

import { PostCard } from '#/components/post-card.tsx'
import { Pagination } from '#/components/pagination.tsx'
import { getPublishedPosts } from '#/server/content.ts'

const blogSearch = z.object({ page: z.number().int().min(1).catch(1).default(1) })

export const Route = createFileRoute('/blog/')({
  component: BlogIndex,
  validateSearch: blogSearch,
  loaderDeps: ({ search }) => ({ page: search.page }),
  loader: ({ deps }) => getPublishedPosts({ data: deps }),
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
  const { rows: posts, total, page, pageSize } = Route.useLoaderData()
  const navigate = useNavigate({ from: Route.fullPath })

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

      <Pagination
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={(p) => navigate({ search: (prev) => ({ ...prev, page: p }) })}
      />
    </section>
  )
}
