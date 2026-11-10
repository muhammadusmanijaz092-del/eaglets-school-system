'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { INITIAL_STUDENTS, INITIAL_FACULTY } from '@/lib/mock-data'
import { useRootAdmin } from '@/lib/admin-store'

interface TopBarProps {
  onMenuToggle?: () => void
  onNewAdmission?: () => void
  onRecordFee?: () => void
}

export default function TopBar({ onMenuToggle, onNewAdmission, onRecordFee }: TopBarProps) {
  const router = useRouter()
  const { admin, initials } = useRootAdmin()
  const [selectedCampus, setSelectedCampus] = useState('Main Boys Campus, Lahore')
  const [isCommandOpen, setIsCommandOpen] = useState(false)
  const [commandQuery, setCommandQuery] = useState('')

  // Global Ctrl+K Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setIsCommandOpen((prev) => !prev)
      } else if (e.key === 'Escape') {
        setIsCommandOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const quickLinks = [
    { label: 'Dashboard Overview', href: '/', icon: 'grid_view' },
    { label: 'Student Admissions & Records', href: '/students', icon: 'school' },
    { label: 'Faculty Hiring & Payroll', href: '/faculty', icon: 'badge' },
    { label: 'Fee Finance & PKR Challans', href: '/finance', icon: 'payments' },
    { label: 'Daily Attendance Roll Call', href: '/attendance', icon: 'fact_check' },
    { label: 'Timetable, Syllabus & Diary', href: '/academics', icon: 'menu_book' },
    { label: 'Examination Portal & Results', href: '/examinations', icon: 'assignment_turned_in' },
    { label: 'Settings & Security', href: '/settings', icon: 'admin_panel_settings' },
  ]

  // Filter students or actions
  const filteredStudents = INITIAL_STUDENTS.filter(
    (s) =>
      s.student_name.toLowerCase().includes(commandQuery.toLowerCase()) ||
      s.roll_no.toLowerCase().includes(commandQuery.toLowerCase()) ||
      s.b_form.includes(commandQuery)
  )

  const filteredFaculty = INITIAL_FACULTY.filter(
    (f) =>
      f.full_name.toLowerCase().includes(commandQuery.toLowerCase()) ||
      f.emp_id.toLowerCase().includes(commandQuery.toLowerCase()) ||
      f.designation.toLowerCase().includes(commandQuery.toLowerCase())
  )

  const navigateTo = (path: string) => {
    setIsCommandOpen(false)
    router.push(path)
  }

  return (
    <>
      <header className="fixed top-0 left-0 lg:left-72 right-0 h-16 bg-white/95 backdrop-blur-md z-40 border-b border-slate-200 shadow-[0_1px_4px_rgba(0,22,57,0.04)] flex items-center justify-between px-3 sm:px-6 print:hidden transition-all duration-300 gap-2 sm:gap-4">
        {/* Left Side: Mobile Menu Button & Search */}
        <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0 max-w-md">
          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={onMenuToggle}
            className="lg:hidden p-1.5 sm:p-2 -ml-1 text-slate-700 hover:text-[#001639] hover:bg-slate-100 rounded-lg cursor-pointer flex-shrink-0"
            aria-label="Toggle Navigation Menu"
          >
            <span className="material-symbols-outlined text-[24px]">menu</span>
          </button>

          {/* Mobile Crest Logo */}
          <div className="lg:hidden flex items-center gap-1.5 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-white p-0.5 flex items-center justify-center shadow-xs border border-slate-200 overflow-hidden">
              <img
                src="/images/eaglets-logo.jpg"
                alt="Eaglets Schools Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Search Trigger Bar */}
          <div
            onClick={() => setIsCommandOpen(true)}
            className="relative flex-1 min-w-0 cursor-pointer group"
          >
            <span className="material-symbols-outlined absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px] group-hover:text-[#001639] transition-colors">
              search
            </span>
            <div className="w-full h-9 pl-8 sm:pl-9 pr-2 sm:pr-14 bg-slate-50 text-slate-400 text-xs rounded-lg border border-slate-200 flex items-center group-hover:border-[#122b54] group-hover:bg-white transition-all shadow-2xs truncate">
              <span className="hidden sm:inline truncate">Search students, faculty, or jump to module...</span>
              <span className="sm:hidden truncate">Search...</span>
            </div>
            <span className="hidden sm:inline-block absolute right-2 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-slate-200/70 text-slate-600 text-[10px] font-mono border border-slate-300">
              Ctrl+K
            </span>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Live Date / PKR Banner */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-xs">
            <span className="material-symbols-outlined text-[15px] text-[#001639]">
              calendar_today
            </span>
            <span className="font-semibold">Monday, 16 Sep 2026</span>
            <span className="text-slate-300">|</span>
            <span className="font-bold text-[#b3272c]">PKR Live Ledger</span>
          </div>

          {/* Campus Dropdown (Hidden on Small Screens) */}
          <div className="hidden md:flex items-center gap-2">
            <select
              value={selectedCampus}
              onChange={(e) => setSelectedCampus(e.target.value)}
              className="h-9 px-2.5 bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 focus:outline-none focus:border-[#122b54] cursor-pointer"
            >
              <option value="Main Boys Campus, Lahore">Main Boys Campus, Lahore</option>
              <option value="Girls Junior Campus">Girls Junior Campus</option>
              <option value="Gulberg Model Wing">Gulberg Model Wing</option>
            </select>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {onNewAdmission ? (
              <button
                type="button"
                onClick={onNewAdmission}
                className="h-8 sm:h-9 px-2.5 sm:px-3.5 bg-[#b3272c] text-white hover:bg-[#88131b] text-xs font-semibold rounded-lg flex items-center gap-1 sm:gap-1.5 transition-colors shadow-xs cursor-pointer"
                title="New Admission"
              >
                <span className="material-symbols-outlined text-[16px] sm:text-[17px]">person_add</span>
                <span className="hidden sm:inline">+ New Admission</span>
              </button>
            ) : (
              <Link
                href="/students"
                className="h-8 sm:h-9 px-2.5 sm:px-3.5 bg-[#b3272c] text-white hover:bg-[#88131b] text-xs font-semibold rounded-lg flex items-center gap-1 sm:gap-1.5 transition-colors shadow-xs"
                title="New Admission"
              >
                <span className="material-symbols-outlined text-[16px] sm:text-[17px]">person_add</span>
                <span className="hidden sm:inline">+ New Admission</span>
              </Link>
            )}

            {onRecordFee ? (
              <button
                type="button"
                onClick={onRecordFee}
                className="h-8 sm:h-9 px-2.5 sm:px-3.5 bg-[#122b54] text-white hover:bg-[#001639] text-xs font-semibold rounded-lg flex items-center gap-1 sm:gap-1.5 transition-colors shadow-xs cursor-pointer"
                title="Record Fee"
              >
                <span className="material-symbols-outlined text-[16px] sm:text-[17px]">receipt_long</span>
                <span className="hidden sm:inline">+ Record Fee</span>
              </button>
            ) : (
              <Link
                href="/finance"
                className="h-8 sm:h-9 px-2.5 sm:px-3.5 bg-[#122b54] text-white hover:bg-[#001639] text-xs font-semibold rounded-lg flex items-center gap-1 sm:gap-1.5 transition-colors shadow-xs"
                title="Record Fee"
              >
                <span className="material-symbols-outlined text-[16px] sm:text-[17px]">receipt_long</span>
                <span className="hidden sm:inline">+ Record Fee</span>
              </Link>
            )}
          </div>

          {/* Notifications & Avatar */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            {/* Global Root Badge */}
            <Link
              href="/settings"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#001639] text-white text-[11px] font-bold hover:bg-[#b3272c] transition-colors border border-slate-700 shadow-2xs"
              title="Global Root Access Active"
            >
              <span className="material-symbols-outlined text-[13px] text-[#f5bc71]">
                shield_person
              </span>
              <span>Root Admin</span>
            </Link>

            <button
              type="button"
              className="relative w-9 h-9 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="System Notifications"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#b3272c]"></span>
            </button>
            <Link
              href="/settings"
              className="w-8 h-8 rounded-full bg-[#001639] flex items-center justify-center text-white text-xs font-bold hover:ring-2 hover:ring-[#b3272c] transition-all flex-shrink-0"
              title={`Global Root Profile (${admin.name}) • Click to Edit Credentials`}
            >
              {initials}
            </Link>
          </div>
        </div>
      </header>

      {/* Ctrl+K Command Palette Modal */}
      {isCommandOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-100">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-100">
            {/* Search Input Box */}
            <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50/80">
              <span className="material-symbols-outlined text-slate-400 text-[22px]">
                search
              </span>
              <input
                type="text"
                autoFocus
                value={commandQuery}
                onChange={(e) => setCommandQuery(e.target.value)}
                placeholder="Type a student name, roll #, employee ID, or module..."
                className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setIsCommandOpen(false)}
                className="px-2 py-1 text-[10px] font-mono text-slate-400 bg-slate-200 rounded hover:text-slate-700 cursor-pointer"
              >
                ESC
              </button>
            </div>

            {/* Results Body */}
            <div className="p-3 max-h-96 overflow-y-auto flex flex-col gap-3 text-xs">
              {/* Quick Jump Modules */}
              {!commandQuery && (
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5 block">
                    Quick Navigation
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {quickLinks.map((item) => (
                      <button
                        key={item.href}
                        onClick={() => navigateTo(item.href)}
                        className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-100 text-left text-slate-700 transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px] text-[#001639]">
                          {item.icon}
                        </span>
                        <span className="font-semibold truncate">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Student Results */}
              {filteredStudents.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1 block">
                    Enrolled Students ({filteredStudents.length})
                  </span>
                  <div className="flex flex-col gap-1">
                    {filteredStudents.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => navigateTo('/students')}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-[#eff4ff] text-left transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-[#122b54] text-white flex items-center justify-center font-bold text-[10px]">
                            {s.student_name.slice(0, 1)}
                          </span>
                          <div>
                            <span className="font-bold text-[#001639] block">
                              {s.student_name}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {s.class_name} • B-Form: {s.b_form}
                            </span>
                          </div>
                        </div>
                        <span className="font-mono text-slate-500 font-bold">
                          {s.roll_no}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Faculty Results */}
              {filteredFaculty.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1 block">
                    Faculty & Staff ({filteredFaculty.length})
                  </span>
                  <div className="flex flex-col gap-1">
                    {filteredFaculty.map((f) => (
                      <button
                        key={f.id}
                        onClick={() => navigateTo('/faculty')}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-[#eff4ff] text-left transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-[#b3272c] text-white flex items-center justify-center font-bold text-[10px]">
                            {f.full_name.slice(0, 1)}
                          </span>
                          <div>
                            <span className="font-bold text-[#001639] block">
                              {f.full_name}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {f.designation} • {f.department}
                            </span>
                          </div>
                        </div>
                        <span className="font-mono text-slate-500 font-bold">
                          {f.emp_id}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-[10px] text-slate-400 flex items-center justify-between px-4">
              <span>Use <strong>↑</strong> <strong>↓</strong> to navigate, <strong>ESC</strong> to close</span>
              <span>Eaglets Command Center</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
