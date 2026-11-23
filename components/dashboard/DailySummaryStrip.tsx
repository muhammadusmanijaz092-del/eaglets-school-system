'use client'

import React from 'react'

interface DailySummaryProps {
  incomeToday: number
  incomeMonth: number
  expenseToday: number
  expenseMonth: number
  balanceToday: number
  balanceMonth: number
  studentsPresentCount: number
  totalStudents: number
  staffPresentCount: number
  totalStaff: number
  staffLateCount: number
  staffAbsentCount: number
  collectedToday: number
  unpaidFees: number
  unpaidInvoicesCount: number
  unpaidStudentsCount: number
  onCardClick?: (target: string) => void
}

export default function DailySummaryStrip({
  incomeToday,
  incomeMonth,
  expenseToday,
  expenseMonth,
  balanceToday,
  balanceMonth,
  studentsPresentCount,
  totalStudents,
  staffPresentCount,
  totalStaff,
  staffLateCount,
  staffAbsentCount,
  collectedToday,
  unpaidFees,
  unpaidInvoicesCount,
  unpaidStudentsCount,
  onCardClick,
}: DailySummaryProps) {
  const studentPresentPercent =
    totalStudents > 0 ? Math.round((studentsPresentCount / totalStudents) * 100) : 0

  const staffPresentPercent =
    totalStaff > 0 ? Math.round((staffPresentCount / totalStaff) * 100) : 0

  return (
    <div className="flex flex-col gap-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#001639] text-[20px]">
            analytics
          </span>
          <h2 className="font-domine text-lg font-bold text-[#001639]">
            Daily summary
          </h2>
        </div>
        <span className="text-xs text-slate-400 font-medium">
          Campus Real-time Metrics
        </span>
      </div>

      {/* Row 1 — Income & Expenses Summary Strip (4 small cards / horizontal strip) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Income today */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Income today</span>
            <span className="material-symbols-outlined text-emerald-600 text-[18px]">
              trending_up
            </span>
          </div>
          <div className="mt-2">
            <span className="text-xl font-bold font-mono text-[#001639]">
              Rs {incomeToday.toLocaleString()}
            </span>
            <p className="text-[11px] text-slate-500 mt-0.5">
              This month Rs {incomeMonth.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Expense today */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Expense today</span>
            <span className="material-symbols-outlined text-rose-600 text-[18px]">
              trending_down
            </span>
          </div>
          <div className="mt-2">
            <span className="text-xl font-bold font-mono text-[#001639]">
              Rs {expenseToday.toLocaleString()}
            </span>
            <p className="text-[11px] text-slate-500 mt-0.5">
              This month Rs {expenseMonth.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Balance today */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Balance today</span>
            <span className="material-symbols-outlined text-blue-600 text-[18px]">
              account_balance_wallet
            </span>
          </div>
          <div className="mt-2">
            <span className="text-xl font-bold font-mono text-[#001639]">
              Rs {balanceToday.toLocaleString()}
            </span>
            <p className="text-[11px] text-slate-500 mt-0.5">
              All entries of this campus
            </p>
          </div>
        </div>

        {/* Balance this month */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Balance this month</span>
            <span className="material-symbols-outlined text-purple-600 text-[18px]">
              calendar_month
            </span>
          </div>
          <div className="mt-2">
            <span className="text-xl font-bold font-mono text-[#001639]">
              Rs {balanceMonth.toLocaleString()}
            </span>
            <p className="text-[11px] text-slate-500 mt-0.5">
              November 2026
            </p>
          </div>
        </div>
      </div>

      {/* Row 2 — 4 Highlight KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Students present today */}
        <div
          onClick={() => onCardClick?.('student_attendance')}
          className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Students present today
            </span>
            <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[19px]">school</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-[#001639] font-mono">
                {studentPresentPercent}%
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              {studentsPresentCount} of {totalStudents} students · {studentPresentPercent}%
            </p>
          </div>
          {/* Progress bar */}
          <div className="w-full h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${studentPresentPercent}%` }}
            />
          </div>
        </div>

        {/* Staff in today */}
        <div
          onClick={() => onCardClick?.('staff_attendance')}
          className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Staff in today
            </span>
            <span className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[19px]">badge</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-[#001639] font-mono">
                {staffPresentCount}/{totalStaff}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              {staffLateCount} late · {staffAbsentCount} absent · {staffPresentPercent}%
            </p>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-teal-600 rounded-full transition-all duration-500"
              style={{ width: `${staffPresentPercent}%` }}
            />
          </div>
        </div>

        {/* Collected today */}
        <div
          onClick={() => onCardClick?.('fee_payment')}
          className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Collected today
            </span>
            <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[19px]">payments</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-[#001639] font-mono">
                Rs {collectedToday.toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Fee and other income
            </p>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-emerald-600 rounded-full transition-all duration-500"
              style={{ width: collectedToday > 0 ? '100%' : '0%' }}
            />
          </div>
        </div>

        {/* Unpaid Fees */}
        <div
          onClick={() => onCardClick?.('details_unpaid_age')}
          className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Unpaid Fees
            </span>
            <span className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[19px]">money_off</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-[#b3272c] font-mono">
                Rs {unpaidFees.toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              {unpaidInvoicesCount} invoices · {unpaidStudentsCount} students · 0%
            </p>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-[#b3272c] rounded-full transition-all duration-500"
              style={{ width: '100%' }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
