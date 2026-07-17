import * as React from 'react'

import { Badge } from '#/components/ui/badge.tsx'
import { Dialog, DialogContent, DialogTitle } from '#/components/ui/dialog.tsx'
import type { GalleryItem } from '#/db/schema.ts'
import { cn } from '#/lib/utils.ts'

export function GalleryGrid({ entries }: { entries: GalleryItem[] }) {
  const tags = React.useMemo(
    () => ['Semua', ...new Set(entries.map((entry) => entry.tag))],
    [entries],
  )
  const [activeTag, setActiveTag] = React.useState('Semua')
  const [selected, setSelected] = React.useState<GalleryItem | null>(null)

  const filtered =
    activeTag === 'Semua'
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

      <div className="mt-8 columns-1 gap-5 sm:columns-2 lg:columns-3">
        {filtered.map((entry) => (
          <button
            key={entry.id}
            type="button"
            onClick={() => setSelected(entry)}
            className="group relative mb-5 block w-full overflow-hidden rounded-xl text-left break-inside-avoid"
          >
            <img
              src={entry.image}
              alt={entry.caption}
              className="w-full rounded-xl object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent p-4 pt-10">
              <Badge
                variant="outline"
                className="border-white/30 font-mono text-[0.65rem] text-white/90"
              >
                {entry.tag}
              </Badge>
              <p className="mt-2 text-sm font-medium text-white">
                {entry.caption}
              </p>
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
            <>
              <img
                src={selected.image}
                alt={selected.caption}
                className="w-full rounded-md"
              />
              <Badge variant="outline" className="font-mono text-[0.65rem]">
                {selected.tag}
              </Badge>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
