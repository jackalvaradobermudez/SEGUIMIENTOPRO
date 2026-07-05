'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaginationProps {
  current: number
  total: number
  pageSize: number
  onChange: (page: number) => void
}

export function Pagination({ current, total, pageSize, onChange }: PaginationProps) {
  const pages = Math.ceil(total / pageSize)
  if (pages <= 1) return null

  return (
    <div className="flex items-center justify-between px-5 py-3">
      <p className="text-[13px] text-slate-400">
        Mostrando {(current - 1) * pageSize + 1} a {Math.min(current * pageSize, total)} de {total} ventas
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(current - 1)}
          disabled={current === 1}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-transparent bg-transparent text-slate-400 transition-all hover:border-white/10 hover:bg-white/[0.06] disabled:opacity-30"
          aria-label="Página anterior"
        >
          <ChevronLeft size={14} />
        </button>
        {[1, 2, 3].map((p) => (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium transition-all',
              p === current ? 'bg-violet-600 text-white shadow-[0_0_15px_rgba(124,92,255,0.3)]' : 'border border-transparent bg-transparent text-slate-300 hover:border-white/10 hover:bg-white/[0.06]',
            )}
          >
            {p}
          </button>
        ))}
        <span className="px-1 text-slate-400">...</span>
        <button
          onClick={() => onChange(9)}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-transparent bg-transparent text-sm font-medium text-slate-300 transition-all hover:border-white/10 hover:bg-white/[0.06]"
        >
          9
        </button>
        <button
          onClick={() => onChange(current + 1)}
          disabled={current >= pages}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-white/[0.03] text-slate-400 transition-all hover:bg-white/[0.06] disabled:opacity-30"
          aria-label="Página siguiente"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  )
}
