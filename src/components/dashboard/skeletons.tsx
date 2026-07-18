import { Skeleton } from '#/components/ui/skeleton.tsx'
import { cn } from '#/lib/utils.ts'

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <div className="border-b border-border bg-muted/50 px-4 py-3">
        <Skeleton className="h-4 w-24" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 border-b border-border px-4 py-3.5 last:border-0"
        >
          <Skeleton className="h-4 w-full max-w-[200px]" />
          <Skeleton className="h-4 w-16 max-sm:hidden" />
          <Skeleton className="h-4 w-12 ml-auto" />
        </div>
      ))}
    </div>
  )
}

const GRID_COLS = {
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-2 sm:grid-cols-4',
} as const

export function SkeletonCardGrid({
  cards = 6,
  cols = 3,
}: {
  cards?: number
  cols?: 2 | 3 | 4
}) {
  return (
    <div className={cn('grid gap-4', GRID_COLS[cols])}>
      {Array.from({ length: cards }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-border p-5 space-y-3"
        >
          <Skeleton className="size-10 rounded-lg" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-6 w-16" />
        </div>
      ))}
    </div>
  )
}

export function SkeletonForm({ fields = 5 }: { fields?: number }) {
  return (
    <div className="space-y-5 max-w-lg">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      ))}
    </div>
  )
}

export function SkeletonList({ items = 4 }: { items?: number }) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: items }).map((_, i) => (
        <div
          key={i}
          className="flex items-start justify-between rounded-xl border border-border p-4"
        >
          <div className="space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="size-8 rounded-md shrink-0" />
        </div>
      ))}
    </div>
  )
}
