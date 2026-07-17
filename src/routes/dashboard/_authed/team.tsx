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
} from '#/components/ui/dialog.tsx'
import { Input } from '#/components/ui/input.tsx'
import { Label } from '#/components/ui/label.tsx'
import type { TeamMember } from '#/db/schema.ts'
import { deleteTeamMember, listTeam, saveTeamMember } from '#/server/admin.ts'

export const Route = createFileRoute('/dashboard/_authed/team')({
  component: TeamAdmin,
  loader: () => listTeam(),
})

type Draft = {
  id?: number
  name: string
  role: string
  division: string
  photo: string
  sortOrder: number
}

const EMPTY: Draft = {
  name: '',
  role: '',
  division: 'Core Team',
  photo: '/placeholders/avatar.svg',
  sortOrder: 0,
}

function TeamAdmin() {
  const members = Route.useLoaderData()
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [draft, setDraft] = React.useState<Draft>(EMPTY)

  function openEdit(member: TeamMember) {
    setDraft({ ...member })
    setOpen(true)
  }

  async function handleSave() {
    if (!draft.name.trim()) {
      toast.error('Name is required')
      return
    }
    await saveTeamMember({ data: draft })
    toast.success('Saved')
    setOpen(false)
    router.invalidate()
  }

  async function handleDelete(id: number) {
    await deleteTeamMember({ data: id })
    toast.success('Deleted')
    router.invalidate()
  }

  return (
    <div>
      <PageHeader
        title="Team"
        description="Members shown on the About page, grouped by division."
        action={
          <Button
            onClick={() => {
              setDraft(EMPTY)
              setOpen(true)
            }}
          >
            <PlusIcon className="size-4" />
            Add member
          </Button>
        }
      />

      {members.length === 0 ? (
        <p className="text-sm text-muted-foreground">No members yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {members.map((member) => (
            <div
              key={member.id}
              className="rounded-xl border border-border bg-card p-4 text-center"
            >
              <img
                src={member.photo}
                alt={member.name}
                className="mx-auto size-16 rounded-full object-cover"
              />
              <div className="mt-2 font-display font-semibold">
                {member.name}
              </div>
              <div className="text-sm text-brand-orange">{member.role}</div>
              <div className="mt-1 font-mono text-[0.65rem] tracking-wide text-muted-foreground uppercase">
                {member.division}
              </div>
              <div className="mt-3 flex justify-center gap-1">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => openEdit(member)}
                >
                  <PencilIcon className="size-4" />
                </Button>
                <ConfirmDelete
                  trigger={
                    <Button variant="ghost" size="icon-sm">
                      <Trash2Icon className="size-4 text-destructive" />
                    </Button>
                  }
                  onConfirm={() => handleDelete(member.id)}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{draft.id ? 'Edit member' : 'Add member'}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>Name</Label>
              <Input
                value={draft.name}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, name: e.target.value }))
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label>Role</Label>
                <Input
                  value={draft.role}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, role: e.target.value }))
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Division</Label>
                <Input
                  value={draft.division}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, division: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Photo</Label>
              <ImageUpload
                value={draft.photo}
                onChange={(photo) => setDraft((d) => ({ ...d, photo }))}
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
