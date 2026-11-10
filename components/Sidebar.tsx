'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRootAdmin } from '@/lib/admin-store'
import { useRBAC, PermissionId } from '@/lib/rbac-store'

interface NavItem {
  label: string
  href: string
  icon: string
  badge?: string
  requiredPermission?: PermissionId
  rootOnly?: boolean
}

const navItems: NavItem[] = [
  { label: 'Dashboard Overview', href: '/', icon: 'grid_view' },
  {
    label: 'Student Admissions & Profiles',
    href: '/students',
    icon: 'school',
    requiredPermission: 'view_students',
  },
  {
    label: 'Faculty Hiring & Payroll',
    href: '/faculty',
    icon: 'badge',
    requiredPermission: 'view_faculty',
  },
  {
    label: 'Fee & Finance (PKR Challans)',
    href: '/finance',
    icon: 'payments',
    requiredPermission: 'view_finance',
  },
  {
    label: 'Daily Attendance',
    href: '/attendance',
    icon: 'fact_check',
    requiredPermission: 'view_attendance',
  },
  {
    label: 'Timetable, Syllabus & Diary',
    href: '/academics',
    icon: 'menu_book',
    requiredPermission: 'manage_academics',
  },
  {
    label: 'Examination & Result Cards',
    href: '/examinations',
    icon: 'assignment_turned_in',
    requiredPermission: 'manage_examinations',
  },
  {
    label: 'Settings & Accreditation',
    href: '/settings',
    icon: 'admin_panel_settings',
    requiredPermission: 'view_settings',
  },
  {
    label: 'Access Control Panel',
    href: '/access-control',
    icon: 'security',
    badge: 'Root Only',
    rootOnly: true,
  },
]

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
  onToggle?: () => void
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname()
  const { admin, initials } = useRootAdmin()
  const { currentUser, isRootAdmin, hasPermission, switchToRootAdmin } = useRBAC()

  // Filter navigation links based on permissions & Root Admin status
  const visibleNavItems = navItems.filter((item) => {
    if (item.rootOnly) {
      return isRootAdmin
    }
    if (item.requiredPermission) {
      return hasPermission(item.requiredPermission)
    }
    return true
  })

  // Display details depending on active session
  const displayName = isRootAdmin ? admin.name : currentUser.name
  const displayRole = isRootAdmin ? 'Global Root Admin' : currentUser.designation
  const displayInitials = isRootAdmin
    ? initials
    : displayName
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()

  return (
    <aside
      aria-label="Main Navigation"
      className={`fixed left-0 top-0 h-screen w-72 max-w-[85vw] bg-[#122b54] text-white z-50 flex flex-col border-r border-slate-700/40 shadow-2xl print:hidden overflow-hidden transition-transform duration-300 ease-in-out ${
        isOpen
          ? 'translate-x-0 pointer-events-auto'
          : '-translate-x-full pointer-events-none'
      }`}
    >
      {/* School Crest & Header (Fixed Top) */}
      <div className="flex-shrink-0 p-5 border-b border-white/10">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-white p-1 flex items-center justify-center flex-shrink-0 shadow-md border border-white/20 overflow-hidden">
              <img
                src="/images/eaglets-logo.jpg"
                alt="Eaglets Schools Crest"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-baldwins text-lg font-bold tracking-wider leading-tight text-white truncate">
                EAGLETS SCHOOLS
              </span>
              <span className="font-aster text-[10.5px] text-[#f5bc71] tracking-wide font-normal truncate">
                Rebirth Of Knowledge & Character
              </span>
            </div>
          </div>

          {/* Collapse button - available on ALL screen sizes */}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 cursor-pointer flex-shrink-0 transition-colors"
            aria-label="Collapse Navigation"
            title="Collapse sidebar (Ctrl+B)"
          >
            <span className="material-symbols-outlined text-[20px]">menu_open</span>
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
        {visibleNavItems.map((item) => {
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
                <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider bg-[#b3272c] text-white">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* User Profile & Session Footer (Pinned Bottom) */}
      <div className="flex-shrink-0 p-3.5 border-t border-white/10 bg-[#001639]/70 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-sm ${
                isRootAdmin ? 'bg-[#b3272c]' : 'bg-[#001639] border border-blue-400'
              }`}
            >
              {displayInitials}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs text-white truncate font-bold">
                {displayName}
              </span>
              <span
                className={`text-[10px] truncate font-medium flex items-center gap-0.5 ${
                  isRootAdmin ? 'text-[#f5bc71]' : 'text-slate-300'
                }`}
              >
                {isRootAdmin && (
                  <span className="material-symbols-outlined text-[11px]">verified_user</span>
                )}
                {displayRole}
              </span>
            </div>
          </div>

          <span className="text-[10px] flex items-center gap-1 bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20 flex-shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Online
          </span>
        </div>

        {/* Quick Return to Root Admin when simulating a restricted staff account */}
        {!isRootAdmin && (
          <button
            type="button"
            onClick={switchToRootAdmin}
            className="w-full h-7 bg-[#b3272c] hover:bg-[#88131b] text-white rounded-md text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            title="Return to Global Root Administrator session"
          >
            <span className="material-symbols-outlined text-[14px] text-[#f5bc71]">shield_person</span>
            <span>Switch to Root Admin</span>
          </button>
        )}

        <Link
          href="/login"
          onClick={onClose}
          className="w-full h-7 bg-white/5 hover:bg-white/10 text-[#7d93c2] hover:text-white border border-white/10 rounded-md flex items-center justify-center gap-1 font-semibold text-[11px] transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[14px]">logout</span>
          <span>Switch User / Login</span>
        </Link>
      </div>
    </aside>
  )
}


