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
import type { Stat } from '#/db/schema.ts'
import { deleteStat, listStats, saveStat } from '#/server/admin.ts'

export const Route = createFileRoute('/dashboard/_authed/stats')({
  component: StatsAdmin,
  loader: () => listStats(),
})

type Draft = { id?: number; label: string; value: string; sortOrder: number }
const EMPTY: Draft = { label: '', value: '', sortOrder: 0 }

function StatsAdmin() {
  const rows = Route.useLoaderData()
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [draft, setDraft] = React.useState<Draft>(EMPTY)

  async function handleSave() {
    if (!draft.label.trim()) {
      toast.error('Label is required')
      return
    }
    await saveStat({ data: draft })
    toast.success('Saved')
    setOpen(false)
    router.invalidate()
  }

  async function handleDelete(id: number) {
    await deleteStat({ data: id })
    toast.success('Deleted')
    router.invalidate()
  }

  return (
    <div>
      <PageHeader
        title="Stats"
        description="The numbers strip on the landing page."
        action={
          <Button
            onClick={() => {
              setDraft(EMPTY)
              setOpen(true)
            }}
          >
            <PlusIcon className="size-4" />
            Add stat
          </Button>
        }
      />

      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">No stats yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {rows.map((stat: Stat) => (
            <div
              key={stat.id}
              className="rounded-xl border border-border bg-card p-4"
            >
              <div className="font-display text-2xl font-semibold text-brand-orange">
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                {stat.label}
              </div>
              <div className="mt-3 flex gap-1">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => {
                    setDraft({ ...stat })
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
                  onConfirm={() => handleDelete(stat.id)}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{draft.id ? 'Edit stat' : 'Add stat'}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>Value (e.g. 80+)</Label>
              <Input
                value={draft.value}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, value: e.target.value }))
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Label</Label>
              <Input
                value={draft.label}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, label: e.target.value }))
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
