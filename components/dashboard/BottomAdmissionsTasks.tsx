'use client'

import React from 'react'
import { StudentRecord } from './types'

interface BottomAdmissionsTasksProps {
  students: StudentRecord[]
  onViewAllAdmissions?: () => void
  onViewAllTasks?: () => void
  onStudentClick?: (student: StudentRecord) => void
}

export default function BottomAdmissionsTasks({
  students,
  onViewAllAdmissions,
  onViewAllTasks,
  onStudentClick,
}: BottomAdmissionsTasksProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Latest Admissions */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600 text-[20px]">
                how_to_reg
              </span>
              <h3 className="font-domine text-sm sm:text-base font-bold text-[#001639]">
                Latest Admissions
              </h3>
            </div>
            <button
              type="button"
              onClick={onViewAllAdmissions}
              className="text-xs font-bold text-blue-700 hover:text-blue-900 cursor-pointer"
            >
              View All
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Total admissions this month so far: {students.length}
          </p>

          <div className="mt-4 divide-y divide-slate-100">
            {students.slice(0, 5).map((student) => (
              <div
                key={student.id}
                onClick={() => onStudentClick?.(student)}
                className="py-3 flex items-center justify-between hover:bg-slate-50/70 p-2 rounded-lg cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-sm shadow-2xs">
                    {student.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#001639] hover:text-[#b3272c] transition-colors">
                      {student.name}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                      {student.roll_no} · {student.class_name}-{student.section}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-500 font-medium">
                    {student.admission_date}
                  </span>
                  <div className="text-[10px] text-emerald-600 font-bold mt-0.5">
                    Verified B-Form
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
          Enrolled in Academic Session 2026–2027
        </div>
      </div>

      {/* Tasks Overview */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-purple-600 text-[20px]">
                task_alt
              </span>
              <h3 className="font-domine text-sm sm:text-base font-bold text-[#001639]">
                Tasks Overview
              </h3>
            </div>
            <button
              type="button"
              onClick={onViewAllTasks}
              className="text-xs font-bold text-blue-700 hover:text-blue-900 cursor-pointer"
            >
              View All
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Tasks of this campus
          </p>

          {/* 4 Task Counters */}
          <div className="grid grid-cols-4 gap-2 mt-4">
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-center">
              <div className="text-xs text-slate-500 font-medium">Pending</div>
              <div className="text-lg font-bold font-mono text-amber-700 mt-1">0</div>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-center">
              <div className="text-xs text-slate-500 font-medium">Processing</div>
              <div className="text-lg font-bold font-mono text-blue-700 mt-1">0</div>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-center">
              <div className="text-xs text-slate-500 font-medium">Completed</div>
              <div className="text-lg font-bold font-mono text-emerald-700 mt-1">0</div>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-center">
              <div className="text-xs text-slate-500 font-medium">Returned</div>
              <div className="text-lg font-bold font-mono text-rose-700 mt-1">0</div>
            </div>
          </div>

          {/* Empty state */}
          <div className="mt-6 py-6 px-4 bg-slate-50/70 rounded-lg border border-dashed border-slate-200 text-center">
            <span className="material-symbols-outlined text-slate-300 text-[28px] mb-1">
              assignment_turned_in
            </span>
            <p className="text-xs text-slate-500 font-medium">No tasks yet.</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Campus workflows and staff tickets will display here.
            </p>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
          Task Delegation & Campus Workflows
        </div>
      </div>
    </div>
  )
}
