import * as React from 'react'

import { Textarea } from '#/components/ui/textarea.tsx'
import { renderPreview } from '#/server/admin.ts'

export function MarkdownEditor({
  value,
  onChange,
}: {
  value: string
  onChange: (markdown: string) => void
}) {
  const [html, setHtml] = React.useState('')
  const [rendering, setRendering] = React.useState(false)

  React.useEffect(() => {
    let cancelled = false
    setRendering(true)
    const timer = setTimeout(async () => {
      try {
        const result = await renderPreview({ data: value })
        if (!cancelled) setHtml(result)
      } finally {
        if (!cancelled) setRendering(false)
      }
    }, 400)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [value])

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="flex flex-col gap-2">
        <div className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
          Markdown
        </div>
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[28rem] font-mono text-sm"
          placeholder="# Write your post in markdown…"
        />
      </div>
      <div className="flex flex-col gap-2">
        <div className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
          Preview {rendering && <span className="text-brand-orange">·</span>}
        </div>
        <div className="min-h-[28rem] overflow-auto rounded-md border border-border bg-card p-5">
          <div
            className="prose prose-neutral max-w-none"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    </div>
  )
}
