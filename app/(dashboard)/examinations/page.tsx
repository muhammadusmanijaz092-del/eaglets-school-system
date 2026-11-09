'use client'

import React, { useState } from 'react'
import Modal from '@/components/Modal'
import PrintableResultCard from '@/components/PrintableResultCard'
import { INITIAL_EXAM_RESULTS, INITIAL_STUDENTS } from '@/lib/mock-data'
import { ExamResultRow } from '@/lib/supabase/types'

export default function ExaminationsPage() {
  const [activeSubTab, setActiveSubTab] = useState<'datesheet' | 'spreadsheet' | 'resultcard'>('resultcard')
  const [selectedStudent, setSelectedStudent] = useState(INITIAL_STUDENTS[0])
  const [resultsData, setResultsData] = useState<ExamResultRow[]>(INITIAL_EXAM_RESULTS)
  const [isResultModalOpen, setIsResultModalOpen] = useState(false)

  // Date sheet items
  const [dateSheets] = useState([
    {
      date: 'Monday, 12 Oct 2026',
      time: '08:30 – 11:30 AM',
      subject: 'English Compulsory',
      maxMarks: 75,
      room: 'Main Examination Hall',
      syllabus: 'Units 1–7 & Grammar Composition',
    },
    {
      date: 'Wednesday, 14 Oct 2026',
      time: '08:30 – 11:30 AM',
      subject: 'Urdu Compulsory',
      maxMarks: 75,
      room: 'Main Examination Hall',
      syllabus: 'Nazm, Ghazal & Sabaq 1–6',
    },
    {
      date: 'Friday, 16 Oct 2026',
      time: '08:30 – 10:30 AM',
      subject: 'Islamiat Compulsory',
      maxMarks: 50,
      room: 'Exam Hall B',
      syllabus: 'Surah Al-Ahzab & Hadith 1–10',
    },
    {
      date: 'Monday, 19 Oct 2026',
      time: '08:30 – 11:30 AM',
      subject: 'Mathematics (Science)',
      maxMarks: 75,
      room: 'Main Examination Hall',
      syllabus: 'Units 1 to 4 Complete',
    },
    {
      date: 'Wednesday, 21 Oct 2026',
      time: '08:30 – 11:30 AM',
      subject: 'Physics (Theory + Practical)',
      maxMarks: 75,
      room: 'Physics Lab 1',
      syllabus: 'Chapters 10, 11, 12 & Labs',
    },
    {
      date: 'Friday, 23 Oct 2026',
      time: '08:30 – 11:30 AM',
      subject: 'Chemistry (Theory + Practical)',
      maxMarks: 75,
      room: 'Chemistry Lab',
      syllabus: 'Chapters 9, 10, 11 & Labs',
    },
  ])

  // Gazette summary
  const gazetteRoster = [
    {
      rollNo: 'EAG-10-042',
      name: 'Muhammad Rayyan Butt',
      eng: 68,
      urd: 62,
      isl: 46,
      pak: 43,
      mth: 72,
      phy: 68,
      chm: 63,
      bio: 69,
      totalObt: 491,
      pct: '89.27%',
      grade: 'A+',
    },
    {
      rollNo: 'EAG-10-041',
      name: 'Zainab Fatima',
      eng: 71,
      urd: 67,
      isl: 48,
      pak: 45,
      mth: 74,
      phy: 70,
      chm: 65,
      bio: 72,
      totalObt: 512,
      pct: '93.09%',
      grade: 'A+',
    },
    {
      rollNo: 'EAG-10-043',
      name: 'Ahmed Bilal Dar',
      eng: 59,
      urd: 55,
      isl: 41,
      pak: 39,
      mth: 64,
      phy: 58,
      chm: 56,
      bio: 60,
      totalObt: 432,
      pct: '78.54%',
      grade: 'A',
    },
    {
      rollNo: 'EAG-10-044',
      name: 'Usman Ghani',
      eng: 52,
      urd: 48,
      isl: 38,
      pak: 36,
      mth: 55,
      phy: 50,
      chm: 49,
      bio: 54,
      totalObt: 382,
      pct: '69.45%',
      grade: 'B',
    },
  ]

  return (
    <div className="px-3 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col gap-4 sm:gap-6 min-w-0">
      {/* Top Banner */}
      <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-[#eff4ff] text-[#001639] text-[10px] font-bold uppercase tracking-wider">
              Academic Registrar & Examinations
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500">BISE Punjab Compliance</span>
          </div>
          <h1 className="font-domine text-2xl font-bold text-[#001639]">
            Examination Portal & Student Result Card System
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage term date sheets, marks entry rosters, grade computations, and certified printable report cards.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => window.print()}
            className="h-9 px-3.5 bg-slate-50 hover:bg-slate-100 text-[#001639] border border-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[17px]">print</span>
            <span>Print Active Result Card</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl text-xs w-full sm:w-auto self-start">
        <button
          type="button"
          onClick={() => setActiveSubTab('resultcard')}
          className={`px-4 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'resultcard'
              ? 'bg-[#001639] text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span className="material-symbols-outlined text-[17px]">workspace_premium</span>
          <span>Printable Student Result Card</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('spreadsheet')}
          className={`px-4 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'spreadsheet'
              ? 'bg-[#001639] text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span className="material-symbols-outlined text-[17px]">table_chart</span>
          <span>Marks Entry Spreadsheet Grid</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('datesheet')}
          className={`px-4 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'datesheet'
              ? 'bg-[#001639] text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span className="material-symbols-outlined text-[17px]">edit_calendar</span>
          <span>Date Sheet Generator</span>
        </button>
      </div>

      {/* SUBTAB 1: PRINTABLE STUDENT RESULT CARD */}
      {activeSubTab === 'resultcard' && (
        <div className="flex flex-col gap-5">
          {/* Student Selector Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <span className="font-bold text-slate-700">Select Student Record:</span>
              <select
                value={selectedStudent.roll_no}
                onChange={(e) => {
                  const s = INITIAL_STUDENTS.find((st) => st.roll_no === e.target.value)
                  if (s) setSelectedStudent(s)
                }}
                className="h-8 px-3 bg-slate-50 border border-slate-200 rounded-lg font-semibold"
              >
                {INITIAL_STUDENTS.map((st) => (
                  <option key={st.id} value={st.roll_no}>
                    {st.roll_no} — {st.student_name} ({st.class_name})
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-1.5 bg-[#b3272c] hover:bg-[#88131b] text-white font-bold rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>Print A4 Certificate</span>
            </button>
          </div>

          <PrintableResultCard
            studentName={selectedStudent.student_name}
            rollNo={selectedStudent.roll_no}
            fatherName={selectedStudent.father_name}
            regNo={selectedStudent.admission_no}
            className={selectedStudent.class_name}
            bForm={selectedStudent.b_form}
            results={resultsData}
          />
        </div>
      )}

      {/* SUBTAB 2: SPREADSHEET GAZETTE GRID */}
      {activeSubTab === 'spreadsheet' && (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-5 flex flex-col gap-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="font-domine text-sm font-bold text-[#001639]">
                Grade 10 Matric Science — Term 1 Master Gazette Snapshot
              </h2>
              <span className="text-[11px] text-slate-500">
                Evaluation Scope: 8 Subjects • Total Max 550 • Passing Cutoff: 33%
              </span>
            </div>
            <span className="px-2 py-1 rounded bg-emerald-50 text-emerald-700 font-bold">
              100% Results Compiled
            </span>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#001639] text-white text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Roll No</th>
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-1.5 text-center">ENG (75)</th>
                  <th className="py-2.5 px-1.5 text-center">URD (75)</th>
                  <th className="py-2.5 px-1.5 text-center">ISL (50)</th>
                  <th className="py-2.5 px-1.5 text-center">PAK (50)</th>
                  <th className="py-2.5 px-1.5 text-center">MTH (75)</th>
                  <th className="py-2.5 px-1.5 text-center">PHY (75)</th>
                  <th className="py-2.5 px-1.5 text-center">CHM (75)</th>
                  <th className="py-2.5 px-1.5 text-center">BIO (75)</th>
                  <th className="py-2.5 px-2 text-center">Obt. / 550</th>
                  <th className="py-2.5 px-2 text-center">%age</th>
                  <th className="py-2.5 px-1 text-center">Grade</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {gazetteRoster.map((row) => (
                  <tr key={row.rollNo} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2 px-3 font-mono font-bold text-[#001639]">
                      {row.rollNo}
                    </td>
                    <td className="py-2 px-3 font-semibold text-slate-800">
                      {row.name}
                    </td>
                    <td className="py-2 px-1.5 text-center">{row.eng}</td>
                    <td className="py-2 px-1.5 text-center">{row.urd}</td>
                    <td className="py-2 px-1.5 text-center">{row.isl}</td>
                    <td className="py-2 px-1.5 text-center">{row.pak}</td>
                    <td className="py-2 px-1.5 text-center font-bold text-[#001639]">
                      {row.mth}
                    </td>
                    <td className="py-2 px-1.5 text-center">{row.phy}</td>
                    <td className="py-2 px-1.5 text-center">{row.chm}</td>
                    <td className="py-2 px-1.5 text-center">{row.bio}</td>
                    <td className="py-2 px-2 text-center font-mono font-bold text-[#001639]">
                      {row.totalObt}
                    </td>
                    <td className="py-2 px-2 text-center font-bold text-slate-800">
                      {row.pct}
                    </td>
                    <td className="py-2 px-1 text-center font-bold text-[#b3272c]">
                      {row.grade}
                    </td>
                    <td className="py-2 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          const s = INITIAL_STUDENTS.find((st) => st.roll_no === row.rollNo)
                          if (s) setSelectedStudent(s)
                          setActiveSubTab('resultcard')
                        }}
                        className="px-2 py-0.8 bg-slate-100 hover:bg-slate-200 text-[#001639] font-bold rounded text-[11px] cursor-pointer"
                      >
                        Load Card
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 3: DATE SHEET GENERATOR */}
      {activeSubTab === 'datesheet' && (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-5 flex flex-col gap-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="font-domine text-sm font-bold text-[#001639]">
                First Term Examination Date Sheet — Session 2026–2027
              </h2>
              <span className="text-[11px] text-slate-500">
                Authorized by Controller of Examinations • BISE Punjab Pattern
              </span>
            </div>
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3 py-1.5 bg-[#001639] hover:bg-[#122b54] text-white font-bold rounded-lg flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>Print Date Sheet</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dateSheets.map((ds, idx) => (
              <div
                key={idx}
                className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between gap-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-domine font-bold text-sm text-[#001639]">
                    {ds.subject}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#122b54] text-white font-mono font-bold text-[10px]">
                    Max {ds.maxMarks} Marks
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600 text-[11px]">
                  <span>{ds.date}</span>
                  <span className="font-bold text-[#b3272c]">{ds.time}</span>
                </div>
                <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                  <strong>Room:</strong> {ds.room} • <strong>Syllabus:</strong> {ds.syllabus}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
