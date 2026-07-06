const STEPS = [
  { num: 1, title: 'Crea tus clientes y productos', desc: 'Carga la información básica de tu negocio en pocos minutos.' },
  { num: 2, title: 'Registra ventas de contado o crédito', desc: 'Cada venta queda asociada al cliente, al monto y a la fecha de vencimiento.' },
  { num: 3, title: 'Revisa tus cobros del día', desc: 'Consulta qué pagos vencen hoy, qué está atrasado y qué requiere seguimiento.' },
  { num: 4, title: 'Cobra con contexto y mide tu cartera', desc: 'Envía recordatorios por WhatsApp y revisa tu recaudo, cartera y saldos en tiempo real.' },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white px-6 py-32 sm:py-40">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-center font-outfit text-[40px] font-bold leading-[1.15] tracking-[-0.02em] text-slate-900 sm:text-[48px]">
          Empieza en minutos. Cobra con más orden desde el primer día.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-lg leading-relaxed text-slate-500">
          SeguimientoPro está diseñado para emprendedores y pequeños negocios. No necesitas conocimientos contables ni procesos complicados.
        </p>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <div key={step.num} className="relative text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-2xl font-bold text-indigo-600 shadow-sm">
                {step.num}
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-900">{step.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-slate-500">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
