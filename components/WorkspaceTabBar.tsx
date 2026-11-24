'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

export interface WorkspaceTab {
  id: string
  label: string
  href: string
  icon: string
}

const ALL_AVAILABLE_TABS: WorkspaceTab[] = [
  { id: 'dashboard', label: 'Dashboard Overview', href: '/', icon: 'grid_view' },
  { id: 'activity', label: "Today's Activity", href: '/activity', icon: 'monitoring' },
  { id: 'students', label: 'Student Admissions', href: '/students', icon: 'school' },
  { id: 'faculty', label: 'Faculty & Payroll', href: '/faculty', icon: 'badge' },
  { id: 'finance', label: 'Fee Finance', href: '/finance', icon: 'payments' },
  { id: 'attendance', label: 'Daily Attendance', href: '/attendance', icon: 'fact_check' },
  { id: 'academics', label: 'Academics & Diary', href: '/academics', icon: 'menu_book' },
  { id: 'examinations', label: 'Examinations', href: '/examinations', icon: 'assignment_turned_in' },
  { id: 'settings', label: 'Settings', href: '/settings', icon: 'admin_panel_settings' },
]

const STORAGE_KEY = 'eaglets_workspace_tabs'

export default function WorkspaceTabBar({
  isSidebarOpen = true,
}: {
  isSidebarOpen?: boolean
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [tabs, setTabs] = useState<WorkspaceTab[]>([
    { id: 'dashboard', label: 'Dashboard Overview', href: '/', icon: 'grid_view' },
  ])
  const [isNewTabMenuOpen, setIsNewTabMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Initialize tabs from storage and ensure current route is an active tab
  useEffect(() => {
    setMounted(true)
    let initialTabs: WorkspaceTab[] = [
      { id: 'dashboard', label: 'Dashboard Overview', href: '/', icon: 'grid_view' },
    ]
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) {
          initialTabs = parsed
        }
      }
    } catch {}

    // Find if current route matches a known tab
    const matched = ALL_AVAILABLE_TABS.find((t) => {
      if (t.href === '/') return pathname === '/'
      return pathname.startsWith(t.href)
    })

    if (matched && !initialTabs.some((t) => t.id === matched.id)) {
      initialTabs.push(matched)
    }

    setTabs(initialTabs)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialTabs))
    } catch {}
  }, [pathname])

  const handleOpenTab = (tab: WorkspaceTab) => {
    setIsNewTabMenuOpen(false)
    if (!tabs.some((t) => t.id === tab.id)) {
      const updated = [...tabs, tab]
      setTabs(updated)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      } catch {}
    }
    router.push(tab.href)
  }

  const handleCloseTab = (e: React.MouseEvent, tabId: string) => {
    e.preventDefault()
    e.stopPropagation()
    if (tabs.length <= 1) return

    const closingIndex = tabs.findIndex((t) => t.id === tabId)
    const isClosingActive = tabs[closingIndex]?.href === pathname

    const updated = tabs.filter((t) => t.id !== tabId)
    setTabs(updated)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch {}

    if (isClosingActive) {
      const nextTab = updated[Math.max(0, closingIndex - 1)]
      if (nextTab) {
        router.push(nextTab.href)
      }
    }
  }

  if (!mounted) return null

  return (
    <div
      className={`fixed top-16 right-0 h-10 bg-white z-30 border-b border-slate-200/90 flex items-center px-3 sm:px-6 print:hidden transition-all duration-300 gap-2 overflow-x-auto select-none ${
        isSidebarOpen ? 'left-0 lg:left-72' : 'left-0'
      }`}
    >
      {/* Scrollable Tab Strip */}
      <div className="flex items-center gap-4 min-w-0 flex-1 overflow-x-auto h-full scrollbar-none">
        {tabs.map((tab) => {
          const isActive =
            tab.href === '/'
              ? pathname === '/'
              : pathname.startsWith(tab.href)

          return (
            <div
              key={tab.id}
              className={`group flex items-center gap-1.5 h-full px-1 text-xs transition-all cursor-pointer flex-shrink-0 relative ${
                isActive
                  ? 'text-[#001639] font-bold border-b-2 border-blue-600'
                  : 'text-slate-500 hover:text-slate-800 font-medium border-b-2 border-transparent'
              }`}
              onClick={() => router.push(tab.href)}
            >
              <span className="truncate max-w-[130px] sm:max-w-[180px]">
                {tab.label}
              </span>

              {tabs.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => handleCloseTab(e, tab.id)}
                  className="w-4 h-4 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center text-[13px] ml-1 transition-colors"
                  title="Close Tab"
                >
                  &times;
                </button>
              )}
            </div>
          )
        })}

        {/* Subtle Separator */}
        <div className="h-4 w-[1px] bg-slate-200 flex-shrink-0" />

        {/* New Tab Button */}
        <div className="relative flex-shrink-0">
          <button
            type="button"
            onClick={() => setIsNewTabMenuOpen((prev) => !prev)}
            className="w-6 h-6 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-800 flex items-center justify-center transition-all cursor-pointer"
            title="Open New Workspace Tab"
            aria-label="New Tab"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
          </button>

          {/* New Tab Dropdown Menu */}
          {isNewTabMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsNewTabMenuOpen(false)}
              />
              <div className="absolute left-0 top-full mt-1.5 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 text-xs">
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                  Open Workspace Tab
                </div>
                {ALL_AVAILABLE_TABS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleOpenTab(item)}
                    className="w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-slate-50 text-slate-700 font-medium transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px] text-slate-400">
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
