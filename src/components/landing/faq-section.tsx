const FAQS = [
  { q: '¿SeguimientoPro es un software contable?', a: 'No. SeguimientoPro está enfocado en ayudarte a registrar ventas, controlar clientes, organizar tu cartera y cobrar a tiempo. Es una herramienta práctica para la gestión diaria de cobros, no un sistema contable complejo.' },
  { q: '¿Puedo usarlo si vendo por WhatsApp o por catálogo?', a: 'Sí. De hecho, está pensado para emprendedores y negocios que venden a crédito por WhatsApp, catálogo, tienda o de forma directa a clientes frecuentes.' },
  { q: '¿Necesito conocimientos contables?', a: 'No. La plataforma está diseñada para que puedas usarla sin ser contador ni especialista en software.' },
  { q: '¿Puedo registrar ventas de contado y a crédito?', a: 'Sí. Puedes registrar ambos tipos de venta y llevar control del historial de cada cliente.' },
  { q: '¿Qué pasa si hoy llevo mis cobros en Excel?', a: 'Puedes empezar con SeguimientoPro y migrar tu operación poco a poco. La idea es que dejes de depender de actualizaciones manuales para saber qué debes cobrar.' },
  { q: '¿Necesito tarjeta para empezar?', a: 'No. Puedes crear tu cuenta gratis sin tarjeta de crédito.' },
  { q: '¿Puedo cancelar cuando quiera?', a: 'Sí. No hay contratos de permanencia.' },
]

export function FaqSection() {
  return (
    <section className="bg-[#F8FAFC] px-6 py-32 sm:py-40">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center font-outfit text-[40px] font-bold leading-[1.15] tracking-[-0.02em] text-slate-900 sm:text-[48px]">
          Preguntas frecuentes
        </h2>

        <div className="mt-16 divide-y divide-slate-200">
          {FAQS.map((faq) => (
            <details key={faq.q} className="group py-6">
              <summary className="flex cursor-pointer items-center justify-between text-lg font-semibold text-slate-800 group-open:text-indigo-600 transition-colors">
                {faq.q}
                <svg className="size-5 shrink-0 text-slate-400 group-open:rotate-180 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                </svg>
              </summary>
              <p className="mt-3 pr-8 text-[15px] leading-relaxed text-slate-500">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
