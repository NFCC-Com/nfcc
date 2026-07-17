import { createFileRoute, notFound } from '@tanstack/react-router'

import { Badge } from '#/components/ui/badge.tsx'
import { getPublishedPost } from '#/server/content.ts'

export const Route = createFileRoute('/blog/$slug')({
  component: BlogPost,
  loader: async ({ params }) => {
    const post = await getPublishedPost({ data: params.slug })
    if (!post) throw notFound()
    return post
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} — NFCC` },
          { name: 'description', content: loaderData.excerpt },
        ]
      : [],
  }),
})

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function BlogPost() {
  const post = Route.useLoaderData()

  return (
    <article className="page-wrap py-20">
      <div className="mx-auto max-w-2xl">
        <time
          dateTime={post.date}
          className="font-mono text-xs tracking-wide text-muted-foreground uppercase"
        >
          {formatDate(post.date)}
        </time>
        <h1 className="display-title mt-2 text-3xl font-semibold sm:text-4xl">
          {post.title}
        </h1>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="font-mono text-[0.65rem]"
            >
              {tag}
            </Badge>
          ))}
        </div>
        {/* Trusted admin-authored HTML from renderMarkdown (Shiki-highlighted). */}
        <div
          className="prose prose-neutral mt-10 max-w-none"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </div>
    </article>
  )
}
