import * as React from 'react'

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js'

type TurnstileInstance = {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string
      callback: (token: string) => void
      'expired-callback'?: () => void
      'error-callback'?: () => void
    },
  ) => string
  reset: (widgetId?: string) => void
  remove: (widgetId?: string) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileInstance
  }
}

let scriptPromise: Promise<void> | undefined

function loadTurnstileScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve()
  scriptPromise ??= new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = SCRIPT_SRC
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Turnstile script'))
    document.head.append(script)
  })
  return scriptPromise
}

export type TurnstileWidgetHandle = { reset: () => void }

/**
 * Cloudflare Turnstile challenge widget. Calls `onToken` once solved; the token
 * is single-use, so callers should reset the widget after every submit attempt
 * (success or failure) via the forwarded ref.
 */
export const TurnstileWidget = React.forwardRef<
  TurnstileWidgetHandle,
  { siteKey: string; onToken: (token: string) => void; onExpire?: () => void }
>(function TurnstileWidget({ siteKey, onToken, onExpire }, ref) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const widgetIdRef = React.useRef<string | undefined>(undefined)

  // Refs so the widget callback always calls the latest handlers without
  // needing to re-render (and re-register) the Turnstile widget on every
  // parent render.
  const onTokenRef = React.useRef(onToken)
  onTokenRef.current = onToken
  const onExpireRef = React.useRef(onExpire)
  onExpireRef.current = onExpire

  React.useImperativeHandle(ref, () => ({
    reset() {
      if (widgetIdRef.current) window.turnstile?.reset(widgetIdRef.current)
    },
  }))

  React.useEffect(() => {
    let cancelled = false

    loadTurnstileScript().then(() => {
      if (cancelled || !containerRef.current || !window.turnstile) return
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: (token) => onTokenRef.current(token),
        'expired-callback': () => onExpireRef.current?.(),
      })
    })

    return () => {
      cancelled = true
      if (widgetIdRef.current) window.turnstile?.remove(widgetIdRef.current)
    }
  }, [siteKey])

  return <div ref={containerRef} />
})
