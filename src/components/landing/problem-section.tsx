import { Clock, TrendingDown, Users, FileSpreadsheet } from 'lucide-react'

const PAIN_POINTS = [
  { icon: Clock, title: 'Cobros que se te pasan', desc: 'Te acuerdas tarde, el cliente ya usó el dinero y el pago se enfría.' },
  { icon: TrendingDown, title: 'Cartera vencida que crece sin darte cuenta', desc: 'Sin alertas ni seguimiento, las deudas se envejecen y se vuelven más difíciles de recuperar.' },
  { icon: Users, title: 'Saldos y clientes desordenados', desc: 'No siempre sabes cuánto debe cada cliente ni desde cuándo te debe.' },
  { icon: FileSpreadsheet, title: 'Excel que depende de disciplina manual', desc: 'Si no lo actualizas todos los días, deja de servirte para cobrar con precisión.' },
]

export function ProblemSection() {
  return (
    <section className="bg-white px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-center font-outfit text-[40px] font-bold leading-[1.15] tracking-[-0.02em] text-slate-900 sm:text-[48px]">
          El problema no es vender a crédito. El problema es no tener control de lo que ya vendiste.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-lg leading-relaxed text-slate-500">
          Cuando tus ventas, tus clientes y tus cobros están repartidos entre cuadernos, chats y hojas de cálculo, el dinero se empieza a perder en silencio.
        </p>

        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {PAIN_POINTS.map((p) => {
            const Icon = p.icon
            return (
              <div key={p.title} className="group rounded-3xl border border-slate-200 bg-white p-8 transition-all hover:border-slate-300 hover:shadow-sm">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50">
                  <Icon size={24} className="text-indigo-500" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">{p.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-slate-500">{p.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
