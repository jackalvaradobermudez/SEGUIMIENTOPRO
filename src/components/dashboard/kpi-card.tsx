import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface KpiCardProps {
  label: string
  value: string
  subtitle?: string
  icon: React.ReactNode
  iconBg: string
  sparklineColor: string
  deltaText?: string
  deltaClassName?: string
  subtitleClassName?: string
  href?: string
  className?: string
}

export function KpiCard({
  label,
  value,
  subtitle,
  icon,
  iconBg,
  sparklineColor,
  deltaText,
  deltaClassName = 'text-emerald-400',
  subtitleClassName = 'text-slate-500',
  href,
  className,
}: KpiCardProps) {
  const Wrapper = href ? 'a' : 'div'
  const wrapperProps = href ? { href } : {}

  return (
    <Wrapper
      {...wrapperProps}
      className={cn(
        'group relative flex min-h-[122px] min-w-0 items-center gap-5 overflow-hidden rounded-xl border border-white/10 bg-[linear-gradient(145deg,rgba(21,31,50,0.96),rgba(12,19,33,0.98))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)] transition-all duration-200 hover:border-white/[0.16] hover:shadow-[0_18px_45px_rgba(0,0,0,0.28)]',
        className,
      )}
    >
      <div className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl', iconBg)}>
        {icon}
      </div>
      <div className="min-w-0 flex-1 pr-16">
        <p className="truncate text-[14px] font-medium text-slate-400">{label}</p>
        <p className="mt-1 font-outfit text-[26px] font-semibold leading-none tracking-[-0.02em] text-white">{value}</p>
        {subtitle && deltaText && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
        {deltaText && (
          <div className="mt-3 flex items-center gap-1 text-xs text-slate-500">
            <ArrowUpRight size={12} className={deltaClassName} />
            <span className={cn('font-semibold', deltaClassName)}>{deltaText}</span>
            <span>vs mes anterior</span>
          </div>
        )}
        {subtitle && !deltaText && (
          <p className={cn('mt-3 text-[13px] font-semibold', subtitleClassName)}>{subtitle}</p>
        )}
      </div>
      <svg width="104" height="42" viewBox="0 0 104 42" className="absolute bottom-5 right-5 opacity-95">
        <polyline
          points="0,34 9,34 16,26 25,28 33,16 43,21 52,10 62,12 72,25 82,18 91,23 104,7"
          fill="none"
          stroke={sparklineColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Wrapper>
  )
}
