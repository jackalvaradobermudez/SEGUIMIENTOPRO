import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CtaSection() {
  return (
    <section className="bg-white px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-outfit text-[40px] font-bold leading-[1.15] tracking-[-0.02em] text-slate-900 sm:text-[56px]">
          Cada día que no sabes qué cobrar, tu dinero pierde velocidad.
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-slate-500">
          Empieza hoy a organizar tus ventas a crédito, tus clientes y tu cartera en un solo lugar.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link href="/register">
            <Button className="h-14 rounded-2xl bg-indigo-600 px-10 text-base font-semibold text-white shadow-[0_8px_30px_rgba(99,102,241,0.25)] transition-all hover:bg-indigo-500 hover:shadow-[0_12px_40px_rgba(99,102,241,0.35)]">
              Crear mi cuenta gratis
              <ArrowRight size={18} className="ml-2" />
            </Button>
          </Link>
        </div>
        <p className="mt-5 text-sm text-slate-400">Sin tarjeta de crédito · Sin contratos · Configuración rápida</p>
      </div>
    </section>
  )
}
