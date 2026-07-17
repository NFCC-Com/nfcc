import { Link } from '@tanstack/react-router'
import { TerminalIcon } from 'lucide-react'

import { Button } from '#/components/ui/button.tsx'

export function NotFound() {
  return (
    <div className="band-dark flex min-h-[70vh] flex-col items-center justify-center text-center">
      <div className="grid-texture" />
      <div className="relative page-wrap flex flex-col items-center gap-4">
        <div className="eyebrow flex items-center gap-2">
          <TerminalIcon className="size-3.5" />
          404 — akses ditolak
        </div>
        <h1 className="display-title text-5xl font-semibold sm:text-6xl">
          Halaman gak ditemukan
        </h1>
        <p className="max-w-md text-white/65">
          Rute ini gak ada — atau mungkin belum di-deploy. Balik aja sebelum
          kena flag enumeration.
        </p>
        <Button asChild size="lg" className="mt-2">
          <Link to="/">Balik ke tempat aman</Link>
        </Button>
      </div>
    </div>
  )
}
