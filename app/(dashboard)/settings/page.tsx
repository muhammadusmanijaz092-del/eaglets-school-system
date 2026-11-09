'use client'

import React, { useState } from 'react'

export default function SettingsPage() {
  const [schoolName, setSchoolName] = useState('Eaglets Schools')
  const [campusName, setCampusName] = useState('Main Boys Campus, Lahore')
  const [academicSession, setAcademicSession] = useState('Session 2026–2027')
  const [biseRegNo, setBiseRegNo] = useState('BISE-LHR-REG-84920')
  const [primaryBank, setPrimaryBank] = useState('Habib Bank Limited (CMD: EAGL-78)')
  const [secondaryBank, setSecondaryBank] = useState('Meezan Bank Islamic (CMD: EAGL-88)')
  const [lateFeeAmount, setLateFeeAmount] = useState(500)
  const [savedNotification, setSavedNotification] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSavedNotification(true)
    setTimeout(() => setSavedNotification(false), 3500)
  }

  return (
    <div className="px-8 py-6 flex flex-col gap-6 text-xs text-slate-800">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
                user: 'M. Tariq Alvi',
                perms: 'Full system rights, fee overrides, payroll disbursement, audit trail',
                badge: 'Super Admin',
                badgeBg: 'bg-[#122b54] text-white',
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
      </form>
    </div>
  )
}

