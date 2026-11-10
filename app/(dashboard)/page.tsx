'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import StatsCard from '@/components/StatsCard'
import Modal from '@/components/Modal'
import PrintableChallan from '@/components/PrintableChallan'
import { useRootAdmin } from '@/lib/admin-store'
import {
  INITIAL_STUDENTS,
  INITIAL_PAYMENTS,
  INITIAL_INVOICES,
} from '@/lib/mock-data'

export default function DashboardOverviewPage() {
  const { admin } = useRootAdmin()
  const [activeTab, setActiveTab] = useState<'all' | 'bank' | 'cash' | 'pending'>('all')
  const [isChallanModalOpen, setIsChallanModalOpen] = useState(false)
  const [selectedChallan, setSelectedChallan] = useState(INITIAL_INVOICES[0])
  const [broadcastSent, setBroadcastSent] = useState(false)

  const filteredPayments = INITIAL_PAYMENTS.filter((pay) => {
    if (activeTab === 'bank') return pay.payment_channel.includes('Bank')
    if (activeTab === 'cash') return pay.payment_channel.includes('Cash')
    if (activeTab === 'pending') return pay.reconciliation_status === 'Pending Reconcile'
    return true
  })

  const handleBroadcast = () => {
    setBroadcastSent(true)
    setTimeout(() => setBroadcastSent(false), 4000)
  }

  return (
    <div className="px-3 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col gap-4 sm:gap-6 min-w-0">
      {/* Executive Welcome Bar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-xl border border-slate-200/80 shadow-xs relative overflow-hidden">
        <div className="flex flex-col gap-1.5 z-10">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#b3272c]/10 text-[#b3272c] text-[11px] font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#b3272c] animate-pulse"></span>
              Executive Terminal
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium">Session 2026–2027</span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-600 flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px] text-[#b4833e]">
                verified_user
              </span>
              Main Boys Campus, Lahore
            </span>
          </div>
          <h1 className="font-domine text-2xl lg:text-3xl font-bold text-[#001639] tracking-tight">
            Good morning, {admin.name}
          </h1>
          <p className="text-xs text-slate-500">
            Live Academic, Financial & Administrative Pulse — Academic Year 2026–2027
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 z-10">
          <button
            type="button"
            onClick={() => window.print()}
            className="h-9 px-3.5 bg-slate-50 hover:bg-slate-100 text-[#001639] border border-slate-200 text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors shadow-2xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[17px]">print</span>
            <span>Print Daily Summary</span>
          </button>
          <button
            type="button"
            onClick={handleBroadcast}
            className="h-9 px-3.5 bg-[#b3272c] hover:bg-[#88131b] text-white text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[17px]">campaign</span>
            <span>Broadcast Notice (SMS/WhatsApp)</span>
          </button>
        </div>
      </div>

      {broadcastSent && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2.5 rounded-lg text-xs flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-emerald-600">
              check_circle
            </span>
            Broadcast message successfully dispatched via Pakistan SMS Gateway to 1,485 parent contacts!
          </span>
          <button
            onClick={() => setBroadcastSent(false)}
            className="text-emerald-700 hover:text-emerald-900"
          >
            ✕
          </button>
        </div>
      )}

      {/* 4 Top KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatsCard
          title="Total Enrolled Students"
          value="1,485"
          subValue="+42 this term"
          icon="groups"
          accentColor="navy"
          progressPercent={95.5}
          footerText="Active Retention 95.5%"
          secondaryFooterText="1,418 Active • 67 Alumni"
        />

        <StatsCard
          title="Faculty & Administration"
          value="94"
          subValue="Members"
          icon="badge"
          accentColor="navy"
          progressPercent={88}
          footerText="Staff-to-Student Ratio"
          secondaryFooterText="1 : 21.8 (68 Teaching)"
        />

        <StatsCard
          title="September Fee Recovery"
          value="PKR 4.82M"
          subValue="/ 5.94M"
          icon="account_balance_wallet"
          accentColor="crimson"
          progressPercent={81.1}
          footerText="81.1% Realized (Due: 10th)"
          secondaryFooterText="PKR 1.12M Pending"
        />

        <StatsCard
          title="Today's Attendance"
          value="94.2%"
          subValue="Students"
          icon="fact_check"
          accentColor="gold"
          progressPercent={94.2}
          footerText="Faculty: 97.8% (66 / 68)"
          secondaryFooterText="1,336 Present • 82 Absent"
        />
      </div>

      {/* Operational Split: Live Fee Stream (7 cols) + Academic Snapshot (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Live Fee Stream */}
        <div className="lg:col-span-7 xl:col-span-8 bg-white rounded-xl border border-slate-200/80 shadow-xs flex flex-col overflow-hidden">
          <div className="p-4 bg-slate-50/70 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#001639] text-[22px]">
                receipt_long
              </span>
              <div>
                <h2 className="font-domine text-sm font-bold text-[#001639]">
                  Live Fee Collection Feed & Banking
                </h2>
                <p className="text-[11px] text-slate-500">
                  Real-time PKR Challan tracking across authorized partner branches
                </p>
              </div>
            </div>
            <Link
              href="/finance"
              className="h-8 px-3 bg-[#001639] text-white hover:bg-[#122b54] text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors self-start sm:self-auto shadow-2xs"
            >
              <span className="material-symbols-outlined text-[15px] text-[#f5bc71]">
                bolt
              </span>
              <span>Batch Fee Generation (Oct 2026)</span>
            </Link>
          </div>

          {/* Subtabs */}
          <div className="px-4 pt-1 flex items-center gap-3 overflow-x-auto border-b border-slate-100 bg-white text-xs">
            <button
              onClick={() => setActiveTab('all')}
              className={`py-2.5 px-2 font-bold whitespace-nowrap transition-colors border-b-2 cursor-pointer ${
                activeTab === 'all'
                  ? 'border-[#001639] text-[#001639]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              All Transactions
            </button>
            <button
              onClick={() => setActiveTab('bank')}
              className={`py-2.5 px-2 font-bold whitespace-nowrap transition-colors border-b-2 cursor-pointer ${
                activeTab === 'bank'
                  ? 'border-[#001639] text-[#001639]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Bank Challans (HBL / Meezan)
            </button>
            <button
              onClick={() => setActiveTab('cash')}
              className={`py-2.5 px-2 font-bold whitespace-nowrap transition-colors border-b-2 cursor-pointer ${
                activeTab === 'cash'
                  ? 'border-[#001639] text-[#001639]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Cash Counter
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`py-2.5 px-2 font-bold whitespace-nowrap transition-colors border-b-2 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'pending'
                  ? 'border-[#b3272c] text-[#b3272c]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>Pending Verification</span>
              <span className="w-4 h-4 rounded-full bg-[#ffdad7] text-[#b3272c] text-[10px] flex items-center justify-center font-bold">
                1
              </span>
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-2.5 px-4">Student / ID</th>
                  <th className="py-2.5 px-3">Class</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Challan / Mode</th>
                  <th className="py-2.5 px-3">Time</th>
                  <th className="py-2.5 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredPayments.map((pay) => (
                  <tr key={pay.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-[#001639] font-bold text-[11px]">
                          {pay.student_name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-[#001639]">
                            {pay.student_name}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {pay.roll_no}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 font-medium">
                      {pay.class_name}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-[#001639]">
                      PKR {pay.amount_paid_pkr.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex flex-col">
                        <span className="font-mono text-slate-800 text-[11px] font-semibold">
                          {pay.receipt_no}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {pay.payment_mode}
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 text-[11px]">
                      {pay.payment_date}
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      {pay.reconciliation_status === 'Verified' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="material-symbols-outlined text-[12px]">
                            check_circle
                          </span>
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          <span className="material-symbols-outlined text-[12px]">
                            pending
                          </span>
                          Reconcile
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Showing recent verified payments</span>
            <Link
              href="/finance"
              className="font-bold text-[#001639] hover:text-[#b3272c] flex items-center gap-1"
            >
              <span>View Complete Ledger</span>
              <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
            </Link>
          </div>
        </div>

        {/* Right: Academic Snapshot & Examination Alert */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-5">
          {/* Live Academic Pulse */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#b3272c] text-[20px]">
                  school
                </span>
                <h2 className="font-domine text-sm font-bold text-[#001639]">
                  Academic Snapshot
                </h2>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#eff4ff] text-[#001639] text-[11px] font-bold">
                Period 4 Active
              </span>
            </div>

            {/* Exam Date Sheet Alert */}
            <div className="bg-slate-50 p-3.5 rounded-lg border-l-4 border-[#b3272c] flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#b3272c] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">
                    event_upcoming
                  </span>
                  Examination Alert
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">Term 1</span>
              </div>
              <p className="font-domine text-xs font-bold text-[#001639]">
                First Term Exams Commence Oct 12, 2026
              </p>
              <p className="text-[11px] text-slate-600 leading-tight">
                Question paper submissions deadline: <strong>2nd October 2026</strong>. 12 of 24 subject papers submitted.
              </p>
            </div>

            {/* Daily Diary Progress */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">Daily Diaries Published Today</span>
                <span className="font-bold text-[#001639]">14 / 18 Sections</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-[#001639] h-2 rounded-full" style={{ width: '77.7%' }}></div>
              </div>
              <div className="flex items-center justify-between text-[11px] pt-0.5">
                <span className="text-[#b3272c] font-medium">4 Sections Pending Diary</span>
                <Link
                  href="/academics"
                  className="text-[#001639] hover:text-[#b3272c] font-semibold underline"
                >
                  Send Auto-Reminder
                </Link>
              </div>
            </div>

            {/* Notice Alert */}
            <div className="p-2.5 bg-[#eff4ff] rounded-lg flex items-center gap-2.5 border border-[#dee9fc]">
              <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#001639] flex-shrink-0 shadow-2xs">
                <span className="material-symbols-outlined text-[16px]">
                  notifications_active
                </span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-bold text-[#001639]">
                  Parent-Teacher Meeting (PTM)
                </span>
                <span className="text-[10px] text-slate-600 truncate">
                  Scheduled for Saturday, 28th September across all wings
                </span>
              </div>
            </div>
          </div>

          {/* Code of Character Directives */}
          <div className="bg-[#122b54] text-white p-5 rounded-xl shadow-xs flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] text-[#f5bc71] uppercase tracking-wider font-bold">
                  Instructional Discipline
                </span>
                <h3 className="font-domine text-sm font-bold text-white mt-0.5">
                  Eaglets Code of Character
                </h3>
                <p className="text-xs text-[#7d93c2] mt-1">
                  Inspection patrol scheduled for senior secondary classes during Break 2.
                </p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-[#001639] flex items-center justify-center text-[#f5bc71] shadow-inner">
                <span className="material-symbols-outlined text-[18px]">shield</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-[#7d93c2]">Supervisor: VP Masood</span>
              <span className="inline-flex items-center gap-1 text-[#f5bc71] font-bold text-xs">
                <span className="material-symbols-outlined text-[14px]">schedule</span>
                11:30 AM
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Admissions Awaiting Verification */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col">
        <div className="p-4 bg-slate-50/70 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#b3272c] text-[22px]">
              how_to_reg
            </span>
            <div>
              <h2 className="font-domine text-sm font-bold text-[#001639]">
                Latest Student Admissions & Document Verification
              </h2>
              <p className="text-[11px] text-slate-500">
                Review applicant credentials, NADRA B-Form compliance, and academic dossiers
              </p>
            </div>
          </div>
          <span className="inline-flex items-center px-2.5 py-1 rounded bg-[#eff4ff] text-[#001639] text-xs font-bold self-start sm:self-auto">
            6 Applications Awaiting Approval
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-2.5 px-4">Admission #</th>
                <th className="py-2.5 px-3">Student Name</th>
                <th className="py-2.5 px-3">Parent / Contact</th>
                <th className="py-2.5 px-3">Class Applied</th>
                <th className="py-2.5 px-3">NADRA B-Form #</th>
                <th className="py-2.5 px-3">Previous School</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {INITIAL_STUDENTS.slice(0, 4).map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-2.5 px-4 font-mono font-bold text-[#001639]">
                    {student.admission_no}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-slate-800">
                    {student.student_name}
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-700">
                        {student.father_name}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {student.contact_phone}
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-semibold">
                      {student.class_name}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-600 text-[11px]">
                    {student.b_form}
                  </td>
                  <td className="py-2.5 px-3 text-slate-500">
                    {student.previous_school || 'Private Candidate'}
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedChallan(INITIAL_INVOICES[0])
                          setIsChallanModalOpen(true)
                        }}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-[#001639] rounded text-[11px] font-semibold transition-colors cursor-pointer"
                      >
                        Print Challan
                      </button>
                      <Link
                        href="/students"
                        className="px-2.5 py-1 bg-[#122b54] hover:bg-[#001639] text-white rounded text-[11px] font-semibold transition-colors"
                      >
                        Review
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Challan Modal */}
      <Modal
        isOpen={isChallanModalOpen}
        onClose={() => setIsChallanModalOpen(false)}
        title="Official 3-Part Bank Challan"
        subtitle="Pakistan Banking Standard (A4 Perforated Cut-Slip for HBL & Meezan Bank)"
        maxWidth="5xl"
      >
        <PrintableChallan
          challanNo={selectedChallan.challan_no}
          studentName={selectedChallan.student_name}
          rollNo={selectedChallan.roll_no}
          className={selectedChallan.class_name}
          tuitionFee={selectedChallan.tuition_amount_pkr}
          labFund={selectedChallan.lab_amount_pkr}
          examFund={selectedChallan.exam_amount_pkr}
          devFund={selectedChallan.development_amount_pkr}
          lateFee={selectedChallan.late_surcharge_pkr}
          issueDate={selectedChallan.issue_date}
          dueDate={selectedChallan.due_date}
          expiryDate={selectedChallan.expiry_date}
        />
      </Modal>
    </div>
  )
}
