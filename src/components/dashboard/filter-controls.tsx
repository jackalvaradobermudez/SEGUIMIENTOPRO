'use client'

import { ChevronDown } from 'lucide-react'

interface FilterControlsProps {
  period: string
}

export function FilterControls({ period }: FilterControlsProps) {
  return (
    <div className="flex items-center gap-3">
      <button className="inline-flex h-10 items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm font-medium text-slate-300 transition-all hover:border-white/20 hover:bg-white/[0.06]">
        {period}
        <ChevronDown size={14} className="text-slate-400" />
      </button>
      <button className="inline-flex h-10 items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm font-medium text-slate-300 transition-all hover:border-white/20 hover:bg-white/[0.06]">
        Filtros
        <ChevronDown size={14} className="text-slate-400" />
      </button>
      <button className="inline-flex h-10 items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm font-medium text-slate-300 transition-all hover:border-white/20 hover:bg-white/[0.06]">
        Ordenar: Fecha
        <ChevronDown size={14} className="text-slate-400" />
      </button>
    </div>
  )
}
