'use client'

import React, { useState } from 'react'
import Link from 'next/link'

interface TopBarProps {
  onNewAdmission?: () => void
  onRecordFee?: () => void
}

export default function TopBar({ onNewAdmission, onRecordFee }: TopBarProps) {
  const [selectedCampus, setSelectedCampus] = useState('Main Boys Campus, Lahore')
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <header className="fixed top-0 left-72 right-0 h-16 bg-white/95 backdrop-blur-md z-40 border-b border-slate-200 shadow-[0_1px_4px_rgba(0,22,57,0.04)] flex items-center justify-between px-6 print:hidden">
      {/* Search Input Bar */}
      <div className="flex items-center gap-4 w-full max-w-md">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search students (Roll No, B-Form, Name) or staff..."
            className="w-full h-9 pl-9 pr-14 bg-slate-50 text-slate-800 placeholder:text-slate-400 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-[#122b54] focus:bg-white transition-all shadow-2xs"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-slate-200/70 text-slate-500 text-[10px] font-mono border border-slate-300">
            Ctrl+K
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Live Date / PKR Banner */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-xs">
          <span className="material-symbols-outlined text-[15px] text-[#001639]">
            calendar_today
          </span>
          <span className="font-semibold">Monday, 16 Sep 2026</span>
          <span className="text-slate-300">|</span>
          <span className="font-bold text-[#b3272c]">PKR Live Ledger</span>
        </div>

        {/* Campus Dropdown */}
        <div className="flex items-center gap-2">
          <select
            value={selectedCampus}
            onChange={(e) => setSelectedCampus(e.target.value)}
            className="h-9 px-2.5 bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 focus:outline-none focus:border-[#122b54] cursor-pointer"
          >
            <option value="Main Boys Campus, Lahore">Main Boys Campus, Lahore</option>
            <option value="Girls Junior Campus">Girls Junior Campus</option>
            <option value="Gulberg Model Wing">Gulberg Model Wing</option>
          </select>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2">
          {onNewAdmission ? (
            <button
              type="button"
              onClick={onNewAdmission}
              className="h-9 px-3.5 bg-[#b3272c] text-white hover:bg-[#88131b] text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[17px]">person_add</span>
              <span>+ New Admission</span>
            </button>
          ) : (
            <Link
              href="/students?action=new"
              className="h-9 px-3.5 bg-[#b3272c] text-white hover:bg-[#88131b] text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <span className="material-symbols-outlined text-[17px]">person_add</span>
              <span>+ New Admission</span>
            </Link>
          )}

          {onRecordFee ? (
            <button
              type="button"
              onClick={onRecordFee}
              className="h-9 px-3.5 bg-[#122b54] text-white hover:bg-[#001639] text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[17px]">receipt_long</span>
              <span>+ Record Fee</span>
            </button>
          ) : (
            <Link
              href="/finance?action=record"
              className="h-9 px-3.5 bg-[#122b54] text-white hover:bg-[#001639] text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <span className="material-symbols-outlined text-[17px]">receipt_long</span>
              <span>+ Record Fee</span>
            </Link>
          )}
        </div>

        {/* Notifications & Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <button
            type="button"
            className="relative w-9 h-9 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            title="System Notifications"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#b3272c]"></span>
          </button>
          <div className="w-8 h-8 rounded-full bg-[#001639] flex items-center justify-center text-white text-xs font-bold">
            TA
          </div>
        </div>
      </div>
    </header>
  )
}

