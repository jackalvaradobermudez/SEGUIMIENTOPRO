import Link from 'next/link'

export function LandingFooter() {
  return (
    <footer className="border-t border-slate-200 bg-[#F8FAFC] px-6 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-2 font-display text-base font-bold text-slate-900 tracking-tight">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="9" stroke="var(--brand-500)" strokeWidth="2.5" fill="white"/>
            <path d="M8.5 12L11 14.5L16 9" stroke="var(--brand-500)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          SEGUIMIENTO <span className="text-[var(--brand-500)] ml-1">PRO</span>
        </div>
        <p className="text-sm text-slate-400">&copy; {new Date().getFullYear()} SeguimientoPro. Gestión de cobros para emprendedores.</p>
        <div className="flex gap-6 text-sm">
          <Link href="/terminos" className="text-slate-400 transition-colors hover:text-slate-600">Términos</Link>
          <Link href="/privacidad" className="text-slate-400 transition-colors hover:text-slate-600">Privacidad</Link>
          <Link href="/contacto" className="text-slate-400 transition-colors hover:text-slate-600">Contacto</Link>
        </div>
      </div>
    </footer>
  )
}
