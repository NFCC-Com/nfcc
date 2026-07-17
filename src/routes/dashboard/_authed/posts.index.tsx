import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { PlusIcon, PencilIcon, Trash2Icon } from 'lucide-react'
import { toast } from 'sonner'

import { PageHeader } from '#/components/dashboard/page-header.tsx'
import { ConfirmDelete } from '#/components/dashboard/confirm-delete.tsx'
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

export const Route = createFileRoute('/dashboard/_authed/posts/')({
  component: PostsList,
  loader: () => listAllPosts(),
})

function PostsList() {
  const posts = Route.useLoaderData()
  const router = useRouter()

  async function handleDelete(id: number) {
    await deletePost({ data: id })
    toast.success('Post deleted')
    router.invalidate()
  }

  return (
    <div>
      <PageHeader
        title="Blog posts"
        description="Write, edit, and publish write-ups."
        action={
          <Button asChild>
            <Link to="/dashboard/posts/$id" params={{ id: 'new' }}>
              <PlusIcon className="size-4" />
              New post
            </Link>
          </Button>
        }
      />

      {posts.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No posts yet. Create your first one.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>
                    {post.published ? (
                      <Badge>Published</Badge>
                    ) : (
                      <Badge variant="outline">Draft</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(post.updatedAt).toLocaleDateString('en-US', {
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
                        title="Delete this post?"
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
    </div>
  )
}
