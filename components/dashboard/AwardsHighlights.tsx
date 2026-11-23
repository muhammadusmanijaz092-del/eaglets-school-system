'use client'

import React from 'react'

interface AwardsHighlightsProps {
  onStudentClick?: () => void
}

export default function AwardsHighlights({ onStudentClick }: AwardsHighlightsProps) {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs">
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#f5bc71] text-[22px]">
            military_tech
          </span>
          <h3 className="font-domine text-sm font-bold text-[#001639] uppercase tracking-wider">
            Awards & Highlights
          </h3>
        </div>
        <span className="text-xs text-slate-400 font-medium">October 2026 Period</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* 1. St. Monthly Attendance Award */}
        <div className="p-3.5 rounded-lg bg-slate-50/80 border border-slate-100 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
            St. Monthly Attendance Award
          </span>
          <div className="mt-2 text-sm font-bold text-slate-400 font-mono">
            N/A
          </div>
          <span className="text-[10px] text-slate-400 mt-1">
            Minimum 98% required
          </span>
        </div>

        {/* 2. Staff Monthly Att. Award */}
        <div className="p-3.5 rounded-lg bg-slate-50/80 border border-slate-100 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
            Staff Monthly Att. Award
          </span>
          <div className="mt-2 text-sm font-bold text-slate-400 font-mono">
            N/A
          </div>
          <span className="text-[10px] text-slate-400 mt-1">
            Zero tardiness record
          </span>
        </div>

        {/* 3. Student with Highest Dues */}
        <div
          onClick={onStudentClick}
          className="p-3.5 rounded-lg bg-rose-50/60 border border-rose-200/80 flex flex-col justify-between cursor-pointer hover:bg-rose-50 transition-colors"
        >
          <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wide flex items-center justify-between">
            <span>Highest Dues</span>
            <span className="material-symbols-outlined text-[15px] text-rose-600">
              priority_high
            </span>
          </span>
          <div className="mt-1">
            <div className="text-xs font-bold text-slate-800 truncate" title="Muhammad Ahmed ahmed Din">
              Muhammad Ahmed ahmed Din
            </div>
            <div className="text-[10.5px] text-slate-500 font-mono mt-0.5">
              Roll/ID: 121
            </div>
          </div>
          <div className="mt-1 font-bold text-rose-700 font-mono text-xs">
            Dues: Rs 1,700
          </div>
        </div>

        {/* 4. Best Performance (Teacher) */}
        <div className="p-3.5 rounded-lg bg-slate-50/80 border border-slate-100 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
            Best Performance (Teacher)
          </span>
          <div className="mt-2 text-sm font-bold text-slate-400 font-mono">
            N/A
          </div>
          <span className="text-[10px] text-slate-400 mt-1">
            Curriculum milestone pacing
          </span>
        </div>

        {/* 5. Weak Performance (Teacher) */}
        <div className="p-3.5 rounded-lg bg-slate-50/80 border border-slate-100 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
            Weak Performance (Teacher)
          </span>
          <div className="mt-2 text-sm font-bold text-slate-400 font-mono">
            N/A
          </div>
          <span className="text-[10px] text-slate-400 mt-1">
            Syllabus delay alerts
          </span>
        </div>
      </div>
    </div>
  )
}
