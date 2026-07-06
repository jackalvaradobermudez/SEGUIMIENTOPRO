// TODO: Reemplazar con testimoniales reales cuando Jack tenga usuarios activos

const TESTIMONIALS = [
  {
    name: 'María González',
    role: 'Vendedora independiente, Bogotá',
    initials: 'MG',
    quote: 'Antes anotaba todo en un cuaderno. Ahora abro la app y sé exactamente quién me debe y cuánto. Es un alivio enorme.',
  },
  {
    name: 'Carlos Ramírez',
    role: 'Dueño de tienda de abarrotes, Medellín',
    initials: 'CR',
    quote: 'Con SeguimientoPro descubrí que tenía \$2.500.000 en cartera vencida que ni recordaba. En una semana recuperé el 70\%.',
  },
  {
    name: 'Ana María López',
    role: 'Distribuidora de catálogo, Cali',
    initials: 'AM',
    quote: 'Mis clientas me pagan más rápido porque les envío el recordatorio por WhatsApp desde la misma app. Todo en un solo lugar.',
  },
]

export function TestimonialsSection() {
  return (
    <section className="px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Emprendedores como tú ya lo usan
        </h2>

        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/20 text-sm font-bold text-indigo-300">
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-zinc-400">{t.role}</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-zinc-300 italic">
                &ldquo;{t.quote}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
