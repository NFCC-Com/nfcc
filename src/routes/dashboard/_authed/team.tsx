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
import type { TeamMember } from '#/db/schema.ts'
import { deleteTeamMember, listTeam, saveTeamMember } from '#/server/admin.ts'
import { SkeletonCardGrid } from '#/components/dashboard/skeletons.tsx'

const teamInput = z.object({
  id: z.number().int().optional(),
  name: z.string().min(1, 'Nama wajib diisi'),
  role: z.string().default(''),
  division: z.string().default('Tim Inti'),
  photo: z.string().default('/placeholders/avatar.svg'),
  sortOrder: z.number().int().default(0),
})

export const Route = createFileRoute('/dashboard/_authed/team')({
  component: TeamAdmin,
  pendingMs: 200,
  pendingComponent: () => <SkeletonCardGrid />,
  loader: () => listTeam(),
})

function TeamForm({ member, onDone }: { member?: TeamMember; onDone: () => void }) {
  const router = useRouter()

  const form = useForm({
    defaultValues: {
      id: member?.id,
      name: member?.name ?? '',
      role: member?.role ?? '',
      division: member?.division ?? 'Tim Inti',
      photo: member?.photo ?? '/placeholders/avatar.svg',
      sortOrder: member?.sortOrder ?? 0,
    } satisfies z.input<typeof teamInput>, onSubmit: async ({ value }) => {
      await saveTeamMember({ data: value })
      toast.success('Disimpan')
      onDone()
      router.invalidate()
    },
  })

  return (
    <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); void form.handleSubmit() }} className="flex flex-col gap-4">
      <form.Field name="name" validators={{ onChange: z.string().min(1, 'Nama wajib diisi') }}>
        {(f) => <FormField label="Nama" errors={fieldErrors(f)}><Input value={f.state.value} onChange={(e) => f.handleChange(e.target.value)} onBlur={f.handleBlur} /></FormField>}
      </form.Field>
      <div className="grid grid-cols-2 gap-4">
        <form.Field name="role">
          {(f) => <FormField label="Jabatan"><Input value={f.state.value} onChange={(e) => f.handleChange(e.target.value)} onBlur={f.handleBlur} /></FormField>}
        </form.Field>
        <form.Field name="division">
          {(f) => <FormField label="Divisi"><Input value={f.state.value} onChange={(e) => f.handleChange(e.target.value)} onBlur={f.handleBlur} /></FormField>}
        </form.Field>
      </div>
      <form.Field name="photo">
        {(f) => <FormField label="Foto"><ImageUpload value={f.state.value} onChange={(url) => f.handleChange(url)} /></FormField>}
      </form.Field>
      <form.Field name="sortOrder">
        {(f) => <FormField label="Urutan"><Input type="number" value={f.state.value} onChange={(e) => f.handleChange(Number(e.target.value))} onBlur={f.handleBlur} /></FormField>}
      </form.Field>
      <DialogFooter>
        <Button type="submit" disabled={form.state.isSubmitting}>Simpan</Button>
      </DialogFooter>
    </form>
  )
}

export default function TeamAdmin() {
  const members = Route.useLoaderData()
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<TeamMember | undefined>()

  async function handleDelete(id: number) {
    await deleteTeamMember({ data: id })
    toast.success('Dihapus')
    router.invalidate()
  }

  return (
    <div>
      <PageHeader title="Tim" description="Anggota yang tampil di halaman Tentang, dikelompokkan per divisi." action={<Button onClick={() => { setEditing(undefined); setOpen(true) }}><PlusIcon className="size-4" /> Tambah anggota</Button>} />
      {members.length === 0 ? (
        <p className="text-sm text-muted-foreground">Belum ada anggota.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {members.map((member) => (
            <div key={member.id} className="rounded-xl border border-border bg-card p-4 text-center">
              <img src={member.photo} alt={member.name} className="mx-auto size-16 rounded-full object-cover" />
              <div className="mt-2 font-display font-semibold">{member.name}</div>
              <div className="text-sm text-brand-orange">{member.role}</div>
              <div className="mt-1 font-mono text-[0.65rem] tracking-wide text-muted-foreground uppercase">{member.division}</div>
              <div className="mt-3 flex justify-center gap-1">
                <Button variant="ghost" size="icon-sm" onClick={() => { setEditing(member); setOpen(true) }}><PencilIcon className="size-4" /></Button>
                <ConfirmDelete trigger={<Button variant="ghost" size="icon-sm"><Trash2Icon className="size-4 text-destructive" /></Button>} onConfirm={() => handleDelete(member.id)} />
              </div>
            </div>
          ))}
        </div>
      )}
      <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(undefined) }}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? 'Edit anggota' : 'Tambah anggota'}</DialogTitle></DialogHeader>
          <TeamForm key={editing?.id ?? 'new'} member={editing} onDone={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

