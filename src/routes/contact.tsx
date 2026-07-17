import { createFileRoute } from '@tanstack/react-router'

import { ContactInfo } from '#/components/contact-info.tsx'
import { getSettings } from '#/server/content.ts'

export const Route = createFileRoute('/contact')({
  component: Contact,
  loader: () => getSettings(),
  head: () => ({
    meta: [
      { title: 'Contact — NFCC' },
      {
        name: 'description',
        content: 'Get in touch with Nurul Fikri Cybersecurity Community.',
      },
    ],
  }),
})

function Contact() {
  const settings = Route.useLoaderData()

  return (
    <section className="page-wrap py-20">
      <div className="eyebrow">Contact</div>
      <h1 className="display-title mt-2 text-4xl font-semibold sm:text-5xl">
        Let&apos;s talk
      </h1>
      <p className="mt-3 max-w-xl text-muted-foreground">
        Whether you want to join, collaborate on an event, or just ask a
        question — reach out through any of the channels below.
      </p>
      <div className="mt-10">
        <ContactInfo settings={settings} />
      </div>
      <div className="mt-10 overflow-hidden rounded-xl border border-border">
        <iframe
          title="STT Terpadu Nurul Fikri location"
          src="https://www.google.com/maps?q=STT+Terpadu+Nurul+Fikri&output=embed"
          className="h-80 w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </section>
  )
}
