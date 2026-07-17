import { Link } from '@tanstack/react-router'
import { ArrowRightIcon } from 'lucide-react'

import { Button } from '#/components/ui/button.tsx'

export function Hero() {
  return (
    <section className="relative flex min-h-[92vh] items-center justify-center overflow-hidden bg-orange-50">
      <img
        src="/hero.webp"
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-[center_30%]"
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-orange-50/90 via-orange-50/30 to-orange-50/95" />

      <div className="relative z-10 page-wrap w-full py-32 md:py-40">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="animate-in fade-in slide-in-from-bottom-4 text-4xl font-bold leading-tight duration-700 sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 bg-clip-text text-transparent">
              Pahami cara menyerang.
            </span>
            <br />
            <span className="bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 bg-clip-text text-transparent">
              Pertahankan sistem dengan benar.
            </span>
          </h1>

          <p className="animate-in fade-in slide-in-from-bottom-4 mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-stone-700 duration-700 delay-150 sm:text-xl md:text-2xl">
            Workshop praktis, kompetisi CTF, dan sesi boot-to-root untuk mahasiswa
            STT Terpadu Nurul Fikri. Legal, teknis, dan berdasarkan metodologi serangan nyata.
          </p>

          <div className="animate-in fade-in slide-in-from-bottom-4 mt-12 flex flex-wrap items-center justify-center gap-5 duration-700 delay-300">
            <Button asChild size="lg">
              <Link to="/contact">
                Gabung komunitas
                <ArrowRightIcon className="ml-2 size-5" />
              </Link>
            </Button>

            <Button asChild size="lg" variant="outline">
              <Link to="/blog">Baca tulisan</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
