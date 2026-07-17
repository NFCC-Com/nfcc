import * as React from 'react'
import {
  createFileRoute,
  Link,
  useRouter,
  notFound,
} from '@tanstack/react-router'
import { ArrowLeftIcon } from 'lucide-react'
import { toast } from 'sonner'

import { PageHeader } from '#/components/dashboard/page-header.tsx'
import { ImageUpload } from '#/components/dashboard/image-upload.tsx'
import { MarkdownEditor } from '#/components/dashboard/markdown-editor.tsx'
import { Button } from '#/components/ui/button.tsx'
import { Input } from '#/components/ui/input.tsx'
import { Label } from '#/components/ui/label.tsx'
import { Switch } from '#/components/ui/switch.tsx'
import { getPostById, savePost } from '#/server/admin.ts'

export const Route = createFileRoute('/dashboard/_authed/posts/$id')({
  component: PostEditor,
  loader: async ({ params }) => {
    if (params.id === 'new') return { post: null }
    const id = Number(params.id)
    if (!Number.isInteger(id)) throw notFound()
    const post = await getPostById({ data: id })
    if (!post) throw notFound()
    return { post }
  },
})

function PostEditor() {
  const { post } = Route.useLoaderData()
  const router = useRouter()

  const [title, setTitle] = React.useState(post?.title ?? '')
  const [slug, setSlug] = React.useState(post?.slug ?? '')
  const [excerpt, setExcerpt] = React.useState(post?.excerpt ?? '')
  const [body, setBody] = React.useState(post?.body ?? '')
  const [cover, setCover] = React.useState(post?.cover ?? '')
  const [tags, setTags] = React.useState((post?.tags ?? []).join(', '))
  const [author, setAuthor] = React.useState(post?.author ?? 'NFCC Team')
  const [published, setPublished] = React.useState(post?.published ?? false)
  const [saving, setSaving] = React.useState(false)

  async function handleSave() {
    if (!title.trim()) {
      toast.error('Title is required')
      return
    }
    setSaving(true)
    try {
      const saved = await savePost({
        data: {
          id: post?.id,
          title,
          slug: slug.trim() || undefined,
          excerpt,
          body,
          cover: cover.trim() || null,
          tags: tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean),
          author,
          published,
        },
      })
      toast.success('Post saved')
      router.invalidate()
      if (!post) {
        await router.navigate({
          to: '/dashboard/posts/$id',
          params: { id: String(saved.id) },
        })
      }
    } catch {
      toast.error('Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
        <Link to="/dashboard/posts">
          <ArrowLeftIcon className="size-4" />
          Back to posts
        </Link>
      </Button>

      <PageHeader
        title={post ? 'Edit post' : 'New post'}
        action={
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm font-medium">
              <Switch checked={published} onCheckedChange={setPublished} />
              {published ? 'Published' : 'Draft'}
            </label>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </div>
        }
      />

      <div className="grid gap-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="slug">Slug (auto from title if blank)</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="my-post-slug"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="excerpt">Excerpt</Label>
          <Input
            id="excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="ctf, linux, writeup"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Cover image (optional)</Label>
          <ImageUpload value={cover} onChange={setCover} label="Upload cover" />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Body</Label>
          <MarkdownEditor value={body} onChange={setBody} />
        </div>
      </div>
    </div>
  )
}
