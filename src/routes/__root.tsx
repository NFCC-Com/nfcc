import {
  HeadContent,
  Scripts,
  createRootRoute,
  useRouterState,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import appCss from '../styles.css?url'
import { Header } from '#/components/header.tsx'
import { Footer } from '#/components/footer.tsx'
import { getSettings } from '#/server/content.ts'

const SITE_TITLE = 'NFCC — Nurul Fikri Cybersecurity Community'
const SITE_DESCRIPTION =
  'Komunitas cybersecurity mahasiswa STT Terpadu Nurul Fikri — workshop offensive security, CTF, dan sesi boot-to-root.'

export const Route = createRootRoute({
  loader: () => getSettings(),
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: SITE_TITLE,
      },
      {
        name: 'description',
        content: SITE_DESCRIPTION,
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      {
        rel: 'icon',
        href: '/favicon.svg',
        type: 'image/svg+xml',
      },
      {
        rel: 'icon',
        href: '/favicon.ico',
        sizes: '32x32',
      },
      {
        rel: 'apple-touch-icon',
        href: '/apple-touch-icon.png',
      },
      {
        rel: 'manifest',
        href: '/manifest.json',
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const settings = Route.useLoaderData()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const isDashboard = pathname.startsWith('/dashboard')
  const hasDarkHero = ['/about', '/contact', '/gallery'].includes(pathname)

  return (
    <html lang="id">
      <head>
        <HeadContent />
      </head>
      <body>
        {isDashboard ? (
          children
        ) : (
          <div className="flex min-h-screen flex-col">
            <Header darkHero={hasDarkHero} />
            <main className="flex-1">{children}</main>
            <Footer settings={settings} />
          </div>
        )}
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
