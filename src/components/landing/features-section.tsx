import { ShoppingCart, Users, DollarSign, CalendarClock, BarChart3 } from 'lucide-react'

const FEATURES = [
  {
    icon: ShoppingCart,
    question: '¿Qué he vendido?',
    title: 'Registro de ventas',
    desc: 'Cada venta con sus productos, cantidades y precios. Contado o crédito, tú decides.',
  },
  {
    icon: Users,
    question: '¿A quién se lo vendí?',
    title: 'CRM de clientes',
    desc: 'Historial completo de cada cliente. WhatsApp directo desde la app. Todo en un solo lugar.',
  },
  {
    icon: DollarSign,
    question: '¿Cuánto me deben?',
    title: 'Cartera por edades',
    desc: 'Al día, 30, 60, 90+ días. Como lo hacen los contadores, pero sin complicaciones.',
  },
  {
    icon: CalendarClock,
    question: '¿Cuándo debo cobrar?',
    title: 'Calendario de vencimientos',
    desc: 'Cada mañana sabes qué cobrar hoy, qué vence mañana y qué está atrasado.',
  },
  {
    icon: BarChart3,
    question: '¿Dónde está mi dinero?',
    title: 'Dashboard con KPIs reales',
    desc: 'Ventas del mes, recaudado, cartera vencida. Todo en una pantalla.',
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Responde las 5 preguntas que tu negocio necesita cada día
        </h2>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.question}
                className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-7 transition-all hover:border-indigo-500/20 hover:bg-indigo-500/[0.04]"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 shadow-[0_0_20px_rgba(99,102,241,0.1)]">
                  <Icon size={26} className="text-indigo-400" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                  {feature.question}
                </p>
                <h3 className="mt-2 text-lg font-bold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{feature.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
