'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { trackEvent } from '@/lib/analytics/gtag'

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    businessName: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres')
      return
    }

    setLoading(true)

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: { business_name: formData.businessName }
      }
    })

    if (signUpError) {
      setError(signUpError.message === 'User already registered'
        ? 'Este email ya está registrado'
        : signUpError.message
      )
      setLoading(false)
      return
    }

    if (data.user) {
      await supabase.from('businesses').insert({
        user_id: data.user.id,
        name: formData.businessName || 'Mi Negocio',
        description: null,
        currency: 'COP',
        timezone: 'America/Bogota',
        logo_url: null,
        deleted_at: null,
      })
    }

    trackEvent('sign_up', { method: 'email' })

    setSuccess(true)
    setLoading(false)

    if (data.session) {
      router.push('/dashboard')
      router.refresh()
    }
  }

  if (success && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 relative bg-slate-50">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[var(--brand-500)]/10 blur-3xl rounded-full pointer-events-none" aria-hidden="true" />
        <div className="clay-card bg-white p-10 w-full max-w-md text-center relative z-10 animate-scale-in">
          <div className="w-16 h-16 bg-[var(--success-500)]/10 border border-[var(--success-500)]/30 rounded-full flex items-center justify-center text-[var(--success-500)] mx-auto">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="mt-6 text-2xl font-bold text-slate-800">¡Cuenta creada!</h1>
          <p className="mt-2 text-slate-600 font-medium">
            Revisa tu email para confirmar tu cuenta y luego ingresa.
          </p>
          <Link href="/login" id="go-to-login" className="block mt-8">
            <button className="clay-btn clay-btn-primary h-14 rounded-2xl w-full text-lg">
              Ir al login
            </button>
          </Link>
        </div>
      </div>
    )
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

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-800 mb-2">Crea tu cuenta</h1>
          <p className="text-slate-500 font-medium">Gratis para siempre en el plan básico</p>
        </div>

        <form onSubmit={handleRegister} className="flex flex-col gap-5" id="register-form">
          <div className="flex flex-col gap-2">
            <Label htmlFor="businessName" className="text-slate-700 font-semibold">Nombre de tu negocio</Label>
            <Input
              id="businessName"
              name="businessName"
              type="text"
              placeholder="Ej: Tienda Doña María"
              value={formData.businessName}
              onChange={handleChange}
              required
              disabled={loading}
              className="h-12 bg-slate-50 border-slate-200 rounded-xl focus-visible:ring-[var(--brand-500)]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="email" className="text-slate-700 font-semibold">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="tu@email.com"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
              disabled={loading}
              className="h-12 bg-slate-50 border-slate-200 rounded-xl focus-visible:ring-[var(--brand-500)]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password" className="text-slate-700 font-semibold">Contraseña</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Mínimo 8 caracteres"
              value={formData.password}
              onChange={handleChange}
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
              name="confirmPassword"
              type="password"
              placeholder="Repite tu contraseña"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={loading}
              className="h-12 bg-slate-50 border-slate-200 rounded-xl focus-visible:ring-[var(--brand-500)]"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium" role="alert">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2"/>
                <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2"/>
              </svg>
              {error}
            </div>
          )}

          <button
            type="submit"
            id="register-submit"
            disabled={loading}
            className="clay-btn clay-btn-primary h-14 mt-2 rounded-2xl w-full text-lg flex items-center justify-center"
          >
            {loading ? 'Creando cuenta...' : 'Crear cuenta gratis'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm font-medium text-slate-500">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" id="go-to-login" className="text-[var(--brand-500)] font-bold hover:underline">Ingresar</Link>
        </p>
      </div>
    </div>
  )
}
