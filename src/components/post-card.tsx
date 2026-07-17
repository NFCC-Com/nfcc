import { Link } from '@tanstack/react-router'

import { Badge } from '#/components/ui/badge.tsx'

export type PostSummary = {
  slug: string
  title: string
  date: string
  excerpt: string
  tags: string[]
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function PostCard({ post }: { post: PostSummary }) {
  return (
    <Link
      to="/blog/$slug"
      params={{ slug: post.slug }}
      className="group flex flex-col rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-md"
    >
      <time
        dateTime={post.date}
        className="font-mono text-xs tracking-wide text-muted-foreground uppercase"
      >
        {formatDate(post.date)}
      </time>
      <h3 className="mt-2 font-display text-xl font-semibold transition-colors group-hover:text-brand-orange">
        {post.title}
      </h3>
      <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
        {post.excerpt}
      </p>
      <div className="mt-4 flex flex-wrap gap-1.5">
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
    </Link>
  )
}
