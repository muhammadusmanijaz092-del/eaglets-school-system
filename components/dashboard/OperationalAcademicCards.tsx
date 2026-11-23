'use client'

import React from 'react'
import { ModalType } from './types'

interface OperationalAcademicCardsProps {
  onOpenModal: (type: ModalType) => void
  isAttendanceMarked: boolean
  isStaffAttendanceMarked: boolean
}

export default function OperationalAcademicCards({
  onOpenModal,
  isAttendanceMarked,
  isStaffAttendanceMarked,
}: OperationalAcademicCardsProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#001639] text-[20px]">
            dashboard_customize
          </span>
          <h2 className="font-domine text-lg font-bold text-[#001639]">
            Operational & Academic Insights
          </h2>
        </div>
        <span className="text-xs text-slate-400 font-medium">
          10 Diagnostic Modules
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* 1. Attendance This Month */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h4 className="font-domine text-xs font-bold text-[#001639]">
                Attendance This Month
              </h4>
              <button
                type="button"
                onClick={() => onOpenModal('details_attendance')}
                className="text-[11px] font-bold text-blue-700 hover:text-blue-900 cursor-pointer"
              >
                Details
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">November 2026</p>

            <div className="mt-3 space-y-1 text-[11px] text-slate-600">
              <div className="flex justify-between">
                <span>Marked today:</span>
                <span className="font-semibold text-slate-800 font-mono">
                  {isAttendanceMarked ? 1 : 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Present:</span>
                <span className="font-mono text-emerald-700 font-semibold">
                  {isAttendanceMarked ? 1 : 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Absent:</span>
                <span className="font-mono text-rose-700 font-semibold">0</span>
              </div>
              <div className="flex justify-between">
                <span>Leave:</span>
                <span className="font-mono text-amber-700 font-semibold">0</span>
              </div>
            </div>
          </div>
          <p className="mt-3 text-[10.5px] text-slate-400 italic bg-slate-50 p-1.5 rounded border border-slate-100">
            {isAttendanceMarked
              ? 'Play Group-A marked present for today.'
              : 'No attendance has been marked this month yet.'}
          </p>
        </div>

        {/* 2. Results & Students at Risk */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h4 className="font-domine text-xs font-bold text-[#001639]">
                Results & Students at Risk
              </h4>
              <button
                type="button"
                onClick={() => onOpenModal('details_results')}
                className="text-[11px] font-bold text-blue-700 hover:text-blue-900 cursor-pointer"
              >
                Details
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Exam & Attendance Risk</p>

            <div className="mt-3">
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                No marks yet
              </span>
              <p className="text-[10.5px] text-slate-500 mt-1">
                Results show here once marks are entered.
              </p>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-600 flex justify-between">
            <span>Students at risk:</span>
            <span className="font-bold text-emerald-700 font-mono">0</span>
          </div>
        </div>

        {/* 3. Staff Overview */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h4 className="font-domine text-xs font-bold text-[#001639]">
                Staff Overview
              </h4>
              <button
                type="button"
                onClick={() => onOpenModal('details_staff')}
                className="text-[11px] font-bold text-blue-700 hover:text-blue-900 cursor-pointer"
              >
                Details
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">1 active staff</p>

            <div className="mt-3 space-y-1 text-[11px] text-slate-600">
              <div className="flex justify-between">
                <span>Employees:</span>
                <span className="font-semibold text-slate-800 font-mono">1</span>
              </div>
              <div className="flex justify-between">
                <span>Departments:</span>
                <span className="font-mono text-slate-700">0</span>
              </div>
              <div className="flex justify-between">
                <span>On leave today:</span>
                <span className="font-mono text-slate-700">0</span>
              </div>
              <div className="flex justify-between font-semibold text-slate-800">
                <span>Monthly salary:</span>
                <span className="font-mono text-emerald-700">Rs 26,000</span>
              </div>
            </div>
          </div>
          <p className="mt-3 text-[10px] text-slate-400 border-t border-slate-100 pt-1.5">
            Department breakdown: No department: 1 (100%)
          </p>
        </div>

        {/* 4. Syllabus Coverage */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h4 className="font-domine text-xs font-bold text-[#001639]">
                Syllabus Coverage
              </h4>
              <button
                type="button"
                onClick={() => onOpenModal('details_syllabus')}
                className="text-[11px] font-bold text-blue-700 hover:text-blue-900 cursor-pointer"
              >
                Details
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Scheme of Study</p>

            <div className="mt-3 p-2 bg-slate-50 rounded border border-slate-100 text-[10.5px] text-slate-500">
              Add the syllabus (Academics &rsaquo; Syllabus) to follow it here.
            </div>
          </div>
          <div className="mt-3 text-[10px] text-slate-400 flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px]">info</span>
            <span>Term 1 & Term 2</span>
          </div>
        </div>

        {/* 5. Birthdays Today */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h4 className="font-domine text-xs font-bold text-[#001639]">
                Birthdays Today
              </h4>
              <span className="text-[10px] font-bold text-slate-400 font-mono">0</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">0 students and staff</p>

            <div className="mt-4 p-2 bg-slate-50 rounded border border-slate-100 text-center text-[11px] text-slate-400 font-medium">
              🎂 No Birthdays Today
            </div>
          </div>
          <p className="mt-3 text-[10px] text-slate-400 border-t border-slate-100 pt-1.5">
            Auto-celebration greeting ready
          </p>
        </div>

        {/* 6. Admissions Overview */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h4 className="font-domine text-xs font-bold text-[#001639]">
                Admissions Overview
              </h4>
              <button
                type="button"
                onClick={() => onOpenModal('details_admissions')}
                className="text-[11px] font-bold text-blue-700 hover:text-blue-900 cursor-pointer"
              >
                View All
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">New admissions & pass-outs</p>

            <div className="mt-2.5">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-mono">
                1 this year
              </span>
            </div>

            <div className="mt-2.5 space-y-1 text-[11px] text-slate-600">
              <div className="flex justify-between">
                <span>Admissions Today:</span>
                <span className="font-mono text-slate-800">0</span>
              </div>
              <div className="flex justify-between">
                <span>Monthly Admissions:</span>
                <span className="font-mono text-slate-800 font-semibold">1</span>
              </div>
              <div className="flex justify-between">
                <span>Yearly Admissions:</span>
                <span className="font-mono text-slate-800 font-semibold">1</span>
              </div>
              <div className="flex justify-between">
                <span>Withdrawn / passed out:</span>
                <span className="font-mono text-slate-800">0</span>
              </div>
            </div>
          </div>
        </div>

        {/* 7. Staff Attendance Overview */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h4 className="font-domine text-xs font-bold text-[#001639]">
                Staff Attendance
              </h4>
              <button
                type="button"
                onClick={() => onOpenModal('details_staff_att')}
                className="text-[11px] font-bold text-blue-700 hover:text-blue-900 cursor-pointer"
              >
                View All
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">1 staff · marked today</p>

            <div className="mt-3 p-2 bg-slate-50 rounded border border-slate-100 text-[10.5px] text-slate-500">
              {isStaffAttendanceMarked
                ? 'Anum Zaheer marked Present today.'
                : 'No staff attendance marked today.'}
            </div>
          </div>
          <div className="mt-3 text-[10px] text-slate-400 border-t border-slate-100 pt-1.5 flex justify-between">
            <span>Duty compliance:</span>
            <span className="font-bold font-mono text-slate-700">
              {isStaffAttendanceMarked ? '100%' : '0%'}
            </span>
          </div>
        </div>

        {/* 8. Admissions Funnel */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h4 className="font-domine text-xs font-bold text-[#001639]">
                Admissions Funnel
              </h4>
              <button
                type="button"
                onClick={() => onOpenModal('details_funnel')}
                className="text-[11px] font-bold text-blue-700 hover:text-blue-900 cursor-pointer"
              >
                Details
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">This Month</p>

            <div className="mt-3 text-[10.5px] text-slate-600 space-y-1.5 font-mono">
              <div className="flex justify-between items-center bg-slate-50 px-2 py-1 rounded">
                <span className="font-sans text-slate-500">Inquiries:</span>
                <span className="font-bold">0</span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 px-2 py-1 rounded">
                <span className="font-sans text-slate-500">Entry test:</span>
                <span className="font-bold">0</span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 px-2 py-1 rounded">
                <span className="font-sans text-slate-500">Passed:</span>
                <span className="font-bold">0</span>
              </div>
              <div className="flex justify-between items-center bg-emerald-50 text-emerald-800 px-2 py-1 rounded">
                <span className="font-sans font-semibold">Admitted:</span>
                <span className="font-bold">1</span>
              </div>
            </div>
          </div>
          <p className="mt-2 text-[10px] text-slate-400">
            Inquiry &rarr; admission: &mdash;
          </p>
        </div>

        {/* 9. Unpaid Fees by Age */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h4 className="font-domine text-xs font-bold text-[#001639]">
                Unpaid Fees by Age
              </h4>
              <button
                type="button"
                onClick={() => onOpenModal('details_unpaid_age')}
                className="text-[11px] font-bold text-blue-700 hover:text-blue-900 cursor-pointer"
              >
                Details
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Aging Analysis (Now)</p>

            <div className="mt-3 space-y-1.5 text-[11px] text-slate-600">
              <div className="flex justify-between">
                <span>3+ months unpaid:</span>
                <span className="font-bold font-mono text-emerald-700">Rs 0</span>
              </div>
              <div className="text-[10px] text-slate-400">0 students</div>
              <div className="pt-2 border-t border-slate-100 flex justify-between font-bold text-slate-800">
                <span>Total unpaid:</span>
                <span className="font-mono text-[#b3272c]">Rs 1,700</span>
              </div>
            </div>
          </div>
          <p className="mt-3 text-[10px] text-slate-400 italic">
            late fees included
          </p>
        </div>

        {/* 10. Parents & Families */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h4 className="font-domine text-xs font-bold text-[#001639]">
                Parents & Families
              </h4>
              <button
                type="button"
                onClick={() => onOpenModal('details_parents_families')}
                className="text-[11px] font-bold text-blue-700 hover:text-blue-900 cursor-pointer"
              >
                Details
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Guardian Records (Now)</p>

            <div className="mt-2.5 space-y-1 text-[10.5px] text-slate-600">
              <div className="flex justify-between">
                <span>Linked to parent:</span>
                <span className="font-mono font-semibold">0</span>
              </div>
              <div className="flex justify-between">
                <span>Multiple children:</span>
                <span className="font-mono font-semibold">0</span>
              </div>
              <div className="flex justify-between">
                <span>No parent linked:</span>
                <span className="font-mono font-semibold text-amber-700">1</span>
              </div>
              <div className="flex justify-between">
                <span>Parent accounts:</span>
                <span className="font-mono font-semibold">1</span>
              </div>
            </div>
          </div>
          <p className="mt-2 text-[10px] text-slate-400 border-t border-slate-100 pt-1">
            Account requests waiting: 0
          </p>
        </div>
      </div>
    </div>
  )
}
