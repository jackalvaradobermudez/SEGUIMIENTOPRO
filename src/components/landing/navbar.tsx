'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

const LINKS = [
  { href: '#features', label: 'Funciones' },
  { href: '#how-it-works', label: 'Cómo funciona' },
  { href: '#pricing', label: 'Precios' },
  { href: '#testimonials', label: 'Testimonios' },
]

export function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 20) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function scrollTo(id: string) {
    setOpen(false)
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav
      className={cn(
        'fixed inset-x-0 top-0 z-50 h-[76px] transition-all duration-300',
        scrolled ? 'border-b border-slate-200 bg-white/80 backdrop-blur-xl' : 'bg-transparent',
      )}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold text-slate-900 tracking-tight">
          <div className="flex h-8 w-8 items-center justify-center flex-shrink-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="9" stroke="var(--brand-500)" strokeWidth="2.5" fill="white"/>
              <path d="M8.5 12L11 14.5L16 9" stroke="var(--brand-500)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          SEGUIMIENTO <span className="text-[var(--brand-500)] ml-1">PRO</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <button key={l.href} onClick={() => scrollTo(l.href)} className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-900">
              {l.label}
            </button>
          ))}
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <Link href="/login" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Entrar</Link>
          <Link href="/register">
            <Button className="h-10 rounded-xl bg-[var(--brand-500)] px-5 text-sm font-semibold text-white shadow-none hover:bg-[var(--brand-600)] transition-colors">
              Empieza gratis
            </Button>
          </Link>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger render={<button className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 md:hidden"><Menu size={18} /></button>} />
          <SheetContent side="right" className="w-64 border-l border-slate-200 bg-white p-6">
            <div className="flex flex-col gap-4 pt-8">
              {LINKS.map((l) => (
                <button key={l.href} onClick={() => scrollTo(l.href)} className="text-left text-sm font-medium text-slate-600 hover:text-slate-900">
                  {l.label}
                </button>
              ))}
              <hr className="border-slate-200" />
              <Link href="/login" className="text-sm font-medium text-slate-600">Entrar</Link>
              <Link href="/register"><Button className="w-full rounded-xl bg-[var(--brand-500)] hover:bg-[var(--brand-600)] text-sm font-semibold text-white">Empieza gratis</Button></Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}
