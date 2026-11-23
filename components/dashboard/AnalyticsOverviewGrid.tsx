'use client'

import React, { useState } from 'react'

interface AnalyticsOverviewGridProps {
  incomeToday: number
  expenseToday: number
  incomeMonth: number
  expenseMonth: number
  activeStudents: number
  boysCount: number
  girlsCount: number
  notSetCount: number
  presentStudentsToday: number
  parentsCount: number
  staffCount: number
  staffMaleCount: number
  staffFemaleCount: number
  recoveredMonth: number
  stillDueMonth: number
  collectedAnyMonth: number
  thisMonthUnpaid: number
  previousArrears: number
  totalReceivable: number
  classesNotMarkedCount: number
  studentsInNotMarkedClasses: number
  staffNotMarkedCount: number
  totalStaff: number
  isAttendanceMarked: boolean
  onMarkAttendance: () => void
  onMarkStaffAttendance: () => void
}

export default function AnalyticsOverviewGrid({
  incomeToday,
  expenseToday,
  incomeMonth,
  expenseMonth,
  activeStudents,
  boysCount,
  girlsCount,
  notSetCount,
  presentStudentsToday,
  parentsCount,
  staffCount,
  staffMaleCount,
  staffFemaleCount,
  recoveredMonth,
  stillDueMonth,
  collectedAnyMonth,
  thisMonthUnpaid,
  previousArrears,
  totalReceivable,
  classesNotMarkedCount,
  studentsInNotMarkedClasses,
  staffNotMarkedCount,
  totalStaff,
  isAttendanceMarked,
  onMarkAttendance,
  onMarkStaffAttendance,
}: AnalyticsOverviewGridProps) {
  const [comparisonTab, setComparisonTab] = useState<'today' | 'month' | 'year'>('today')

  const currentIncome = comparisonTab === 'today' ? incomeToday : comparisonTab === 'month' ? incomeMonth : incomeMonth * 12
  const currentExpense = comparisonTab === 'today' ? expenseToday : comparisonTab === 'month' ? expenseMonth : expenseMonth * 12
  const currentProfit = currentIncome - currentExpense

  const presentPercentage = activeStudents > 0 ? Math.round((presentStudentsToday / activeStudents) * 100) : 0
  const recoveryPercentage = totalReceivable > 0 ? Math.round((recoveredMonth / (recoveredMonth + stillDueMonth)) * 100) : 37

  return (
    <div className="flex flex-col gap-5">
      {/* Entity Count Cards (4-Card Strip) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Active Students */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Active Students
            </span>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              Registered
            </span>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-[#001639]">
              {activeStudents}
            </span>
          </div>
          <div className="mt-1.5 text-[11px] text-slate-500 flex items-center gap-1.5 flex-wrap">
            <span>Boys: <strong className="text-slate-700">{boysCount}</strong></span>
            <span>·</span>
            <span>Girls: <strong className="text-slate-700">{girlsCount}</strong></span>
            <span>·</span>
            <span>Not set: <strong className="text-slate-700">{notSetCount}</strong></span>
          </div>
        </div>

        {/* Present Students Today */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Present Students Today
            </span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              {presentPercentage}%
            </span>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-[#001639]">
              {presentStudentsToday}
            </span>
          </div>
          <div className="mt-1.5 text-[11px] text-slate-500">
            {presentPercentage}% of active students
          </div>
        </div>

        {/* Parents */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Parents
            </span>
            <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
              Guardian Hub
            </span>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-[#001639]">
              {parentsCount}
            </span>
          </div>
          <div className="mt-1.5 text-[11px] text-slate-500 truncate">
            Total registered parents · 0 passed out students
          </div>
        </div>

        {/* Staff */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Staff
            </span>
            <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">
              Faculty & Admin
            </span>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-[#001639]">
              {staffCount}
            </span>
          </div>
          <div className="mt-1.5 text-[11px] text-slate-500 flex items-center gap-1.5">
            <span>Male: <strong className="text-slate-700">{staffMaleCount}</strong></span>
            <span>·</span>
            <span>Female: <strong className="text-slate-700">{staffFemaleCount}</strong></span>
          </div>
        </div>
      </div>

      {/* Grid of A, C, D, E */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* A. Income & Expenses Comparison Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-domine text-sm font-bold text-[#001639]">
                Income & Expenses
              </h3>
              <div className="inline-flex p-0.5 bg-slate-100 rounded-md text-[10.5px]">
                {(['today', 'month', 'year'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setComparisonTab(t)}
                    className={`px-2 py-0.5 rounded capitalize font-medium cursor-pointer transition-colors ${
                      comparisonTab === t
                        ? 'bg-white text-[#001639] font-bold shadow-2xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {t === 'today' ? 'Today' : t === 'month' ? 'This month' : 'This year'}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Fees and other income, against your expenses
            </p>

            <div className="mt-4 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Income:
                </span>
                <span className="font-bold font-mono text-emerald-700">
                  Rs {currentIncome.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  Expense:
                </span>
                <span className="font-bold font-mono text-rose-700">
                  Rs {currentExpense.toLocaleString()}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-700">Profit:</span>
                <span className={`font-mono ${currentProfit >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                  Rs {currentProfit.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-3 text-[10px] text-slate-400">
            Real-time ledger updates
          </div>
        </div>

        {/* C. Student Strength (This Month) */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-domine text-sm font-bold text-[#001639]">
                Student Strength
              </h3>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                +1 net change
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {activeStudents} active students now
            </p>

            <div className="mt-4 space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-600">
                <span>New admissions:</span>
                <span className="font-bold font-mono text-[#001639]">1</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Withdrawn:</span>
                <span className="font-bold font-mono text-[#001639]">0</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Deactivated Now:</span>
                <span className="font-bold font-mono text-[#001639]">0</span>
              </div>
              <div className="pt-2 border-t border-slate-100 flex justify-between items-center font-semibold text-slate-800">
                <span>Net change:</span>
                <span className="text-emerald-700 font-mono">+1 (100.0%)</span>
              </div>
            </div>
          </div>
          <div className="mt-3 text-[10px] text-slate-400">
            November 2026 Cohort
          </div>
        </div>

        {/* D. Fee Recovery (This Month) */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-domine text-sm font-bold text-[#001639]">
                Fee Recovery
              </h3>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                This Month
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Of the fees generated for the period
            </p>

            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-xl font-bold font-mono text-[#001639]">
                {recoveryPercentage}% recovered
              </span>
            </div>

            <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-amber-600 rounded-full transition-all duration-500"
                style={{ width: `${recoveryPercentage}%` }}
              />
            </div>

            <div className="mt-3 space-y-1.5 text-[11px] text-slate-600">
              <div className="flex justify-between">
                <span>Recovered:</span>
                <span className="font-semibold font-mono text-emerald-700">
                  Rs {recoveredMonth.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Still due:</span>
                <span className="font-semibold font-mono text-rose-700">
                  Rs {stillDueMonth.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Collected (any month):</span>
                <span className="font-mono text-slate-700">
                  Rs {collectedAnyMonth.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>This month unpaid Now:</span>
                <span className="font-semibold font-mono text-rose-700">
                  Rs {thisMonthUnpaid.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Previous arrears Now:</span>
                <span className="font-mono text-slate-700">
                  Rs {previousArrears.toLocaleString()}
                </span>
              </div>
              <div className="pt-1.5 border-t border-slate-100 flex justify-between font-bold text-slate-800">
                <span>Total receivable Now:</span>
                <span className="font-mono text-[#b3272c]">
                  Rs {totalReceivable.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* E. Attendance Not Marked (Today) */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-domine text-sm font-bold text-[#001639]">
                Attendance Not Marked
              </h3>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                isAttendanceMarked
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-rose-50 text-rose-700'
              }`}>
                {isAttendanceMarked ? 'Completed' : 'Today'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Classes that have not marked attendance today
            </p>

            <div className="mt-3 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Classes not marked:</span>
                <span className="font-bold font-mono text-slate-800">
                  {classesNotMarkedCount} ({studentsInNotMarkedClasses} students)
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Staff not marked:</span>
                <span className="font-bold font-mono text-slate-800">
                  {staffNotMarkedCount} (of {totalStaff} staff)
                </span>
              </div>
            </div>

            {/* Class Item */}
            <div className="mt-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs">
              <div className="flex items-center justify-between font-bold text-slate-800">
                <span>Play Group-A</span>
                {!isAttendanceMarked ? (
                  <button
                    type="button"
                    onClick={onMarkAttendance}
                    className="text-[10px] bg-[#b3272c] hover:bg-[#88131b] text-white px-2 py-0.5 rounded font-bold cursor-pointer transition-colors"
                  >
                    Mark Now
                  </button>
                ) : (
                  <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">check</span> Marked
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Present {isAttendanceMarked ? 1 : 0} · Absent 0 · Leave 0
              </div>
              <p className="text-[10px] text-slate-400 mt-1 italic">
                classes not marked count as neither.
              </p>
            </div>
          </div>

          {!isAttendanceMarked && (
            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={onMarkStaffAttendance}
                className="text-xs text-blue-700 hover:text-blue-900 font-bold cursor-pointer"
              >
                Mark Staff Attendance &rarr;
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
