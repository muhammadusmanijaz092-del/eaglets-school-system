'use client'

import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import TopBar from '@/components/TopBar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()

  // Detect screen size on mount & resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      if (mobile) {
        setIsSidebarOpen(false)
      } else {
        const stored = localStorage.getItem('eaglets_sidebar_open')
        if (stored !== null) {
          setIsSidebarOpen(stored === 'true')
        } else {
          setIsSidebarOpen(true)
        }
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Automatically close sidebar on mobile when navigating
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false)
    }
  }, [pathname, isMobile])

  // Keyboard shortcut: Ctrl+B or Cmd+B to toggle sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault()
        toggleSidebar()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  })

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => {
      const next = !prev
      if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
        try {
          localStorage.setItem('eaglets_sidebar_open', String(next))
        } catch {}
      }
      return next
    })
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false)
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      try {
        localStorage.setItem('eaglets_sidebar_open', 'false')
      } catch {}
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f9ff] overflow-x-hidden">
      {/* Sidebar Drawer */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
        onToggle={toggleSidebar}
      />

      {/* Mobile Dark Backdrop (only when viewport < 1024px and sidebar is open) */}
      {isMobile && isSidebarOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Main Content Area - dynamically indented by sidebar width when open, full-width when collapsed */}
      <div
        className={`transition-all duration-300 min-w-0 w-full ${
          isSidebarOpen ? 'lg:pl-72' : 'pl-0'
        }`}
      >
        <TopBar
          isSidebarOpen={isSidebarOpen}
          onMenuToggle={toggleSidebar}
        />
        <main className="pt-16 min-h-[calc(100vh-4rem)] overflow-x-hidden min-w-0 w-full">
          {children}
        </main>
      </div>
    </div>
  )
}
