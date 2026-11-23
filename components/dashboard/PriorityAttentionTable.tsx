'use client'

import React from 'react'

interface PriorityAttentionTableProps {
  isAttendanceMarked: boolean
  isStaffAttendanceMarked: boolean
  onOpenAttendanceModal: () => void
  onOpenStaffAttendanceModal: () => void
  onActionClick: (issue: string) => void
}

export default function PriorityAttentionTable({
  isAttendanceMarked,
  isStaffAttendanceMarked,
  onOpenAttendanceModal,
  onOpenStaffAttendanceModal,
  onActionClick,
}: PriorityAttentionTableProps) {
  const priorityItems = [
    {
      id: 'student_att',
      issue: 'Attendance not marked',
      count: isAttendanceMarked ? '—' : '1',
      target: isAttendanceMarked ? '—' : 'Play Group-A',
      assignedTo: 'Class teachers',
      due: 'Today',
      isOverdue: !isAttendanceMarked,
      action: !isAttendanceMarked,
      handler: onOpenAttendanceModal,
    },
    {
      id: 'staff_att',
      issue: 'Staff attendance not marked',
      count: isStaffAttendanceMarked ? '—' : '1',
      target: isStaffAttendanceMarked ? '—' : 'Front desk',
      assignedTo: 'Front desk',
      due: 'Today',
      isOverdue: !isStaffAttendanceMarked,
      action: !isStaffAttendanceMarked,
      handler: onOpenStaffAttendanceModal,
    },
    {
      id: 'fees_3m',
      issue: 'Fees unpaid for 3+ months',
      count: '—',
      target: '—',
      assignedTo: 'Accounts',
      due: 'This week',
      isOverdue: false,
      action: false,
      handler: () => onActionClick('Fees unpaid for 3+ months'),
    },
    {
      id: 'academic_risk',
      issue: 'Students at academic risk',
      count: '—',
      target: '—',
      assignedTo: 'Coordinators',
      due: 'This week',
      isOverdue: false,
      action: false,
      handler: () => onActionClick('Students at academic risk'),
    },
    {
      id: 'syllabus_lag',
      issue: 'Sections behind the syllabus plan',
      count: '—',
      target: '—',
      assignedTo: 'Coordinators',
      due: 'Before exams',
      isOverdue: false,
      action: false,
      handler: () => onActionClick('Sections behind the syllabus plan'),
    },
    {
      id: 'parent_complaints',
      issue: 'Parent complaints',
      count: '—',
      target: '—',
      assignedTo: 'Principal',
      due: 'Within 3 days',
      isOverdue: false,
      action: false,
      handler: () => onActionClick('Parent complaints'),
    },
    {
      id: 'admission_req',
      issue: 'Admission requests',
      count: '—',
      target: '—',
      assignedTo: 'Admissions desk',
      due: 'Today',
      isOverdue: false,
      action: false,
      handler: () => onActionClick('Admission requests'),
    },
    {
      id: 'leave_req',
      issue: 'Leave requests',
      count: '—',
      target: '—',
      assignedTo: 'You',
      due: 'Today',
      isOverdue: false,
      action: false,
      handler: () => onActionClick('Leave requests'),
    },
    {
      id: 'inquiries_follow',
      issue: 'New inquiries to follow up',
      count: '—',
      target: '—',
      assignedTo: 'Admissions desk',
      due: 'This week',
      isOverdue: false,
      action: false,
      handler: () => onActionClick('New inquiries to follow up'),
    },
    {
      id: 'parent_acct_req',
      issue: 'Parent account requests',
      count: '—',
      target: '—',
      assignedTo: 'Office',
      due: 'This week',
      isOverdue: false,
      action: false,
      handler: () => onActionClick('Parent account requests'),
    },
    {
      id: 'pending_tasks',
      issue: 'Pending tasks',
      count: '—',
      target: '—',
      assignedTo: 'Assigned staff',
      due: 'As set',
      isOverdue: false,
      action: false,
      handler: () => onActionClick('Pending tasks'),
    },
  ]

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50/50">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#b3272c] text-[20px]">
              notification_important
            </span>
            <h3 className="font-domine text-sm sm:text-base font-bold text-[#001639]">
              Priority Attention Action Items
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            What is waiting, who acts and by when — click to act
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 self-start sm:self-auto">
          11 Checkpoints
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 text-slate-500 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-200/70">
            <tr>
              <th className="py-3 px-4">Issue</th>
              <th className="py-3 px-3 text-center">Count</th>
              <th className="py-3 px-3">Target/Dept</th>
              <th className="py-3 px-3">Assigned To</th>
              <th className="py-3 px-3">Due</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {priorityItems.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-slate-50/70 transition-colors"
              >
                <td className="py-2.5 px-4 font-semibold text-slate-800">
                  {item.issue}
                </td>
                <td className="py-2.5 px-3 text-center font-mono">
                  {item.count}
                </td>
                <td className="py-2.5 px-3 text-slate-600">
                  {item.target}
                </td>
                <td className="py-2.5 px-3 text-slate-600 font-medium">
                  {item.assignedTo}
                </td>
                <td className="py-2.5 px-3 text-slate-500 font-medium">
                  {item.due}
                </td>
                <td className="py-2.5 px-3">
                  {item.isOverdue ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] font-bold bg-rose-50 text-[#b3272c] border border-rose-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#b3272c] animate-pulse"></span>
                      Overdue
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Clear
                    </span>
                  )}
                </td>
                <td className="py-2.5 px-4 text-right">
                  {item.action ? (
                    <button
                      type="button"
                      onClick={item.handler}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#001639] hover:bg-[#122b54] text-white text-[11px] font-bold transition-colors cursor-pointer shadow-2xs"
                    >
                      <span>Open</span>
                      <span>&rarr;</span>
                    </button>
                  ) : (
                    <span className="text-slate-400 font-mono text-xs">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
