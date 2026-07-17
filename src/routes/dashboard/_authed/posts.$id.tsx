import {
  createFileRoute,
  Link,
  useRouter,
  notFound,
} from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { ArrowLeftIcon } from 'lucide-react'
import { z } from 'zod'
import { toast } from 'sonner'

import { PageHeader } from '#/components/dashboard/page-header.tsx'
import { ImageUpload } from '#/components/dashboard/image-upload.tsx'
import { MarkdownEditor } from '#/components/dashboard/markdown-editor.tsx'
import { FormField, fieldErrors } from '#/components/dashboard/form-field.tsx'
import { Button } from '#/components/ui/button.tsx'
import { Input } from '#/components/ui/input.tsx'
import { Switch } from '#/components/ui/switch.tsx'
import { getPostById, savePost } from '#/server/admin.ts'
import { SkeletonForm } from '#/components/dashboard/skeletons.tsx'

const postInput = z.object({
  id: z.number().int().optional(),
  title: z.string().min(1, 'Judul wajib diisi'),
  slug: z.string().default(''),
  excerpt: z.string().default(''),
  body: z.string().default(''),
  cover: z.string().nullable().default(null),
  tags: z.array(z.string()).default([]),
  author: z.string().default('Tim NFCC'),
  published: z.boolean().default(false),
})

export const Route = createFileRoute('/dashboard/_authed/posts/$id')({
  component: PostEditor,
  pendingMs: 200,
  pendingComponent: () => <SkeletonForm fields={6} />,
  loader: async ({ params }) => {
    if (params.id === 'new') return { post: null }
    const id = Number(params.id)
    if (!Number.isInteger(id)) throw notFound()
    const post = await getPostById({ data: id })
    if (!post) throw notFound()
    return { post }
  },
})

export default function PostEditor() {
  const { post } = Route.useLoaderData()
  const router = useRouter()

  const form = useForm({
    defaultValues: {
      id: post?.id,
      title: post?.title ?? '',
      slug: post?.slug ?? '',
      excerpt: post?.excerpt ?? '',
      body: post?.body ?? '',
      cover: post?.cover ?? null,
      tags: post?.tags ?? [],
      author: post?.author ?? 'Tim NFCC',
      published: post?.published ?? false,
    } satisfies z.input<typeof postInput>,
    onSubmit: async ({ value }) => {
      const saved = await savePost({ data: value })
      toast.success('Post disimpan')
      router.invalidate()
      if (!post) {
        await router.navigate({
          to: '/dashboard/posts/$id',
          params: { id: String(saved.id) },
        })
      }
    },
  })

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
        <Link to="/dashboard/posts">
          <ArrowLeftIcon className="size-4" />
          Kembali ke daftar post
        </Link>
      </Button>

      <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); void form.handleSubmit() }}>
        <PageHeader
          title={post ? 'Edit post' : 'Post baru'}
          action={
            <div className="flex items-center gap-4">
              <form.Field name="published">
                {(f) => (
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <Switch checked={f.state.value} onCheckedChange={(v) => f.handleChange(v)} />
                    {f.state.value ? 'Publikasi' : 'Draf'}
                  </label>
                )}
              </form.Field>
              <Button type="submit" disabled={form.state.isSubmitting}>
                {form.state.isSubmitting ? 'Menyimpan\u2026' : 'Simpan'}
              </Button>
            </div>
          }
        />

        <div className="grid gap-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <form.Field name="title" validators={{ onChange: z.string().min(1, 'Judul wajib diisi') }}>
              {(f) => <FormField label="Judul" htmlFor="title" errors={fieldErrors(f)}><Input id="title" value={f.state.value} onChange={(e) => f.handleChange(e.target.value)} onBlur={f.handleBlur} /></FormField>}
            </form.Field>
            <form.Field name="slug">
              {(f) => <FormField label="Slug (dari judul kalo dikosongin)" htmlFor="slug"><Input id="slug" value={f.state.value} onChange={(e) => f.handleChange(e.target.value)} onBlur={f.handleBlur} placeholder="my-post-slug" /></FormField>}
            </form.Field>
          </div>

          <form.Field name="excerpt">
            {(f) => <FormField label="Kutipan" htmlFor="excerpt"><Input id="excerpt" value={f.state.value} onChange={(e) => f.handleChange(e.target.value)} onBlur={f.handleBlur} /></FormField>}
          </form.Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <form.Field name="tags">
              {(f) => (
                <FormField label="Tag (pisahin pake koma)" htmlFor="tags">
                  <Input id="tags" value={f.state.value.join(', ')} onChange={(e) => f.handleChange(e.target.value.split(',').map((t) => t.trim()).filter(Boolean))} onBlur={f.handleBlur} placeholder="ctf, linux, writeup" />
                </FormField>
              )}
            </form.Field>
            <form.Field name="author">
              {(f) => <FormField label="Penulis" htmlFor="author"><Input id="author" value={f.state.value} onChange={(e) => f.handleChange(e.target.value)} onBlur={f.handleBlur} /></FormField>}
            </form.Field>
          </div>

          <form.Field name="cover">
            {(f) => (
                <FormField label="Gambar cover (opsional)">
                  <ImageUpload value={f.state.value ?? ''} onChange={(url) => f.handleChange(url || null)} label="Upload cover" />
              </FormField>
            )}
          </form.Field>

          <form.Field name="body">
            {(f) => (
              <FormField label="Isi">
                <MarkdownEditor value={f.state.value} onChange={(v) => f.handleChange(v)} />
              </FormField>
            )}
          </form.Field>
        </div>
      </form>
    </div>
  )
}
