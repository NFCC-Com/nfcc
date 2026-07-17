import type { TimelineEntry } from '#/db/schema.ts'

export function TimelineItem({
  entry,
  isLast,
}: {
  entry: TimelineEntry
  isLast: boolean
}) {
  return (
    <div className="relative flex gap-6 pb-10">
      {!isLast && (
        <span
          className="absolute top-3 left-[7px] h-full w-px bg-border"
          aria-hidden="true"
        />
      )}
      <span className="relative z-10 mt-1.5 flex size-3.5 shrink-0 items-center justify-center rounded-full bg-brand-orange ring-4 ring-background" />
      <div>
        <div className="font-mono text-xs tracking-wide text-brand-orange uppercase">
          {entry.year}
        </div>
        <h3 className="mt-1 font-display text-lg font-semibold">
          {entry.title}
        </h3>
        <p className="mt-1.5 max-w-xl text-sm text-muted-foreground">
          {entry.description}
        </p>
      </div>
    </div>
  )
}
