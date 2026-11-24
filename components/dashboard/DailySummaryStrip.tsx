'use client'

import React from 'react'

interface DailySummaryProps {
  studentsPresentCount: number
  totalStudents: number
  boysCount: number
  girlsCount: number
  staffPresentCount: number
  totalStaff: number
  staffLateCount: number
  staffAbsentCount: number
  collectedToday: number
  recoveredMonth: number
  balanceToday: number
  unpaidFees: number
  unpaidInvoicesCount: number
  unpaidStudentsCount: number
  onCardClick?: (target: string) => void
}

export default function DailySummaryStrip({
  studentsPresentCount,
  totalStudents,
  boysCount,
  girlsCount,
  staffPresentCount,
  totalStaff,
  staffLateCount,
  staffAbsentCount,
  collectedToday,
  recoveredMonth,
  balanceToday,
  unpaidFees,
  unpaidInvoicesCount,
  unpaidStudentsCount,
  onCardClick,
}: DailySummaryProps) {
  const studentPresentPercent =
    totalStudents > 0 ? Math.round((studentsPresentCount / totalStudents) * 100) : 0

  const staffPresentPercent =
    totalStaff > 0 ? Math.round((staffPresentCount / totalStaff) * 100) : 0

  const totalGeneratedEstimated = recoveredMonth + unpaidFees
  const recoveryPercentage =
    totalGeneratedEstimated > 0
      ? Math.round((recoveredMonth / totalGeneratedEstimated) * 100)
      : 37

  return (
    <div className="flex flex-col gap-3">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#001639] text-[20px]">
            analytics
          </span>
          <h2 className="font-domine text-sm sm:text-base font-bold text-[#001639] uppercase tracking-wider">
            Campus Real-time Metrics
          </h2>
        </div>
        <span className="text-xs text-slate-400 font-medium hidden sm:inline">
          Zeenat Ilyas Campus · Live Telemetry
        </span>
      </div>

      {/* 4 Clean, Non-Redundant Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Students Present Today */}
        <div
          onClick={() => onCardClick?.('student_attendance')}
          className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs hover:border-blue-300 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Students Present Today
              </span>
              <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center group-hover:scale-105 transition-transform shadow-2xs">
                <span className="material-symbols-outlined text-[19px]">school</span>
              </span>
            </div>

            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-slate-900">
                {studentPresentPercent}%
              </span>
              <span className="text-xs text-slate-500 font-medium">
                ({studentsPresentCount} of {totalStudents} active students)
              </span>
            </div>
          </div>

          {/* Subtle Sub-pills for Boys and Girls */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">
              Boys: {boysCount}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">
              Girls: {girlsCount}
            </span>
          </div>
        </div>

        {/* Card 2: Staff In Today */}
        <div
          onClick={() => onCardClick?.('staff_attendance')}
          className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs hover:border-blue-300 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Staff In Today
              </span>
              <span className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center group-hover:scale-105 transition-transform shadow-2xs">
                <span className="material-symbols-outlined text-[19px]">badge</span>
              </span>
            </div>

            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-slate-900">
                {staffPresentCount} / {totalStaff}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                ({staffPresentPercent}%)
              </span>
            </div>
          </div>

          {/* Inline Status Counts */}
          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 font-medium flex items-center gap-1.5">
            <span>{staffLateCount} late</span>
            <span className="text-slate-300">•</span>
            <span>{staffAbsentCount} absent</span>
          </div>
        </div>

        {/* Card 3: Collected Today */}
        <div
          onClick={() => onCardClick?.('fee_payment')}
          className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs hover:border-blue-300 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Collected Today
              </span>
              <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform shadow-2xs">
                <span className="material-symbols-outlined text-[19px]">payments</span>
              </span>
            </div>

            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-slate-900">
                Rs {collectedToday.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Clean Footer Line showing This Month and Balance Today */}
          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 flex items-center justify-between flex-wrap gap-1">
            <span>
              This Month: <strong className="text-emerald-700 font-mono">Rs {recoveredMonth.toLocaleString()}</strong>
            </span>
            <span className="text-slate-300">•</span>
            <span>
              Balance Today: <strong className="text-slate-800 font-mono">Rs {balanceToday.toLocaleString()}</strong>
            </span>
          </div>
        </div>

        {/* Card 4: Unpaid Fees (Receivable) */}
        <div
          onClick={() => onCardClick?.('details_unpaid_age')}
          className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs hover:border-blue-300 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Unpaid Fees (Receivable)
              </span>
              <span className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center group-hover:scale-105 transition-transform shadow-2xs">
                <span className="material-symbols-outlined text-[19px]">receipt_long</span>
              </span>
            </div>

            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-[#b3272c]">
                Rs {unpaidFees.toLocaleString()}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                ({unpaidInvoicesCount} invoice • {unpaidStudentsCount} student)
              </span>
            </div>
          </div>

          {/* Subtle Progress Indicator */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5 font-medium">
              <span>Recovery Progress</span>
              <span className="text-amber-700 font-bold font-mono">{recoveryPercentage}% recovered this month</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-600 rounded-full transition-all duration-500"
                style={{ width: `${recoveryPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
