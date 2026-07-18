/** Formats a periode as "2024/2025", "2024", or "Umum" (no periode assigned). */
export function formatPeriode(start: number | null, end: number | null): string {
  if (start == null) return 'Umum'
  if (end != null && end !== start) return `${start}/${end}`
  return `${start}`
}

/** Reverses formatPeriode() — used to turn a filter-dropdown selection back into columns. */
export function parsePeriodeFilter(label: string): { start: number | null; end: number | null } {
  if (label === 'Umum') return { start: null, end: null }
  const [start, end] = label.split('/')
  return { start: Number(start), end: end ? Number(end) : null }
}
