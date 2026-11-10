'use client'

import React, { useState, useEffect } from 'react'
import Modal from '@/components/Modal'
import { useRootAdmin } from '@/lib/admin-store'

export default function SettingsPage() {
  const { admin, updateAdmin } = useRootAdmin()
  const [schoolName, setSchoolName] = useState('Eaglets Schools')
  const [campusName, setCampusName] = useState('Main Boys Campus, Lahore')
  const [academicSession, setAcademicSession] = useState('Session 2026–2027')
  const [biseRegNo, setBiseRegNo] = useState('BISE-LHR-REG-84920')
  const [primaryBank, setPrimaryBank] = useState('Habib Bank Limited (CMD: EAGL-78)')
  const [secondaryBank, setSecondaryBank] = useState('Meezan Bank Islamic (CMD: EAGL-88)')
  const [lateFeeAmount, setLateFeeAmount] = useState(500)
  const [savedNotification, setSavedNotification] = useState(false)

  // Root Admin Credentials State
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false)
  const [adminName, setAdminName] = useState(admin.name)
  const [adminUsername, setAdminUsername] = useState(admin.username)
  const [adminEmail, setAdminEmail] = useState(admin.email)
  const [adminPassword, setAdminPassword] = useState(admin.password || 'Password@2026')
  const [confirmPassword, setConfirmPassword] = useState(admin.password || 'Password@2026')
  const [showAdminPassword, setShowAdminPassword] = useState(false)
  const [adminError, setAdminError] = useState<string | null>(null)
  const [adminSuccessMsg, setAdminSuccessMsg] = useState<string | null>(null)

  // Sync state when admin changes
  useEffect(() => {
    setAdminName(admin.name)
    setAdminUsername(admin.username)
    setAdminEmail(admin.email)
    setAdminPassword(admin.password || 'Password@2026')
    setConfirmPassword(admin.password || 'Password@2026')
  }, [admin])

  const handleOpenAdminModal = () => {
    setAdminName(admin.name)
    setAdminUsername(admin.username)
    setAdminEmail(admin.email)
    setAdminPassword(admin.password || 'Password@2026')
    setConfirmPassword(admin.password || 'Password@2026')
    setAdminError(null)
    setIsAdminModalOpen(true)
  }

  const handleSaveRootAdmin = (e: React.FormEvent) => {
    e.preventDefault()
    setAdminError(null)

    if (!adminName.trim()) {
      setAdminError('Administrator Full Name cannot be empty.')
      return
    }
    if (!adminUsername.trim()) {
      setAdminError('Username cannot be empty.')
      return
    }
    if (adminPassword.length < 6) {
      setAdminError('Password must be at least 6 characters.')
      return
    }
    if (adminPassword !== confirmPassword) {
      setAdminError('Passwords do not match.')
      return
    }

    updateAdmin({
      name: adminName.trim(),
      username: adminUsername.trim(),
      email: adminEmail.trim(),
      password: adminPassword,
    })

    setAdminSuccessMsg('Global Root Administrator name, username, and password updated successfully!')
    setTimeout(() => setAdminSuccessMsg(null), 4000)
    setIsAdminModalOpen(false)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSavedNotification(true)
    setTimeout(() => setSavedNotification(false), 3500)
  }

  return (
    <div className="px-3 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col gap-4 sm:gap-6 min-w-0 text-xs text-slate-800">
      {/* Top Banner */}
      <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-[#eff4ff] text-[#001639] text-[10px] font-bold uppercase tracking-wider">
              Administration & Access Control
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500">Institutional Governance</span>
          </div>
          <h1 className="font-domine text-2xl font-bold text-[#001639]">
            System Settings & Security Configuration
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure campus details, banking accounts, late fee rules, BISE accreditation, and role-based permissions.
          </p>
        </div>

        <button
          onClick={handleSave}
          type="button"
          className="h-9 px-4 bg-[#001639] hover:bg-[#122b54] text-white font-bold rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[17px]">save</span>
          <span>Save Changes</span>
        </button>
      </div>

      {/* Global Root Admin Status Banner */}
      <div className="bg-gradient-to-r from-[#001639] to-[#122b54] text-white p-5 rounded-xl shadow-xs border border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-white p-1 flex items-center justify-center flex-shrink-0 shadow-md">
            <img
              src="/images/eaglets-logo.jpg"
              alt="Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-baldwins text-base font-bold text-white tracking-wider">
                {admin.name}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#b3272c] text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-2xs">
                <span className="material-symbols-outlined text-[12px] text-[#f5bc71]">verified_user</span>
                Global Root Access Active
              </span>
              <span className="text-[11px] text-[#f5bc71] font-mono px-2 py-0.5 rounded bg-white/10">
                @{admin.username}
              </span>
            </div>
            <p className="font-aster text-xs text-[#f5bc71] mt-0.5">
              Chief Administrator & Institutional Root Authority
            </p>
            <p className="text-[11px] text-[#7d93c2] mt-1">
              Unrestricted administrative privileges across Student Records, Faculty Payroll, Fee Challans, Biometric Attendance, and BISE Examinations.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleOpenAdminModal}
            className="h-9 px-3.5 bg-[#b3272c] hover:bg-[#88131b] text-white rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-[17px]">manage_accounts</span>
            <span>Change Name & Password</span>
          </button>
          <div className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/10 flex items-center gap-1.5 text-[11px] font-semibold text-slate-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Cloud DB Connected</span>
          </div>
        </div>
      </div>

      {adminSuccessMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2.5 rounded-lg text-xs flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-emerald-600">
              check_circle
            </span>
            {adminSuccessMsg}
          </span>
          <button
            onClick={() => setAdminSuccessMsg(null)}
            className="text-emerald-700 hover:text-emerald-900"
          >
            ✕
          </button>
        </div>
      )}

      {savedNotification && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2.5 rounded-lg text-xs flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-emerald-600">
              check_circle
            </span>
            Settings saved successfully! Configuration updated across all campus terminals.
          </span>
          <button
            onClick={() => setSavedNotification(false)}
            className="text-emerald-700 hover:text-emerald-900"
          >
            ✕
          </button>
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Campus & Institutional Identity */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col gap-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <span className="material-symbols-outlined text-[#001639] text-[20px]">
              apartment
            </span>
            <h2 className="font-domine font-bold text-sm text-[#001639]">
              Institutional Identity & Campus Info
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Institution Name
              </label>
              <input
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Campus Location / Branch
              </label>
              <input
                type="text"
                value={campusName}
                onChange={(e) => setCampusName(e.target.value)}
                className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Current Academic Session
              </label>
              <input
                type="text"
                value={academicSession}
                onChange={(e) => setAcademicSession(e.target.value)}
                className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                BISE Lahore Registration / Affiliation #
              </label>
              <input
                type="text"
                value={biseRegNo}
                onChange={(e) => setBiseRegNo(e.target.value)}
                className="w-full h-9 px-3 font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639]"
              />
            </div>
          </div>
        </div>

        {/* Banking & Fee Rules */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col gap-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <span className="material-symbols-outlined text-[#b3272c] text-[20px]">
              account_balance
            </span>
            <h2 className="font-domine font-bold text-sm text-[#001639]">
              Banking Partners & Challan Defaults
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Primary Partner Bank (A4 Challan Part 1)
              </label>
              <input
                type="text"
                value={primaryBank}
                onChange={(e) => setPrimaryBank(e.target.value)}
                className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Secondary Partner Bank
              </label>
              <input
                type="text"
                value={secondaryBank}
                onChange={(e) => setSecondaryBank(e.target.value)}
                className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Default Late Fee Surcharge (PKR)
              </label>
              <input
                type="number"
                value={lateFeeAmount}
                onChange={(e) => setLateFeeAmount(Number(e.target.value))}
                className="w-full h-9 px-3 font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639]"
              />
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-600">
              <span className="font-bold text-[#001639] block mb-1">
                Due Date Policy:
              </span>
              Standard fee challans expire 10 calendar days after the billing issue date. Surcharge applies from the 11th.
            </div>
          </div>
        </div>

        {/* Security & Access Roles */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col gap-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <span className="material-symbols-outlined text-[#001639] text-[20px]">
              admin_panel_settings
            </span>
            <h2 className="font-domine font-bold text-sm text-[#001639]">
              Role-Based Access Control (RBAC)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            {[
              {
                role: 'Chief Administrator / Principal',
                user: admin.name,
                perms: 'Full system rights, fee overrides, payroll disbursement, audit trail',
                badge: 'Global Root Admin',
                badgeBg: 'bg-[#001639] text-[#f5bc71] border border-[#f5bc71]/40',
              },
              {
                role: 'Vice Principal / Academic HOD',
                user: 'Engr. Masood Ahmad',
                perms: 'Curriculum oversight, timetable scheduling, faculty attendance',
                badge: 'Academic Admin',
                badgeBg: 'bg-[#eff4ff] text-[#001639]',
              },
              {
                role: 'Accountant & Cashier',
                user: 'Accounts Desk 1',
                perms: 'POS cash settlements, bank reconciliation, challan printing',
                badge: 'Finance Desk',
                badgeBg: 'bg-[#ffdad7] text-[#b3272c]',
              },
              {
                role: 'Faculty Teachers',
                user: '68 Active Teachers',
                perms: 'Daily diary publication, student attendance roll-call, marks entry',
                badge: 'Teacher Portal',
                badgeBg: 'bg-emerald-50 text-emerald-700',
              },
            ].map((r, idx) => (
              <div
                key={idx}
                className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between gap-3"
              >
                <div>
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold mb-2 ${r.badgeBg}`}
                  >
                    {r.badge}
                  </span>
                  <h3 className="font-domine font-bold text-xs text-[#001639]">
                    {r.role}
                  </h3>
                  <span className="text-slate-500 font-semibold block text-[11px] mt-0.5">
                    {r.user}
                  </span>
                  <p className="text-slate-500 text-[10px] mt-2 leading-relaxed">
                    {r.perms}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-400 font-mono">
                  RLS Policy Enabled
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Root Administrator Credentials Inline Card */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#b3272c] text-[20px]">
                manage_accounts
              </span>
              <h2 className="font-domine font-bold text-sm text-[#001639]">
                Global Root Administrator Profile & Security Credentials
              </h2>
            </div>
            <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold border border-emerald-200">
              Active Session
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Full Name
              </span>
              <span className="font-bold text-sm text-[#001639]">{admin.name}</span>
              <span className="text-[10px] text-slate-500">Chief Executive Authority</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Root Username
              </span>
              <span className="font-mono font-bold text-sm text-[#b3272c]">@{admin.username}</span>
              <span className="text-[10px] text-slate-500">Used for Admin Login</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Password Status
                </span>
                <span className="font-mono font-bold text-sm text-slate-700 block">••••••••••••</span>
              </div>
              <button
                type="button"
                onClick={handleOpenAdminModal}
                className="mt-2 text-[11px] font-bold text-[#001639] hover:text-[#b3272c] flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">edit</span>
                <span>Change Credentials</span>
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Root Admin Credentials Modal */}
      <Modal
        isOpen={isAdminModalOpen}
        onClose={() => {
          setIsAdminModalOpen(false)
          setAdminError(null)
        }}
        title="Change Global Root Administrator Credentials"
        subtitle="Update Root Principal Full Name, Login Username, and Password"
        maxWidth="md"
      >
        <form onSubmit={handleSaveRootAdmin} className="flex flex-col gap-4 text-xs">
          {adminError && (
            <div className="p-3 bg-red-50 border border-red-300 rounded-lg text-red-800 text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-red-600 text-[18px]">error</span>
              <span>{adminError}</span>
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Administrator Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              placeholder="e.g. M. Tariq Alvi"
              className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639]"
            />
            <span className="text-[10px] text-slate-400">Displayed in sidebar, dashboard greetings, and official receipts.</span>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Admin Login Username <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono">@</span>
              <input
                type="text"
                required
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                placeholder="admin"
                className="w-full h-9 pl-7 pr-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639] font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Official Email
            </label>
            <input
              type="email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              placeholder="tariq.alvi@eaglets.edu.pk"
              className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639]"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              New Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showAdminPassword ? 'text' : 'password'}
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full h-9 pl-3 pr-9 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639] font-mono"
              />
              <button
                type="button"
                onClick={() => setShowAdminPassword(!showAdminPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showAdminPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Confirm New Password <span className="text-red-500">*</span>
            </label>
            <input
              type={showAdminPassword ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639] font-mono"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => {
                setIsAdminModalOpen(false)
                setAdminError(null)
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#001639] hover:bg-[#122b54] text-white rounded-lg font-bold transition-colors cursor-pointer shadow-sm flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[17px]">save</span>
              <span>Update Root Credentials</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

