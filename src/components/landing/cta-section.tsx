import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CtaSection() {
  return (
    <section className="bg-white px-6 py-32 sm:py-40">
      <div className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-700 px-8 py-20 text-center shadow-[0_40px_100px_rgba(79,70,229,0.35)] sm:px-16 sm:py-28">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-violet-400/20 blur-3xl" />

          <div className="relative mx-auto max-w-2xl">
            <h2 className="font-outfit text-[36px] font-bold leading-[1.15] tracking-[-0.02em] text-white sm:text-[52px]">
              Cada día que no sabes qué cobrar, tu dinero pierde velocidad.
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-indigo-100">
              Empieza hoy a organizar tus ventas a crédito, tus clientes y tu cartera en un solo lugar.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/register">
                <Button className="h-14 rounded-2xl bg-white px-10 text-base font-semibold text-indigo-600 shadow-[0_8px_30px_rgba(0,0,0,0.15)] transition-all hover:bg-indigo-50 hover:-translate-y-0.5">
                  Crear mi cuenta gratis
                  <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>
            </div>
            <p className="mt-5 text-sm text-indigo-200">Sin tarjeta de crédito · Sin contratos · Configuración rápida</p>
          </div>
        </div>
      </div>
    </section>
  )
}
