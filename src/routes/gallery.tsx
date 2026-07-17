import { createFileRoute } from '@tanstack/react-router'

import { GalleryGrid } from '#/components/gallery-grid.tsx'
import { getGallery } from '#/server/content.ts'

export const Route = createFileRoute('/gallery')({
  component: Gallery,
  loader: () => getGallery(),
  head: () => ({
    meta: [
      { title: 'Galeri — NFCC' },
      {
        name: 'description',
        content: 'Foto-foto dari workshop, CTF, dan sesi boot-to-root NFCC.',
      },
    ],
  }),
})

function Gallery() {
  const entries = Route.useLoaderData()

  return (
    <>
      <section className="band-dark relative py-20">
        <div className="grid-texture" />
        <div className="page-wrap relative">
          <div className="eyebrow">Galeri</div>
          <h1 className="display-title mt-2 max-w-2xl text-4xl font-semibold sm:text-5xl">
            Momen di lapangan
          </h1>
          <p className="mt-5 max-w-xl text-white/70">
            Cuplikan workshop dan challenge terbaru. Album lengkapnya ada di{' '}
            <a
              href="https://instagram.com/nfcc.id"
              target="_blank"
              rel="noreferrer noopener"
              className="text-brand-orange-soft underline underline-offset-2"
            >
              Instagram
            </a>
            .
          </p>
        </div>
      </section>

      <section className="page-wrap py-20">
        {entries.length === 0 ? (
          <p className="text-muted-foreground">
            Belum ada foto. Cek lagi nanti ya.
          </p>
        ) : (
          <GalleryGrid entries={entries} />
        )}
      </section>
    </>
  )
}
