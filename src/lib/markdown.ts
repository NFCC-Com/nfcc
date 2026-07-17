import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeStringify from 'rehype-stringify'

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypePrettyCode, { theme: 'github-dark-dimmed', keepBackground: false })
  .use(rehypeStringify)

/**
 * Render trusted, admin-authored markdown to an HTML string with Shiki-highlighted
 * code blocks. Output is inserted via dangerouslySetInnerHTML on the blog detail page.
 * Only feed this content written by authenticated admins — it is not sanitized.
 */
export async function renderMarkdown(markdown: string): Promise<string> {
  const file = await processor.process(markdown)
  return String(file)
}
