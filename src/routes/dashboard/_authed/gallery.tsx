import * as React from 'react'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { PlusIcon, PencilIcon, Trash2Icon } from 'lucide-react'
import { toast } from 'sonner'

import { PageHeader } from '#/components/dashboard/page-header.tsx'
import { ConfirmDelete } from '#/components/dashboard/confirm-delete.tsx'
import { ImageUpload } from '#/components/dashboard/image-upload.tsx'
import { Button } from '#/components/ui/button.tsx'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#/components/ui/dialog.tsx'
import { Input } from '#/components/ui/input.tsx'
import { Label } from '#/components/ui/label.tsx'
import type { GalleryItem } from '#/db/schema.ts'
import {
  deleteGalleryItem,
  listGallery,
  saveGalleryItem,
} from '#/server/admin.ts'

export const Route = createFileRoute('/dashboard/_authed/gallery')({
  component: GalleryAdmin,
  loader: () => listGallery(),
})

type Draft = {
  id?: number
  image: string
  caption: string
  tag: string
  date: string
  sortOrder: number
}

const EMPTY: Draft = {
  image: '',
  caption: '',
  tag: 'Workshop',
  date: '',
  sortOrder: 0,
}

function GalleryAdmin() {
  const items = Route.useLoaderData()
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [draft, setDraft] = React.useState<Draft>(EMPTY)

  function openNew() {
    setDraft(EMPTY)
    setOpen(true)
  }

  function openEdit(item: GalleryItem) {
    setDraft({
      id: item.id,
      image: item.image,
      caption: item.caption,
      tag: item.tag,
      date: item.date,
      sortOrder: item.sortOrder,
    })
    setOpen(true)
  }

  async function handleSave() {
    if (!draft.image) {
      toast.error('Image is required')
      return
    }
    await saveGalleryItem({ data: draft })
    toast.success('Saved')
    setOpen(false)
    router.invalidate()
  }

  async function handleDelete(id: number) {
    await deleteGalleryItem({ data: id })
    toast.success('Deleted')
    router.invalidate()
  }

  return (
    <div>
      <PageHeader
        title="Gallery"
        description="Photos shown on the public gallery page."
        action={
          <Button onClick={openNew}>
            <PlusIcon className="size-4" />
            Add photo
          </Button>
        }
      />

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No photos yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-xl border border-border bg-card"
            >
              <img
                src={item.image}
                alt={item.caption}
                className="aspect-[3/2] w-full object-cover"
              />
              <div className="p-3">
                <div className="font-mono text-[0.65rem] tracking-wide text-brand-orange uppercase">
                  {item.tag}
                </div>
                <p className="mt-1 line-clamp-2 text-sm">{item.caption}</p>
                <div className="mt-3 flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => openEdit(item)}
                  >
                    <PencilIcon className="size-4" />
                  </Button>
                  <ConfirmDelete
                    trigger={
                      <Button variant="ghost" size="icon-sm">
                        <Trash2Icon className="size-4 text-destructive" />
                      </Button>
                    }
                    onConfirm={() => handleDelete(item.id)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="hidden" />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{draft.id ? 'Edit photo' : 'Add photo'}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <ImageUpload
              value={draft.image}
              onChange={(image) => setDraft((d) => ({ ...d, image }))}
            />
            <div className="flex flex-col gap-2">
              <Label>Caption</Label>
              <Input
                value={draft.caption}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, caption: e.target.value }))
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label>Tag</Label>
                <Input
                  value={draft.tag}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, tag: e.target.value }))
                  }
                  placeholder="Workshop / CTF / Community"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={draft.date}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, date: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Sort order</Label>
              <Input
                type="number"
                value={draft.sortOrder}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, sortOrder: Number(e.target.value) }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
