'use client'

import { CalendarDays, ChevronDown, SlidersHorizontal } from 'lucide-react'

interface FilterControlsProps {
  period: string
}

export function FilterControls({ period }: FilterControlsProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button className="inline-flex h-11 min-w-[210px] items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.035] px-4 text-sm font-semibold text-white transition-all hover:border-white/20 hover:bg-white/[0.06]">
        <span className="inline-flex items-center gap-3">
          <CalendarDays size={16} className="text-slate-300" />
          {period}
        </span>
        <ChevronDown size={14} className="text-slate-400" />
      </button>
      <button className="inline-flex h-11 min-w-[184px] items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.035] px-4 text-sm font-semibold text-white transition-all hover:border-white/20 hover:bg-white/[0.06]">
        <span className="inline-flex items-center gap-3">
          <SlidersHorizontal size={16} className="text-slate-300" />
          Filtros
        </span>
        <ChevronDown size={14} className="text-slate-400" />
      </button>
      <button className="inline-flex h-11 min-w-[200px] items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.035] px-4 text-sm font-semibold text-white transition-all hover:border-white/20 hover:bg-white/[0.06]">
        <span>Ordenar: Fecha ↓</span>
        <ChevronDown size={14} className="text-slate-400" />
      </button>
    </div>
  )
}
