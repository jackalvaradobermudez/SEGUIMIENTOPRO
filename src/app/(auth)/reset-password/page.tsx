'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ResetPasswordPage() {
  const router = useRouter()
  const supabase = createClient()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
    setTimeout(() => {
      router.push('/dashboard')
      router.refresh()
    }, 1500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-slate-50">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[var(--brand-500)]/10 blur-3xl rounded-full pointer-events-none" aria-hidden="true" />

      <div className="clay-card bg-white p-10 w-full max-w-md relative z-10 animate-fade-in">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-12 h-12 flex items-center justify-center rounded-2xl clay-card-inset bg-slate-50">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--brand-500)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="font-display text-xl font-bold text-slate-800">Seguimiento<span className="text-[var(--brand-500)]">PRO</span></span>
        </div>

        {success ? (
          <div className="text-center">
            <h1 className="text-2xl font-extrabold text-slate-800 mb-2">¡Contraseña actualizada!</h1>
            <p className="text-slate-500 font-medium">Te estamos llevando a tu dashboard...</p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-extrabold text-slate-800 mb-2">Crea una nueva contraseña</h1>
              <p className="text-slate-500 font-medium">Debe tener al menos 8 caracteres.</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5" id="reset-password-form">
              <div className="flex flex-col gap-2">
                <Label htmlFor="password" className="text-slate-700 font-semibold">Nueva contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  disabled={loading}
                  className="h-12 bg-slate-50 border-slate-200 rounded-xl focus-visible:ring-[var(--brand-500)]"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="confirmPassword" className="text-slate-700 font-semibold">Confirmar contraseña</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  disabled={loading}
                  className="h-12 bg-slate-50 border-slate-200 rounded-xl focus-visible:ring-[var(--brand-500)]"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium" role="alert">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="clay-btn clay-btn-primary h-14 mt-2 rounded-2xl w-full text-lg flex items-center justify-center"
              >
                {loading ? 'Guardando...' : 'Guardar nueva contraseña'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
