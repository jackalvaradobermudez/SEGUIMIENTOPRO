import Link from 'next/link'
import { Check, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const PLANS = [
  {
    name: 'Gratis',
    price: '$0 /mes',
    cta: 'Crear cuenta gratis',
    href: '/register',
    popular: false,
    desc: 'Ideal para empezar a ordenar clientes, ventas y cobros sin fricción.',
    features: ['Hasta 20 clientes', 'Hasta 15 productos', 'Hasta 30 ventas al mes', 'Gestión básica de cobros', 'Cartera por edades', 'Recibos PDF', 'WhatsApp con plantillas', 'Calendario de vencimientos'],
  },
  {
    name: 'PRO',
    price: '$29.900 /mes',
    cta: 'Probar PRO',
    href: '#',
    popular: true,
    desc: 'Para negocios que venden a crédito con frecuencia y necesitan control completo.',
    features: ['Clientes ilimitados', 'Productos ilimitados', 'Ventas ilimitadas', 'Gestión completa de cobros', 'Cartera por edades', 'Estados de cuenta PDF', 'Reportes exportables', 'Soporte prioritario', 'Calendario completo', 'Mejor control operativo'],
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="bg-white px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-center font-outfit text-[40px] font-bold leading-[1.15] tracking-[-0.02em] text-slate-900 sm:text-[48px]">
          Empieza gratis. Escala cuando tu operación necesite más control.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-lg leading-relaxed text-slate-500">
          Sin contratos. Sin instalación. Sin tarjeta de crédito para comenzar.
        </p>

        <div className="mt-16 grid gap-8 sm:grid-cols-2">
          {PLANS.map((plan) => (
            <div key={plan.name} className={`relative rounded-3xl border p-8 ${plan.popular ? 'border-indigo-200 bg-indigo-50/30 shadow-sm' : 'border-slate-200 bg-white'}`}>
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-4 py-1 text-xs font-semibold text-white shadow-sm">Recomendado</span>
              )}
              <h3 className="text-2xl font-bold text-slate-900">{plan.name}</h3>
              <p className="mt-2 font-outfit text-[44px] font-extrabold text-slate-900">{plan.price}</p>
              <p className="mt-1 text-sm text-slate-500">{plan.desc}</p>

              <ul className="mt-8 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-slate-600">
                    <Check size={15} className="mt-0.5 shrink-0 text-emerald-500" />{f}
                  </li>
                ))}
              </ul>

              <Link href={plan.href} className="mt-8 block">
                <Button
                  className={`h-12 w-full rounded-2xl text-sm font-semibold ${plan.popular ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-[0_8px_25px_rgba(99,102,241,0.25)]' : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
                >
                  {plan.cta}
                  {plan.name === 'Gratis' && <ArrowRight size={16} className="ml-2" />}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
