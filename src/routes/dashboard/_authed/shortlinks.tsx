import * as React from 'react'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { CopyIcon, ExternalLinkIcon, LinkIcon, PencilIcon, PlusIcon, QrCodeIcon, Trash2Icon } from 'lucide-react'
import { z } from 'zod'
import { toast } from 'sonner'

import { PageHeader } from '#/components/dashboard/page-header.tsx'
import { ConfirmDelete } from '#/components/dashboard/confirm-delete.tsx'
import { FormField, fieldErrors } from '#/components/dashboard/form-field.tsx'
import { Button } from '#/components/ui/button.tsx'
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from '#/components/ui/dialog.tsx'
import { Input } from '#/components/ui/input.tsx'
import type { Shortlink } from '#/db/schema.ts'
import { deleteShortlink, listShortlinks, saveShortlink } from '#/server/admin.ts'
import { SkeletonTable } from '#/components/dashboard/skeletons.tsx'
import { QrCodeCard } from '#/components/dashboard/qr-code.tsx'

const shortlinkInput = z.object({
  id: z.number().int().optional(),
  url: z.string().min(1, 'URL tujuan wajib diisi'),
  code: z.string().default(''),
})

export const Route = createFileRoute('/dashboard/_authed/shortlinks')({
  component: ShortlinksAdmin,
  pendingMs: 200,
  pendingComponent: () => <SkeletonTable />,
  loader: () => listShortlinks(),
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

export default function ShortlinksAdmin() {
  const rows = Route.useLoaderData()
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
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="px-4 py-3 font-medium">URL Pendek</th>
                <th className="px-4 py-3 font-medium max-sm:hidden">Tujuan</th>
                <th className="px-4 py-3 font-medium text-right">Klik</th>
                <th className="px-4 py-3 font-medium max-md:hidden">Terakhir diklik</th>
                <th className="px-4 py-3 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((sl: Shortlink) => (
                <tr key={sl.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <LinkIcon className="size-3.5 text-muted-foreground shrink-0" />
                      <span className="font-mono text-xs truncate max-w-[140px] sm:max-w-none">/{sl.code}</span>
                      <button type="button" className="shrink-0 text-muted-foreground hover:text-foreground" onClick={() => copyUrl(sl.code)} title="Salin URL"><CopyIcon className="size-3.5" /></button>
                      <a href={`/${sl.code}`} target="_blank" rel="noreferrer" className="shrink-0 text-muted-foreground hover:text-brand-orange" title="Buka"><ExternalLinkIcon className="size-3.5" /></a>
                    </div>
                  </td>
                  <td className="px-4 py-3 max-sm:hidden"><span className="truncate block max-w-[200px] text-muted-foreground" title={sl.url}>{sl.url}</span></td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums">{sl.clicks}</td>
                  <td className="px-4 py-3 text-muted-foreground max-md:hidden">{sl.lastClickedAt ? new Date(sl.lastClickedAt).toLocaleString() : '\u2014'}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon-sm" onClick={() => { setQrItem(sl); setQrOpen(true) }} title="Kode QR"><QrCodeIcon className="size-4" /></Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => { setEditing(sl); setOpen(true) }}><PencilIcon className="size-4" /></Button>
                      <ConfirmDelete trigger={<Button variant="ghost" size="icon-sm"><Trash2Icon className="size-4 text-destructive" /></Button>} onConfirm={() => handleDelete(sl.id)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
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

