import { Star } from 'lucide-react'

const TESTIMONIALS = [
  {
    name: 'María González',
    role: 'Vendedora independiente · Bogotá',
    initials: 'MG',
    quote: 'Antes llevaba todo en un cuaderno y terminaba cobrando tarde. Ahora abro SeguimientoPro y sé exactamente quién me debe, cuánto y qué tengo que cobrar hoy.',
  },
  {
    name: 'Carlos Ramírez',
    role: 'Tienda de abarrotes · Medellín',
    initials: 'CR',
    quote: 'Descubrimos cartera vencida que no estábamos siguiendo. Solo con ordenar los cobros, mejoró el flujo de caja de la tienda.',
  },
  {
    name: 'Ana María López',
    role: 'Distribuidora por catálogo · Cali',
    initials: 'AM',
    quote: 'Me gusta porque puedo ver el historial de cada clienta y enviar recordatorios sin enredarme. Es simple, pero muy útil.',
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="bg-[#F8FAFC] px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-center font-outfit text-[40px] font-bold leading-[1.15] tracking-[-0.02em] text-slate-900 sm:text-[48px]">
          Negocios que ya dejaron de cobrar a ciegas
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-lg leading-relaxed text-slate-500">
          SeguimientoPro está diseñado para el día a día de quienes venden a crédito y necesitan orden sin complicarse con sistemas pesados.
        </p>

        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="rounded-3xl border border-slate-200 bg-white p-8 transition-all hover:shadow-sm">
              <div className="mb-4 flex gap-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-amber-400 text-amber-400" />)}
              </div>
              <p className="text-[15px] leading-relaxed text-slate-600 italic">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600">{t.initials}</div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                  <p className="text-xs text-slate-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
