import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'

import { GalleryGrid } from '#/components/gallery-grid.tsx'
import { Pagination } from '#/components/pagination.tsx'
import { getGallery } from '#/server/content.ts'

const gallerySearch = z.object({ page: z.number().int().min(1).catch(1).default(1) })

export const Route = createFileRoute('/gallery')({
  component: Gallery,
  validateSearch: gallerySearch,
  loaderDeps: ({ search }) => ({ page: search.page }),
  loader: ({ deps }) => getGallery({ data: deps }),
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
  const { rows: entries, total, page, pageSize } = Route.useLoaderData()
  const navigate = useNavigate({ from: Route.fullPath })

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

        <Pagination
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={(p) => navigate({ search: (prev) => ({ ...prev, page: p }) })}
        />
      </section>
    </>
  )
}
