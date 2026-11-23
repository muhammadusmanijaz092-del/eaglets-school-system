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
  const [currentTime, setCurrentTime] = useState('08:54:52 PM')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const updateTime = () => {
      const now = new Date()
      const timeStr = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      })
      setCurrentTime(timeStr)
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  const filterTabs: { id: TimeFilter; label: string }[] = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'Week' },
    { id: 'month', label: 'Month' },
    { id: 'session', label: 'Session' },
    { id: 'custom', label: 'Custom' },
  ]

  return (
    <div className="flex flex-col gap-3 bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs">
      {/* Status Metadata Line */}
      <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pb-2.5 border-b border-slate-100 gap-2">
        <div className="flex items-center gap-2 flex-wrap font-mono">
          <span className="flex items-center gap-1.5 font-semibold text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Monday, November 23
          </span>
          <span className="text-slate-300">·</span>
          <span className="text-slate-600 font-medium">
            {mounted ? currentTime : '08:54:52 PM'}
          </span>
          <span className="text-slate-300">·</span>
          <span className="px-2 py-0.5 rounded bg-slate-100 text-[#001639] font-sans font-bold text-[11px]">
            Session 2026-2027
          </span>
          <span className="text-slate-300">·</span>
          <span className="text-slate-400">Updated 8:39 pm</span>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-slate-500">
          <span className="material-symbols-outlined text-[15px] text-[#f5bc71]">verified</span>
          <span>Main Boys Campus, Lahore</span>
        </div>
      </div>

      {/* Main Greeting & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
        <div>
          <h1 className="font-domine text-2xl lg:text-3xl font-bold text-[#001639] tracking-tight">
            Good evening, Usman
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Here is what&apos;s happening in your school today.
          </p>
        </div>

        {/* Global Time Filter Tabs */}
        <div className="inline-flex p-1 bg-slate-100/90 rounded-lg border border-slate-200/60 self-start md:self-center">
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onFilterChange(tab.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-[#001639] shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
