import { createFileRoute } from '@tanstack/react-router'

import { GalleryGrid } from '#/components/gallery-grid.tsx'
import { getGallery } from '#/server/content.ts'

export const Route = createFileRoute('/gallery')({
  component: Gallery,
  loader: () => getGallery(),
  head: () => ({
    meta: [
      { title: 'Gallery — NFCC' },
      {
        name: 'description',
        content: 'Photos from NFCC workshops, CTFs, and boot-to-root sessions.',
      },
    ],
  }),
})

function Gallery() {
  const entries = Route.useLoaderData()

  return (
    <section className="page-wrap py-20">
      <div className="eyebrow">Gallery</div>
      <h1 className="display-title mt-2 text-4xl font-semibold sm:text-5xl">
        Moments from the field
      </h1>
      <p className="mt-3 max-w-xl text-muted-foreground">
        A look at recent workshops and challenges. Full album lives on{' '}
        <a
          href="https://instagram.com/nfcc.id"
          target="_blank"
          rel="noreferrer noopener"
          className="text-brand-orange underline underline-offset-2"
        >
          Instagram
        </a>
        .
      </p>
      {entries.length === 0 ? (
        <p className="mt-10 text-muted-foreground">
          No photos yet. Check back soon.
        </p>
      ) : (
        <div className="mt-10">
          <GalleryGrid entries={entries} />
        </div>
      )}
    </section>
  )
}
