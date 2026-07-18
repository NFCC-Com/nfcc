import { TableIcon, LayoutGridIcon } from 'lucide-react'

import { cn } from '#/lib/utils.ts'
import type { ViewMode } from '#/lib/use-view-mode.ts'

export function ViewToggle({
  value,
  onChange,
}: {
  value: ViewMode
  onChange: (v: ViewMode) => void
}) {
  return (
    <div className="inline-flex items-center rounded-md border border-input p-0.5">
      <button
        type="button"
        aria-label="Tampilan tabel"
        aria-pressed={value === 'table'}
        onClick={() => onChange('table')}
        className={cn(
          'inline-flex size-8 items-center justify-center rounded-sm transition-colors',
          value === 'table'
            ? 'bg-accent text-accent-foreground'
            : 'text-muted-foreground hover:text-foreground',
        )}
      >
        <TableIcon className="size-4" />
      </button>
      <button
        type="button"
        aria-label="Tampilan kartu"
        aria-pressed={value === 'cards'}
        onClick={() => onChange('cards')}
        className={cn(
          'inline-flex size-8 items-center justify-center rounded-sm transition-colors',
          value === 'cards'
            ? 'bg-accent text-accent-foreground'
            : 'text-muted-foreground hover:text-foreground',
        )}
      >
        <LayoutGridIcon className="size-4" />
      </button>
    </div>
  )
}
