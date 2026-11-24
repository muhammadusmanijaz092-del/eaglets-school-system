'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { INITIAL_STUDENTS, INITIAL_FACULTY } from '@/lib/mock-data'
import { useRootAdmin } from '@/lib/admin-store'
import { useRBAC, CurrentUser } from '@/lib/rbac-store'

interface TopBarProps {
  isSidebarOpen?: boolean
  onMenuToggle?: () => void
  onNewAdmission?: () => void
  onRecordFee?: () => void
}

const CAMPUSES = [
  'Main Boys Campus, Lahore',
  'Zeenat Ilyas Campus, Burewala',
  'Girls Junior Campus',
  'Gulberg Model Wing',
]

export default function TopBar({
  isSidebarOpen = true,
  onMenuToggle,
  onNewAdmission,
  onRecordFee,
}: TopBarProps) {
  const router = useRouter()
  const { admin, initials } = useRootAdmin()
  const { currentUser, isRootAdmin, hasPermission, switchToRootAdmin, switchUser } = useRBAC()

  const [selectedCampus, setSelectedCampus] = useState('Main Boys Campus, Lahore')
  const [isCampusOpen, setIsCampusOpen] = useState(false)
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isCommandOpen, setIsCommandOpen] = useState(false)
  const [commandQuery, setCommandQuery] = useState('')

  const campusRef = useRef<HTMLDivElement>(null)
  const quickActionRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)

  // Permissions checks
  const canCreateStudent = hasPermission('create_students')
  const canManageFinance = hasPermission('manage_finance')

  // Close popups on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node
      if (campusRef.current && !campusRef.current.contains(target)) {
        setIsCampusOpen(false)
      }
      if (quickActionRef.current && !quickActionRef.current.contains(target)) {
        setIsQuickActionOpen(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(target)) {
        setIsUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  // Global Ctrl+K Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setIsCommandOpen((prev) => !prev)
      } else if (e.key === 'Escape') {
        setIsCommandOpen(false)
        setIsCampusOpen(false)
        setIsQuickActionOpen(false)
        setIsUserMenuOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const quickLinks = [
    { label: 'Dashboard Overview', href: '/', icon: 'grid_view' },
    { label: "Today's Activity", href: '/activity', icon: 'monitoring' },
    { label: 'Student Admissions & Records', href: '/students', icon: 'school' },
    { label: 'Faculty Hiring & Payroll', href: '/faculty', icon: 'badge' },
    { label: 'Fee Finance & PKR Challans', href: '/finance', icon: 'payments' },
    { label: 'Daily Attendance Roll Call', href: '/attendance', icon: 'fact_check' },
    { label: 'Timetable, Syllabus & Diary', href: '/academics', icon: 'menu_book' },
    { label: 'Examination Portal & Results', href: '/examinations', icon: 'assignment_turned_in' },
    { label: 'Settings & Security', href: '/settings', icon: 'admin_panel_settings' },
  ]

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

  const handleActionClick = (actionKey: string) => {
    setIsQuickActionOpen(false)
    switch (actionKey) {
      case 'admit_student':
        if (onNewAdmission) {
          onNewAdmission()
        } else {
          router.push('/students')
        }
        break
      case 'fee_payment':
        if (onRecordFee) {
          onRecordFee()
        } else {
          router.push('/finance')
        }
        break
      case 'student_attendance':
        router.push('/attendance')
        break
      case 'staff_attendance':
        router.push('/faculty')
        break
      case 'generate_monthly_fee':
        router.push('/finance')
        break
      case 'print_fee_slips':
        router.push('/finance')
        break
      case 'add_expense':
        router.push('/finance')
        break
      case 'todays_balance':
        router.push('/finance')
        break
      default:
        break
    }
  }

  return (
    <>
      <header
        className={`fixed top-0 right-0 h-16 bg-white z-40 border-b border-slate-200/90 shadow-[0_1px_4px_rgba(0,22,57,0.03)] flex items-center justify-between px-3 sm:px-6 print:hidden transition-all duration-300 gap-3 sm:gap-4 ${
          isSidebarOpen ? 'left-0 lg:left-72' : 'left-0'
        }`}
      >
        {/* Left: Brand Identity Lockup + Sidebar Toggle */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0">
          {/* Menu Toggle */}
          <button
            type="button"
            onClick={onMenuToggle}
            className="p-1.5 text-slate-600 hover:text-[#001639] hover:bg-slate-100 rounded-lg cursor-pointer flex-shrink-0 transition-colors"
            aria-label="Toggle Navigation Menu"
            title={isSidebarOpen ? 'Collapse sidebar (Ctrl+B)' : 'Expand sidebar (Ctrl+B)'}
          >
            <span className="material-symbols-outlined text-[22px]">
              {isSidebarOpen ? 'menu_open' : 'menu'}
            </span>
          </button>

          {/* School Crest Logo (UNCHANGED OFFICIAL CREST) & Brand Text */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center border border-slate-200/80 shadow-2xs overflow-hidden flex-shrink-0">
              <img
                src="/images/eaglets-logo.jpg"
                alt="Eaglets School System"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-[13.5px] font-bold text-[#001639] leading-tight tracking-tight group-hover:text-blue-700 transition-colors">
                Eaglets School System
              </span>
              <span className="text-[10.5px] text-slate-400 font-medium tracking-tight">
                School Management System
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Search Bar Trigger */}
        <div
          onClick={() => setIsCommandOpen(true)}
          className="flex-1 max-w-md mx-2 sm:mx-4 cursor-pointer group"
        >
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px] group-hover:text-[#001639] transition-colors">
              search
            </span>
            <div className="w-full h-9 pl-9 pr-14 bg-slate-50 text-slate-400 text-xs rounded-lg border border-slate-200 flex items-center group-hover:border-slate-300 group-hover:bg-white transition-all shadow-2xs truncate">
              <span className="truncate">Search students, staff, or modules...</span>
            </div>
            <span className="hidden sm:inline-flex items-center absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-slate-200/60 text-slate-500 text-[10px] font-mono border border-slate-300/80">
              Ctrl+K
            </span>
          </div>
        </div>

        {/* Right Controls: Campus Pill, + Quick Action, Notifications, User */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Campus Selector Pill Dropdown */}
          <div className="relative hidden md:block" ref={campusRef}>
            <button
              type="button"
              onClick={() => setIsCampusOpen(!isCampusOpen)}
              className="h-9 px-3 bg-white text-slate-700 text-xs font-semibold rounded-lg border border-slate-200/90 hover:bg-slate-50 hover:border-slate-300 flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
              title="Select Active Campus"
            >
              <span className="material-symbols-outlined text-[17px] text-slate-500">
                apartment
              </span>
              <span className="truncate max-w-[150px] lg:max-w-[190px]">
                {selectedCampus}
              </span>
              <span className="material-symbols-outlined text-[16px] text-slate-400">
                keyboard_arrow_down
              </span>
            </button>

            {isCampusOpen && (
              <div className="absolute right-0 top-10 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 text-xs">
                <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Select Campus
                </div>
                {CAMPUSES.map((campus) => (
                  <button
                    key={campus}
                    type="button"
                    onClick={() => {
                      setSelectedCampus(campus)
                      setIsCampusOpen(false)
                    }}
                    className={`w-full px-3 py-2 text-left flex items-center justify-between transition-colors cursor-pointer ${
                      selectedCampus === campus
                        ? 'bg-blue-50 text-blue-800 font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="truncate">{campus}</span>
                    {selectedCampus === campus && (
                      <span className="material-symbols-outlined text-[15px] text-blue-600">
                        check
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* + Quick Action ▾ Dropdown Button */}
          <div className="relative" ref={quickActionRef}>
            <button
              type="button"
              onClick={() => setIsQuickActionOpen(!isQuickActionOpen)}
              className="h-9 px-3.5 bg-[#001639] hover:bg-[#07214e] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <span className="text-sm font-bold leading-none">+</span>
              <span className="whitespace-nowrap">Quick Action</span>
              <span className="material-symbols-outlined text-[15px]">keyboard_arrow_down</span>
            </button>

            {isQuickActionOpen && (
              <div className="absolute right-0 top-10 w-60 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 text-xs">
                <div className="px-3 py-1 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Primary Actions
                </div>

                <div className="py-1">
                  <button
                    type="button"
                    onClick={() => handleActionClick('admit_student')}
                    className="w-full px-3 py-2 text-left flex items-center gap-2.5 text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <span className="material-symbols-outlined text-[17px] text-[#b3272c]">
                      person_add
                    </span>
                    <span className="font-semibold">Admit Student</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleActionClick('fee_payment')}
                    className="w-full px-3 py-2 text-left flex items-center gap-2.5 text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <span className="material-symbols-outlined text-[17px] text-[#001639]">
                      payments
                    </span>
                    <span className="font-semibold">Fee Payment</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleActionClick('student_attendance')}
                    className="w-full px-3 py-2 text-left flex items-center gap-2.5 text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <span className="material-symbols-outlined text-[17px] text-emerald-600">
                      fact_check
                    </span>
                    <span className="font-semibold">Student Attendance</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleActionClick('staff_attendance')}
                    className="w-full px-3 py-2 text-left flex items-center gap-2.5 text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <span className="material-symbols-outlined text-[17px] text-blue-600">
                      badge
                    </span>
                    <span className="font-semibold">Staff Attendance</span>
                  </button>
                </div>

                <div className="border-t border-slate-100 py-1">
                  <button
                    type="button"
                    onClick={() => handleActionClick('generate_monthly_fee')}
                    className="w-full px-3 py-2 text-left flex items-center gap-2.5 text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <span className="material-symbols-outlined text-[17px] text-indigo-600">
                      receipt_long
                    </span>
                    <span>Generate Monthly Fee</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleActionClick('print_fee_slips')}
                    className="w-full px-3 py-2 text-left flex items-center gap-2.5 text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <span className="material-symbols-outlined text-[17px] text-amber-600">
                      print
                    </span>
                    <span>Print Fee Slips</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleActionClick('add_expense')}
                    className="w-full px-3 py-2 text-left flex items-center gap-2.5 text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <span className="material-symbols-outlined text-[17px] text-rose-600">
                      account_balance_wallet
                    </span>
                    <span>Add Expense</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleActionClick('todays_balance')}
                    className="w-full px-3 py-2 text-left flex items-center gap-2.5 text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <span className="material-symbols-outlined text-[17px] text-teal-600">
                      request_quote
                    </span>
                    <span>Today&apos;s Balance Sheet</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* System Notification Bell */}
          <button
            type="button"
            className="relative w-9 h-9 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="System Notifications"
            aria-label="System Notifications"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#b3272c] ring-2 ring-white"></span>
          </button>

          {/* User Profile Pill & Dropdown */}
          <div className="relative" ref={userMenuRef}>
            <button
              type="button"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 pl-1 pr-1.5 py-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              title={`${currentUser.name} (${currentUser.designation})`}
            >
              {/* Avatar circle / portrait */}
              <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden ring-1 ring-slate-300/80 flex items-center justify-center text-xs font-bold text-[#001639]">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Usman"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to initials if image fails
                    ;(e.target as HTMLElement).style.display = 'none'
                  }}
                />
                <span className="select-none">{initials || 'U'}</span>
              </div>
              <span className="hidden sm:inline text-xs font-semibold text-slate-800">
                Usman
              </span>
              <span className="material-symbols-outlined text-[16px] text-slate-400">
                keyboard_arrow_down
              </span>
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 top-11 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 text-xs">
                <div className="px-3.5 py-2 border-b border-slate-100">
                  <div className="font-bold text-slate-900 leading-tight">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">
                    {currentUser.designation}
                  </div>
                </div>

                <div className="p-1">
                  {isRootAdmin && (
                    <Link
                      href="/access-control"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="w-full px-3 py-2 text-left flex items-center gap-2 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px] text-[#f5bc71]">
                        security
                      </span>
                      <span className="font-semibold text-[#001639]">Access Control Panel</span>
                    </Link>
                  )}

                  <Link
                    href="/settings"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="w-full px-3 py-2 text-left flex items-center gap-2 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px] text-slate-500">
                      settings
                    </span>
                    <span>School Settings</span>
                  </Link>

                  <Link
                    href="/activity"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="w-full px-3 py-2 text-left flex items-center gap-2 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px] text-slate-500">
                      monitoring
                    </span>
                    <span>Today&apos;s Activity</span>
                  </Link>
                </div>

                {/* Role Switcher for Testing */}
                <div className="border-t border-slate-100 p-2">
                  <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Role Simulation
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        switchToRootAdmin()
                        setIsUserMenuOpen(false)
                      }}
                      className={`w-full px-2.5 py-1.5 rounded-md text-left flex items-center justify-between text-[11px] cursor-pointer ${
                        isRootAdmin ? 'bg-slate-100 font-bold text-[#001639]' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span>Root Admin</span>
                      {isRootAdmin && <span className="material-symbols-outlined text-[14px]">check</span>}
                    </button>
                    {['Teacher', 'Accountant', 'Front Desk'].map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => {
                          switchUser({
                            id: `test-${role.toLowerCase()}`,
                            name: `Test ${role}`,
                            username: `test.${role.toLowerCase()}`,
                            designation: role,
                            isRoot: false,
                          })
                          setIsUserMenuOpen(false)
                        }}
                        className={`w-full px-2.5 py-1.5 rounded-md text-left flex items-center justify-between text-[11px] cursor-pointer ${
                          !isRootAdmin && currentUser.designation === role
                            ? 'bg-blue-50 font-bold text-blue-700'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span>{role}</span>
                        {!isRootAdmin && currentUser.designation === role && (
                          <span className="material-symbols-outlined text-[14px]">check</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
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

              {/* Students Search Results */}
              {commandQuery && filteredStudents.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1 block">
                    Students ({filteredStudents.length})
                  </span>
                  <div className="flex flex-col gap-1">
                    {filteredStudents.map((st) => (
                      <button
                        key={st.id}
                        onClick={() => navigateTo(`/students`)}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 text-left cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[16px] text-[#b3272c]">
                            school
                          </span>
                          <span className="font-semibold text-slate-800">
                            {st.student_name}
                          </span>
                          <span className="text-slate-400 font-mono text-[10px]">
                            {st.roll_no}
                          </span>
                        </div>
                        <span className="text-slate-500 font-medium">
                          {st.class_name || 'Class'} - {st.section}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Faculty Search Results */}
              {commandQuery && filteredFaculty.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1 block">
                    Faculty ({filteredFaculty.length})
                  </span>
                  <div className="flex flex-col gap-1">
                    {filteredFaculty.map((fac) => (
                      <button
                        key={fac.id}
                        onClick={() => navigateTo(`/faculty`)}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 text-left cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[16px] text-[#001639]">
                            badge
                          </span>
                          <span className="font-semibold text-slate-800">
                            {fac.full_name}
                          </span>
                          <span className="text-slate-400 font-mono text-[10px]">
                            {fac.emp_id}
                          </span>
                        </div>
                        <span className="text-slate-500 font-medium">{fac.designation}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* No results */}
              {commandQuery &&
                filteredStudents.length === 0 &&
                filteredFaculty.length === 0 && (
                  <div className="py-8 text-center text-slate-400">
                    <span className="material-symbols-outlined text-4xl block mb-2 opacity-50">
                      search_off
                    </span>
                    No records found for &quot;{commandQuery}&quot;
                  </div>
                )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
