'use client'

import { cn } from '@/lib/utils'

interface FilterPillsProps {
  options: Array<{ key: string; label: string; count?: number; countClass?: string }>
  active: string
  onChange: (key: string) => void
}

export function FilterPills({ options, active, onChange }: FilterPillsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-1">
      {options.map((opt) => (
        <button
          key={opt.key}
          type="button"
          onClick={() => onChange(opt.key)}
          className={cn(
            'inline-flex h-9 items-center gap-2 rounded-lg border px-4 text-sm font-semibold transition-all duration-200',
            active === opt.key
              ? 'border-transparent bg-[var(--brand-500)] text-white shadow-sm'
              : 'border-transparent bg-transparent text-[var(--text-primary)] hover:bg-white hover:text-[var(--brand-700)]',
          )}
        >
          {opt.label}
          {opt.count !== undefined && (
            <span className={cn('rounded-full px-1.5 py-0.5 text-[11px] font-bold', opt.countClass ?? 'bg-slate-200 text-[var(--text-primary)]')}>
              {opt.count}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
