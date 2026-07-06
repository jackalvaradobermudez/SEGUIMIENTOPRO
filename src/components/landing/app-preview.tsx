export function AppPreviewSection() {
  return (
    <section className="px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center font-display text-4xl font-extrabold tracking-tight text-slate-800 sm:text-5xl">
          Así se ve tu negocio en SeguimientoPro
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-center text-lg text-slate-500 font-medium">
          Un dashboard limpio, rápido y pensado para que tomes decisiones cada mañana.
        </p>

        <div className="mt-14 overflow-hidden rounded-3xl border border-slate-200 shadow-[0_20px_60px_rgba(124,92,255,0.15)] bg-white/50 p-4 sm:p-8 backdrop-blur-xl">
          <div className="bg-slate-50 rounded-2xl shadow-inner border border-slate-200 overflow-hidden">
            {/* Dashboard mockup */}
            <div className="p-4 sm:p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <div className="h-4 w-32 rounded-md bg-slate-300" />
                  <div className="mt-2 h-3 w-48 rounded-md bg-slate-200" />
                </div>
                <div className="flex gap-3">
                  <div className="h-10 w-24 rounded-xl clay-card bg-white" />
                  <div className="h-10 w-10 rounded-xl clay-card bg-[var(--brand-500)]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {['indigo', 'emerald', 'amber', 'rose'].map((color) => (
                  <div key={color} className="rounded-2xl clay-card p-5 bg-white">
                    <div className={`h-10 w-10 rounded-xl bg-${color}-100 flex items-center justify-center`} />
                    <div className="mt-4 h-3 w-20 rounded-md bg-slate-200" />
                    <div className="mt-3 h-8 w-28 rounded-md bg-slate-800" />
                    <div className="mt-2 h-2 w-24 rounded-md bg-slate-100" />
                  </div>
                ))}
              </div>
              <div className="mt-6 overflow-hidden rounded-2xl clay-card bg-white">
                <div className="flex gap-4 border-b border-slate-100 px-5 py-4 bg-slate-50">
                  {['Todas', 'Pendientes', 'Vencidas', 'Pagadas'].map((t, i) => (
                    <div key={t} className={`h-4 w-20 rounded-full ${i === 0 ? 'bg-[var(--brand-500)]/20' : 'bg-slate-200'}`} />
                  ))}
                </div>
                <div className="bg-white">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 border-b border-slate-50 px-5 py-4 hover:bg-slate-50 transition-colors">
                      <div className="h-5 w-20 rounded-md bg-indigo-100" />
                      <div className="flex-1">
                        <div className="h-4 w-32 rounded-md bg-slate-300" />
                        <div className="mt-2 h-3 w-24 rounded-md bg-slate-200" />
                      </div>
                      <div className="h-4 w-20 rounded-md bg-slate-200" />
                      <div className="h-4 w-20 rounded-md bg-slate-200" />
                      <div className="h-4 w-20 rounded-md bg-amber-100" />
                      <div className="h-4 w-20 rounded-md bg-cyan-100" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
