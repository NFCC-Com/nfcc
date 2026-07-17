import * as React from 'react'

import { Badge } from '#/components/ui/badge.tsx'
import { Dialog, DialogContent, DialogTitle } from '#/components/ui/dialog.tsx'
import type { GalleryItem } from '#/db/schema.ts'
import { cn } from '#/lib/utils.ts'

export function GalleryGrid({ entries }: { entries: GalleryItem[] }) {
  const tags = React.useMemo(
    () => ['All', ...new Set(entries.map((entry) => entry.tag))],
    [entries],
  )
  const [activeTag, setActiveTag] = React.useState('All')
  const [selected, setSelected] = React.useState<GalleryItem | null>(null)

  const filtered =
    activeTag === 'All'
      ? entries
      : entries.filter((entry) => entry.tag === activeTag)

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => setActiveTag(tag)}
            className={cn(
              'rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors',
              activeTag === tag
                ? 'border-brand-orange bg-brand-orange text-white'
                : 'border-border bg-card text-muted-foreground hover:text-foreground',
            )}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((entry) => (
          <button
            key={entry.id}
            type="button"
            onClick={() => setSelected(entry)}
            className="group overflow-hidden rounded-xl border border-border bg-card text-left"
          >
            <div className="aspect-[3/2] overflow-hidden">
              <img
                src={entry.image}
                alt={entry.caption}
                className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="p-4">
              <Badge variant="outline" className="font-mono text-[0.65rem]">
                {entry.tag}
              </Badge>
              <p className="mt-2 text-sm font-medium">{entry.caption}</p>
            </div>
          </button>
        ))}
      </div>

      <Dialog
        open={selected !== null}
        onOpenChange={(open) => !open && setSelected(null)}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogTitle>{selected?.caption}</DialogTitle>
          {selected && (
            <img
              src={selected.image}
              alt={selected.caption}
              className="w-full rounded-md"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
