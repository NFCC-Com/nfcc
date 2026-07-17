import { createFileRoute } from '@tanstack/react-router'

import { ContactInfo } from '#/components/contact-info.tsx'
import { getSettings } from '#/server/content.ts'

export const Route = createFileRoute('/contact')({
  component: Contact,
  loader: () => getSettings(),
  head: () => ({
    meta: [
      { title: 'Kontak — NFCC' },
      {
        name: 'description',
        content: 'Hubungi Nurul Fikri Cybersecurity Community.',
      },
    ],
  }),
})

function Contact() {
  const settings = Route.useLoaderData()

  return (
    <>
      <section className="band-dark relative py-20">
        <div className="grid-texture" />
        <div className="page-wrap relative">
          <div className="eyebrow">Kontak</div>
          <h1 className="display-title mt-2 max-w-2xl text-4xl font-semibold sm:text-5xl">
            Ngobrol yuk
          </h1>
          <p className="mt-5 max-w-xl text-white/70">
            Mau gabung, kolaborasi event, atau sekadar nanya-nanya — kontak aja
            lewat channel mana aja di bawah.
          </p>
        </div>
      </section>

      <section className="page-wrap py-20">
        <ContactInfo settings={settings} />
        <div className="mt-10 overflow-hidden rounded-xl border border-border">
          <iframe
            title="Lokasi STT Terpadu Nurul Fikri"
            src="https://www.google.com/maps?q=STT+Terpadu+Nurul+Fikri&output=embed"
            className="h-80 w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </>
  )
}
