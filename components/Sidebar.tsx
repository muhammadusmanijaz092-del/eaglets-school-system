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
  { label: 'Student Admissions & Profiles', href: '/students', icon: 'school' },
  { label: 'Faculty Hiring & Payroll', href: '/faculty', icon: 'badge' },
  { label: 'Fee & Finance (PKR Challans)', href: '/finance', icon: 'payments' },
  { label: 'Daily Attendance', href: '/attendance', icon: 'fact_check' },
  { label: 'Timetable, Syllabus & Diary', href: '/academics', icon: 'menu_book' },
  { label: 'Examination & Result Cards', href: '/examinations', icon: 'assignment_turned_in' },
  { label: 'Settings & Access Control', href: '/settings', icon: 'admin_panel_settings' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-full w-72 bg-[#122b54] text-white z-50 flex flex-col justify-between border-r border-slate-700/40 shadow-[0_1px_8px_rgba(0,0,0,0.12)] print:hidden">
      <div className="flex flex-col">
        {/* School Crest & Header */}
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xl flex-shrink-0 border border-white/20 shadow-inner">
              🦅
            </div>
            <div className="flex flex-col">
              <span className="font-domine text-lg font-bold tracking-wide leading-tight text-white">
                EAGLETS SCHOOLS
              </span>
              <span className="text-[10px] text-[#7d93c2] uppercase tracking-wider font-semibold">
                Rebirth Of Knowledge & Character
              </span>
            </div>
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

        {/* Navigation Items */}
        <nav className="flex flex-col px-3 py-4 gap-1 overflow-y-auto max-h-[calc(100vh-220px)]">
          {navItems.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname?.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
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
      </div>

      {/* Principal Profile Footer */}
      <div className="p-4 border-t border-white/10 bg-[#001639]/40">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full bg-[#b3272c] text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-sm">
              TA
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs text-white truncate font-bold">
                M. Tariq Alvi
              </span>
              <span className="text-[11px] text-[#7d93c2] truncate">
                Principal & Chief Administrator
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[11px]">
          <Link
            href="/login"
            className="text-[#f5bc71] hover:underline flex items-center gap-1 font-semibold"
          >
            <span className="material-symbols-outlined text-[14px]">logout</span>
            <span>Switch Role / Logout</span>
          </Link>
          <span className="text-[#7d93c2] flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Online
          </span>
        </div>
      </div>
    </aside>
  )
}

