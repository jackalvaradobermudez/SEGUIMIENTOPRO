import { Check, X } from 'lucide-react'

const ROWS = [
  { feature: 'Ver quién debe hoy', notebook: false, segui: true },
  { feature: 'Recordar vencimientos', notebook: false, segui: true },
  { feature: 'Ver cartera por edades', notebook: false, segui: true },
  { feature: 'Historial por cliente', notebook: false, segui: true },
  { feature: 'Recordatorios por WhatsApp', notebook: false, segui: true },
  { feature: 'Dashboard de cartera y recaudo', notebook: false, segui: true },
  { feature: 'Escalar sin perder control', notebook: false, segui: true },
]

export function ComparisonSection() {
  return (
    <section className="bg-white px-6 py-32 sm:py-40">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-center font-outfit text-[40px] font-bold leading-[1.15] tracking-[-0.02em] text-slate-900 sm:text-[48px]">
          Seguir cobrando con libreta o Excel sale más caro de lo que parece.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-lg leading-relaxed text-slate-500">
          No solo por tiempo. También por cobros que se pasan, cartera vencida que crece y decisiones tomadas sin información actualizada.
        </p>

        <div className="mt-16 overflow-hidden rounded-3xl border border-slate-200">
          <div className="grid grid-cols-[1fr_auto_auto]">
            <div className="border-b border-slate-100 bg-slate-50 p-5 text-sm font-semibold text-slate-700">Función</div>
            <div className="border-b border-slate-100 bg-slate-50 p-5 text-center text-sm font-semibold text-slate-400">Libreta / Excel</div>
            <div className="border-b border-slate-100 bg-indigo-50 p-5 text-center text-sm font-semibold text-indigo-700">SeguimientoPro</div>

            {ROWS.map((row, i) => (
              <>
                <div key={row.feature} className={`flex items-center p-5 text-sm font-medium text-slate-700 ${i < ROWS.length - 1 ? 'border-b border-slate-50' : ''}`}>
                  {row.feature}
                </div>
                <div className={`flex items-center justify-center p-5 ${i < ROWS.length - 1 ? 'border-b border-slate-50' : ''}`}>
                  {row.notebook ? <Check size={16} className="text-emerald-500" /> : <X size={14} className="text-slate-300" />}
                </div>
                <div className={`flex items-center justify-center bg-indigo-50/50 p-5 ${i < ROWS.length - 1 ? 'border-b border-slate-50' : ''}`}>
                  <Check size={16} className="text-indigo-600" />
                </div>
              </>
            ))}
          </div>
        </div>

        <p className="mx-auto mt-8 max-w-xl text-center text-[15px] leading-relaxed text-slate-500">
          Si tu negocio vende a crédito todas las semanas, necesitas algo más confiable que memoria, notas y hojas sueltas.
        </p>
      </div>
    </section>
  )
}
