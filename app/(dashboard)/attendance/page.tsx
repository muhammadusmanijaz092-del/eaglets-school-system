'use client'

import React, { useState } from 'react'
import { INITIAL_STUDENTS, INITIAL_FACULTY, INITIAL_CLASSES } from '@/lib/mock-data'

type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Leave'

interface RosterRow {
  id: string
  identifier: string // Roll No or Emp ID
  name: string
  classOrDesignation: string
  status: AttendanceStatus
  timeIn: string
}

export default function AttendancePage() {
  const [entityType, setEntityType] = useState<'Student' | 'Faculty'>('Student')
  const [selectedDate, setSelectedDate] = useState('2026-09-16')
  const [selectedClass, setSelectedClass] = useState('Grade 10 - Science A (Rose)')

  // Initial Roster Rows
  const [studentRoster, setStudentRoster] = useState<RosterRow[]>(
    INITIAL_STUDENTS.map((s, idx) => ({
      id: s.id,
      identifier: s.roll_no,
      name: s.student_name,
      classOrDesignation: s.class_name || 'Grade 10',
      status: idx === 2 ? 'Absent' : idx === 3 ? 'Late' : 'Present',
      timeIn: idx === 2 ? '—' : idx === 3 ? '08:22 AM' : '07:50 AM',
    }))
  )

  const [facultyRoster, setFacultyRoster] = useState<RosterRow[]>(
    INITIAL_FACULTY.map((f, idx) => ({
      id: f.id,
      identifier: f.emp_id,
      name: f.full_name,
      classOrDesignation: f.designation,
      status: idx === 3 ? 'Leave' : 'Present',
      timeIn: idx === 3 ? '—' : '07:40 AM',
    }))
  )

  const [smsAlertSent, setSmsAlertSent] = useState(false)

  const currentRoster = entityType === 'Student' ? studentRoster : facultyRoster
  const setCurrentRoster = entityType === 'Student' ? setStudentRoster : setFacultyRoster

  const handleStatusChange = (id: string, newStatus: AttendanceStatus) => {
    setCurrentRoster((prev) =>
      prev.map((row) =>
        row.id === id
          ? {
              ...row,
              status: newStatus,
              timeIn: newStatus === 'Absent' || newStatus === 'Leave' ? '—' : '07:55 AM',
            }
          : row
      )
    )
  }

  const handleMarkAllPresent = () => {
    setCurrentRoster((prev) =>
      prev.map((row) => ({
        ...row,
        status: 'Present',
        timeIn: '07:50 AM',
      }))
    )
  }

  const handleSendAbsenteeSMS = () => {
    setSmsAlertSent(true)
    setTimeout(() => setSmsAlertSent(false), 4000)
  }

  const presentCount = currentRoster.filter((r) => r.status === 'Present').length
  const absentCount = currentRoster.filter((r) => r.status === 'Absent').length
  const lateCount = currentRoster.filter((r) => r.status === 'Late').length
  const leaveCount = currentRoster.filter((r) => r.status === 'Leave').length
  const attendanceRate = ((presentCount / currentRoster.length) * 100).toFixed(1)

  return (
    <div className="px-8 py-6 flex flex-col gap-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-[#eff4ff] text-[#001639] text-[10px] font-bold uppercase tracking-wider">
              Biometric & Manual Attendance Roster
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500">Live Campus Roll Call</span>
          </div>
          <h1 className="font-domine text-2xl font-bold text-[#001639]">
            Daily Attendance Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Log, monitor, and broadcast daily student and teacher attendance status with automatic absence alerts.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={handleMarkAllPresent}
            className="h-9 px-3.5 bg-slate-50 hover:bg-slate-100 text-[#001639] border border-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[17px] text-emerald-600">
              done_all
            </span>
            <span>Mark All Present</span>
          </button>
          <button
            type="button"
            onClick={handleSendAbsenteeSMS}
            className="h-9 px-3.5 bg-[#b3272c] hover:bg-[#88131b] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[17px]">sms</span>
            <span>Send Absent SMS to Parents</span>
          </button>
        </div>
      </div>

      {smsAlertSent && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2.5 rounded-lg text-xs flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-emerald-600">
              check_circle
            </span>
            Automatic Absence SMS triggered for {absentCount} parents with school helpline number!
          </span>
          <button
            onClick={() => setSmsAlertSent(false)}
            className="text-emerald-700 hover:text-emerald-900"
          >
            ✕
          </button>
        </div>
      )}

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase">
            Total In Roster
          </span>
          <span className="text-xl font-bold font-domine text-[#001639] mt-1">
            {currentRoster.length}
          </span>
          <span className="text-[10px] text-slate-500">
            {entityType === 'Student' ? 'Students' : 'Faculty'}
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-[10px] font-bold text-emerald-700 uppercase">Present</span>
          <span className="text-xl font-bold font-domine text-emerald-600 mt-1">
            {presentCount}
          </span>
          <span className="text-[10px] text-emerald-600 font-semibold">
            {attendanceRate}% Present
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-[10px] font-bold text-[#b3272c] uppercase">Absent</span>
          <span className="text-xl font-bold font-domine text-[#b3272c] mt-1">
            {absentCount}
          </span>
          <span className="text-[10px] text-[#b3272c]">Awaiting parent excuse</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-[10px] font-bold text-amber-700 uppercase">Late</span>
          <span className="text-xl font-bold font-domine text-amber-600 mt-1">
            {lateCount}
          </span>
          <span className="text-[10px] text-amber-600">Gate arrival after 08:00 AM</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-[10px] font-bold text-indigo-700 uppercase">
            Official Leave
          </span>
          <span className="text-xl font-bold font-domine text-indigo-600 mt-1">
            {leaveCount}
          </span>
          <span className="text-[10px] text-indigo-600">Approved written slip</span>
        </div>
      </div>

      {/* Segmented Toggle & Date Selection */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs w-full md:w-auto">
          <button
            type="button"
            onClick={() => setEntityType('Student')}
            className={`flex-1 md:flex-none px-4 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
              entityType === 'Student'
                ? 'bg-white text-[#001639] shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            [ Student Attendance ]
          </button>
          <button
            type="button"
            onClick={() => setEntityType('Faculty')}
            className={`flex-1 md:flex-none px-4 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
              entityType === 'Faculty'
                ? 'bg-white text-[#001639] shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            [ Faculty Attendance ]
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="h-9 px-3 bg-slate-50 text-xs font-semibold rounded-lg border border-slate-200"
          />

          {entityType === 'Student' && (
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="h-9 px-3 bg-slate-50 text-xs font-semibold rounded-lg border border-slate-200 cursor-pointer"
            >
              {INITIAL_CLASSES.map((c) => (
                <option key={c.id} value={`${c.name} - ${c.section}`}>
                  {c.name} - {c.section}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Attendance Roster Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">
                  {entityType === 'Student' ? 'Roll No' : 'Emp ID'}
                </th>
                <th className="py-3 px-3">Name</th>
                <th className="py-3 px-3">
                  {entityType === 'Student' ? 'Class & Section' : 'Designation'}
                </th>
                <th className="py-3 px-3">Time In</th>
                <th className="py-3 px-4 text-center">Status Toggle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {currentRoster.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#001639]">
                    {row.identifier}
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-800">
                    {row.name}
                  </td>
                  <td className="py-3 px-3 text-slate-600">
                    {row.classOrDesignation}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-500">
                    {row.timeIn}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center gap-1.5">
                      {[
                        {
                          id: 'Present',
                          color: 'bg-emerald-50 text-emerald-700 border-emerald-300',
                          active: 'bg-emerald-600 text-white font-bold',
                        },
                        {
                          id: 'Absent',
                          color: 'bg-rose-50 text-rose-700 border-rose-300',
                          active: 'bg-[#b3272c] text-white font-bold',
                        },
                        {
                          id: 'Late',
                          color: 'bg-amber-50 text-amber-700 border-amber-300',
                          active: 'bg-amber-600 text-white font-bold',
                        },
                        {
                          id: 'Leave',
                          color: 'bg-indigo-50 text-indigo-700 border-indigo-300',
                          active: 'bg-indigo-600 text-white font-bold',
                        },
                      ].map((btn) => (
                        <button
                          key={btn.id}
                          type="button"
                          onClick={() =>
                            handleStatusChange(row.id, btn.id as AttendanceStatus)
                          }
                          className={`px-3 py-1 rounded text-[11px] border transition-all cursor-pointer ${
                            row.status === btn.id
                              ? `${btn.active} shadow-2xs`
                              : `${btn.color} hover:opacity-80`
                          }`}
                        >
                          {btn.id}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

