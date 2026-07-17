import { createFileRoute, Link, useNavigate, useRouter } from '@tanstack/react-router'
import { PlusIcon, PencilIcon, Trash2Icon } from 'lucide-react'
import { z } from 'zod'
import { toast } from 'sonner'

import { PageHeader } from '#/components/dashboard/page-header.tsx'
import { ConfirmDelete } from '#/components/dashboard/confirm-delete.tsx'
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
import { SkeletonTable } from '#/components/dashboard/skeletons.tsx'

const postsSearch = z.object({ page: z.number().int().min(1).catch(1).default(1) })

export const Route = createFileRoute('/dashboard/_authed/posts/')({
  component: PostsList,
  pendingMs: 200,
  pendingComponent: () => <SkeletonTable />,
  validateSearch: postsSearch,
  loaderDeps: ({ search }) => ({ page: search.page }),
  loader: ({ deps }) => listAllPosts({ data: deps }),
})

function PostsList() {
  const { rows: posts, total, page, pageSize } = Route.useLoaderData()
  const navigate = useNavigate({ from: Route.fullPath })
  const router = useRouter()

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
          <Button asChild>
            <Link to="/dashboard/posts/$id" params={{ id: 'new' }}>
              <PlusIcon className="size-4" />
              Post baru
            </Link>
          </Button>
        }
      />

      {posts.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Belum ada post. Bikin yang pertama yuk.
        </p>
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
                    {new Date(post.updatedAt).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
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
