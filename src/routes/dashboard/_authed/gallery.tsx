import * as React from 'react'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { PlusIcon, PencilIcon, Trash2Icon } from 'lucide-react'
import { z } from 'zod'
import { toast } from 'sonner'

import { PageHeader } from '#/components/dashboard/page-header.tsx'
import { ConfirmDelete } from '#/components/dashboard/confirm-delete.tsx'
import { ImageUpload } from '#/components/dashboard/image-upload.tsx'
import { FormField, fieldErrors } from '#/components/dashboard/form-field.tsx'
import { Button } from '#/components/ui/button.tsx'
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from '#/components/ui/dialog.tsx'
import { Input } from '#/components/ui/input.tsx'
import type { GalleryItem } from '#/db/schema.ts'
import { deleteGalleryItem, listGallery, saveGalleryItem } from '#/server/admin.ts'
import { SkeletonCardGrid } from '#/components/dashboard/skeletons.tsx'

const galleryInput = z.object({
  id: z.number().int().optional(),
  image: z.string().min(1, 'Gambar wajib diisi'),
  caption: z.string().default(''),
  tag: z.string().default('Workshop'),
  date: z.string().default(''),
  sortOrder: z.number().int().default(0),
})

export const Route = createFileRoute('/dashboard/_authed/gallery')({
  component: GalleryAdmin,
  pendingMs: 200,
  pendingComponent: () => <SkeletonCardGrid />,
  loader: () => listGallery(),
})

function GalleryForm({ item, onDone }: { item?: GalleryItem; onDone: () => void }) {
  const router = useRouter()

  const form = useForm({
    defaultValues: {
      id: item?.id,
      image: item?.image ?? '',
      caption: item?.caption ?? '',
      tag: item?.tag ?? 'Workshop',
      date: item?.date ?? '',
      sortOrder: item?.sortOrder ?? 0,
    } satisfies z.input<typeof galleryInput>, onSubmit: async ({ value }) => {
      await saveGalleryItem({ data: value })
      toast.success('Disimpan')
      onDone()
      router.invalidate()
    },
  })

  return (
    <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); void form.handleSubmit() }} className="flex flex-col gap-4">
      <form.Field name="image" validators={{ onChange: z.string().min(1, 'Gambar wajib diisi') }}>
        {(f) => <FormField label="Gambar" errors={fieldErrors(f)}><ImageUpload value={f.state.value} onChange={(url) => f.handleChange(url)} /></FormField>}
      </form.Field>
      <form.Field name="caption">
        {(f) => <FormField label="Keterangan"><Input value={f.state.value} onChange={(e) => f.handleChange(e.target.value)} onBlur={f.handleBlur} /></FormField>}
      </form.Field>
      <div className="grid grid-cols-2 gap-4">
        <form.Field name="tag">
          {(f) => <FormField label="Tag"><Input value={f.state.value} onChange={(e) => f.handleChange(e.target.value)} onBlur={f.handleBlur} placeholder="Workshop / CTF / Komunitas" /></FormField>}
        </form.Field>
        <form.Field name="date">
          {(f) => <FormField label="Tanggal"><Input type="date" value={f.state.value} onChange={(e) => f.handleChange(e.target.value)} onBlur={f.handleBlur} /></FormField>}
        </form.Field>
      </div>
      <form.Field name="sortOrder">
        {(f) => <FormField label="Urutan"><Input type="number" value={f.state.value} onChange={(e) => f.handleChange(Number(e.target.value))} onBlur={f.handleBlur} /></FormField>}
      </form.Field>
      <DialogFooter>
        <Button type="submit" disabled={form.state.isSubmitting}>Simpan</Button>
      </DialogFooter>
    </form>
  )
}

export default function GalleryAdmin() {
  const items = Route.useLoaderData()
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<GalleryItem | undefined>()

  async function handleDelete(id: number) {
    await deleteGalleryItem({ data: id })
    toast.success('Dihapus')
    router.invalidate()
  }

  return (
    <div>
      <PageHeader title="Galeri" description="Foto yang tampil di halaman galeri publik." action={<Button onClick={() => { setEditing(undefined); setOpen(true) }}><PlusIcon className="size-4" /> Tambah foto</Button>} />
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">Belum ada foto.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <div key={item.id} className="overflow-hidden rounded-xl border border-border bg-card">
              <img src={item.image} alt={item.caption} className="aspect-[3/2] w-full object-cover" />
              <div className="p-3">
                <div className="font-mono text-[0.65rem] tracking-wide text-brand-orange uppercase">{item.tag}</div>
                <p className="mt-1 line-clamp-2 text-sm">{item.caption}</p>
                <div className="mt-3 flex gap-1">
                  <Button variant="ghost" size="icon-sm" onClick={() => { setEditing(item); setOpen(true) }}><PencilIcon className="size-4" /></Button>
                  <ConfirmDelete trigger={<Button variant="ghost" size="icon-sm"><Trash2Icon className="size-4 text-destructive" /></Button>} onConfirm={() => handleDelete(item.id)} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(undefined) }}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? 'Edit foto' : 'Tambah foto'}</DialogTitle></DialogHeader>
          <GalleryForm key={editing?.id ?? 'new'} item={editing} onDone={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

