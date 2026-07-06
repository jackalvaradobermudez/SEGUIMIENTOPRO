export function SocialProofBar() {
  const segments = ['Vendedores por catálogo', 'Tiendas de barrio', 'Distribuidores', 'Negocios con cobro por WhatsApp', 'Emprendedores de consumo masivo']

  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <p className="mb-4 text-center text-sm font-medium text-slate-400">
          Pensado para vendedores independientes, tiendas, distribuidores y negocios que venden a crédito todos los días.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {segments.map((s) => (
            <span key={s} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-500">
              {s}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
