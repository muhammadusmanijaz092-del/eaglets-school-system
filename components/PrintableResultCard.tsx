'use client'

import React from 'react'
import { ExamResultRow } from '@/lib/supabase/types'

interface PrintableResultCardProps {
  studentName?: string
  rollNo?: string
  fatherName?: string
  regNo?: string
  className?: string
  bForm?: string
  dob?: string
  campus?: string
  session?: string
  termName?: string
  results?: ExamResultRow[]
  attendancePercentage?: number
}

export default function PrintableResultCard({
  studentName = 'Muhammad Rayyan Butt',
  rollNo = 'EAG-10-042',
  fatherName = 'Tariq Mehmood Butt',
  regNo = 'AD-2022-118',
  className = '10th (Matric Science) - Section A (Rose)',
  bForm = '35201-8491023-1',
  dob = '14-May-2010',
  campus = 'Main Boys Campus, Lahore',
  session = 'Session 2026–2027',
  termName = 'First Term Examination 2026',
  results = [],
  attendancePercentage = 96.5,
}: PrintableResultCardProps) {
  const totalMax = results.reduce((acc, r) => acc + r.total_max_marks, 0) || 550
  const totalObt = results.reduce((acc, r) => acc + r.obt_total_marks, 0) || 491
  const overallPercentage = ((totalObt / totalMax) * 100).toFixed(2)

  let overallGrade = 'A+'
  const p = parseFloat(overallPercentage)
  if (p >= 80) overallGrade = 'A+'
  else if (p >= 70) overallGrade = 'A'
  else if (p >= 60) overallGrade = 'B'
  else if (p >= 50) overallGrade = 'C'
  else if (p >= 40) overallGrade = 'D'
  else overallGrade = 'Fail'

  return (
    <div className="printable-area bg-white rounded-xl shadow-lg border border-slate-200 p-6 sm:p-10 relative text-slate-800">
      {/* Action Bar (Hidden on print) */}
      <div className="flex flex-col sm:flex-row items-center justify-between pb-5 mb-6 border-b border-slate-200 gap-3 no-print">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[22px] text-[#b3272c]">
            verified_user
          </span>
          <div>
            <h3 className="font-domine font-bold text-sm text-[#001639]">
              Authenticated Document Preview #EAG-REP-2026-0429
            </h3>
            <span className="text-[11px] text-slate-500">
              Board of Intermediate & Secondary Education (BISE) Lahore Compliant
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="h-8 px-4 bg-[#b3272c] text-white hover:bg-[#88131b] rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">print</span>
            <span>Print Result Card (A4 High-Res)</span>
          </button>
        </div>
      </div>

      {/* Official Certificate Framing */}
      <div className="border-4 border-double border-[#001639]/30 p-5 sm:p-8 rounded-lg relative">
        {/* Crest Watermark Behind */}
        <div className="absolute inset-0 flex items-center justify-center opacity-4 pointer-events-none text-9xl">
          🦅
        </div>

        {/* Institutional Header */}
        <div className="flex flex-col items-center text-center pb-5 mb-5 border-b border-slate-200 relative">
          <div className="w-16 h-16 rounded-2xl bg-white p-1 flex items-center justify-center shadow-xs border border-slate-200 mb-2 overflow-hidden">
            <img
              src="/images/eaglets-logo.jpg"
              alt="Eaglets Schools Crest"
              className="w-full h-full object-contain"
            />
          </div>
          <h2 className="font-baldwins text-2xl sm:text-3xl font-bold tracking-wider text-[#001639]">
            EAGLETS SCHOOLS
          </h2>
          <div className="flex items-center gap-3 my-1.5 justify-center">
            <span className="h-0.5 w-10 bg-[#b3272c] rounded-full"></span>
            <span className="font-aster text-xs sm:text-sm text-[#b3272c] tracking-wide">
              Rebirth Of Knowledge & Character
            </span>
            <span className="h-0.5 w-10 bg-[#b3272c] rounded-full"></span>
          </div>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">
            Accredited by Board of Intermediate & Secondary Education (BISE) Lahore, Pakistan
          </p>

          <div className="mt-3 py-1 px-6 rounded-full bg-[#122b54] text-white">
            <span className="font-domine text-xs sm:text-sm font-semibold tracking-wider uppercase">
              Official Academic Progress Report & Result Card
            </span>
          </div>
          <span className="text-xs font-bold text-[#b3272c] mt-1.5 uppercase tracking-wide">
            {termName} — {session}
          </span>
        </div>

        {/* Student Bio-Data Dossier */}
        <div className="bg-slate-50 p-4 rounded-xl mb-5 border border-slate-200">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                Student Full Name
              </span>
              <span className="font-bold text-[#001639] text-sm">{studentName}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                Institutional Roll No
              </span>
              <span className="font-mono font-bold text-[#b3272c] text-sm">
                {rollNo}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                Father&apos;s Name
              </span>
              <span className="font-semibold text-slate-800">{fatherName}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                Registration No
              </span>
              <span className="font-mono font-semibold text-slate-800">{regNo}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                Academic Class
              </span>
              <span className="font-semibold text-slate-800">{className}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                Campus Location
              </span>
              <span className="font-semibold text-slate-800">{campus}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                Date of Birth
              </span>
              <span className="font-semibold text-slate-800">{dob}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                NADRA B-Form ID
              </span>
              <span className="font-mono text-slate-700">{bForm}</span>
            </div>
          </div>
        </div>

        {/* Subject-Wise Table */}
        <div className="mb-5 overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#001639] text-white text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-2 px-2.5">Subject Name</th>
                <th className="py-2 px-1 text-center">Total</th>
                <th className="py-2 px-1 text-center">Pass</th>
                <th className="py-2 px-1 text-center">Theory</th>
                <th className="py-2 px-1 text-center">Pract/Viva</th>
                <th className="py-2 px-2 text-center">Obt. Marks</th>
                <th className="py-2 px-1 text-center">Grade</th>
                <th className="py-2 px-1 text-center">Rank</th>
                <th className="py-2 px-2.5">Teacher Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {results.map((row, idx) => (
                <tr
                  key={idx}
                  className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}
                >
                  <td className="py-1.5 px-2.5 font-semibold text-[#001639]">
                    {row.subject_name}
                  </td>
                  <td className="py-1.5 px-1 text-center">{row.total_max_marks}</td>
                  <td className="py-1.5 px-1 text-center text-slate-400">
                    {row.passing_marks}
                  </td>
                  <td className="py-1.5 px-1 text-center font-medium">
                    {row.obt_theory}
                  </td>
                  <td className="py-1.5 px-1 text-center text-slate-400">
                    {row.max_practical > 0 ? row.obt_practical : '—'}
                  </td>
                  <td className="py-1.5 px-2 text-center font-bold text-[#001639]">
                    {row.obt_total_marks}{' '}
                    <span className="text-[10px] text-slate-400 font-normal">
                      ({row.percentage.toFixed(1)}%)
                    </span>
                  </td>
                  <td className="py-1.5 px-1 text-center font-bold text-[#b3272c]">
                    {row.letter_grade}
                  </td>
                  <td className="py-1.5 px-1 text-center text-slate-500 font-medium">
                    {row.class_rank || '—'}
                  </td>
                  <td className="py-1.5 px-2.5 text-[11px] text-slate-600 italic">
                    {row.teacher_remarks || 'Satisfactory progress'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Overall Academic Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 bg-[#122b54] text-white p-3 rounded-lg text-center mb-6">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase text-[#7d93c2]">Max Marks</span>
            <span className="text-sm font-bold font-mono">{totalMax}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase text-[#7d93c2]">Marks Obt.</span>
            <span className="text-sm font-bold font-mono text-[#f5bc71]">{totalObt}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase text-[#7d93c2]">Percentage</span>
            <span className="text-sm font-bold font-mono">{overallPercentage}%</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase text-[#7d93c2]">Final Grade</span>
            <span className="text-sm font-bold text-[#fc5c5b]">{overallGrade}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase text-[#7d93c2]">Class Position</span>
            <span className="text-sm font-bold">1st Position</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase text-[#7d93c2]">Attendance</span>
            <span className="text-sm font-bold">{attendancePercentage}%</span>
          </div>
        </div>

        {/* Signatures & Accreditation Footer */}
        <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-300 text-center text-xs">
          <div className="flex flex-col items-center">
            <div className="h-10 border-b border-slate-400 w-32 mb-1"></div>
            <span className="font-bold text-slate-700">Class In-charge</span>
            <span className="text-[10px] text-slate-500">Signature & Date</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="h-10 border-b border-slate-400 w-32 mb-1 flex items-end justify-center">
              <span className="text-[10px] text-slate-400 font-mono">SEAL AFFIXED</span>
            </div>
            <span className="font-bold text-slate-700">Controller of Exams</span>
            <span className="text-[10px] text-slate-500">Official Stamp</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="h-10 border-b border-slate-400 w-32 mb-1 flex items-end justify-center">
              <span className="text-xs font-serif font-bold text-[#001639] italic">
                M. Tariq Alvi
              </span>
            </div>
            <span className="font-bold text-slate-700">Principal</span>
            <span className="text-[10px] text-slate-500">Chief Executive</span>
          </div>
        </div>
      </div>
    </div>
  )
}

