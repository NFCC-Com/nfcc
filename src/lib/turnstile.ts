/**
 * Server-side verification for Cloudflare Turnstile. Reads TURNSTILE_SECRET_KEY —
 * see https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
 */
export async function verifyTurnstile(
  token: string,
  remoteIp?: string,
): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY
  if (!secretKey) {
    throw new Error(
      'TURNSTILE_SECRET_KEY is not set. Copy .env.example to .env and fill it in.',
    )
  }
  if (!token) return false

  const body = new URLSearchParams({ secret: secretKey, response: token })
  if (remoteIp) body.set('remoteip', remoteIp)

  const res = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    { method: 'POST', body },
  )
  const result = (await res.json()) as { success: boolean }
  return result.success
}
