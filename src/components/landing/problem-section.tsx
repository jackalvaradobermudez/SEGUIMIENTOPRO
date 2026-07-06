import { NotebookPen, Brain, Sheet, BadgeDollarSign } from 'lucide-react'

const PAIN_POINTS = [
  {
    icon: NotebookPen,
    title: 'Anotas las deudas en libretas que se pierden',
    desc: 'Cada mes tienes que reconstruir de memoria a quién le fiaste y cuánto era.',
  },
  {
    icon: Brain,
    title: 'Cobras de memoria y se te olvida quién te debe',
    desc: 'Pasan los días y cuando te acuerdas de cobrar, el cliente ya gastó el dinero.',
  },
  {
    icon: Sheet,
    title: 'Tu Excel tiene datos de hace 3 meses sin actualizar',
    desc: 'Mantener una hoja de cálculo al día toma más tiempo del que debería.',
  },
  {
    icon: BadgeDollarSign,
    title: 'Pierdes dinero porque no cobras a tiempo',
    desc: 'Cada día que pasa sin cobrar una deuda vencida es dinero que pierde valor.',
  },
]

export function ProblemSection() {
  return (
    <section className="px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Si vendes a crédito, esto te suena familiar
        </h2>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PAIN_POINTS.map((point) => {
            const Icon = point.icon
            return (
              <div
                key={point.title}
                className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all hover:border-white/[0.12] hover:bg-white/[0.04]"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10">
                  <Icon size={22} className="text-indigo-400" />
                </div>
                <h3 className="text-sm font-semibold text-white">{point.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{point.desc}</p>
              </div>
            )
          })}
        </div>

        <p className="mx-auto mt-12 max-w-2xl text-center text-lg leading-relaxed text-zinc-400">
          SeguimientoPro nació para resolver esto. No es un ERP, no es un software contable. Es la herramienta que un emprendedor que vende a crédito necesita cada mañana.
        </p>
      </div>
    </section>
  )
}
