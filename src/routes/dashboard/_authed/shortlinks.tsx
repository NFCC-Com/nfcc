import * as React from 'react'
import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { CopyIcon, ExternalLinkIcon, LinkIcon, PencilIcon, PlusIcon, QrCodeIcon, Trash2Icon } from 'lucide-react'
import { z } from 'zod'
import { toast } from 'sonner'

import { PageHeader } from '#/components/dashboard/page-header.tsx'
import { ConfirmDelete } from '#/components/dashboard/confirm-delete.tsx'
import { FormField, fieldErrors } from '#/components/dashboard/form-field.tsx'
import { Pagination } from '#/components/pagination.tsx'
import { Button } from '#/components/ui/button.tsx'
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from '#/components/ui/dialog.tsx'
import { Input } from '#/components/ui/input.tsx'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '#/components/ui/table.tsx'
import type { Shortlink } from '#/db/schema.ts'
import { deleteShortlink, listShortlinks, saveShortlink } from '#/server/admin.ts'
import { SkeletonTable } from '#/components/dashboard/skeletons.tsx'
import { QrCodeCard } from '#/components/dashboard/qr-code.tsx'

const shortlinksSearch = z.object({ page: z.number().int().min(1).catch(1).default(1) })

const shortlinkInput = z.object({
  id: z.number().int().optional(),
  url: z.string().min(1, 'URL tujuan wajib diisi'),
  code: z.string().default(''),
})

export const Route = createFileRoute('/dashboard/_authed/shortlinks')({
  component: ShortlinksAdmin,
  pendingMs: 200,
  pendingComponent: () => <SkeletonTable />,
  validateSearch: shortlinksSearch,
  loaderDeps: ({ search }) => ({ page: search.page }),
  loader: ({ deps }) => listShortlinks({ data: deps }),
})

function ShortlinkForm({ item, onDone }: { item?: Shortlink; onDone: () => void }) {
  const router = useRouter()
  const [serverError, setServerError] = React.useState<string | null>(null)

  const form = useForm({
    defaultValues: {
      id: item?.id,
      url: item?.url ?? '',
      code: item?.code ?? '',
    } satisfies z.input<typeof shortlinkInput>, onSubmit: async ({ value }) => {
      setServerError(null)
      try {
        const result = await saveShortlink({ data: value })
        toast.success(item ? 'Shortlink diupdate' : 'Shortlink dibuat')
        onDone()
        router.invalidate()
        if (!item) {
          const url = `${window.location.origin}/${result.code}`
          await navigator.clipboard.writeText(url)
          toast.success(`Disalin: ${url}`)
        }
      } catch (err: any) {
        setServerError(err.message ?? 'Gagal menyimpan')
      }
    },
  })

  return (
    <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); void form.handleSubmit() }} className="flex flex-col gap-4">
      <form.Field name="url" validators={{ onChange: z.string().min(1, 'URL tujuan wajib diisi') }}>
        {(f) => (
          <FormField label="URL Tujuan" errors={fieldErrors(f)}>
            <Input placeholder="https://contoh.com" value={f.state.value} onChange={(e) => f.handleChange(e.target.value)} onBlur={f.handleBlur} />
          </FormField>
        )}
      </form.Field>
      <form.Field name="code">
        {(f) => (
          <FormField label="Kode kustom">
            <Input placeholder="Kosongin buat generate otomatis" value={f.state.value} disabled={!!item} onChange={(e) => f.handleChange(e.target.value)} onBlur={f.handleBlur} />
          </FormField>
        )}
      </form.Field>
      <p className="text-xs text-muted-foreground">Huruf, angka, strip, underscore. Gak bisa diubah setelah dibuat.</p>
      {serverError && <p className="text-sm text-destructive">{serverError}</p>}
      <DialogFooter>
        <Button type="submit" disabled={form.state.isSubmitting}>{form.state.isSubmitting ? 'Menyimpan...' : 'Simpan'}</Button>
      </DialogFooter>
    </form>
  )
}

function ShortlinksAdmin() {
  const { rows, total, page, pageSize } = Route.useLoaderData()
  const navigate = useNavigate({ from: Route.fullPath })
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<Shortlink | undefined>()
  const [qrOpen, setQrOpen] = React.useState(false)
  const [qrItem, setQrItem] = React.useState<Shortlink | null>(null)

  async function handleDelete(id: number) {
    await deleteShortlink({ data: id })
    toast.success('Dihapus')
    router.invalidate()
  }

  async function copyUrl(code: string) {
    const url = `${window.location.origin}/${code}`
    await navigator.clipboard.writeText(url)
    toast.success(`Disalin: ${url}`)
  }

  return (
    <div>
      <PageHeader title="Shortlink" description="Bikin URL pendek yang redirect ke mana aja." action={<Button onClick={() => { setEditing(undefined); setOpen(true) }}><PlusIcon className="size-4" /> Shortlink baru</Button>} />
      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">Belum ada shortlink.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>URL Pendek</TableHead>
                <TableHead className="max-sm:hidden">Tujuan</TableHead>
                <TableHead className="text-right">Klik</TableHead>
                <TableHead className="max-md:hidden">Terakhir diklik</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((sl: Shortlink) => (
                <TableRow key={sl.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <LinkIcon className="size-3.5 text-muted-foreground shrink-0" />
                      <span className="font-mono text-xs truncate max-w-35 sm:max-w-none">/{sl.code}</span>
                      <button type="button" className="shrink-0 text-muted-foreground hover:text-foreground" onClick={() => copyUrl(sl.code)} title="Salin URL"><CopyIcon className="size-3.5" /></button>
                      <a href={`/${sl.code}`} target="_blank" rel="noreferrer" className="shrink-0 text-muted-foreground hover:text-brand-orange" title="Buka"><ExternalLinkIcon className="size-3.5" /></a>
                    </div>
                  </TableCell>
                  <TableCell className="max-sm:hidden"><span className="truncate block max-w-50 text-muted-foreground" title={sl.url}>{sl.url}</span></TableCell>
                  <TableCell className="text-right font-mono tabular-nums">{sl.clicks}</TableCell>
                  <TableCell className="text-muted-foreground max-md:hidden">{sl.lastClickedAt ? new Date(sl.lastClickedAt).toLocaleString() : '\u2014'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon-sm" onClick={() => { setQrItem(sl); setQrOpen(true) }} title="Kode QR"><QrCodeIcon className="size-4" /></Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => { setEditing(sl); setOpen(true) }}><PencilIcon className="size-4" /></Button>
                      <ConfirmDelete trigger={<Button variant="ghost" size="icon-sm"><Trash2Icon className="size-4 text-destructive" /></Button>} onConfirm={() => handleDelete(sl.id)} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Pagination
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={(p) => navigate({ search: (prev) => ({ ...prev, page: p }) })}
      />

      <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(undefined) }}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? 'Edit shortlink' : 'Shortlink baru'}</DialogTitle></DialogHeader>
          <ShortlinkForm key={editing?.id ?? 'new'} item={editing} onDone={() => setOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={qrOpen} onOpenChange={setQrOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Kode QR</DialogTitle>
          </DialogHeader>
          {qrItem && (
            <QrCodeCard
              shortUrl={`${window.location.origin}/${qrItem.code}`}
              code={qrItem.code}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

