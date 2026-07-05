import { cn } from '@/lib/utils'

interface KpiCardProps {
  label: string
  value: string
  subtitle?: string
  icon: React.ReactNode
  iconBg?: string
  sparklineColor?: string
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
  deltaText,
  deltaClassName = 'text-[var(--success-500)]',
  subtitleClassName = 'text-[var(--text-muted)]',
  href,
  className,
}: KpiCardProps) {
  const Wrapper = href ? 'a' : 'div'
  const wrapperProps = href ? { href } : {}

  return (
    <Wrapper
      {...wrapperProps}
      className={cn(
        'group relative flex flex-col gap-2.5 rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-1)] p-6 shadow-surface hover:shadow-surfaceHover hover:translate-y-[-2px] transition-all duration-200 min-w-0',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-[13px] font-semibold text-[var(--text-secondary)] truncate">{label}</span>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.03] text-slate-400 group-hover:text-white transition-colors flex-shrink-0">
          {icon}
        </div>
      </div>
      <div className="flex flex-col gap-1.5 mt-0.5">
        <div className="text-[28px] leading-none font-bold tracking-tight text-white tabular-nums truncate">{value}</div>
        
        {/* Info secundaria/Delta */}
        {deltaText && (
          <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
            <span className={cn('font-semibold tabular-nums', deltaClassName)}>{deltaText}</span>
            <span>vs mes anterior</span>
          </div>
        )}
        
        {subtitle && (
          <p className={cn('text-xs font-medium tabular-nums', subtitleClassName)}>{subtitle}</p>
        )}
      </div>
    </Wrapper>
  )
}
