'use client'

import React, { useState, useEffect } from 'react'
import { TimeFilter } from './types'

interface HeaderFilterBarProps {
  activeFilter: TimeFilter
  onFilterChange: (filter: TimeFilter) => void
  onQuickAction?: (action: string) => void
}

export default function HeaderFilterBar({
  activeFilter,
  onFilterChange,
}: HeaderFilterBarProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [currentDate, setCurrentDate] = useState<Date | null>(null)

  // Live timer ticking every second - only read new Date() inside useEffect to support Next.js static prerendering
  useEffect(() => {
    setCurrentDate(new Date())
    const timer = setInterval(() => {
      setCurrentDate(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const filterTabs: { id: TimeFilter; label: string }[] = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'Week' },
    { id: 'month', label: 'Month' },
    { id: 'session', label: 'Session' },
    { id: 'custom', label: 'Custom' },
  ]

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
    }, 700)
  }

  // Format live date and time cleanly
  const formattedDate = currentDate
    ? currentDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Monday, Nov 23, 2026'

  const formattedTime = currentDate
    ? currentDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      })
    : '08:00:00 PM'

  // Dynamic greeting based on current local hour
  const hour = currentDate ? currentDate.getHours() : 18
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="bg-gradient-to-r from-[#061a38] via-[#0a2754] to-[#123e7f] rounded-2xl p-6 sm:p-7 shadow-lg relative overflow-hidden text-white flex flex-col lg:flex-row lg:items-center justify-between gap-5">
      {/* Decorative subtle ambient curves */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[radial-gradient(ellipse_at_top_right,rgba(37,99,235,0.2),transparent_70%)] pointer-events-none" />
      <div className="absolute -left-12 -bottom-12 w-48 h-48 rounded-full bg-blue-400/10 blur-2xl pointer-events-none" />

      {/* Left: Dynamic Greeting, Live Date, and Real-Time Clock */}
      <div className="relative z-10 flex flex-col gap-2">
        <h1 className="font-domine text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
          <span>{greeting}, Usman</span>
        </h1>

        <div
          className="text-xs sm:text-sm text-slate-300 font-medium flex items-center gap-2 flex-wrap"
          suppressHydrationWarning
        >
          <span className="font-semibold text-white/90">{formattedDate}</span>
          <span className="text-white/40">·</span>

          {/* Live pulsing clock pill */}
          <span className="inline-flex items-center gap-1.5 font-mono text-emerald-300 bg-emerald-500/15 px-2.5 py-0.5 rounded-md border border-emerald-400/30 text-xs font-semibold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{formattedTime}</span>
          </span>

          <span className="text-white/40">·</span>
          <span className="text-slate-300">Session 2026–2027</span>
          <span className="text-white/40 hidden md:inline">·</span>
          <span className="hidden md:inline text-slate-300">Here is what is happening in your school today</span>
        </div>
      </div>

      {/* Right: Glassmorphic Capsule Time Filters & Refresh Action */}
      <div className="relative z-10 flex items-center gap-2 self-start lg:self-center flex-wrap">
        <div className="inline-flex p-1 bg-white/10 backdrop-blur-md rounded-xl border border-white/15 text-xs shadow-inner">
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onFilterChange(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-[#001639] shadow-md font-bold'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Refresh Reload Button */}
        <button
          type="button"
          onClick={handleRefresh}
          className={`h-9 w-9 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-white flex items-center justify-center transition-all cursor-pointer shadow-2xs ${
            isRefreshing ? 'animate-spin' : ''
          }`}
          title="Refresh Telemetry"
          aria-label="Refresh Telemetry"
        >
          <span className="material-symbols-outlined text-[18px]">sync</span>
        </button>
      </div>
    </div>
  )
}
