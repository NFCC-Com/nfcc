import { createHash, randomBytes } from 'node:crypto'

export const RESERVED = new Set([
  'about',
  'api',
  'assets',
  'blog',
  'contact',
  'dashboard',
  'favicon.svg',
  'favicon.ico',
  'gallery',
  'logo192.png',
  'logo512.png',
  'manifest.json',
  'placeholders',
  'robots.txt',
])

const CODE_RE = /^[A-Za-z0-9_-]+$/
const CODE_MIN = 1
const CODE_MAX = 64

const BASE62 =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

export function isValidCode(code: string): boolean {
  return (
    code.length >= CODE_MIN &&
    code.length <= CODE_MAX &&
    CODE_RE.test(code) &&
    !RESERVED.has(code.toLowerCase())
  )
}

export function isSafeTargetUrl(raw: string): boolean {
  let url: URL
  try {
    url = new URL(raw)
  } catch {
    return false
  }
  return url.protocol === 'http:' || url.protocol === 'https:'
}

export function generateCode(length = 6): string {
  const bytes = randomBytes(length * 2)
  const hash = createHash('sha256').update(bytes).digest()

  let code = ''
  for (let i = 0; i < length; i++) {
    code += BASE62[hash[i] % 62]
  }
  return code
}
