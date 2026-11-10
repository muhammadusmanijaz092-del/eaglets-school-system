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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  // Automatically close mobile sidebar drawer on navigation
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  return (
    <div className="min-h-screen bg-[#f8f9ff] overflow-x-hidden">
      {/* Sidebar Drawer */}
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Dark Backdrop */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Main Content Area */}
      <div className="lg:pl-72 transition-all duration-300 min-w-0 w-full">
        <TopBar onMenuToggle={() => setIsMobileMenuOpen((prev) => !prev)} />
        <main className="pt-16 min-h-[calc(100vh-4rem)] overflow-x-hidden min-w-0 w-full">
          {children}
        </main>
      </div>
    </div>
  )
}

