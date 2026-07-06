'use client'

import Link from 'next/link'
import { ArrowRight, Play, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#F8FAFC] px-6 pb-20 pt-36 sm:pb-28 sm:pt-44">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          {/* Left column — Copy */}
          <div className="flex flex-col justify-center">
            <span className="mb-6 inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-600">
              Gestión de cobros para emprendedores
            </span>

            <h1 className="font-outfit text-[56px] font-extrabold leading-[1.05] tracking-[-0.03em] text-slate-900 sm:text-[64px] lg:text-[72px]">
              Deja de cobrar de memoria.
              <br />
              <span className="bg-gradient-to-r from-indigo-600 to-indigo-500 bg-clip-text text-transparent">
                Controla quién te debe
              </span>
              , cuánto te debe y qué debes cobrar hoy.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-500">
              SeguimientoPro te ayuda a registrar ventas a crédito, organizar tu cartera, ver vencimientos, enviar recordatorios por WhatsApp y cobrar con más orden, sin depender de libretas o Excel.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link href="/register">
                <Button className="h-14 rounded-2xl bg-indigo-600 px-8 text-base font-semibold text-white shadow-[0_8px_30px_rgba(99,102,241,0.25)] transition-all hover:bg-indigo-500 hover:shadow-[0_12px_40px_rgba(99,102,241,0.35)]">
                  Crear cuenta gratis
                  <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>
              <button className="inline-flex h-14 items-center gap-2.5 rounded-2xl border border-slate-200 bg-white px-6 text-sm font-medium text-slate-600 transition-all hover:border-slate-300 hover:text-slate-900">
                <Play size={16} className="text-indigo-500" />
                Ver demo de 2 minutos
              </button>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-500" />
                Sin tarjeta de crédito
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-500" />
                Configuración en minutos
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-500" />
                Ideal para ventas por WhatsApp, catálogo y tienda
              </span>
            </div>
          </div>

          {/* Right column — Dashboard mockup */}
          <div className="relative hidden lg:flex lg:items-center">
            <div className="relative w-full rounded-3xl border border-slate-200 bg-white p-3 shadow-[0_25px_70px_rgba(0,0,0,0.06)]">
              {/* Dashboard header mock */}
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-indigo-500/15" />
                  <div>
                    <div className="h-3 w-24 rounded bg-slate-200" />
                    <div className="mt-1 h-2 w-16 rounded bg-slate-100" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="h-8 w-20 rounded-lg bg-indigo-600" />
                  <div className="h-8 w-8 rounded-lg bg-slate-100" />
                </div>
              </div>
              {/* KPI row */}
              <div className="grid grid-cols-4 gap-3 p-4">
                {[
                  { label: 'Ventas del mes', value: '$4.2M', color: 'indigo' },
                  { label: 'Recaudado', value: '$3.1M', color: 'emerald' },
                  { label: 'Cartera vencida', value: '$680K', color: 'rose' },
                  { label: 'Cobros hoy', value: '12', color: 'amber' },
                ].map((kpi) => (
                  <div key={kpi.label} className="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
                    <div className={`h-2 w-2 rounded-full bg-${kpi.color}-500`} />
                    <div className="mt-2 text-[11px] font-medium text-slate-400">{kpi.label}</div>
                    <div className="mt-0.5 text-sm font-bold text-slate-800">{kpi.value}</div>
                  </div>
                ))}
              </div>
              {/* Table rows */}
              <div className="border-t border-slate-100 px-4 pt-3">
                <div className="mb-2 flex text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  <span className="flex-1">Cliente</span><span className="w-16 text-right">Saldo</span><span className="w-20 text-right">Estado</span>
                </div>
                {[
                  { name: 'María González', balance: '$450.000', status: 'Vencida', color: 'rose' },
                  { name: 'Carlos Ramírez', balance: '$230.000', status: 'Pendiente', color: 'amber' },
                  { name: 'Ana María López', balance: '$0', status: 'Pagada', color: 'emerald' },
                ].map((row) => (
                  <div key={row.name} className="flex items-center border-b border-slate-50 py-2.5 text-xs">
                    <span className="flex-1 font-medium text-slate-700">{row.name}</span>
                    <span className="w-16 text-right font-medium text-slate-700">{row.balance}</span>
                    <span className={`w-20 text-right text-[11px] font-medium text-${row.color}-600`}>{row.status}</span>
                  </div>
                ))}
              </div>

              {/* Floating KPIs overlay */}
              <div className="absolute -right-6 -top-6 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs shadow-[0_15px_40px_rgba(0,0,0,0.08)]">
                <div className="text-[11px] font-medium text-slate-400">Por cobrar esta semana</div>
                <div className="mt-0.5 text-sm font-bold text-slate-800">$2.450.000</div>
              </div>
              <div className="absolute -bottom-4 -left-6 rounded-2xl border border-rose-100 bg-white px-4 py-3 text-xs shadow-[0_15px_40px_rgba(0,0,0,0.08)]">
                <div className="text-[11px] font-medium text-slate-400">Cartera vencida 30+ días</div>
                <div className="mt-0.5 text-sm font-bold text-rose-600">$680.000</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
