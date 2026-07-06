'use client'

import Link from 'next/link'
import { ArrowRight, Play, ShieldCheck, TrendingUp, AlertTriangle, Users, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#F8FAFC] px-6 pb-32 pt-40 sm:pb-40 sm:pt-48">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left — Copy */}
          <div className="flex flex-col justify-center lg:pr-4">
            <span className="mb-6 inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-indigo-600">
              Gestión de cobros para emprendedores
            </span>

            <h1 className="font-outfit text-[54px] font-extrabold leading-[1.06] tracking-[-0.03em] text-slate-900 sm:text-[64px] xl:text-[72px]">
              Deja de cobrar de memoria.
              <br />
              <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-500 bg-clip-text text-transparent">
                Controla quién te debe
              </span>
              , cuánto te debe y qué cobrar hoy.
            </h1>

            <p className="mt-7 max-w-lg text-lg leading-relaxed text-slate-500">
              SeguimientoPro te ayuda a registrar ventas a crédito, organizar tu cartera, ver vencimientos, enviar recordatorios por WhatsApp y cobrar con más orden, sin depender de libretas o Excel.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link href="/register">
                <Button className="h-[54px] rounded-2xl bg-indigo-600 px-8 text-[15px] font-semibold text-white shadow-[0_8px_30px_rgba(99,102,241,0.22)] transition-all hover:bg-indigo-500 hover:shadow-[0_16px_45px_rgba(99,102,241,0.32)] hover:-translate-y-0.5">
                  Crear cuenta gratis
                  <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>
              <button className="inline-flex h-[54px] items-center gap-2.5 rounded-2xl border border-slate-200 bg-white px-6 text-[15px] font-medium text-slate-600 transition-all hover:border-slate-300 hover:text-slate-900 hover:shadow-sm">
                <Play size={16} className="text-indigo-500" />
                Ver demo de 2 minutos
              </button>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck size={15} className="text-emerald-500" /> Sin tarjeta de crédito
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck size={15} className="text-emerald-500" /> Configuración en minutos
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck size={15} className="text-emerald-500" /> Ideal para ventas por WhatsApp
              </span>
            </div>
          </div>

          {/* Right — Premium Dashboard Mockup */}
          <div className="relative hidden lg:flex lg:items-start">
            <div className="relative w-full">
              {/* Main card */}
              <div className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_30px_80px_rgba(0,0,0,0.07)]">
                {/* App topbar */}
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-[10px] bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                      </svg>
                    </div>
                    <div>
                      <div className="h-2.5 w-20 rounded-sm bg-slate-200" />
                      <div className="mt-1 h-1.5 w-14 rounded-sm bg-slate-100" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-8 w-24 rounded-[10px] bg-indigo-600" />
                    <div className="h-8 w-8 rounded-[10px] bg-slate-100" />
                  </div>
                </div>

                {/* KPI strip */}
                <div className="grid grid-cols-4 gap-0.5 border-b border-slate-100 bg-slate-50/30">
                  {[
                    { label: 'Ventas del mes', value: '$4.280.000', color: 'indigo', Icon: TrendingUp },
                    { label: 'Recaudado', value: '$3.150.000', color: 'emerald', Icon: TrendingUp },
                    { label: 'Vencido', value: '$680.000', color: 'rose', Icon: AlertTriangle },
                    { label: 'Cobros hoy', value: '12 ventas', color: 'amber', Icon: Clock },
                  ].map((kpi) => (
                    <div key={kpi.label} className="p-3.5">
                      <div className="flex items-center gap-1.5">
                        <kpi.Icon size={11} className={`text-${kpi.color}-500`} />
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{kpi.label}</span>
                      </div>
                      <p className="mt-1 text-sm font-bold text-slate-800">{kpi.value}</p>
                    </div>
                  ))}
                </div>

                {/* Content area */}
                <div className="p-4">
                  {/* Section header */}
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock size={13} className="text-slate-400" />
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Cobros del día</span>
                    </div>
                    <span className="text-[10px] font-medium text-indigo-500">Ver todos →</span>
                  </div>

                  {/* Client list */}
                  <div className="space-y-1.5">
                    {[
                      { name: 'María González', ref: 'VTA-0042', balance: '$450.000', status: 'Vencida', statusColor: 'rose', days: '15 días' },
                      { name: 'Carlos Ramírez', ref: 'VTA-0038', balance: '$230.000', status: 'Pendiente', statusColor: 'amber', days: 'Hoy' },
                      { name: 'Ana María López', ref: 'VTA-0035', balance: '$0', status: 'Pagada', statusColor: 'emerald', days: '—' },
                      { name: 'Jorge Martínez', ref: 'VTA-0041', balance: '$890.000', status: 'Vencida', statusColor: 'rose', days: '32 días' },
                    ].map((row) => (
                      <div key={row.name} className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-slate-50">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-500">
                          {row.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[12px] font-semibold text-slate-700 truncate">{row.name}</span>
                            <span className="text-[10px] text-slate-400">{row.ref}</span>
                          </div>
                          <span className="text-[10px] text-slate-400">{row.days}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[12px] font-bold text-slate-700">{row.balance}</span>
                          <div>
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-semibold bg-${row.statusColor}-50 text-${row.statusColor}-600`}>
                              {row.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Aging mini bar */}
                  <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-3.5">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Cartera por edades</span>
                    <div className="mt-2 flex h-2 overflow-hidden rounded-full bg-slate-200">
                      <div className="bg-emerald-400" style={{ width: '50%' }} />
                      <div className="bg-amber-400" style={{ width: '22%' }} />
                      <div className="bg-orange-400" style={{ width: '15%' }} />
                      <div className="bg-rose-400" style={{ width: '13%' }} />
                    </div>
                    <div className="mt-2 flex text-[9px] text-slate-400">
                      <span className="flex-1">Al día</span><span className="flex-1">30d</span><span className="flex-1">60d</span><span className="flex-1 text-right">90d+</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating overlay 1 — top right */}
              <div className="absolute -right-5 -top-5 rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-xs shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
                <TrendingUp size={13} className="mb-1 text-emerald-500" />
                <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Por cobrar esta semana</div>
                <div className="mt-0.5 text-[15px] font-extrabold text-slate-800">$2.450.000</div>
              </div>

              {/* Floating overlay 2 — bottom left */}
              <div className="absolute -bottom-4 -left-5 rounded-2xl border border-rose-100 bg-white px-5 py-3.5 text-xs shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
                <AlertTriangle size={13} className="mb-1 text-rose-500" />
                <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Cartera vencida 30+ días</div>
                <div className="mt-0.5 text-[15px] font-extrabold text-rose-600">$680.000</div>
              </div>

              {/* Floating overlay 3 — small, top left */}
              <div className="absolute -left-4 top-12 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[10px] shadow-[0_15px_40px_rgba(0,0,0,0.06)]">
                <div className="font-semibold uppercase tracking-wider text-slate-400">Hoy</div>
                <div className="mt-0.5 text-sm font-bold text-amber-600">12 pagos</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
