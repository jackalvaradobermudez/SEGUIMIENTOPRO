import { TrendingUp, AlertTriangle, Clock, Phone, Mail, MessageCircle, Check, CheckCheck } from 'lucide-react'

const MOCK_CARD = 'overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-[0_30px_80px_rgba(0,0,0,0.07)]'

function DashboardMockup() {
  return (
    <div className={MOCK_CARD}>
      <div className="grid grid-cols-3 gap-0.5 border-b border-slate-100 bg-slate-50/30">
        {[
          { label: 'Ventas del mes', value: '$4.280.000', Icon: TrendingUp, color: 'indigo' },
          { label: 'Recaudado', value: '$3.150.000', Icon: TrendingUp, color: 'emerald' },
          { label: 'Cartera vencida', value: '$680.000', Icon: AlertTriangle, color: 'rose' },
        ].map((kpi) => (
          <div key={kpi.label} className="p-4">
            <div className="flex items-center gap-1.5">
              <kpi.Icon size={11} className={`text-${kpi.color}-500`} />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{kpi.label}</span>
            </div>
            <p className="mt-1.5 text-base font-bold text-slate-800">{kpi.value}</p>
          </div>
        ))}
      </div>
      <div className="p-5">
        <div className="mb-3 flex items-end justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Recaudo últimos 7 días</span>
        </div>
        <div className="flex h-24 items-end gap-2">
          {[38, 55, 42, 68, 50, 74, 60].map((h, i) => (
            <div key={i} className="flex-1 rounded-t-md bg-gradient-to-t from-indigo-500 to-indigo-400" style={{ height: `${h}%` }} />
          ))}
        </div>
        <div className="mt-2 flex justify-between text-[9px] text-slate-400">
          <span>Lun</span><span>Mar</span><span>Mié</span><span>Jue</span><span>Vie</span><span>Sáb</span><span>Dom</span>
        </div>
      </div>
    </div>
  )
}

function ClientHistoryMockup() {
  return (
    <div className={MOCK_CARD}>
      <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600">MG</div>
        <div className="flex-1">
          <p className="text-sm font-bold text-slate-900">María González</p>
          <p className="text-[11px] text-slate-400">Cliente desde ene. 2025 · Bogotá</p>
        </div>
        <span className="rounded-full bg-rose-50 px-2.5 py-1 text-[10px] font-semibold text-rose-600">Saldo $450.000</span>
      </div>
      <div className="grid grid-cols-2 gap-0.5 border-b border-slate-100 bg-slate-50/30 px-5 py-3">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500"><Phone size={12} className="text-slate-400" /> 300 123 4567</div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500"><Mail size={12} className="text-slate-400" /> maria@correo.com</div>
      </div>
      <div className="p-5">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Historial de ventas</span>
        <div className="mt-3 space-y-3">
          {[
            { ref: 'VTA-0042', date: '18 jun', amount: '$450.000', status: 'Vencida', color: 'rose' },
            { ref: 'VTA-0031', date: '02 may', amount: '$280.000', status: 'Pagada', color: 'emerald' },
            { ref: 'VTA-0019', date: '14 mar', amount: '$310.000', status: 'Pagada', color: 'emerald' },
          ].map((row) => (
            <div key={row.ref} className="flex items-center justify-between border-l-2 border-slate-100 pl-3">
              <div>
                <p className="text-[12px] font-semibold text-slate-700">{row.ref}</p>
                <p className="text-[10px] text-slate-400">{row.date}</p>
              </div>
              <div className="text-right">
                <p className="text-[12px] font-bold text-slate-700">{row.amount}</p>
                <span className={`text-[9px] font-semibold text-${row.color}-600`}>{row.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function AgingMockup() {
  const buckets = [
    { label: 'Al día', amount: '$1.850.000', pct: 50, color: 'emerald' },
    { label: '1-30 días', amount: '$820.000', pct: 22, color: 'amber' },
    { label: '31-60 días', amount: '$560.000', pct: 15, color: 'orange' },
    { label: '60+ días', amount: '$480.000', pct: 13, color: 'rose' },
  ]
  return (
    <div className={`${MOCK_CARD} p-6`}>
      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Cartera por edades</span>
      <div className="mt-3 flex h-3 overflow-hidden rounded-full bg-slate-100">
        {buckets.map((b) => (
          <div key={b.label} className={`bg-${b.color}-400`} style={{ width: `${b.pct}%` }} />
        ))}
      </div>
      <div className="mt-5 space-y-3">
        {buckets.map((b) => (
          <div key={b.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full bg-${b.color}-400`} />
              <span className="text-[12px] font-medium text-slate-600">{b.label}</span>
            </div>
            <span className="text-[12px] font-bold text-slate-800">{b.amount}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function CalendarMockup() {
  const days = Array.from({ length: 30 }, (_, i) => i + 1)
  const due = new Set([3, 8, 12, 15, 19, 22, 27])
  const overdue = new Set([5, 14])
  return (
    <div className={`${MOCK_CARD} p-6`}>
      <div className="mb-4 flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Vencimientos · Julio</span>
        <Clock size={13} className="text-slate-400" />
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((d) => {
          const isOverdue = overdue.has(d)
          const isDue = due.has(d)
          return (
            <div
              key={d}
              className={`flex h-8 items-center justify-center rounded-lg text-[11px] font-semibold ${
                isOverdue ? 'bg-rose-500 text-white' : isDue ? 'bg-indigo-100 text-indigo-700' : 'text-slate-400'
              }`}
            >
              {d}
            </div>
          )
        })}
      </div>
      <div className="mt-4 flex items-center gap-4 text-[10px] text-slate-500">
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-rose-500" /> Vencido</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-indigo-300" /> Vence pronto</span>
      </div>
    </div>
  )
}

function WhatsAppMockup() {
  return (
    <div className={`${MOCK_CARD} bg-[#ECE5DD] p-5`}>
      <div className="mb-3 flex items-center gap-2.5 rounded-t-xl">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-white"><MessageCircle size={16} /></div>
        <div>
          <p className="text-[12px] font-bold text-slate-800">Carlos Ramírez</p>
          <p className="text-[10px] text-slate-500">en línea</p>
        </div>
      </div>
      <div className="space-y-2">
        <div className="ml-auto max-w-[80%] rounded-lg rounded-tr-sm bg-[#DCF8C6] px-3 py-2 shadow-sm">
          <p className="text-[12px] leading-snug text-slate-700">
            Hola Carlos 👋 te recordamos que tienes un saldo pendiente de <b>$230.000</b>, vence hoy. ¿Podemos coordinar el pago?
          </p>
          <span className="mt-1 flex items-center justify-end gap-1 text-[9px] text-slate-400">10:24 a.m. <CheckCheck size={12} className="text-sky-500" /></span>
        </div>
        <div className="max-w-[70%] rounded-lg rounded-tl-sm bg-white px-3 py-2 shadow-sm">
          <p className="text-[12px] leading-snug text-slate-700">Claro, te pago esta tarde 👍</p>
          <span className="mt-1 block text-[9px] text-slate-400">10:31 a.m.</span>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-sm">
        <Check size={13} className="text-emerald-500" />
        <span className="text-[11px] text-slate-400">Plantilla: recordatorio de vencimiento</span>
      </div>
    </div>
  )
}

const BLOCKS = [
  {
    eyebrow: 'Dashboard general',
    title: 'Empieza el día viendo exactamente dónde está tu dinero.',
    desc: 'Ventas, recaudo y cartera vencida en una sola pantalla, sin tener que armar el reporte tú mismo.',
    Mockup: DashboardMockup,
  },
  {
    eyebrow: 'Historial de cliente',
    title: 'Cada cliente con su historial, saldo y seguimiento.',
    desc: 'Contacto, saldo actual y todas sus ventas anteriores, para que nunca tengas que adivinar cuánto te debe alguien.',
    Mockup: ClientHistoryMockup,
  },
  {
    eyebrow: 'Cartera por edades',
    title: 'Prioriza primero lo que más riesgo tiene de quedarse sin cobrar.',
    desc: 'Ve tu cartera dividida por antigüedad — al día, 30, 60 y 90+ días — y decide qué cobrar primero.',
    Mockup: AgingMockup,
  },
  {
    eyebrow: 'Calendario de vencimientos',
    title: 'No vuelvas a enterarte tarde de un pago vencido.',
    desc: 'Visualiza qué vence cada día del mes y qué ya está atrasado, sin depender de tu memoria.',
    Mockup: CalendarMockup,
  },
  {
    eyebrow: 'WhatsApp y recordatorios',
    title: 'Envía recordatorios sin salir de tu flujo de cobro.',
    desc: 'Plantillas listas para recordar vencimientos por WhatsApp, directo desde la ficha del cliente.',
    Mockup: WhatsAppMockup,
  },
]

export function FeatureShowcase() {
  return (
    <section className="bg-white px-6 py-32 sm:py-40">
      <div className="mx-auto max-w-7xl">
        <h2 className="mx-auto max-w-2xl text-center font-outfit text-[40px] font-bold leading-[1.15] tracking-[-0.02em] text-slate-900 sm:text-[48px]">
          Un producto real, no solo una promesa
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-lg leading-relaxed text-slate-500">
          Así se ve SeguimientoPro por dentro, módulo por módulo.
        </p>

        <div className="mt-24 flex flex-col gap-28 sm:gap-32">
          {BLOCKS.map((block, i) => (
            <div key={block.eyebrow} className={`grid items-center gap-12 lg:grid-cols-2 lg:gap-20 ${i % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''}`}>
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.08em] text-indigo-500">{block.eyebrow}</span>
                <h3 className="mt-3 font-outfit text-[28px] font-bold leading-[1.2] tracking-[-0.01em] text-slate-900 sm:text-[32px]">
                  {block.title}
                </h3>
                <p className="mt-4 max-w-md text-[17px] leading-relaxed text-slate-500">{block.desc}</p>
              </div>
              <block.Mockup />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
