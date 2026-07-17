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
  'Student-run cybersecurity community at STT Terpadu Nurul Fikri — offensive security workshops, CTFs, and boot-to-root sessions.'

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
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const settings = Route.useLoaderData()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const isDashboard = pathname.startsWith('/dashboard')

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {isDashboard ? (
          children
        ) : (
          <div className="flex min-h-screen flex-col">
            <Header />
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
