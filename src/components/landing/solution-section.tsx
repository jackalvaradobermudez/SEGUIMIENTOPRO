import { ShoppingCart, Users, DollarSign, CalendarClock, BarChart3 } from 'lucide-react'

const BENEFITS = [
  { icon: ShoppingCart, title: 'Registro de ventas', desc: 'Registra ventas de contado o a crédito con productos, cantidades y valores.' },
  { icon: Users, title: 'Historial de clientes', desc: 'Consulta el saldo, el historial y el contacto de cada cliente en un solo lugar.' },
  { icon: DollarSign, title: 'Cartera por edades', desc: 'Identifica rápido qué está al día, qué está por vencer y qué ya está atrasado.' },
  { icon: CalendarClock, title: 'Calendario de cobros', desc: 'Empieza el día sabiendo qué pagos vencen hoy, mañana y esta semana.' },
  { icon: BarChart3, title: 'Dashboard con KPIs reales', desc: 'Visualiza ventas, recaudo y cartera vencida sin depender de Excel.' },
]

export function SolutionSection() {
  return (
    <section className="bg-[#F8FAFC] px-6 py-32 sm:py-40">
      <div className="mx-auto max-w-7xl">
        <h2 className="max-w-3xl font-outfit text-[40px] font-bold leading-[1.15] tracking-[-0.02em] text-slate-900 sm:text-[48px]">
          SeguimientoPro organiza tus ventas, tus clientes y tus cobros alrededor de una sola pregunta: qué debo cobrar hoy.
        </h2>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-500">
          No necesitas un ERP ni un sistema contable complejo. Necesitas ver qué vendiste, quién te debe, cuánto está vencido y qué debes cobrar primero. SeguimientoPro está hecho para eso.
        </p>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((b) => {
            const Icon = b.icon
            return (
              <div key={b.title} className="rounded-2xl border border-slate-200 bg-white p-7 transition-all hover:border-indigo-200 hover:shadow-sm">
                <Icon size={22} className="text-indigo-500" />
                <h3 className="mt-4 text-lg font-bold text-slate-900">{b.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-slate-500">{b.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
