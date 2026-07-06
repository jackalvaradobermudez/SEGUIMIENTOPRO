import Link from 'next/link'

export function LandingFooter() {
  return (
    <footer className="border-t border-white/[0.06] px-6 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-2.5 font-display text-base font-bold text-white">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          Seguimiento<span className="text-indigo-400">PRO</span>
        </div>

        <p className="text-sm text-zinc-500">
          Gestión de cobros para emprendedores. &copy; {new Date().getFullYear()} SeguimientoPro. Todos los derechos reservados.
        </p>

        <div className="flex gap-6 text-sm">
          <Link href="#" className="text-zinc-500 transition-colors hover:text-white">
            Términos
          </Link>
          <Link href="#" className="text-zinc-500 transition-colors hover:text-white">
            Privacidad
          </Link>
          <Link href="#" className="text-zinc-500 transition-colors hover:text-white">
            Contacto
          </Link>
        </div>
      </div>
    </footer>
  )
}
