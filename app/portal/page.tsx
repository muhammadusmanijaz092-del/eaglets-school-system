'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Modal from '@/components/Modal'
import PrintableChallan from '@/components/PrintableChallan'
import PrintableResultCard from '@/components/PrintableResultCard'
import {
  INITIAL_STUDENTS,
  INITIAL_INVOICES,
  INITIAL_DIARIES,
  INITIAL_EXAM_RESULTS,
  INITIAL_TIMETABLE,
} from '@/lib/mock-data'
import { StudentItem } from '@/lib/supabase/types'
import { createClient } from '@/lib/supabase/client'

export default function ParentStudentPortalPage() {
  const [searchKey, setSearchKey] = useState('EAG-10-042')
  const [selectedStudent, setSelectedStudent] = useState<StudentItem>(INITIAL_STUDENTS[0])
  const [activeTab, setActiveTab] = useState<'fee' | 'diary' | 'result' | 'timetable'>('fee')

  // Modals
  const [isChallanModalOpen, setIsChallanModalOpen] = useState(false)
  const [isResultModalOpen, setIsResultModalOpen] = useState(false)

  // Find Student by Roll No or B-Form
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    const query = searchKey.trim()
    if (!query) return

    // 1. Query live Supabase cloud database if configured
    const supabase = createClient()
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('students')
          .select('*')
          .or(`roll_no.ilike.%${query}%,b_form.eq.${query},student_name.ilike.%${query}%`)
          .limit(1)

        if (!error && data && data.length > 0) {
          setSelectedStudent(data[0] as StudentItem)
          return
        }
      } catch (err) {
        console.warn('Supabase search fallback:', err)
      }
    }

    // 2. Offline fallback
    const found = INITIAL_STUDENTS.find(
      (s) =>
        s.roll_no.toLowerCase() === query.toLowerCase() ||
        s.b_form.replace(/[-]/g, '') === query.replace(/[-]/g, '') ||
        s.student_name.toLowerCase().includes(query.toLowerCase())
    )
    if (found) {
      setSelectedStudent(found)
    } else {
      alert(`Student with Roll No / B-Form "${query}" was not found. Please try "EAG-10-042" or "EAG-10-041".`)
    }
  }

  const studentInvoice =
    INITIAL_INVOICES.find((inv) => inv.student_id === selectedStudent.id) ||
    INITIAL_INVOICES[0]

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-slate-800 flex flex-col">
      {/* Top Navbar */}
      <header className="h-16 bg-[#122b54] text-white px-4 sm:px-8 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xl flex-shrink-0 border border-white/20">
            🦅
          </div>
          <div>
            <span className="font-domine font-bold text-base tracking-wide text-white block leading-tight">
              EAGLETS SCHOOLS
            </span>
            <span className="text-[10px] text-[#7d93c2] uppercase tracking-wider font-semibold">
              Parent & Student Access Portal
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/10 text-[#f5bc71] font-semibold">
            <span className="material-symbols-outlined text-[15px]">verified</span>
            Session 2026–2027
          </span>
          <Link
            href="/login"
            className="px-3 py-1.5 bg-[#b3272c] hover:bg-[#88131b] text-white font-bold rounded-lg transition-colors"
          >
            Staff Login
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 flex flex-col gap-6">
        {/* Lookup Banner */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="font-domine text-xl font-bold text-[#001639]">
              Student Records & Academic Tracker
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter Student Institutional Roll Number or NADRA B-Form to view fee challan, diaries, and result cards.
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              required
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              placeholder="e.g. EAG-10-042"
              className="h-10 px-3 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#001639] font-mono font-semibold"
            />
            <button
              type="submit"
              className="h-10 px-4 bg-[#001639] hover:bg-[#122b54] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">search</span>
              <span>Find</span>
            </button>
          </form>
        </div>

        {/* Student Bio Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#122b54] text-white flex items-center justify-center font-bold text-xl flex-shrink-0 shadow-inner">
              {selectedStudent.student_name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-domine text-lg font-bold text-[#001639]">
                  {selectedStudent.student_name}
                </h2>
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                  Enrolled & Active
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 flex-wrap">
                <span className="font-mono font-bold text-[#b3272c]">
                  Roll #: {selectedStudent.roll_no}
                </span>
                <span>•</span>
                <span>Class: {selectedStudent.class_name}</span>
                <span>•</span>
                <span>Father: {selectedStudent.father_name}</span>
              </div>
              <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                NADRA B-Form: {selectedStudent.b_form}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-100 self-start md:self-auto">
            <div className="text-center px-3 border-r border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Attendance
              </span>
              <span className="text-base font-bold text-emerald-600 font-mono">
                96.5%
              </span>
            </div>
            <div className="text-center px-3 border-r border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Term Grade
              </span>
              <span className="text-base font-bold text-[#b3272c] font-mono">
                A+ (491)
              </span>
            </div>
            <div className="text-center px-3">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Fee Status
              </span>
              <span
                className={`text-base font-bold font-mono ${
                  studentInvoice.status === 'Paid'
                    ? 'text-emerald-600'
                    : 'text-[#b3272c]'
                }`}
              >
                {studentInvoice.status}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 bg-slate-200/60 p-1 rounded-xl text-xs overflow-x-auto">
          {[
            { id: 'fee', label: 'Fee Challan & Banking', icon: 'payments' },
            { id: 'diary', label: 'Daily Diary & Homework', icon: 'auto_stories' },
            { id: 'result', label: 'Term Result Card', icon: 'workspace_premium' },
            { id: 'timetable', label: 'Weekly Timetable', icon: 'calendar_month' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-white text-[#001639] shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {tab.icon}
              </span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB 1: FEE CHALLAN */}
        {activeTab === 'fee' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col gap-5 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Current Billing Cycle
                </span>
                <h3 className="font-domine text-lg font-bold text-[#001639]">
                  {studentInvoice.billing_month} Tuition Voucher
                </h3>
                <span className="text-slate-500 text-[11px]">
                  Challan #{studentInvoice.challan_no} • Due Date:{' '}
                  <strong className="text-[#b3272c]">{studentInvoice.due_date}</strong>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsChallanModalOpen(true)}
                  className="px-4 py-2 bg-[#b3272c] hover:bg-[#88131b] text-white font-bold rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[17px]">print</span>
                  <span>Print 3-Part Bank Challan</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <span className="text-[11px] font-bold text-[#001639] uppercase block mb-1">
                  Itemized Dues Breakdown
                </span>
                <div className="flex justify-between">
                  <span className="text-slate-600">Monthly Tuition Fee:</span>
                  <span className="font-mono font-semibold">
                    PKR {studentInvoice.tuition_amount_pkr.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Science / Lab Fund:</span>
                  <span className="font-mono font-semibold">
                    PKR {studentInvoice.lab_amount_pkr.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Term Examination Charges:</span>
                  <span className="font-mono font-semibold">
                    PKR {studentInvoice.exam_amount_pkr.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Campus Development:</span>
                  <span className="font-mono font-semibold">
                    PKR {studentInvoice.development_amount_pkr.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-[#001639] text-sm">
                  <span>Net Payable (Within Due Date):</span>
                  <span className="font-mono">
                    PKR {studentInvoice.total_due_pkr.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="bg-[#eff4ff] p-4 rounded-xl border border-[#dee9fc] space-y-2 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold text-[#001639] uppercase block mb-1">
                    Authorized Bank Settlement
                  </span>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Fees can be deposited at any branch of <strong>Habib Bank Limited (HBL)</strong> or <strong>Meezan Bank Islamic</strong> using the official 3-part bank voucher, or via HBL Mobile / Raast transfer.
                  </p>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-[#c4c6d0] text-[10px] space-y-0.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">HBL Account Title:</span>
                    <span className="font-bold text-[#001639]">Eaglets Schools (Main Campus)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Account Number:</span>
                    <span className="font-mono font-bold">0042-79018420-03</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DAILY DIARY */}
        {activeTab === 'diary' && (
          <div className="flex flex-col gap-4 text-xs">
            {INITIAL_DIARIES.map((d) => (
              <div
                key={d.id}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col gap-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#122b54] text-white font-bold text-[10px]">
                      {d.subject_name}
                    </span>
                    <span className="font-bold text-slate-800 text-sm">
                      {d.class_name} ({d.section})
                    </span>
                  </div>
                  <span className="text-slate-400 font-mono text-[11px]">
                    {d.diary_date} • Teacher: {d.teacher_name}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                      Classwork Completed:
                    </span>
                    <p className="text-slate-800 leading-relaxed">{d.classwork}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#b3272c] uppercase block mb-1">
                      Assigned Homework:
                    </span>
                    <p className="text-slate-800 leading-relaxed">{d.homework}</p>
                  </div>
                </div>

                {d.teacher_notes && (
                  <div className="text-[11px] text-[#633f00] bg-[#ffddb5]/30 p-2.5 rounded-lg border border-[#ffddb5]">
                    <strong>Teacher&apos;s Special Note:</strong> {d.teacher_notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: RESULT CARD */}
        {activeTab === 'result' && (
          <div className="flex flex-col gap-4 text-xs">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <h3 className="font-domine text-sm font-bold text-[#001639]">
                  First Term Examination 2026 Academic Report
                </h3>
                <span className="text-slate-500 text-[11px]">
                  Board of Intermediate & Secondary Education (BISE) Lahore Compliant
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsResultModalOpen(true)}
                className="px-4 py-2 bg-[#001639] hover:bg-[#122b54] text-white font-bold rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[17px]">print</span>
                <span>Print Official A4 Certificate</span>
              </button>
            </div>

            <PrintableResultCard
              studentName={selectedStudent.student_name}
              rollNo={selectedStudent.roll_no}
              fatherName={selectedStudent.father_name}
              regNo={selectedStudent.admission_no}
              className={selectedStudent.class_name}
              bForm={selectedStudent.b_form}
              results={INITIAL_EXAM_RESULTS}
            />
          </div>
        )}

        {/* TAB 4: TIMETABLE */}
        {activeTab === 'timetable' && (
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col gap-4 text-xs">
            <h3 className="font-domine text-sm font-bold text-[#001639]">
              Weekly Period Timetable: {selectedStudent.class_name}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {INITIAL_TIMETABLE.map((t) => (
                <div
                  key={t.id}
                  className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col gap-1"
                >
                  <span className="text-[10px] font-bold text-[#b3272c] uppercase">
                    Period {t.period_number} ({t.start_time} - {t.end_time})
                  </span>
                  <span className="font-bold text-[#001639] text-sm">
                    {t.subject_name}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {t.teacher_name} • {t.room_number}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Challan Modal */}
      <Modal
        isOpen={isChallanModalOpen}
        onClose={() => setIsChallanModalOpen(false)}
        title="Official 3-Part Bank Challan"
        subtitle={`Student: ${selectedStudent.student_name} (${selectedStudent.roll_no})`}
        maxWidth="5xl"
      >
        <PrintableChallan
          studentName={selectedStudent.student_name}
          rollNo={selectedStudent.roll_no}
          bForm={selectedStudent.b_form}
          className={selectedStudent.class_name}
        />
      </Modal>

      {/* Result Card Modal */}
      <Modal
        isOpen={isResultModalOpen}
        onClose={() => setIsResultModalOpen(false)}
        title="Official Academic Progress Report & Result Card"
        subtitle={`Student: ${selectedStudent.student_name} • BISE Lahore Compliant`}
        maxWidth="5xl"
      >
        <PrintableResultCard
          studentName={selectedStudent.student_name}
          rollNo={selectedStudent.roll_no}
          fatherName={selectedStudent.father_name}
          regNo={selectedStudent.admission_no}
          className={selectedStudent.class_name}
          bForm={selectedStudent.b_form}
          results={INITIAL_EXAM_RESULTS}
        />
      </Modal>
    </div>
  )
}

