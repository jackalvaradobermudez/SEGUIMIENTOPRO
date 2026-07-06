import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CtaSection() {
  return (
    <section className="px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Deja de cobrar de memoria. Empieza hoy.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-lg text-zinc-400">
          Sin tarjeta de crédito. Sin contratos. En 2 minutos estás adentro.
        </p>
        <Link href="/register" className="mt-8 inline-block">
          <Button className="h-14 rounded-xl bg-indigo-600 px-10 text-base font-semibold text-white shadow-[0_0_40px_rgba(99,102,241,0.3)] transition-all hover:bg-indigo-500 hover:shadow-[0_0_60px_rgba(99,102,241,0.4)]">
            Crear mi cuenta gratis
            <ArrowRight size={20} className="ml-2" />
          </Button>
        </Link>
      </div>
    </section>
  )
}
