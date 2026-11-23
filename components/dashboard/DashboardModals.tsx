'use client'

import React, { useState } from 'react'
import { ModalType, StudentRecord, StaffRecord, ExpenseRecord, SmsRecord } from './types'

interface DashboardModalsProps {
  activeModal: ModalType
  onClose: () => void
  students: StudentRecord[]
  staff: StaffRecord[]
  expenses: ExpenseRecord[]
  smsLogs: SmsRecord[]
  onAddStudent: (newStudent: Partial<StudentRecord>) => void
  onSaveStudentAttendance: (studentId: string, status: 'Present' | 'Absent' | 'Leave') => void
  onSaveStaffAttendance: (staffId: string, status: 'Present' | 'Absent' | 'Late' | 'Leave') => void
  onRecordFeePayment: (amount: number, studentId: string, mode: string) => void
  onAddExpense: (expense: Partial<ExpenseRecord>) => void
  onSendSms: (sms: Partial<SmsRecord>) => void
}

export default function DashboardModals({
  activeModal,
  onClose,
  students,
  staff,
  expenses,
  smsLogs,
  onAddStudent,
  onSaveStudentAttendance,
  onSaveStaffAttendance,
  onRecordFeePayment,
  onAddExpense,
  onSendSms,
}: DashboardModalsProps) {
  // Local form states
  const [newStudentName, setNewStudentName] = useState('')
  const [newStudentClass, setNewStudentClass] = useState('Play Group')
  const [newStudentSection, setNewStudentSection] = useState('A')
  const [newStudentGender, setNewStudentGender] = useState<'Male' | 'Female'>('Male')
  const [newStudentBForm, setNewStudentBForm] = useState('35201-1234567-1')
  const [newStudentGuardian, setNewStudentGuardian] = useState('')
  const [newStudentPhone, setNewStudentPhone] = useState('0300-1234567')

  // Attendance states
  const [selectedStudentAtt, setSelectedStudentAtt] = useState<Record<string, 'Present' | 'Absent' | 'Leave'>>({
    '121': 'Present',
  })
  const [selectedStaffAtt, setSelectedStaffAtt] = useState<Record<string, 'Present' | 'Absent' | 'Late' | 'Leave'>>({
    'staff-01': 'Present',
  })

  // Fee payment state
  const [paymentAmount, setPaymentAmount] = useState('1700')
  const [paymentStudentId, setPaymentStudentId] = useState('121')
  const [paymentMode, setPaymentMode] = useState('Cash Counter')

  // Expense state
  const [expenseTitle, setExpenseTitle] = useState('')
  const [expenseCategory, setExpenseCategory] = useState('Utilities & Power')
  const [expenseAmount, setExpenseAmount] = useState('')
  const [expensePaidTo, setExpensePaidTo] = useState('')

  // SMS state
  const [smsRecipient, setSmsRecipient] = useState('All Parents')
  const [smsMessage, setSmsMessage] = useState('Dear Parents, please be informed that school fee challans for November 2026 are due.')

  // Homework Diary state
  const [diarySubject, setDiarySubject] = useState('English')
  const [diaryClasswork, setDiaryClasswork] = useState('Alphabet tracing page 12-14')
  const [diaryHomework, setDiaryHomework] = useState('Practice lowercase letters a-e on notebook')

  // Noticeboard state
  const [noticeTitle, setNoticeTitle] = useState('')
  const [noticeContent, setNoticeContent] = useState('')

  // Feedback notification
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  if (!activeModal) return null

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Toast */}
        {toastMessage && (
          <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between">
            <span>{toastMessage}</span>
            <button onClick={() => setToastMessage(null)}>&times;</button>
          </div>
        )}

        {/* 1. ADMIT STUDENT */}
        {activeModal === 'admit_student' && (
          <>
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">person_add</span>
                </span>
                <div>
                  <h3 className="font-domine font-bold text-[#001639] text-base">Admit New Student</h3>
                  <p className="text-xs text-slate-500">NADRA B-Form verified enrollment</p>
                </div>
              </div>
              <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 text-xl font-bold cursor-pointer">&times;</button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (!newStudentName.trim()) return
                const roll = String(Math.floor(100 + Math.random() * 900))
                onAddStudent({
                  id: `st-${Date.now()}`,
                  name: newStudentName,
                  roll_no: roll,
                  class_name: newStudentClass,
                  section: newStudentSection,
                  gender: newStudentGender,
                  admission_date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                  guardian_name: newStudentGuardian || 'Parent / Guardian',
                  guardian_phone: newStudentPhone,
                  dues_pkr: 2700,
                  attendance_status: 'Not Marked',
                  status: 'Active',
                })
                showToast(`Student ${newStudentName} successfully enrolled with Roll No. ${roll}!`)
                setTimeout(onClose, 800)
              }}
              className="p-5 space-y-4 overflow-y-auto"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Zainab Bibi"
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">NADRA B-Form Number</label>
                  <input
                    type="text"
                    placeholder="35201-XXXXXXX-X"
                    value={newStudentBForm}
                    onChange={(e) => setNewStudentBForm(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Assign Class</label>
                  <select
                    value={newStudentClass}
                    onChange={(e) => setNewStudentClass(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Play Group">Play Group</option>
                    <option value="Nursery">Nursery</option>
                    <option value="Prep">Prep</option>
                    <option value="Grade 1">Grade 1</option>
                    <option value="Grade 2">Grade 2</option>
                    <option value="Grade 10">Grade 10</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Section</label>
                  <select
                    value={newStudentSection}
                    onChange={(e) => setNewStudentSection(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
                  <select
                    value={newStudentGender}
                    onChange={(e) => setNewStudentGender(e.target.value as 'Male' | 'Female')}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Guardian Name</label>
                  <input
                    type="text"
                    placeholder="Father / Guardian"
                    value={newStudentGuardian}
                    onChange={(e) => setNewStudentGuardian(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Emergency / WhatsApp Contact</label>
                  <input
                    type="text"
                    placeholder="0300-XXXXXXX"
                    value={newStudentPhone}
                    onChange={(e) => setNewStudentPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                  />
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#001639] hover:bg-[#122b54] text-white rounded-lg text-xs font-bold cursor-pointer transition-colors"
                >
                  Confirm Admission
                </button>
              </div>
            </form>
          </>
        )}

        {/* 2. STUDENT INFORMATION */}
        {activeModal === 'student_info' && (
          <>
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">manage_accounts</span>
                </span>
                <div>
                  <h3 className="font-domine font-bold text-[#001639] text-base">Student Information Registry</h3>
                  <p className="text-xs text-slate-500">Registered campus students and credentials</p>
                </div>
              </div>
              <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 text-xl font-bold cursor-pointer">&times;</button>
            </div>
            <div className="p-5 overflow-y-auto space-y-3">
              {students.map((st) => (
                <div key={st.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#001639] text-white flex items-center justify-center font-bold">
                      {st.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#001639]">{st.name}</h4>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                        Roll: {st.roll_no} · Class: {st.class_name}-{st.section} · {st.gender}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Guardian: {st.guardian_name} ({st.guardian_phone})
                      </div>
                    </div>
                  </div>
                  <div className="text-right sm:text-right flex sm:flex-col items-center sm:items-end justify-between">
                    <span className="text-xs font-bold font-mono text-rose-700">Dues: Rs {st.dues_pkr.toLocaleString()}</span>
                    <span className="text-[10.5px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold mt-1">
                      {st.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* 3. STUDENT ATTENDANCE */}
        {activeModal === 'student_attendance' && (
          <>
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">checklist</span>
                </span>
                <div>
                  <h3 className="font-domine font-bold text-[#001639] text-base">Mark Student Attendance</h3>
                  <p className="text-xs text-slate-500">Play Group-A · Today&apos;s Daily Roll Call</p>
                </div>
              </div>
              <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 text-xl font-bold cursor-pointer">&times;</button>
            </div>
            <div className="p-5 space-y-4 overflow-y-auto">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-700">Student Roll List</span>
                <button
                  type="button"
                  onClick={() => {
                    const updated: Record<string, 'Present' | 'Absent' | 'Leave'> = {}
                    students.forEach((s) => {
                      updated[s.id] = 'Present'
                    })
                    setSelectedStudentAtt(updated)
                  }}
                  className="text-xs text-blue-700 hover:text-blue-900 font-bold cursor-pointer"
                >
                  ✓ Mark All Present
                </button>
              </div>
              {students.map((st) => (
                <div key={st.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-[#001639]">{st.name}</span>
                    <div className="text-[11px] text-slate-500 font-mono">
                      Roll #{st.roll_no} · {st.class_name}-{st.section}
                    </div>
                  </div>
                  <div className="inline-flex p-0.5 bg-white rounded-lg border border-slate-200 text-xs">
                    {(['Present', 'Absent', 'Leave'] as const).map((status) => {
                      const isSelected = (selectedStudentAtt[st.id] || st.attendance_status) === status
                      return (
                        <button
                          key={status}
                          type="button"
                          onClick={() => {
                            setSelectedStudentAtt((prev) => ({ ...prev, [st.id]: status }))
                          }}
                          className={`px-2.5 py-1 rounded font-semibold cursor-pointer transition-colors ${
                            isSelected
                              ? status === 'Present'
                                ? 'bg-emerald-600 text-white'
                                : status === 'Absent'
                                ? 'bg-rose-600 text-white'
                                : 'bg-amber-600 text-white'
                              : 'text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {status}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    students.forEach((st) => {
                      const stat = selectedStudentAtt[st.id] || 'Present'
                      onSaveStudentAttendance(st.id, stat)
                    })
                    showToast('Student attendance marked and updated on dashboard!')
                    setTimeout(onClose, 800)
                  }}
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors"
                >
                  Save Attendance
                </button>
              </div>
            </div>
          </>
        )}

        {/* 4. STAFF ATTENDANCE */}
        {activeModal === 'staff_attendance' && (
          <>
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">fact_check</span>
                </span>
                <div>
                  <h3 className="font-domine font-bold text-[#001639] text-base">Mark Staff Attendance</h3>
                  <p className="text-xs text-slate-500">Faculty & Front Desk Duty Log</p>
                </div>
              </div>
              <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 text-xl font-bold cursor-pointer">&times;</button>
            </div>
            <div className="p-5 space-y-4 overflow-y-auto">
              {staff.map((st) => (
                <div key={st.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-[#001639]">{st.name}</span>
                    <div className="text-[11px] text-slate-500">
                      {st.designation} · Monthly Pay: Rs {st.monthly_salary.toLocaleString()}
                    </div>
                  </div>
                  <div className="inline-flex p-0.5 bg-white rounded-lg border border-slate-200 text-xs">
                    {(['Present', 'Late', 'Absent', 'Leave'] as const).map((status) => {
                      const isSelected = (selectedStaffAtt[st.id] || st.attendance_status) === status
                      return (
                        <button
                          key={status}
                          type="button"
                          onClick={() => {
                            setSelectedStaffAtt((prev) => ({ ...prev, [st.id]: status }))
                          }}
                          className={`px-2.5 py-1 rounded font-semibold cursor-pointer transition-colors ${
                            isSelected
                              ? status === 'Present'
                                ? 'bg-teal-600 text-white'
                                : status === 'Late'
                                ? 'bg-amber-600 text-white'
                                : status === 'Absent'
                                ? 'bg-rose-600 text-white'
                                : 'bg-slate-600 text-white'
                              : 'text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {status}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    staff.forEach((s) => {
                      const stat = selectedStaffAtt[s.id] || 'Present'
                      onSaveStaffAttendance(s.id, stat)
                    })
                    showToast('Staff attendance recorded successfully!')
                    setTimeout(onClose, 800)
                  }}
                  className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors"
                >
                  Confirm Staff Log
                </button>
              </div>
            </div>
          </>
        )}

        {/* 5. FEE PAYMENT */}
        {activeModal === 'fee_payment' && (
          <>
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">point_of_sale</span>
                </span>
                <div>
                  <h3 className="font-domine font-bold text-[#001639] text-base">Receive Fee Payment</h3>
                  <p className="text-xs text-slate-500">Record cash counter or banking challan credit</p>
                </div>
              </div>
              <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 text-xl font-bold cursor-pointer">&times;</button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const amt = Number(paymentAmount) || 0
                onRecordFeePayment(amt, paymentStudentId, paymentMode)
                showToast(`Payment of Rs ${amt.toLocaleString()} recorded for Roll #121!`)
                setTimeout(onClose, 800)
              }}
              className="p-5 space-y-4 overflow-y-auto"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Student</label>
                <select
                  value={paymentStudentId}
                  onChange={(e) => setPaymentStudentId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {students.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name} (Roll: {st.roll_no}) — Outstanding Dues: Rs {st.dues_pkr.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Amount to Pay (PKR) *</label>
                <input
                  type="number"
                  required
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono font-bold text-lg text-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Channel</label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="Cash Counter">Cash Counter (Instant POS Slip)</option>
                  <option value="Meezan Bank Challan">Meezan Bank Challan (A/C: 0214-0104829)</option>
                  <option value="Habib Bank Limited (HBL)">HBL Branch Deposit Slip</option>
                  <option value="JazzCash / Mobile Wallet">JazzCash / Raast TID</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors"
                >
                  Post Payment & Issue Receipt
                </button>
              </div>
            </form>
          </>
        )}

        {/* 6. GENERATE MONTHLY FEE */}
        {activeModal === 'generate_monthly_fee' && (
          <>
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">receipt_long</span>
                </span>
                <div>
                  <h3 className="font-domine font-bold text-[#001639] text-base">Generate Monthly Fee Invoices</h3>
                  <p className="text-xs text-slate-500">Batch billing for Session 2026-2027</p>
                </div>
              </div>
              <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 text-xl font-bold cursor-pointer">&times;</button>
            </div>
            <div className="p-5 space-y-4 overflow-y-auto">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900">
                <strong>Billing Cohort:</strong> All Active Students (November 2026). Standard tuition slab + campus charges will be calculated per class grade level.
              </div>
              <div className="space-y-2 text-xs text-slate-700">
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                  Include Statutory Monthly Tuition (Rs 2,700 for Play Group)
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                  Include Late Fee Fine rule (Rs 300 after 10th of Month)
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                  Generate 3-part bank challans with barcode series
                </label>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    showToast('Cohort invoices generated successfully for Session 2026-2027!')
                    setTimeout(onClose, 800)
                  }}
                  className="px-5 py-2 bg-[#001639] hover:bg-[#122b54] text-white rounded-lg text-xs font-bold cursor-pointer transition-colors"
                >
                  Generate Invoices
                </button>
              </div>
            </div>
          </>
        )}

        {/* 7. PRINT FEE SLIPS */}
        {activeModal === 'print_fee_slips' && (
          <>
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-slate-200 text-slate-800 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">print</span>
                </span>
                <div>
                  <h3 className="font-domine font-bold text-[#001639] text-base">Print Fee Slips</h3>
                  <p className="text-xs text-slate-500">Challan and POS thermal receipt generation</p>
                </div>
              </div>
              <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 text-xl font-bold cursor-pointer">&times;</button>
            </div>
            <div className="p-5 space-y-4 overflow-y-auto">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#001639]">Challan #EAG-2026-00121</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                    Unpaid
                  </span>
                </div>
                <div className="text-xs text-slate-600 space-y-1">
                  <div>Student: <strong>Muhammad Ahmed ahmed Din</strong> (Roll: 121)</div>
                  <div>Class: <strong>Play Group-A</strong></div>
                  <div>Payable Dues: <strong className="text-rose-700 font-mono">Rs 1,700</strong></div>
                  <div>Partner Bank: <strong>Meezan Bank Ltd (Islamic Banking)</strong></div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 py-2.5 px-4 bg-[#001639] hover:bg-[#122b54] text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <span className="material-symbols-outlined text-[17px]">print</span>
                  Print 3-Part Bank Challan (A4)
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold flex items-center justify-center gap-2 cursor-pointer border border-slate-300 shadow-2xs"
                >
                  <span className="material-symbols-outlined text-[17px]">receipt</span>
                  Print 80mm Thermal POS Slip
                </button>
              </div>
            </div>
          </>
        )}

        {/* 8. ADD EXPENSE */}
        {activeModal === 'add_expense' && (
          <>
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">payments</span>
                </span>
                <div>
                  <h3 className="font-domine font-bold text-[#001639] text-base">Record Campus Expense</h3>
                  <p className="text-xs text-slate-500">Log campus operational disbursements</p>
                </div>
              </div>
              <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 text-xl font-bold cursor-pointer">&times;</button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const amt = Number(expenseAmount) || 0
                onAddExpense({
                  id: `exp-${Date.now()}`,
                  title: expenseTitle || 'Campus Operational Cost',
                  category: expenseCategory,
                  amount_pkr: amt,
                  date: 'Today',
                  payment_mode: 'Cash Voucher',
                })
                showToast(`Expense of Rs ${amt.toLocaleString()} recorded!`)
                setTimeout(onClose, 800)
              }}
              className="p-5 space-y-4 overflow-y-auto"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Expense Title / Description *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Science Lab Consumables"
                  value={expenseTitle}
                  onChange={(e) => setExpenseTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Expense Category</label>
                  <select
                    value={expenseCategory}
                    onChange={(e) => setExpenseCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Utilities & Power">Utilities & Power</option>
                    <option value="Stationery & Printing">Stationery & Printing</option>
                    <option value="Campus Maintenance">Campus Maintenance</option>
                    <option value="Staff Refreshments">Staff Refreshments</option>
                    <option value="Generator Fuel">Generator Fuel</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Amount (PKR) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 3500"
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono font-bold text-rose-700"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Paid To / Vendor</label>
                <input
                  type="text"
                  placeholder="Vendor Name / Receiver"
                  value={expensePaidTo}
                  onChange={(e) => setExpensePaidTo(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors"
                >
                  Save Cashout Voucher
                </button>
              </div>
            </form>
          </>
        )}

        {/* 9. TODAY'S BALANCE SHEET */}
        {activeModal === 'balance_sheet' && (
          <>
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">account_balance</span>
                </span>
                <div>
                  <h3 className="font-domine font-bold text-[#001639] text-base">Today&apos;s Balance Sheet</h3>
                  <p className="text-xs text-slate-500">Cash desk reconciliation & bank balances</p>
                </div>
              </div>
              <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 text-xl font-bold cursor-pointer">&times;</button>
            </div>
            <div className="p-5 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500">Opening Cash Counter</span>
                  <div className="text-base font-bold font-mono text-[#001639] mt-1">Rs 15,000</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500">Fee Inflow Today</span>
                  <div className="text-base font-bold font-mono text-emerald-700 mt-1">Rs 0</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500">Expenses / Disbursements</span>
                  <div className="text-base font-bold font-mono text-rose-700 mt-1">Rs 0</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500">Closing Balance (Vault)</span>
                  <div className="text-base font-bold font-mono text-purple-700 mt-1">Rs 15,000</div>
                </div>
              </div>
              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-[#001639] text-white rounded-lg text-xs font-bold cursor-pointer flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">print</span>
                  Print Balance Sheet
                </button>
              </div>
            </div>
          </>
        )}

        {/* 10. MANAGE STAFF */}
        {activeModal === 'manage_staff' && (
          <>
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">badge</span>
                </span>
                <div>
                  <h3 className="font-domine font-bold text-[#001639] text-base">Manage Staff & Faculty</h3>
                  <p className="text-xs text-slate-500">Faculty directory and salary configurations</p>
                </div>
              </div>
              <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 text-xl font-bold cursor-pointer">&times;</button>
            </div>
            <div className="p-5 space-y-4 overflow-y-auto">
              {staff.map((s) => (
                <div key={s.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-sky-700 text-white flex items-center justify-center font-bold">
                      {s.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#001639]">{s.name}</h4>
                      <p className="text-[11px] text-slate-500 font-mono">
                        ID: {s.emp_id} · {s.designation} · {s.gender}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-emerald-700 font-mono">
                      Rs {s.monthly_salary.toLocaleString()}/mo
                    </div>
                    <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full mt-1 inline-block">
                      Active
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* 11. PARENT ACCOUNT REQUESTS */}
        {activeModal === 'parent_account_requests' && (
          <>
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">group_add</span>
                </span>
                <div>
                  <h3 className="font-domine font-bold text-[#001639] text-base">Parent Account Requests</h3>
                  <p className="text-xs text-slate-500">Manage portal access credentials for guardians</p>
                </div>
              </div>
              <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 text-xl font-bold cursor-pointer">&times;</button>
            </div>
            <div className="p-5 space-y-4 overflow-y-auto">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-[#001639]">Tariq Ahmed</h4>
                  <div className="text-[11px] text-slate-500 font-mono">
                    Child: Muhammad Ahmed (Roll: 121) · Mobile: 0300-8472910
                  </div>
                  <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 mt-1 inline-block">
                    Connected to Portal
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      showToast('SMS portal credentials dispatched to 0300-8472910!')
                    }}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-bold cursor-pointer hover:bg-blue-700"
                  >
                    Resend Login Pin
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* 12. SMS TO PARENTS & 13. SMS TO STAFF */}
        {(activeModal === 'sms_to_parents' || activeModal === 'sms_to_staff') && (
          <>
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">sms</span>
                </span>
                <div>
                  <h3 className="font-domine font-bold text-[#001639] text-base">
                    {activeModal === 'sms_to_parents' ? 'Broadcast SMS to Parents' : 'Broadcast SMS to Staff'}
                  </h3>
                  <p className="text-xs text-slate-500">Pakistan Telecom Gateway Integration</p>
                </div>
              </div>
              <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 text-xl font-bold cursor-pointer">&times;</button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                onSendSms({
                  id: `sms-${Date.now()}`,
                  recipient_type: activeModal === 'sms_to_parents' ? 'Parent' : 'Staff',
                  recipient_name: smsRecipient,
                  phone: '0300-XXXXXXX',
                  message: smsMessage,
                  status: 'Delivered',
                  timestamp: 'Just now',
                })
                showToast(`SMS broadcast dispatched successfully to ${smsRecipient}!`)
                setTimeout(onClose, 800)
              }}
              className="p-5 space-y-4 overflow-y-auto"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Recipient Group</label>
                <select
                  value={smsRecipient}
                  onChange={(e) => setSmsRecipient(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {activeModal === 'sms_to_parents' ? (
                    <>
                      <option value="All Parents">All Registered Parents (1 contact)</option>
                      <option value="Play Group Parents">Play Group Parents Only</option>
                      <option value="Parents with Unpaid Dues">Parents with Outstanding Dues</option>
                    </>
                  ) : (
                    <>
                      <option value="All Faculty">All Teaching & Admin Staff (1 contact)</option>
                      <option value="Primary Teachers">Primary Section Staff</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-slate-700">Message Content *</label>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {smsMessage.length}/160 characters (1 SMS)
                  </span>
                </div>
                <textarea
                  rows={4}
                  required
                  value={smsMessage}
                  onChange={(e) => setSmsMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-700 hover:bg-orange-800 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors"
                >
                  Send Broadcast
                </button>
              </div>
            </form>
          </>
        )}

        {/* 14. SENT SMS HISTORY */}
        {activeModal === 'sent_sms_history' && (
          <>
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">history_toggle_off</span>
                </span>
                <div>
                  <h3 className="font-domine font-bold text-[#001639] text-base">Sent SMS History</h3>
                  <p className="text-xs text-slate-500">Gateway delivery verification logs</p>
                </div>
              </div>
              <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 text-xl font-bold cursor-pointer">&times;</button>
            </div>
            <div className="p-5 space-y-3 overflow-y-auto">
              {smsLogs.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400">No broadcast messages dispatched today.</div>
              ) : (
                smsLogs.map((log) => (
                  <div key={log.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">{log.recipient_name} ({log.recipient_type})</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {log.status}
                      </span>
                    </div>
                    <p className="text-slate-600">{log.message}</p>
                    <div className="text-[10px] text-slate-400 font-mono pt-1">{log.timestamp}</div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* 15. NOTICEBOARD */}
        {activeModal === 'noticeboard' && (
          <>
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">campaign</span>
                </span>
                <div>
                  <h3 className="font-domine font-bold text-[#001639] text-base">School Noticeboard</h3>
                  <p className="text-xs text-slate-500">Publish public circulars and parent portal notices</p>
                </div>
              </div>
              <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 text-xl font-bold cursor-pointer">&times;</button>
            </div>
            <div className="p-5 space-y-4 overflow-y-auto">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-xs text-[#001639]">Winter Uniform Commencement</h4>
                  <span className="text-[10px] text-slate-400">20 Nov 2026</span>
                </div>
                <p className="text-xs text-slate-600">
                  All students are advised to wear navy blue sweaters/blazers from Monday onwards as per BISE Lahore winter code.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-3">
                <h4 className="text-xs font-bold text-slate-800">Publish New Circular</h4>
                <input
                  type="text"
                  placeholder="Notice Title"
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <textarea
                  rows={3}
                  placeholder="Notice description or guidelines..."
                  value={noticeContent}
                  onChange={(e) => setNoticeContent(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!noticeTitle.trim()) return
                    showToast('Notice published to student & parent portal feed!')
                    setNoticeTitle('')
                    setNoticeContent('')
                  }}
                  className="px-4 py-2 bg-[#b3272c] hover:bg-[#88131b] text-white rounded-lg text-xs font-bold cursor-pointer transition-colors"
                >
                  Publish Notice
                </button>
              </div>
            </div>
          </>
        )}

        {/* 16. SCHOOL SETTINGS */}
        {activeModal === 'school_settings' && (
          <>
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-slate-200 text-slate-800 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">settings</span>
                </span>
                <div>
                  <h3 className="font-domine font-bold text-[#001639] text-base">School Campus Settings</h3>
                  <p className="text-xs text-slate-500">Institution metadata & banking channels</p>
                </div>
              </div>
              <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 text-xl font-bold cursor-pointer">&times;</button>
            </div>
            <div className="p-5 space-y-3 overflow-y-auto text-xs text-slate-700">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <div>Institution: <strong>Eaglets Schools</strong></div>
                <div>Campus: <strong>Main Boys Campus, Lahore</strong></div>
                <div>Session: <strong>Session 2026-2027</strong></div>
                <div>Accreditation: <strong>BISE Lahore Affiliated (Code: LHR-9281)</strong></div>
                <div>Currency: <strong>PKR (Rs)</strong></div>
              </div>
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    showToast('Campus configuration verified!')
                    setTimeout(onClose, 800)
                  }}
                  className="px-4 py-2 bg-[#001639] text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </>
        )}

        {/* 17. DAILY HOMEWORK DIARY */}
        {activeModal === 'daily_homework_diary' && (
          <>
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">menu_book</span>
                </span>
                <div>
                  <h3 className="font-domine font-bold text-[#001639] text-base">Daily Homework Diary</h3>
                  <p className="text-xs text-slate-500">Post daily classwork & homework for parents</p>
                </div>
              </div>
              <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 text-xl font-bold cursor-pointer">&times;</button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                showToast(`Daily Diary posted for Play Group-A (${diarySubject})!`)
                setTimeout(onClose, 800)
              }}
              className="p-5 space-y-4 overflow-y-auto"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Target Class</label>
                  <input
                    type="text"
                    disabled
                    value="Play Group - Section A"
                    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                  <select
                    value={diarySubject}
                    onChange={(e) => setDiarySubject(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="English">English</option>
                    <option value="Urdu">Urdu</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="General Knowledge">General Knowledge</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Classwork Accomplished</label>
                <input
                  type="text"
                  value={diaryClasswork}
                  onChange={(e) => setDiaryClasswork(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Homework Assigned</label>
                <textarea
                  rows={3}
                  value={diaryHomework}
                  onChange={(e) => setDiaryHomework(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors"
                >
                  Publish Diary to Parents
                </button>
              </div>
            </form>
          </>
        )}

        {/* GENERIC DETAILS MODAL FOR OPERATIONAL & CHART CARDS */}
        {activeModal && activeModal.startsWith('details_') && (
          <>
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">insights</span>
                </span>
                <div>
                  <h3 className="font-domine font-bold text-[#001639] text-base capitalize">
                    {activeModal.replace('details_', '').replace('_', ' ')} Details
                  </h3>
                  <p className="text-xs text-slate-500">Live system audit and telemetry</p>
                </div>
              </div>
              <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 text-xl font-bold cursor-pointer">&times;</button>
            </div>
            <div className="p-5 space-y-4 overflow-y-auto text-xs text-slate-700">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <p>
                  Diagnostic inspection for <strong>{activeModal.replace('details_', '').replace('_', ' ')}</strong> confirms data integrity across the Main Boys Campus, Lahore database.
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-600">
                  <li>Active Academic Session: 2026-2027</li>
                  <li>Campus Node: Primary Education Cluster</li>
                  <li>Last Synchronized: Today, 08:39 PM</li>
                </ul>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-[#001639] text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </>
        )}

        {/* VIEW ALL DIALOGS */}
        {activeModal && activeModal.startsWith('view_all_') && (
          <>
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">view_list</span>
                </span>
                <div>
                  <h3 className="font-domine font-bold text-[#001639] text-base capitalize">
                    {activeModal.replace('view_all_', '').replace('_', ' ')} Report
                  </h3>
                  <p className="text-xs text-slate-500">Comprehensive dataset breakdown</p>
                </div>
              </div>
              <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 text-xl font-bold cursor-pointer">&times;</button>
            </div>
            <div className="p-5 space-y-4 overflow-y-auto text-xs text-slate-700">
              <p>
                Displaying all recorded transactions and logs for this campus. All records comply with statutory BISE Lahore audit reporting standards.
              </p>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                1 total active record found in this view.
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-[#001639] text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
