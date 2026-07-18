# Dashboard tables: responsive card view + consistency pass

## Problem

`posts.index.tsx` and `shortlinks.tsx` render raw `<Table>` wrapped in
`overflow-x-auto`. On narrow viewports this produces a horizontally-scrolling
table (see screenshot: title column clipped, scrollbar visible) — poor UX on
mobile. Other dashboard list routes (`team`, `gallery`, `stats`, `timeline`,
`index`) already use card grids and are unaffected.

Additionally, card grids across routes are visually inconsistent (some have
hover elevation, some don't) and the user wants a card view as an alternative
to the table, not a replacement — so power users keep dense table scanning,
mobile/casual users get cards.

## Scope

In scope:
- `posts.index.tsx`, `shortlinks.tsx` — add table/card toggle + card renderers
- New `ViewToggle` component, `useViewMode` hook
- Minor visual consistency pass on existing card grids (hover shadow) and
  `SkeletonCardGrid` (configurable column count)

Out of scope:
- Redesigning team/gallery/stats/timeline/index card grids beyond the hover
  touch — they don't have the overflow bug and don't need new layouts
- Any change to server/loader/pagination logic
- Any change to `Table` primitive itself (`src/components/ui/table.tsx`)

## Design

### `useViewMode` hook (`src/lib/use-view-mode.ts`)

- Single shared preference, key `dashboard-view-mode` in `localStorage`,
  values `'table' | 'cards'`, default `'table'`.
- One React state + effect to sync to localStorage; read initial value
  lazily (SSR-safe: default to `'table'` on server, hydrate from
  localStorage on mount).
- Shared (not per-page) — matches "consistent ui/ux" ask: one preference
  follows the user across posts and shortlinks.

### `ViewToggle` component (`src/components/dashboard/view-toggle.tsx`)

- Two icon buttons (`TableIcon` / `LayoutGridIcon` from lucide-react) in a
  single bordered pill, active state highlighted (same visual language as
  existing `Button` ghost/outline variants — no new color tokens).
- Props: `value: 'table' | 'cards'`, `onChange: (v) => void`.
- Rendered inline next to the page action button (inside `PageHeader`'s
  `action` slot, or just above the content — placed in a flex row with the
  existing filter/search area if present).

### Posts card layout

- Grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`
- Each card (`rounded-xl border border-border bg-card p-4
  transition-shadow hover:shadow-md`):
  - Title, `font-display font-semibold`, `line-clamp-2`
  - Badge (Publikasi / Draf) below title
  - Updated date, `text-xs text-muted-foreground`
  - Bottom row: edit + delete icon buttons, right-aligned

### Shortlinks card layout

- Same grid breakpoints.
- Each card:
  - Top row: `/code` (font-mono) + copy/open icon buttons
  - Destination URL, truncated, `text-sm text-muted-foreground`
  - Stat row: click count + last-clicked, small text
  - Bottom row: QR + edit + delete icon buttons, right-aligned

### Table mode (unchanged behavior)

- Stays exactly as today, including existing `max-sm:hidden` /
  `max-md:hidden` column-hiding — the card toggle is the mobile escape
  hatch now, so no further table breakpoint changes needed.

### Consistency pass

- Add `transition-shadow hover:shadow-md` to card items in `team.tsx`,
  `gallery.tsx`, `timeline.tsx`, `stats.tsx` (currently only
  `dashboard/index.tsx` stat cards have this).
- `SkeletonCardGrid` gets an optional `cols?: 2 | 3 | 4` prop (default
  keeps current `sm:grid-cols-2 lg:grid-cols-3`) so posts/shortlinks
  pending state can render a matching skeleton when `cards` mode is
  selected the previous session. Pending component picks
  `SkeletonTable`/`SkeletonCardGrid` based on the current `useViewMode()`
  value.

## Testing

- Manual: toggle table/cards on posts and shortlinks, verify localStorage
  persistence across reload and across the two pages (one shared key).
  Resize to mobile width in both modes — table mode may still scroll
  (acceptable), card mode must not overflow.
- No new automated tests planned (no existing test suite covers dashboard
  routes visually); rely on manual verification per house `verify` skill.
