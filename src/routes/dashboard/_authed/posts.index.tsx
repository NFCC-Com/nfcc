import { createFileRoute, Link, useNavigate, useRouter } from '@tanstack/react-router'
import { PlusIcon, PencilIcon, Trash2Icon } from 'lucide-react'
import { z } from 'zod'
import { toast } from 'sonner'

import { PageHeader } from '#/components/dashboard/page-header.tsx'
import { ConfirmDelete } from '#/components/dashboard/confirm-delete.tsx'
import { ViewToggle } from '#/components/dashboard/view-toggle.tsx'
import { Pagination } from '#/components/pagination.tsx'
import { Badge } from '#/components/ui/badge.tsx'
import { Button } from '#/components/ui/button.tsx'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table.tsx'
import { deletePost, listAllPosts } from '#/server/admin.ts'
import { SkeletonCardGrid, SkeletonTable } from '#/components/dashboard/skeletons.tsx'
import { useViewMode } from '#/lib/use-view-mode.ts'

const postsSearch = z.object({ page: z.number().int().min(1).catch(1).default(1) })

export const Route = createFileRoute('/dashboard/_authed/posts/')({
  component: PostsList,
  pendingMs: 200,
  pendingComponent: PostsPending,
  validateSearch: postsSearch,
  loaderDeps: ({ search }) => ({ page: search.page }),
  loader: ({ deps }) => listAllPosts({ data: deps }),
})

function PostsPending() {
  const [mode] = useViewMode()
  return mode === 'cards' ? <SkeletonCardGrid /> : <SkeletonTable />
}

function formatUpdatedAt(updatedAt: string | number | Date) {
  return new Date(updatedAt).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function PostsList() {
  const { rows: posts, total, page, pageSize } = Route.useLoaderData()
  const navigate = useNavigate({ from: Route.fullPath })
  const router = useRouter()
  const [viewMode, setViewMode] = useViewMode()

  async function handleDelete(id: number) {
    await deletePost({ data: id })
    toast.success('Post dihapus')
    router.invalidate()
  }

  return (
    <div>
      <PageHeader
        title="Post blog"
        description="Tulis, edit, dan publikasi write-up."
        action={
          <div className="flex items-center gap-2">
            <ViewToggle value={viewMode} onChange={setViewMode} />
            <Button asChild>
              <Link to="/dashboard/posts/$id" params={{ id: 'new' }}>
                <PlusIcon className="size-4" />
                Post baru
              </Link>
            </Button>
          </div>
        }
      />

      {posts.length === 0 ? (
        <p className="text-sm text-muted-foreground">Belum ada post.</p>
      ) : viewMode === 'cards' ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex flex-col rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-md"
            >
              <div className="font-display line-clamp-2 font-semibold">{post.title}</div>
              <div className="mt-2 flex items-center gap-2">
                {post.published ? (
                  <Badge>Publikasi</Badge>
                ) : (
                  <Badge variant="outline">Draf</Badge>
                )}
                <span className="text-xs text-muted-foreground">
                  {formatUpdatedAt(post.updatedAt)}
                </span>
              </div>
              <div className="mt-4 flex justify-end gap-1 border-t border-border pt-3">
                <Button asChild variant="ghost" size="icon-sm">
                  <Link to="/dashboard/posts/$id" params={{ id: String(post.id) }}>
                    <PencilIcon className="size-4" />
                  </Link>
                </Button>
                <ConfirmDelete
                  title="Hapus post ini?"
                  trigger={
                    <Button variant="ghost" size="icon-sm">
                      <Trash2Icon className="size-4 text-destructive" />
                    </Button>
                  }
                  onConfirm={() => handleDelete(post.id)}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Judul</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Diupdate</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>
                    {post.published ? (
                      <Badge>Publikasi</Badge>
                    ) : (
                      <Badge variant="outline">Draf</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatUpdatedAt(post.updatedAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button asChild variant="ghost" size="icon-sm">
                        <Link
                          to="/dashboard/posts/$id"
                          params={{ id: String(post.id) }}
                        >
                          <PencilIcon className="size-4" />
                        </Link>
                      </Button>
                      <ConfirmDelete
                        title="Hapus post ini?"
                        trigger={
                          <Button variant="ghost" size="icon-sm">
                            <Trash2Icon className="size-4 text-destructive" />
                          </Button>
                        }
                        onConfirm={() => handleDelete(post.id)}
                      />
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
    </div>
  )
}
