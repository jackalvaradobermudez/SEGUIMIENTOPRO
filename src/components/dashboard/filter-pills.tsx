'use client'

import { cn } from '@/lib/utils'

interface FilterPillsProps {
  options: Array<{ key: string; label: string; count?: number; countClass?: string }>
  active: string
  onChange: (key: string) => void
}

export function FilterPills({ options, active, onChange }: FilterPillsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {options.map((opt) => (
        <button
          key={opt.key}
          type="button"
          onClick={() => onChange(opt.key)}
          className={cn(
            'inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-all duration-200',
            active === opt.key
              ? 'border-violet-500/30 bg-violet-500/15 text-white shadow-[0_0_20px_rgba(124,92,255,0.15)]'
              : 'border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/20 hover:bg-white/[0.06]',
          )}
        >
          {opt.label}
          {opt.count !== undefined && (
            <span className={cn('rounded-full px-1.5 py-0.5 text-[11px] font-semibold', opt.countClass ?? 'bg-white/10 text-slate-300')}>
              {opt.count}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
