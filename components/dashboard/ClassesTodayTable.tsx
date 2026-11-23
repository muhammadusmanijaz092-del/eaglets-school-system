'use client'

import React, { useState } from 'react'

interface ClassRowData {
  id: string
  name: string
  students: number
  present: number
  absent: number
  onLeave: number
  notMarked: number
  expectedFee: number
  feeGenerated: number
  paidAmount: number
  balance: number
  newStudents: number
  withdrawn: number
}

interface ClassesTodayTableProps {
  isAttendanceMarked: boolean
  paidAmount: number
  onMarkAttendanceClick?: () => void
}

export default function ClassesTodayTable({
  isAttendanceMarked,
  paidAmount,
  onMarkAttendanceClick,
}: ClassesTodayTableProps) {
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table')
  const [selectedFilter, setSelectedFilter] = useState('All')

  const presentCount = isAttendanceMarked ? 1 : 0
  const notMarkedCount = isAttendanceMarked ? 0 : 1
  const balanceAmount = Math.max(0, 2700 - paidAmount)
  const recoveryPercent = Math.round((paidAmount / 2700) * 100)

  const classData: ClassRowData[] = [
    {
      id: 'pg',
      name: 'Play Group',
      students: 1,
      present: presentCount,
      absent: 0,
      onLeave: 0,
      notMarked: notMarkedCount,
      expectedFee: 2700,
      feeGenerated: 2700,
      paidAmount: paidAmount,
      balance: balanceAmount,
      newStudents: 1,
      withdrawn: 0,
    },
  ]

  const filteredData =
    selectedFilter === 'All'
      ? classData
      : classData.filter((c) => c.name.toLowerCase().includes(selectedFilter.toLowerCase()))

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
      {/* Top Header & Toggles */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#001639] text-[20px]">
              class
            </span>
            <h3 className="font-domine text-sm sm:text-base font-bold text-[#001639]">
              Classes Today
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Strength, attendance and this month&apos;s fees per class
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Filter dropdown */}
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="h-8 px-2.5 bg-slate-50 border border-slate-200 text-xs rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
          >
            <option value="All">Filter: All Classes</option>
            <option value="Play Group">Play Group</option>
            <option value="Primary">Primary Wing</option>
            <option value="Middle">Middle Wing</option>
          </select>

          {/* Cards / Table toggle */}
          <div className="inline-flex p-0.5 bg-slate-100 rounded-lg border border-slate-200/60 text-xs">
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'cards'
                  ? 'bg-white text-[#001639] shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">grid_view</span>
              <span>Cards</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'table'
                  ? 'bg-white text-[#001639] shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">table_rows</span>
              <span>Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary Strip */}
      <div className="px-4 py-2.5 bg-slate-50/80 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
        <div className="flex items-center gap-2 flex-wrap">
          <span>
            Students: <strong className="text-slate-800">1</strong> · 1 classes
          </span>
          <span className="text-slate-300">|</span>
          <span>
            Present Today: <strong className="text-emerald-700">{presentCount}</strong> · 0 absent · 0 on leave
          </span>
        </div>
        <div className="flex items-center gap-2 flex-wrap font-mono text-[11.5px]">
          <span>
            Generated this month: <strong className="text-slate-800">Rs 2,700</strong> · Expected Rs 2,700
          </span>
          <span className="text-slate-300">|</span>
          <span>
            Paid Amount: <strong className="text-emerald-700">Rs {paidAmount.toLocaleString()}</strong> · Balance <strong className="text-rose-700">Rs {balanceAmount.toLocaleString()}</strong>
          </span>
        </div>
      </div>

      {/* Table / Cards View */}
      {viewMode === 'table' ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4">Class</th>
                <th className="py-2.5 px-2 text-center">Students</th>
                <th className="py-2.5 px-2 text-center">Present</th>
                <th className="py-2.5 px-2 text-center">Absent</th>
                <th className="py-2.5 px-2 text-center">On Leave</th>
                <th className="py-2.5 px-2 text-center">Not marked</th>
                <th className="py-2.5 px-2 text-center">Attendance %</th>
                <th className="py-2.5 px-3">Expected fee</th>
                <th className="py-2.5 px-3">Fee generated</th>
                <th className="py-2.5 px-3">Paid Amount</th>
                <th className="py-2.5 px-3">Balance</th>
                <th className="py-2.5 px-2 text-center">Recovery %</th>
                <th className="py-2.5 px-2 text-center">New</th>
                <th className="py-2.5 px-2 text-center">Withdrawn</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredData.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-2.5 px-4 font-bold text-[#001639] flex items-center gap-2">
                    <span>{row.name}</span>
                    {row.notMarked > 0 && (
                      <button
                        type="button"
                        onClick={onMarkAttendanceClick}
                        className="text-[10px] text-rose-600 hover:text-rose-800 underline font-semibold cursor-pointer"
                      >
                        (Mark)
                      </button>
                    )}
                  </td>
                  <td className="py-2.5 px-2 text-center font-mono font-medium">{row.students}</td>
                  <td className="py-2.5 px-2 text-center font-mono font-medium text-emerald-700">
                    {row.present}
                  </td>
                  <td className="py-2.5 px-2 text-center font-mono font-medium text-rose-700">
                    {row.absent}
                  </td>
                  <td className="py-2.5 px-2 text-center font-mono font-medium text-amber-700">
                    {row.onLeave}
                  </td>
                  <td className="py-2.5 px-2 text-center font-mono font-medium text-slate-500">
                    {row.notMarked}
                  </td>
                  <td className="py-2.5 px-2 text-center font-mono font-semibold">
                    {row.notMarked > 0 ? '—' : `${Math.round((row.present / row.students) * 100)}%`}
                  </td>
                  <td className="py-2.5 px-3 font-mono">Rs {row.expectedFee.toLocaleString()}</td>
                  <td className="py-2.5 px-3 font-mono">Rs {row.feeGenerated.toLocaleString()}</td>
                  <td className="py-2.5 px-3 font-mono font-semibold text-emerald-700">
                    Rs {row.paidAmount.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 font-mono font-semibold text-rose-700">
                    Rs {row.balance.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-2 text-center font-mono font-semibold">
                    {recoveryPercent}%
                  </td>
                  <td className="py-2.5 px-2 text-center font-mono font-semibold text-emerald-700">
                    +{row.newStudents}
                  </td>
                  <td className="py-2.5 px-2 text-center font-mono font-medium text-slate-500">
                    {row.withdrawn}
                  </td>
                </tr>
              ))}
            </tbody>
            {/* Total Row */}
            <tfoot className="bg-slate-50/90 font-bold text-slate-900 border-t border-slate-200">
              <tr>
                <td className="py-2.5 px-4">Total</td>
                <td className="py-2.5 px-2 text-center font-mono">1</td>
                <td className="py-2.5 px-2 text-center font-mono text-emerald-700">
                  {presentCount}
                </td>
                <td className="py-2.5 px-2 text-center font-mono text-rose-700">0</td>
                <td className="py-2.5 px-2 text-center font-mono text-amber-700">0</td>
                <td className="py-2.5 px-2 text-center font-mono text-slate-500">
                  {notMarkedCount}
                </td>
                <td className="py-2.5 px-2 text-center font-mono">
                  {notMarkedCount > 0 ? '—' : '100%'}
                </td>
                <td className="py-2.5 px-3 font-mono">Rs 2,700</td>
                <td className="py-2.5 px-3 font-mono">Rs 2,700</td>
                <td className="py-2.5 px-3 font-mono text-emerald-700">
                  Rs {paidAmount.toLocaleString()}
                </td>
                <td className="py-2.5 px-3 font-mono text-rose-700">
                  Rs {balanceAmount.toLocaleString()}
                </td>
                <td className="py-2.5 px-2 text-center font-mono">—</td>
                <td className="py-2.5 px-2 text-center font-mono text-emerald-700">1</td>
                <td className="py-2.5 px-2 text-center font-mono">0</td>
              </tr>
            </tfoot>
          </table>
        </div>
      ) : (
        /* Cards View */
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredData.map((row) => (
            <div
              key={row.id}
              className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/40 hover:bg-white hover:shadow-xs transition-all"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-domine font-bold text-sm text-[#001639]">
                  {row.name}
                </span>
                <span className="text-xs font-mono font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                  {row.students} Students
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-3 text-center text-xs">
                <div className="bg-white p-2 rounded border border-slate-100">
                  <span className="text-slate-400 text-[10px]">Present</span>
                  <div className="font-bold font-mono text-emerald-700 mt-0.5">
                    {row.present}
                  </div>
                </div>
                <div className="bg-white p-2 rounded border border-slate-100">
                  <span className="text-slate-400 text-[10px]">Not Marked</span>
                  <div className="font-bold font-mono text-slate-500 mt-0.5">
                    {row.notMarked}
                  </div>
                </div>
                <div className="bg-white p-2 rounded border border-slate-100">
                  <span className="text-slate-400 text-[10px]">Recovery</span>
                  <div className="font-bold font-mono text-amber-700 mt-0.5">
                    {recoveryPercent}%
                  </div>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500">Fee Balance:</span>
                <span className="font-bold text-rose-700">Rs {row.balance.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer Controls & Note */}
      <div className="p-4 bg-slate-50/60 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
        <div className="flex items-center gap-4">
          <span>Rows: <strong className="text-slate-700">25</strong></span>
          <span>1–1 of 1</span>
        </div>
        <p className="text-[11px] text-slate-400">
          <strong>Note:</strong> Attendance: today. Fees: this month (Paid includes discounts; Balance = generated − paid). New / Withdrawn: This month.
        </p>
      </div>
    </div>
  )
}
