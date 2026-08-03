'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Play, Pause, RotateCcw, MessageCircle } from 'lucide-react'

// Timings in seconds
const SCENE_DURATIONS = [8, 12, 15, 20, 20, 20, 15]
const TOTAL_DURATION = SCENE_DURATIONS.reduce((a, b) => a + b, 0)

export default function CommercialPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [currentScene, setCurrentScene] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    let accumulatedTime = 0
    for (let i = 0; i < SCENE_DURATIONS.length; i++) {
      accumulatedTime += SCENE_DURATIONS[i]
      if (currentTime < accumulatedTime) {
        if (currentScene !== i) setCurrentScene(i)
        break
      }
    }
    if (currentTime >= TOTAL_DURATION) {
      setIsPlaying(false)
      setCurrentTime(TOTAL_DURATION)
    }
  }, [currentTime, currentScene])

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => Math.min(prev + 0.1, TOTAL_DURATION))
      }, 100)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isPlaying])

  const togglePlay = () => setIsPlaying(!isPlaying)
  const reset = () => {
    setIsPlaying(false)
    setCurrentTime(0)
    setCurrentScene(0)
  }

  return (
    <div className="fixed inset-0 bg-[#0B1120] text-white overflow-hidden font-display flex flex-col z-[100]">
      {/* Viewport (16:9 Aspect Ratio container centered) */}
      <div className="flex-1 relative w-full h-full flex items-center justify-center bg-black">
        <div className="relative w-full max-w-[1920px] aspect-video bg-[#0B1120] overflow-hidden shadow-2xl">
          
          {/* Scene 1: El Gancho (0 - 8s) */}
          <div className={`absolute inset-0 transition-opacity duration-1000 ${currentScene === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
            <Image src="/commercial/scene1.png" alt="Emprendedor estresado" fill className="object-cover opacity-40 scale-105" priority />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12">
              <h1 className={`text-5xl md:text-7xl font-bold mb-6 transition-all duration-1000 transform ${currentScene === 0 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                Vender a crédito <span className="text-blue-500">no es el problema.</span>
              </h1>
              <p className={`text-2xl md:text-3xl text-slate-300 transition-all duration-1000 transform ${currentScene === 0 && currentTime > 2.5 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                El problema es cuando no sabes <span className="text-white font-bold">quién te debe</span>...
              </p>
              <p className={`text-2xl md:text-3xl text-slate-300 transition-all duration-1000 transform ${currentScene === 0 && currentTime > 4.5 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                cuánto te debe... y qué deberías cobrar hoy.
              </p>
            </div>
          </div>

          {/* Scene 2: El Dolor (8 - 20s) */}
          <div className={`absolute inset-0 bg-[#0B1120] transition-opacity duration-1000 ${currentScene === 1 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
               <div className="w-96 h-96 bg-red-500/20 rounded-full blur-3xl absolute top-1/4 left-1/4 animate-pulse" />
               <div className="w-96 h-96 bg-blue-500/20 rounded-full blur-3xl absolute bottom-1/4 right-1/4 animate-pulse" />
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12 z-20">
              
              <div className="flex flex-col gap-4 mb-12 items-center w-full max-w-lg">
                <div className={`bg-slate-800 text-slate-200 p-4 rounded-2xl rounded-tl-sm w-3/4 self-start shadow-xl transition-all duration-500 transform ${currentScene === 1 && currentTime > 9 ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
                  "Te pago mañana."
                </div>
                <div className={`bg-slate-800 text-slate-200 p-4 rounded-2xl rounded-tr-sm w-3/4 self-end shadow-xl transition-all duration-500 transform ${currentScene === 1 && currentTime > 10.5 ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
                  "¿Cuánto era que debía?"
                </div>
                <div className={`bg-slate-800 text-slate-200 p-4 rounded-2xl rounded-tl-sm w-3/4 self-start shadow-xl transition-all duration-500 transform ${currentScene === 1 && currentTime > 12 ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
                  "Creo que ya pagué."
                </div>
              </div>

              <h2 className={`text-4xl md:text-5xl font-bold transition-all duration-1000 transform ${currentScene === 1 && currentTime > 14 ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                Cada día que pasa sin control... <span className="text-red-500">pierdes dinero.</span>
              </h2>
              <p className={`mt-6 text-2xl text-slate-400 max-w-2xl transition-all duration-1000 transform ${currentScene === 1 && currentTime > 16.5 ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
                No porque vendas poco... <br/><span className="text-white font-bold">sino porque cobras tarde.</span>
              </p>
            </div>
          </div>

          {/* Scene 3: Aparece SeguimientoPRO (20 - 35s) */}
          <div className={`absolute inset-0 bg-white text-slate-900 transition-opacity duration-1000 ${currentScene === 2 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
            <div className="absolute inset-0 flex flex-col items-center justify-center p-12">
              <div className={`mb-8 transition-all duration-1000 transform ${currentScene === 2 && currentTime > 21 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
                <div className="flex items-center justify-center w-24 h-24 bg-blue-600 text-white rounded-3xl shadow-2xl shadow-blue-500/50 mb-6 mx-auto">
                   <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                </div>
                <h2 className="text-5xl font-extrabold tracking-tight text-center">Seguimiento<span className="text-blue-600">PRO</span></h2>
              </div>
              
              <div className="flex flex-col items-center gap-6 mt-8">
                <p className={`text-3xl font-medium transition-all duration-700 transform ${currentScene === 2 && currentTime > 24 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>Quién te debe.</p>
                <p className={`text-3xl font-medium transition-all duration-700 transform ${currentScene === 2 && currentTime > 26 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>Cuánto te debe.</p>
                <p className={`text-3xl font-medium transition-all duration-700 transform ${currentScene === 2 && currentTime > 28 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>Qué pagos vencen hoy.</p>
                <div className={`mt-8 px-8 py-4 bg-blue-50 rounded-2xl text-blue-700 text-2xl font-bold transition-all duration-1000 transform ${currentScene === 2 && currentTime > 31 ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
                  Todo en un solo lugar.
                </div>
              </div>
            </div>
          </div>

          {/* Scene 4: Beneficios (35 - 55s) */}
          <div className={`absolute inset-0 bg-[#0B1120] transition-opacity duration-1000 ${currentScene === 3 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
            <div className="absolute inset-0 flex flex-col items-center justify-center p-12">
              <h2 className={`text-5xl font-bold mb-16 text-center transition-all duration-1000 transform ${currentScene === 3 && currentTime > 36 ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
                Sin Excel. Sin Cuadernos.<br/><span className="text-blue-500">Sin depender de la memoria.</span>
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl">
                {['Registro de venta', 'Historial de cliente', 'Cartera por edades', 'Programa cobros', 'Recordatorios WhatsApp', 'Indicadores en tiempo real'].map((benefit, idx) => (
                  <div key={idx} className={`bg-white/5 border border-white/10 p-8 rounded-3xl flex flex-col items-center justify-center text-center transition-all duration-700 transform ${currentScene === 3 && currentTime > (38 + idx * 2) ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
                    <div className="w-12 h-12 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12l5 5l10 -10"></path></svg>
                    </div>
                    <p className="text-lg font-semibold text-slate-200">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Scene 5: El Resultado (55 - 75s) */}
          <div className={`absolute inset-0 transition-opacity duration-1000 ${currentScene === 4 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
            <Image src="/commercial/scene5.png" alt="Empresario tranquilo" fill className="object-cover opacity-50 scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-[#0B1120]/50 to-transparent opacity-90" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12">
              <h2 className={`text-5xl md:text-6xl font-bold mb-8 transition-all duration-1000 transform ${currentScene === 4 && currentTime > 56 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                Lo mejor no es el software.
              </h2>
              <h2 className={`text-4xl md:text-5xl font-medium text-blue-400 mb-12 transition-all duration-1000 transform ${currentScene === 4 && currentTime > 59 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                Lo mejor es lo que ocurre cuando empiezas a usarlo.
              </h2>
              
              <div className="flex flex-wrap justify-center gap-4 max-w-4xl">
                {['Cobras más rápido', 'Recuperas cartera vencida', 'Mejoras tu flujo de caja', 'Vendes más sin perder el control'].map((result, idx) => (
                  <span key={idx} className={`px-6 py-3 bg-white/10 backdrop-blur-md rounded-full text-xl font-semibold border border-white/20 transition-all duration-700 transform ${currentScene === 4 && currentTime > (63 + idx * 2.5) ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
                    {result}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Scene 6: ¿Por qué la versión PRO? (75 - 95s) */}
          <div className={`absolute inset-0 bg-[#0B1120] transition-opacity duration-1000 ${currentScene === 5 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
            <div className="absolute inset-0 flex flex-col items-center justify-center p-12">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-[#0B1120] to-[#0B1120]" />
              
              <h2 className={`text-5xl font-bold mb-4 relative z-10 transition-all duration-1000 transform ${currentScene === 5 && currentTime > 76 ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
                Diseñado para negocios que venden a crédito <span className="text-blue-500">todos los días.</span>
              </h2>
              
              <div className={`w-full max-w-4xl bg-white/5 border border-white/10 rounded-3xl p-10 mt-12 relative z-10 transition-all duration-1000 transform ${currentScene === 5 && currentTime > 79 ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                <div className="grid grid-cols-2 gap-y-6 gap-x-12">
                  {[
                    'Clientes ilimitados', 'Ventas ilimitadas', 'Productos ilimitados', 
                    'Reportes inteligentes', 'Estados de cuenta en PDF', 'Calendario completo',
                    'Exportación de información', 'Herramientas para cobrar antes'
                  ].map((feature, idx) => (
                    <div key={idx} className={`flex items-center gap-4 transition-all duration-500 transform ${currentScene === 5 && currentTime > (81 + idx * 1.5) ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}>
                      <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                        <CheckIcon />
                      </div>
                      <span className="text-xl text-slate-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Scene 7: Cierre (95 - 110s) */}
          <div className={`absolute inset-0 bg-blue-600 transition-opacity duration-1000 ${currentScene === 6 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12">
              <h2 className={`text-5xl font-bold mb-8 transition-all duration-1000 transform ${currentScene === 6 && currentTime > 96 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                El verdadero crecimiento no ocurre cuando vendes más.
              </h2>
              <h2 className={`text-4xl font-medium text-blue-200 mb-16 transition-all duration-1000 transform ${currentScene === 6 && currentTime > 99 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                Ocurre cuando tienes el <span className="text-white font-bold underline decoration-4 underline-offset-8">control</span> de todo lo que ya vendiste.
              </h2>
              
              <div className={`flex flex-col items-center gap-6 transition-all duration-1000 transform ${currentScene === 6 && currentTime > 103 ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
                <div className="flex items-center justify-center w-20 h-20 bg-white text-blue-600 rounded-2xl shadow-2xl mb-2">
                   <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                </div>
                <h1 className="text-6xl font-extrabold tracking-tight mb-2">Seguimiento<span className="text-blue-200">PRO</span></h1>
                <p className="text-2xl font-medium text-blue-100 tracking-wide mb-8">Organiza. Controla. Cobra mejor.</p>
                
                <div className="flex gap-4">
                  <Link href="/register" className="px-10 py-5 bg-white text-blue-600 rounded-full font-bold text-xl shadow-xl hover:bg-slate-50 transition-all transform hover:scale-105 active:scale-95">
                    Empieza hoy - Ver Demo
                  </Link>
                  <a href="https://wa.me/573165366015" target="_blank" rel="noreferrer" className="px-10 py-5 bg-[#25D366] text-white rounded-full font-bold text-xl shadow-xl hover:bg-[#20bd5a] transition-all transform hover:scale-105 active:scale-95 flex items-center gap-3">
                    <MessageCircle size={24} />
                    +573165366015
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar Overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-50">
            <div 
              className="h-full bg-blue-500 transition-all duration-100 ease-linear"
              style={{ width: ((currentTime / TOTAL_DURATION) * 100) + '%' }}
            />
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="h-20 bg-slate-900 border-t border-white/10 flex items-center justify-between px-8 z-50 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={togglePlay}
            className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:bg-slate-200 transition-colors"
          >
            {isPlaying ? <Pause size={20} className="fill-black" /> : <Play size={20} className="fill-black ml-1" />}
          </button>
          <button 
            onClick={reset}
            className="w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <RotateCcw size={20} />
          </button>
          <div className="text-slate-400 font-mono text-lg font-medium ml-4">
            {currentTime.toFixed(1)}s / {TOTAL_DURATION}s <span className="ml-2 text-slate-500">| Escena {currentScene + 1}/7</span>
          </div>
        </div>
        <div className="text-sm text-slate-500 font-medium tracking-wide">
          <span className="text-blue-400">HYPERFRAMES ENGINE</span> • AUTONOMOUS CINEMATIC RENDER
        </div>
      </div>
    </div>
  )
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  )
}
