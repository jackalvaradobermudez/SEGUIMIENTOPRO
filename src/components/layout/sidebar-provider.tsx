'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type SidebarContextType = {
  isCollapsed: boolean
  toggleSidebar: () => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Persistir en localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed')
    if (saved === 'true') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsCollapsed(true)
    }
    setMounted(true)
  }, [])

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const next = !prev
      localStorage.setItem('sidebar-collapsed', String(next))
      return next
    })
  }

  // Evitar saltos de renderizado en el cliente antes de montar
  const sidebarWidth = mounted && isCollapsed ? '88px' : '280px'

  const rootStyle = {
    '--sidebar-width': sidebarWidth,
  } as React.CSSProperties

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleSidebar }}>
      <div className="dashboard-root" style={rootStyle}>
        {children}
      </div>
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}
