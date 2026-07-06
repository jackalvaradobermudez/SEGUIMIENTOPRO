import Link from 'next/link'

export function LandingFooter() {
  return (
    <footer className="border-t border-slate-200 bg-[#F8FAFC] px-6 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-2.5 font-outfit text-base font-bold text-slate-900">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          Seguimiento<span className="text-indigo-500">PRO</span>
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
