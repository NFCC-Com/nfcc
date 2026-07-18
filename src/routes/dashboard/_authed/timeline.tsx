import * as React from 'react'
import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { PlusIcon, PencilIcon, Trash2Icon } from 'lucide-react'
import { z } from 'zod'
import { toast } from 'sonner'

import { PageHeader } from '#/components/dashboard/page-header.tsx'
import { ConfirmDelete } from '#/components/dashboard/confirm-delete.tsx'
import { FormField, fieldErrors } from '#/components/dashboard/form-field.tsx'
import { Pagination } from '#/components/pagination.tsx'
import { Button } from '#/components/ui/button.tsx'
import {
  ResponsiveDialog as Dialog,
  ResponsiveDialogContent as DialogContent,
  ResponsiveDialogFooter as DialogFooter,
  ResponsiveDialogHeader as DialogHeader,
  ResponsiveDialogTitle as DialogTitle,
} from '#/components/dashboard/responsive-dialog.tsx'
import { Input } from '#/components/ui/input.tsx'
import { Textarea } from '#/components/ui/textarea.tsx'
import type { TimelineEntry } from '#/db/schema.ts'
import { deleteTimelineEntry, listTimeline, saveTimelineEntry } from '#/server/admin.ts'
import { SkeletonList } from '#/components/dashboard/skeletons.tsx'

const timelineSearch = z.object({ page: z.number().int().min(1).catch(1).default(1) })

const timelineInput = z.object({
  id: z.number().int().optional(),
  year: z.string().default(''),
  title: z.string().min(1, 'Judul wajib diisi'),
  description: z.string().default(''),
  sortOrder: z.number().int().default(0),
})

export const Route = createFileRoute('/dashboard/_authed/timeline')({
  component: TimelineAdmin,
  pendingMs: 200,
  pendingComponent: () => <SkeletonList />,
  validateSearch: timelineSearch,
  loaderDeps: ({ search }) => ({ page: search.page }),
  loader: ({ deps }) => listTimeline({ data: deps }),
})

function TimelineForm({ entry, onDone }: { entry?: TimelineEntry; onDone: () => void }) {
  const router = useRouter()

  const form = useForm({
    defaultValues: {
      id: entry?.id,
      year: entry?.year ?? '',
      title: entry?.title ?? '',
      description: entry?.description ?? '',
      sortOrder: entry?.sortOrder ?? 0,
    } satisfies z.input<typeof timelineInput>, onSubmit: async ({ value }) => {
      await saveTimelineEntry({ data: value })
      toast.success('Disimpan')
      onDone()
      router.invalidate()
    },
  })

  return (
    <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); void form.handleSubmit() }} className="flex flex-col gap-4">
      <div className="grid grid-cols-[1fr_2fr] gap-4">
        <form.Field name="year">
          {(f) => <FormField label="Tahun"><Input value={f.state.value} onChange={(e) => f.handleChange(e.target.value)} onBlur={f.handleBlur} /></FormField>}
        </form.Field>
        <form.Field name="title" validators={{ onChange: z.string().min(1, 'Judul wajib diisi') }}>
          {(f) => <FormField label="Judul" errors={fieldErrors(f)}><Input value={f.state.value} onChange={(e) => f.handleChange(e.target.value)} onBlur={f.handleBlur} /></FormField>}
        </form.Field>
      </div>
      <form.Field name="description">
        {(f) => <FormField label="Deskripsi"><Textarea value={f.state.value} onChange={(e) => f.handleChange(e.target.value)} onBlur={f.handleBlur} /></FormField>}
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

function TimelineAdmin() {
  const { rows: entries, total, page, pageSize } = Route.useLoaderData()
  const navigate = useNavigate({ from: Route.fullPath })
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<TimelineEntry | undefined>()

  async function handleDelete(id: number) {
    await deleteTimelineEntry({ data: id })
    toast.success('Dihapus')
    router.invalidate()
  }

  return (
    <div>
      <PageHeader title="Timeline" description="Tonggak sejarah yang tampil di halaman Tentang." action={<Button onClick={() => { setEditing(undefined); setOpen(true) }}><PlusIcon className="size-4" /> Tambah milestone</Button>} />
      {entries.length === 0 ? (
        <p className="text-sm text-muted-foreground">Belum ada milestone.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {entries.map((entry: TimelineEntry) => (
            <div key={entry.id} className="flex items-start justify-between gap-4 rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-md">
              <div className="min-w-0">
                <div className="font-mono text-xs tracking-wide text-brand-orange uppercase">{entry.year || '\u2014'}</div>
                <div className="font-display font-semibold">{entry.title}</div>
                <p className="mt-1 text-sm text-muted-foreground">{entry.description}</p>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button variant="ghost" size="icon-sm" onClick={() => { setEditing(entry); setOpen(true) }}><PencilIcon className="size-4" /></Button>
                <ConfirmDelete trigger={<Button variant="ghost" size="icon-sm"><Trash2Icon className="size-4 text-destructive" /></Button>} onConfirm={() => handleDelete(entry.id)} />
              </div>
            </div>
          ))}
        </div>
      )}

      <Pagination
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={(p) => navigate({ search: (prev) => ({ ...prev, page: p }) })}
      />

      <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(undefined) }}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? 'Edit milestone' : 'Tambah milestone'}</DialogTitle></DialogHeader>
          <TimelineForm key={editing?.id ?? 'new'} entry={editing} onDone={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

