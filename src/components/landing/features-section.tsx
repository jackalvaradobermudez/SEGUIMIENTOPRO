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
        <h2 className="text-center font-display text-4xl font-extrabold tracking-tight text-slate-800 sm:text-5xl">
          Responde las 5 preguntas que tu negocio necesita cada día
        </h2>

        <div className="mt-20 grid gap-8 lg:gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.question}
                className="group clay-card bg-white p-8 transition-all hover:-translate-y-2 hover:shadow-[15px_15px_30px_rgba(166,171,189,0.5),-15px_-15px_30px_#FFFFFF]"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl clay-card-inset bg-slate-50">
                  <Icon size={26} className="text-[var(--brand-500)] drop-shadow-sm" />
                </div>
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--brand-500)] mb-2">
                  {feature.question}
                </p>
                <h3 className="text-xl font-bold text-slate-800 leading-tight">{feature.title}</h3>
                <p className="mt-3 text-sm font-medium leading-relaxed text-slate-500">{feature.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
