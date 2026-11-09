'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavItem {
  label: string
  href: string
  icon: string
  badge?: string
}

const navItems: NavItem[] = [
  { label: 'Dashboard Overview', href: '/', icon: 'grid_view' },
  { label: 'Super Admin Console', href: '/super-admin', icon: 'shield_person', badge: 'Root' },
  { label: 'Student Admissions & Profiles', href: '/students', icon: 'school' },
  { label: 'Faculty Hiring & Payroll', href: '/faculty', icon: 'badge' },
  { label: 'Fee & Finance (PKR Challans)', href: '/finance', icon: 'payments' },
  { label: 'Daily Attendance', href: '/attendance', icon: 'fact_check' },
  { label: 'Timetable, Syllabus & Diary', href: '/academics', icon: 'menu_book' },
  { label: 'Examination & Result Cards', href: '/examinations', icon: 'assignment_turned_in' },
  { label: 'Settings & Access Control', href: '/settings', icon: 'admin_panel_settings' },
]

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={`fixed left-0 top-0 h-screen w-72 max-w-[85vw] bg-[#122b54] text-white z-50 flex flex-col border-r border-slate-700/40 shadow-2xl print:hidden overflow-hidden transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      {/* School Crest & Header (Fixed Top) */}
      <div className="flex-shrink-0 p-5 border-b border-white/10">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xl flex-shrink-0 border border-white/20 shadow-inner">
              🦅
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-domine text-lg font-bold tracking-wide leading-tight text-white truncate">
                EAGLETS SCHOOLS
              </span>
              <span className="text-[10px] text-[#7d93c2] uppercase tracking-wider font-semibold truncate">
                Rebirth Of Knowledge & Character
              </span>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 cursor-pointer flex-shrink-0"
            aria-label="Close Navigation"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="mt-3.5 pt-3 border-t border-white/10 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-[#b3272c] text-white text-[11px] font-bold tracking-wide shadow-xs">
              Session 2026–2027
            </span>
            <span className="text-[11px] text-[#7d93c2] flex items-center gap-1 font-medium">
              <span className="material-symbols-outlined text-[13px] text-[#f5bc71]">
                verified
              </span>
              BISE Certified
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[#7d93c2] text-xs mt-0.5">
            <span className="material-symbols-outlined text-[15px] text-[#f5bc71]">
              apartment
            </span>
            <span>Main Boys Campus, Lahore</span>
          </div>
        </div>
      </div>

      {/* Navigation Items (Scrollable Middle Section) */}
      <nav className="flex-1 min-h-0 overflow-y-auto px-3 py-3 space-y-1 overscroll-contain">
        {navItems.map((item) => {
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname?.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-all text-xs font-medium ${
                isActive
                  ? 'bg-white text-[#001639] font-bold shadow-sm border-l-4 border-[#b3272c]'
                  : 'text-[#7d93c2] hover:bg-[#001639]/50 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[19px] flex-shrink-0">
                {item.icon}
              </span>
              <span className="truncate">{item.label}</span>
              {item.badge && (
                <span className="ml-auto text-[10px] px-1.5 py-0.2 rounded-full bg-[#b3272c] text-white">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Principal Profile & Logout Footer (Pinned Bottom) */}
      <div className="flex-shrink-0 p-3.5 border-t border-white/10 bg-[#001639]/70">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#b3272c] text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-sm">
              TA
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs text-white truncate font-bold">
                M. Tariq Alvi
              </span>
              <span className="text-[10px] text-[#7d93c2] truncate">
                Principal & Administrator
              </span>
            </div>
          </div>
          <span className="text-[#7d93c2] text-[10px] flex items-center gap-1 bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20 flex-shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Online
          </span>
        </div>

        <Link
          href="/login"
          onClick={onClose}
          className="w-full h-8 bg-white/5 hover:bg-[#b3272c] text-[#f5bc71] hover:text-white border border-white/10 hover:border-transparent rounded-lg flex items-center justify-center gap-1.5 font-semibold text-xs transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[15px]">logout</span>
          <span>Switch Role / Logout</span>
        </Link>
      </div>
    </aside>
  )
}

