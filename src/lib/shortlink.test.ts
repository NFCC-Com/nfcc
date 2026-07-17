import { describe, expect, it } from 'vitest'
import { generateCode, isSafeTargetUrl, isValidCode } from './shortlink.ts'

describe('isValidCode', () => {
  it('accepts alphanumeric codes', () => {
    expect(isValidCode('abc123')).toBe(true)
  })

  it('accepts hyphen and underscore', () => {
    expect(isValidCode('my-link')).toBe(true)
    expect(isValidCode('my_link')).toBe(true)
  })

  it('rejects codes with illegal chars', () => {
    expect(isValidCode('no space')).toBe(false)
    expect(isValidCode('slash/me')).toBe(false)
    expect(isValidCode('dot.me')).toBe(false)
    expect(isValidCode('emoji👋')).toBe(false)
  })

  it('rejects empty code', () => {
    expect(isValidCode('')).toBe(false)
  })

  it('rejects code over max length', () => {
    expect(isValidCode('a'.repeat(65))).toBe(false)
  })

  it('rejects reserved codes (case-insensitive)', () => {
    expect(isValidCode('about')).toBe(false)
    expect(isValidCode('ABOUT')).toBe(false)
    expect(isValidCode('Blog')).toBe(false)
    expect(isValidCode('dashboard')).toBe(false)
    expect(isValidCode('gallery')).toBe(false)
    expect(isValidCode('api')).toBe(false)
    expect(isValidCode('assets')).toBe(false)
    expect(isValidCode('favicon.svg')).toBe(false)
    expect(isValidCode('robots.txt')).toBe(false)
    expect(isValidCode('manifest.json')).toBe(false)
  })

  it('accepts non-reserved codes', () => {
    expect(isValidCode('mylink')).toBe(true)
    expect(isValidCode('goto-x')).toBe(true)
    expect(isValidCode('nfcc_discord')).toBe(true)
  })
})

describe('isSafeTargetUrl', () => {
  it('accepts http and https URLs', () => {
    expect(isSafeTargetUrl('https://example.com')).toBe(true)
    expect(isSafeTargetUrl('http://example.com')).toBe(true)
  })

  it('rejects javascript: scheme', () => {
    expect(isSafeTargetUrl('javascript:alert(1)')).toBe(false)
  })

  it('rejects data: scheme', () => {
    expect(isSafeTargetUrl('data:text/html,<script>alert(1)</script>')).toBe(
      false,
    )
  })

  it('rejects file: scheme', () => {
    expect(isSafeTargetUrl('file:///etc/passwd')).toBe(false)
  })

  it('rejects invalid URLs', () => {
    expect(isSafeTargetUrl('not a url at all')).toBe(false)
    expect(isSafeTargetUrl('')).toBe(false)
  })
})

describe('generateCode', () => {
  it('returns a string of the requested length', () => {
    expect(generateCode(6)).toHaveLength(6)
    expect(generateCode(8)).toHaveLength(8)
  })

  it('contains only base62 characters', () => {
    for (let i = 0; i < 20; i++) {
      const code = generateCode(6)
      expect(/^[A-Za-z0-9]+$/.test(code)).toBe(true)
    }
  })

  it('produces different values (extremely likely)', () => {
    const codes = new Set(Array.from({ length: 10 }, () => generateCode(6)))
    expect(codes.size).toBe(10)
  })
})
