import { describe, expect, it } from 'vitest'

import { renderMarkdown } from './markdown.ts'

describe('renderMarkdown', () => {
  it('renders headings and paragraphs to HTML', async () => {
    const html = await renderMarkdown('# Title\n\nHello **world**.')
    expect(html).toContain('<h1>Title</h1>')
    expect(html).toContain('<strong>world</strong>')
  })

  it('renders GFM tables', async () => {
    const html = await renderMarkdown('| a | b |\n| - | - |\n| 1 | 2 |')
    expect(html).toContain('<table>')
    expect(html).toContain('<td>1</td>')
  })

  it('highlights fenced code blocks (Shiki adds token spans)', async () => {
    const html = await renderMarkdown('```bash\nnmap -sV target\n```')
    expect(html).toContain('<pre')
    expect(html).toContain('<code')
    // rehype-pretty-code annotates the language on the figure/pre.
    expect(html.toLowerCase()).toContain('bash')
  })

  it('returns an empty string for empty input', async () => {
    expect((await renderMarkdown('')).trim()).toBe('')
  })
})
