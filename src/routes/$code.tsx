import * as React from 'react'
import { createFileRoute, notFound } from '@tanstack/react-router'
import { ExternalLinkIcon, LinkIcon, PauseIcon, PlayIcon } from 'lucide-react'

import { Button } from '#/components/ui/button.tsx'
import { Card } from '#/components/ui/card.tsx'
import { resolveShortlink } from '#/server/content.ts'

const COUNTDOWN_SECONDS = 3

export const Route = createFileRoute('/$code')({
  loader: async ({ params }) => {
    const url = await resolveShortlink({ data: params.code })
    if (!url) throw notFound()
    return { url, code: params.code }
  },
  head: () => ({
    meta: [
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  component: ShortlinkVerify,
})

function ShortlinkVerify() {
  const { url, code } = Route.useLoaderData()
  const [count, setCount] = React.useState(COUNTDOWN_SECONDS)
  const [paused, setPaused] = React.useState(false)
  const [redirecting, setRedirecting] = React.useState(false)

  const redirect = React.useCallback(() => {
    setRedirecting(true)
    window.location.href = url
  }, [url])

  React.useEffect(() => {
    if (redirecting || paused) return
    if (count < 1) {
      redirect()
      return
    }
    const timer = setTimeout(() => setCount((c) => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [count, paused, redirecting, redirect])

  const host = (() => {
    try {
      return new URL(url).hostname
    } catch {
      return url
    }
  })()

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <Card className="w-full max-w-md p-0 overflow-hidden">
        <div className="flex flex-col items-center gap-2 p-8 pb-6 text-center">
          <img src="/logo.png" alt="NFCC" className="size-12 rounded-xl" />
          <h1 className="display-title mt-2 text-xl font-semibold">
            Link Eksternal
          </h1>
          <p className="text-sm text-muted-foreground">
            Kamu akan keluar dari <strong>nfcc.my.id</strong> lewat shortcode{' '}
            <code className="font-mono text-xs">{code}</code>
          </p>
        </div>

        <div className="border-y border-border bg-muted/40 px-6 py-4">
          <div className="flex items-start gap-3">
            <LinkIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0">
              <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Tujuan
              </p>
              <p className="mt-1 break-all font-mono text-sm">{host}</p>
              <p className="mt-0.5 break-all text-xs text-muted-foreground">
                {url}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 p-6">
          <Button
            onClick={redirect}
            disabled={redirecting}
            className="w-full"
            size="lg"
          >
            <ExternalLinkIcon className="size-4" />
            {redirecting ? 'Mengalihkan\u2026' : `Lanjut ke ${host}`}
          </Button>

          <div className="flex items-center gap-2 text-xs text-muted-foreground tabular-nums">
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 transition-colors hover:bg-muted hover:text-foreground"
              aria-label={paused ? 'Lanjutkan hitung mundur' : 'Jeda hitung mundur'}
            >
              {paused ? (
                <PlayIcon className="size-3.5" />
              ) : (
                <PauseIcon className="size-3.5" />
              )}
            </button>
            {paused ? 'Dijeda' : `Redirect otomatis dalam ${count}s`}
          </div>
        </div>
      </Card>
    </div>
  )
}
