'use client'

import React, { useState } from 'react'
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

  return (
    <div className="bg-gradient-to-r from-[#061a38] via-[#0a2754] to-[#123e7f] rounded-2xl p-6 sm:p-7 shadow-lg relative overflow-hidden text-white flex flex-col lg:flex-row lg:items-center justify-between gap-5">
      {/* Decorative subtle ambient curves */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[radial-gradient(ellipse_at_top_right,rgba(37,99,235,0.2),transparent_70%)] pointer-events-none" />
      <div className="absolute -left-12 -bottom-12 w-48 h-48 rounded-full bg-blue-400/10 blur-2xl pointer-events-none" />

      {/* Left: Heading and Subtitle */}
      <div className="relative z-10 flex flex-col gap-1.5">
        <h1 className="font-domine text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Good evening, Usman
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 font-medium">
          Monday, Nov 23 · Session 2026–2027 · Here is what is happening in your school today
        </p>
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
