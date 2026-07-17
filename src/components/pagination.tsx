import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

import { Button } from '#/components/ui/button.tsx'

export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
}: {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  if (totalPages <= 1) return null

  return (
    <div className="mt-6 flex items-center justify-between gap-4">
      <p className="text-sm text-muted-foreground">
        Halaman {page} dari {totalPages} &middot; {total} total
      </p>
      <div className="flex gap-1">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeftIcon className="size-4" />
          Sebelumnya
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Berikutnya
          <ChevronRightIcon className="size-4" />
        </Button>
      </div>
    </div>
  )
}
