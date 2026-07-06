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
      <p className="text-[13px] text-[var(--text-primary)]">
        Mostrando {(current - 1) * pageSize + 1} a {Math.min(current * pageSize, total)} de {total} ventas
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(current - 1)}
          disabled={current === 1}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-transparent bg-transparent text-[var(--text-secondary)] transition-all hover:border-slate-200 hover:bg-slate-50 disabled:opacity-30"
          aria-label="Página anterior"
        >
          <ChevronLeft size={14} />
        </button>
        {[1, 2, 3].map((p) => (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-md text-sm font-semibold transition-all',
              p === current ? 'bg-[var(--brand-500)] text-white shadow-sm' : 'border border-transparent bg-transparent text-[var(--text-primary)] hover:border-slate-200 hover:bg-slate-50',
            )}
          >
            {p}
          </button>
        ))}
        <span className="px-1 text-[var(--text-secondary)]">...</span>
        <button
          onClick={() => onChange(9)}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-transparent bg-transparent text-sm font-semibold text-[var(--text-primary)] transition-all hover:border-slate-200 hover:bg-slate-50"
        >
          9
        </button>
        <button
          onClick={() => onChange(current + 1)}
          disabled={current >= pages}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-[var(--text-secondary)] transition-all hover:bg-slate-100 disabled:opacity-30"
          aria-label="Página siguiente"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  )
}
