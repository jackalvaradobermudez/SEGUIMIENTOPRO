import { Check, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const PLANS = [
  {
    name: 'Gratis',
    price: '$0 /mes',
    cta: 'Empezar gratis',
    href: '/register',
    popular: false,
    features: [
      'Hasta 20 clientes',
      'Hasta 15 productos',
      'Hasta 30 ventas por mes',
      'Gestiones de cobro',
      'Cartera por edades',
      'Recibos PDF',
      'WhatsApp con plantillas',
    ],
    missing: ['Estados de cuenta PDF', 'Calendario completo', 'Exportar reportes', 'Soporte prioritario'],
  },
  {
    name: 'PRO',
    price: '$29.900 /mes',
    cta: 'Próximamente',
    href: '#',
    popular: true,
    features: [
      'Clientes ilimitados',
      'Productos ilimitados',
      'Ventas ilimitadas',
      'Gestiones de cobro',
      'Cartera por edades',
      'Recibos PDF',
      'WhatsApp con plantillas',
      'Estados de cuenta PDF',
      'Calendario completo',
      'Exportar reportes',
      'Soporte prioritario',
    ],
    missing: [],
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-center font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Simple. Sin contratos. Cancela cuando quieras.
        </h2>

        <div className="mt-14 grid gap-8 sm:grid-cols-2">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl border p-8 ${
                plan.popular
                  ? 'border-indigo-500/30 bg-indigo-500/[0.04]'
                  : 'border-white/[0.06] bg-white/[0.02]'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-4 py-1 text-xs font-semibold text-white">
                  Recomendado
                </span>
              )}
              <h3 className="text-xl font-bold text-white">{plan.name}</h3>
              <p className="mt-1 font-display text-3xl font-bold text-white">{plan.price}</p>

              <ul className="mt-8 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-zinc-300">
                    <Check size={16} className="mt-0.5 shrink-0 text-emerald-400" />
                    {f}
                  </li>
                ))}
                {plan.missing.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-zinc-500 line-through">
                    <span className="mt-0.5 block h-4 w-4 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link href={plan.href} className="mt-8 block">
                <Button
                  variant={plan.popular ? 'default' : 'outline'}
                  className={`h-12 w-full rounded-xl text-sm font-semibold ${
                    plan.popular
                      ? 'bg-indigo-600 text-white hover:bg-indigo-500'
                      : 'border-white/10 text-zinc-300 hover:bg-white/[0.04]'
                  }`}
                  disabled={plan.cta === 'Próximamente'}
                >
                  {plan.cta}
                  {plan.cta === 'Empezar gratis' && <ArrowRight size={16} className="ml-2" />}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
