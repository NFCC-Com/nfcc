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
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog.tsx'
import { Input } from '#/components/ui/input.tsx'
import type { Stat } from '#/db/schema.ts'
import { deleteStat, listStats, saveStat } from '#/server/admin.ts'
import { SkeletonCardGrid } from '#/components/dashboard/skeletons.tsx'

const statsSearch = z.object({ page: z.number().int().min(1).catch(1).default(1) })

const statInput = z.object({
  id: z.number().int().optional(),
  label: z.string().min(1, 'Label wajib diisi'),
  value: z.string().default(''),
  sortOrder: z.number().int().default(0),
})

export const Route = createFileRoute('/dashboard/_authed/stats')({
  component: StatsAdmin,
  pendingMs: 200,
  pendingComponent: () => <SkeletonCardGrid cards={4} />,
  validateSearch: statsSearch,
  loaderDeps: ({ search }) => ({ page: search.page }),
  loader: ({ deps }) => listStats({ data: deps }),
})

function StatForm({ item, onDone }: { item?: Stat; onDone: () => void }) {
  const router = useRouter()

  const form = useForm({
    defaultValues: {
      id: item?.id,
      label: item?.label ?? '',
      value: item?.value ?? '',
      sortOrder: item?.sortOrder ?? 0,
    } satisfies z.input<typeof statInput>, onSubmit: async ({ value }) => {
      await saveStat({ data: value })
      toast.success('Disimpan')
      onDone()
      router.invalidate()
    },
  })

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); void form.handleSubmit() }}
      className="flex flex-col gap-4"
    >
      <form.Field name="value">
        {(f) => (
          <FormField label="Nilai (mis: 80+)" errors={fieldErrors(f)}>
            <Input value={f.state.value} onChange={(e) => f.handleChange(e.target.value)} onBlur={f.handleBlur} />
          </FormField>
        )}
      </form.Field>
      <form.Field name="label" validators={{ onChange: z.string().min(1, 'Label wajib diisi') }}>
        {(f) => (
          <FormField label="Label" errors={fieldErrors(f)}>
            <Input value={f.state.value} onChange={(e) => f.handleChange(e.target.value)} onBlur={f.handleBlur} />
          </FormField>
        )}
      </form.Field>
      <form.Field name="sortOrder">
        {(f) => (
          <FormField label="Urutan">
            <Input type="number" value={f.state.value} onChange={(e) => f.handleChange(Number(e.target.value))} onBlur={f.handleBlur} />
          </FormField>
        )}
      </form.Field>
      <DialogFooter>
        <Button type="submit" disabled={form.state.isSubmitting}>Simpan</Button>
      </DialogFooter>
    </form>
  )
}

function StatsAdmin() {
  const { rows, total, page, pageSize } = Route.useLoaderData()
  const navigate = useNavigate({ from: Route.fullPath })
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<Stat | undefined>()

  async function handleDelete(id: number) {
    await deleteStat({ data: id })
    toast.success('Dihapus')
    router.invalidate()
  }

  return (
    <div>
      <PageHeader title="Statistik" description="Strip angka di landing page." action={<Button onClick={() => { setEditing(undefined); setOpen(true) }}><PlusIcon className="size-4" /> Tambah stat</Button>} />
      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">Belum ada stat.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {rows.map((stat: Stat) => (
            <div key={stat.id} className="rounded-xl border border-border bg-card p-4">
              <div className="font-display text-2xl font-semibold text-brand-orange">{stat.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
              <div className="mt-3 flex gap-1">
                <Button variant="ghost" size="icon-sm" onClick={() => { setEditing(stat); setOpen(true) }}><PencilIcon className="size-4" /></Button>
                <ConfirmDelete trigger={<Button variant="ghost" size="icon-sm"><Trash2Icon className="size-4 text-destructive" /></Button>} onConfirm={() => handleDelete(stat.id)} />
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
          <DialogHeader><DialogTitle>{editing ? 'Edit stat' : 'Tambah stat'}</DialogTitle></DialogHeader>
          <StatForm key={editing?.id ?? 'new'} item={editing} onDone={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

