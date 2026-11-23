'use client'

import React from 'react'
import { ModalType } from './types'

interface QuickActionItem {
  id: ModalType
  label: string
  icon: string
  color: string
  bg: string
}

const actions: QuickActionItem[] = [
  {
    id: 'admit_student',
    label: 'Admit Student',
    icon: 'person_add',
    color: 'text-blue-700',
    bg: 'bg-blue-50/80 hover:bg-blue-100/80 border-blue-200/70',
  },
  {
    id: 'student_info',
    label: 'Student Information',
    icon: 'manage_accounts',
    color: 'text-indigo-700',
    bg: 'bg-indigo-50/80 hover:bg-indigo-100/80 border-indigo-200/70',
  },
  {
    id: 'student_attendance',
    label: 'Student Attendance',
    icon: 'checklist',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50/80 hover:bg-emerald-100/80 border-emerald-200/70',
  },
  {
    id: 'staff_attendance',
    label: 'Staff Attendance',
    icon: 'fact_check',
    color: 'text-teal-700',
    bg: 'bg-teal-50/80 hover:bg-teal-100/80 border-teal-200/70',
  },
  {
    id: 'fee_payment',
    label: 'Fee Payment',
    icon: 'point_of_sale',
    color: 'text-amber-800',
    bg: 'bg-amber-50/80 hover:bg-amber-100/80 border-amber-200/70',
  },
  {
    id: 'generate_monthly_fee',
    label: 'Generate Monthly Fee',
    icon: 'receipt_long',
    color: 'text-amber-700',
    bg: 'bg-amber-50/80 hover:bg-amber-100/80 border-amber-200/70',
  },
  {
    id: 'print_fee_slips',
    label: 'Print Fee Slips',
    icon: 'print',
    color: 'text-slate-700',
    bg: 'bg-slate-50 hover:bg-slate-100 border-slate-200',
  },
  {
    id: 'add_expense',
    label: 'Add Expense',
    icon: 'payments',
    color: 'text-rose-700',
    bg: 'bg-rose-50/80 hover:bg-rose-100/80 border-rose-200/70',
  },
  {
    id: 'balance_sheet',
    label: "Today's Balance Sheet",
    icon: 'account_balance',
    color: 'text-purple-700',
    bg: 'bg-purple-50/80 hover:bg-purple-100/80 border-purple-200/70',
  },
  {
    id: 'manage_staff',
    label: 'Manage Staff',
    icon: 'badge',
    color: 'text-sky-700',
    bg: 'bg-sky-50/80 hover:bg-sky-100/80 border-sky-200/70',
  },
  {
    id: 'parent_account_requests',
    label: 'Parent Account Requests',
    icon: 'group_add',
    color: 'text-cyan-700',
    bg: 'bg-cyan-50/80 hover:bg-cyan-100/80 border-cyan-200/70',
  },
  {
    id: 'sms_to_parents',
    label: 'SMS To Parents',
    icon: 'sms',
    color: 'text-orange-700',
    bg: 'bg-orange-50/80 hover:bg-orange-100/80 border-orange-200/70',
  },
  {
    id: 'sms_to_staff',
    label: 'SMS To Staff',
    icon: 'forward_to_inbox',
    color: 'text-amber-700',
    bg: 'bg-amber-50/80 hover:bg-amber-100/80 border-amber-200/70',
  },
  {
    id: 'sent_sms_history',
    label: 'Sent SMS History',
    icon: 'history_toggle_off',
    color: 'text-slate-700',
    bg: 'bg-slate-50 hover:bg-slate-100 border-slate-200',
  },
  {
    id: 'noticeboard',
    label: 'Noticeboard',
    icon: 'campaign',
    color: 'text-red-700',
    bg: 'bg-red-50/80 hover:bg-red-100/80 border-red-200/70',
  },
  {
    id: 'school_settings',
    label: 'School Settings',
    icon: 'settings',
    color: 'text-slate-800',
    bg: 'bg-slate-50 hover:bg-slate-100 border-slate-200',
  },
  {
    id: 'daily_homework_diary',
    label: 'Daily Homework Diary',
    icon: 'menu_book',
    color: 'text-blue-800',
    bg: 'bg-blue-50/80 hover:bg-blue-100/80 border-blue-200/70',
  },
]

interface QuickActionsGridProps {
  onOpenModal: (type: ModalType) => void
}

export default function QuickActionsGrid({ onOpenModal }: QuickActionsGridProps) {
  return (
    <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/90 shadow-xs">
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#001639] text-[20px]">
            flash_on
          </span>
          <h2 className="font-domine text-sm font-bold text-[#001639] uppercase tracking-wider">
            Quick Actions
          </h2>
        </div>
        <span className="text-[11px] font-medium text-slate-400">
          17 Operational Actions
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-9 gap-2.5">
        {actions.map((act) => (
          <button
            key={act.id}
            type="button"
            onClick={() => onOpenModal(act.id)}
            className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all duration-150 cursor-pointer shadow-2xs group hover:-translate-y-0.5 hover:shadow-xs min-h-[76px] ${act.bg}`}
          >
            <span
              className={`material-symbols-outlined text-[24px] mb-1.5 transition-transform group-hover:scale-110 ${act.color}`}
            >
              {act.icon}
            </span>
            <span className="text-[11.5px] font-semibold text-slate-800 leading-snug line-clamp-2">
              {act.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
