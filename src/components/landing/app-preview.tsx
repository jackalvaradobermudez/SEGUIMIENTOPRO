export function AppPreviewSection() {
  return (
    <section className="px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Así se ve tu negocio en SeguimientoPro
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-zinc-400">
          Un dashboard limpio, rápido y pensado para que tomes decisiones cada mañana.
        </p>

        <div className="mt-12 overflow-hidden rounded-2xl border border-white/[0.08] shadow-[0_0_60px_rgba(99,102,241,0.08)]">
          <div className="bg-[#0a0a0f] p-4 sm:p-6">
            {/* Dashboard mockup */}
            <div className="rounded-xl border border-white/[0.06] bg-[#111113] p-4 sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <div className="h-3 w-24 rounded bg-white/10" />
                  <div className="mt-2 h-2 w-40 rounded bg-white/5" />
                </div>
                <div className="flex gap-2">
                  <div className="h-8 w-20 rounded-lg bg-white/5" />
                  <div className="h-8 w-8 rounded-lg bg-white/5" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {['indigo', 'emerald', 'amber', 'rose'].map((color) => (
                  <div key={color} className="rounded-xl border border-white/[0.06] bg-[#18181b] p-4">
                    <div className={`h-8 w-8 rounded-lg bg-${color}-500/20`} />
                    <div className="mt-3 h-3 w-16 rounded bg-white/10" />
                    <div className="mt-2 h-6 w-24 rounded bg-white/15" />
                    <div className="mt-2 h-2 w-20 rounded bg-white/5" />
                  </div>
                ))}
              </div>
              <div className="mt-4 overflow-hidden rounded-xl border border-white/[0.06]">
                <div className="flex gap-4 border-b border-white/[0.06] bg-[#18181b] px-4 py-3">
                  {['Todas', 'Pendientes', 'Vencidas', 'Pagadas'].map((t, i) => (
                    <div key={t} className={`h-3 w-16 rounded-full ${i === 0 ? 'bg-indigo-500/30' : 'bg-white/5'}`} />
                  ))}
                </div>
                <div className="bg-[#111113]">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 border-b border-white/[0.04] px-4 py-3">
                      <div className="h-4 w-16 rounded bg-indigo-500/20" />
                      <div className="flex-1">
                        <div className="h-3 w-24 rounded bg-white/10" />
                        <div className="mt-1 h-2 w-20 rounded bg-white/5" />
                      </div>
                      <div className="h-3 w-16 rounded bg-white/5" />
                      <div className="h-3 w-16 rounded bg-white/5" />
                      <div className="h-3 w-16 rounded bg-amber-500/20" />
                      <div className="h-3 w-16 rounded bg-cyan-500/20" />
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
