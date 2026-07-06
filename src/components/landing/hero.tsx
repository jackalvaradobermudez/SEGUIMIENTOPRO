'use client'

import Link from 'next/link'
import { ArrowDown, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  function scrollToSection() {
    document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative overflow-hidden px-6 pb-24 pt-32 sm:pb-32 sm:pt-44">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 right-0 h-[600px] w-[600px] rounded-full bg-indigo-500/[0.04] blur-3xl" />
        <div className="absolute -bottom-20 left-0 h-[400px] w-[400px] rounded-full bg-indigo-500/[0.03] blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl text-center">
        <div className="animate-fade-in mb-6">
          <span className="inline-flex items-center rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-300">
            Gestión de cobros para emprendedores
          </span>
        </div>

        <h1 className="animate-fade-in delay-100 font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
          Sabe exactamente{' '}
          <span className="bg-gradient-to-r from-indigo-400 to-indigo-200 bg-clip-text text-transparent">
            cuánto te deben
          </span>
          ,<br />
          quién te debe y cuándo cobrar.
        </h1>

        <p className="animate-fade-in delay-200 mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">
          SeguimientoPro es el sistema que reemplaza tu libreta, tus notas del celular y tu Excel. Registra ventas, cobra a tiempo, no pierdas dinero.
        </p>

        <div className="animate-fade-in delay-300 mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link href="/register">
            <Button className="h-12 rounded-xl bg-indigo-600 px-8 text-base font-semibold text-white shadow-[0_0_30px_rgba(99,102,241,0.3)] transition-all hover:bg-indigo-500 hover:shadow-[0_0_40px_rgba(99,102,241,0.4)]">
              Empezar gratis
              <ArrowRight size={18} className="ml-2" />
            </Button>
          </Link>
          <button
            onClick={scrollToSection}
            className="inline-flex h-12 items-center gap-2 rounded-xl px-6 text-sm font-medium text-zinc-400 transition-colors hover:text-white"
          >
            Ver cómo funciona
            <ArrowDown size={16} />
          </button>
        </div>

        <p className="animate-fade-in delay-400 mt-4 text-xs text-zinc-500">
          Sin tarjeta de crédito. En 2 minutos estás adentro.
        </p>
      </div>
    </section>
  )
}
