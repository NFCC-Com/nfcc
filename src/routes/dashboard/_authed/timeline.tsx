import * as React from 'react'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { PlusIcon, PencilIcon, Trash2Icon } from 'lucide-react'
import { toast } from 'sonner'

import { PageHeader } from '#/components/dashboard/page-header.tsx'
import { ConfirmDelete } from '#/components/dashboard/confirm-delete.tsx'
import { Button } from '#/components/ui/button.tsx'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog.tsx'
import { Input } from '#/components/ui/input.tsx'
import { Label } from '#/components/ui/label.tsx'
import { Textarea } from '#/components/ui/textarea.tsx'
import type { TimelineEntry } from '#/db/schema.ts'
import {
  deleteTimelineEntry,
  listTimeline,
  saveTimelineEntry,
} from '#/server/admin.ts'

export const Route = createFileRoute('/dashboard/_authed/timeline')({
  component: TimelineAdmin,
  loader: () => listTimeline(),
})

type Draft = {
  id?: number
  year: string
  title: string
  description: string
  sortOrder: number
}
const EMPTY: Draft = { year: '', title: '', description: '', sortOrder: 0 }

function TimelineAdmin() {
  const entries = Route.useLoaderData()
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [draft, setDraft] = React.useState<Draft>(EMPTY)

  async function handleSave() {
    if (!draft.title.trim()) {
      toast.error('Title is required')
      return
    }
    await saveTimelineEntry({ data: draft })
    toast.success('Saved')
    setOpen(false)
    router.invalidate()
  }

  async function handleDelete(id: number) {
    await deleteTimelineEntry({ data: id })
    toast.success('Deleted')
    router.invalidate()
  }

  return (
    <div>
      <PageHeader
        title="Timeline"
        description="Milestones shown on the About page."
        action={
          <Button
            onClick={() => {
              setDraft(EMPTY)
              setOpen(true)
            }}
          >
            <PlusIcon className="size-4" />
            Add milestone
          </Button>
        }
      />

      {entries.length === 0 ? (
        <p className="text-sm text-muted-foreground">No milestones yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {entries.map((entry: TimelineEntry) => (
            <div
              key={entry.id}
              className="flex items-start justify-between gap-4 rounded-xl border border-border bg-card p-4"
            >
              <div>
                <div className="font-mono text-xs tracking-wide text-brand-orange uppercase">
                  {entry.year || '—'}
                </div>
                <div className="font-display font-semibold">{entry.title}</div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {entry.description}
                </p>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => {
                    setDraft({ ...entry })
                    setOpen(true)
                  }}
                >
                  <PencilIcon className="size-4" />
                </Button>
                <ConfirmDelete
                  trigger={
                    <Button variant="ghost" size="icon-sm">
                      <Trash2Icon className="size-4 text-destructive" />
                    </Button>
                  }
                  onConfirm={() => handleDelete(entry.id)}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {draft.id ? 'Edit milestone' : 'Add milestone'}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-[1fr_2fr] gap-4">
              <div className="flex flex-col gap-2">
                <Label>Year</Label>
                <Input
                  value={draft.year}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, year: e.target.value }))
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Title</Label>
                <Input
                  value={draft.title}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, title: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Description</Label>
              <Textarea
                value={draft.description}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, description: e.target.value }))
                }
              />
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
