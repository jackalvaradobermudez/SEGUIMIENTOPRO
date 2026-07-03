'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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

    // Crear negocio automáticamente si el usuario se registró
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

    setSuccess(true)
    setLoading(false)

    // Si confirmación de email no requerida, redirigir
    if (data.session) {
      router.push('/dashboard')
      router.refresh()
    }
  }

  if (success && !loading) {
    return (
      <div className="auth-container">
        <div className="auth-glow" aria-hidden="true" />
        <div className="auth-card animate-scale-in" style={{ textAlign: 'center' }}>
          <div className="success-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 style={{ marginTop: 'var(--space-4)' }}>¡Cuenta creada!</h1>
          <p style={{ marginTop: 'var(--space-2)' }}>
            Revisa tu email para confirmar tu cuenta y luego ingresa.
          </p>
          <Link href="/login" id="go-to-login" style={{ display: 'block', marginTop: 'var(--space-6)' }}>
            <Button className="auth-submit" style={{ width: '100%' }}>
              Ir al login
            </Button>
          </Link>
        </div>

        <style jsx>{`
          .auth-container {
            min-height: 100dvh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: var(--space-6);
            position: relative;
          }
          .auth-glow {
            position: absolute;
            top: -200px;
            left: 50%;
            transform: translateX(-50%);
            width: 600px;
            height: 600px;
            background: radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, transparent 70%);
            pointer-events: none;
          }
          .auth-card {
            position: relative;
            z-index: 1;
            width: 100%;
            max-width: 400px;
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: var(--radius-xl);
            padding: var(--space-10) var(--space-8);
            box-shadow: var(--shadow-xl);
          }
          .success-icon {
            width: 64px;
            height: 64px;
            background: var(--success-bg);
            border: 1px solid rgba(34, 197, 94, 0.3);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--success);
            margin: 0 auto;
          }
          .auth-submit {
            background: var(--accent) !important;
            color: white !important;
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="auth-container">
      <div className="auth-glow" aria-hidden="true" />

      <div className="auth-card animate-fade-in">
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" 
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="auth-logo-text">SeguimientoPro</span>
        </div>

        <div className="auth-header">
          <h1>Crea tu cuenta</h1>
          <p>Gratis para siempre en el plan básico</p>
        </div>

        <form onSubmit={handleRegister} className="auth-form" id="register-form">
          <div className="form-group">
            <Label htmlFor="businessName">Nombre de tu negocio</Label>
            <Input
              id="businessName"
              name="businessName"
              type="text"
              placeholder="Ej: Tienda Doña María"
              value={formData.businessName}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <Label htmlFor="email">Email</Label>
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
            />
          </div>

          <div className="form-group">
            <Label htmlFor="password">Contraseña</Label>
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
            />
          </div>

          <div className="form-group">
            <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Repite tu contraseña"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          {error && (
            <div className="auth-error" role="alert">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2"/>
                <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2"/>
              </svg>
              {error}
            </div>
          )}

          <Button
            type="submit"
            id="register-submit"
            disabled={loading}
            className="auth-submit"
          >
            {loading ? 'Creando cuenta...' : 'Crear cuenta gratis'}
          </Button>
        </form>

        <p className="auth-footer">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" id="go-to-login">Ingresar</Link>
        </p>
      </div>

      <style jsx>{`
        .auth-container {
          min-height: 100dvh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-6);
          position: relative;
          overflow: hidden;
        }
        .auth-glow {
          position: absolute;
          top: -200px;
          left: 50%;
          transform: translateX(-50%);
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, transparent 70%);
          pointer-events: none;
        }
        .auth-card {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 420px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-xl);
          padding: var(--space-10) var(--space-8);
          box-shadow: var(--shadow-xl);
        }
        .auth-logo {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          margin-bottom: var(--space-8);
        }
        .auth-logo-icon {
          width: 40px;
          height: 40px;
          background: var(--accent-light);
          border: 1px solid var(--accent-ring);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent);
        }
        .auth-logo-text {
          font-family: var(--font-display);
          font-size: var(--text-lg);
          font-weight: 700;
          color: var(--text);
        }
        .auth-header { margin-bottom: var(--space-8); }
        .auth-header h1 { font-size: var(--text-2xl); font-weight: 700; margin-bottom: var(--space-2); }
        .auth-header p { color: var(--text-muted); font-size: var(--text-sm); }
        .auth-form { display: flex; flex-direction: column; gap: var(--space-4); }
        .form-group { display: flex; flex-direction: column; gap: var(--space-2); }
        .auth-error {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-3) var(--space-4);
          background: var(--danger-bg);
          border: 1px solid rgba(239, 68, 68, 0.25);
          border-radius: var(--radius-md);
          color: var(--danger);
          font-size: var(--text-sm);
        }
        .auth-submit {
          width: 100%;
          height: 44px;
          background: var(--accent) !important;
          color: white !important;
          font-weight: 600;
          font-size: var(--text-sm);
          margin-top: var(--space-2);
          border-radius: var(--radius-md);
        }
        .auth-footer {
          margin-top: var(--space-6);
          text-align: center;
          font-size: var(--text-sm);
          color: var(--text-muted);
        }
        .auth-footer a { color: var(--text-accent); font-weight: 500; }
      `}</style>
    </div>
  )
}
