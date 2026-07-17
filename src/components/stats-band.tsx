import type { Stat } from '#/db/schema.ts'

export function StatsBand({
  stats,
}: {
  stats: Pick<Stat, 'label' | 'value'>[]
}) {
  if (stats.length === 0) return null

  return (
    <section className="band-dark border-t border-white/10">
      <div className="grid-texture" />
      <div className="page-wrap relative grid grid-cols-2 gap-8 py-14 sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center sm:text-left">
            <div className="font-display text-3xl font-semibold text-brand-orange-soft sm:text-4xl">
              {stat.value}
            </div>
            <div className="mt-1 font-mono text-xs tracking-wide text-white/60 uppercase">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
