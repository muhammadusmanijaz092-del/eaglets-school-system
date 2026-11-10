'use client'

import React, { useState, useEffect } from 'react'
import Modal from '@/components/Modal'
import { INITIAL_INSTITUTIONS, INITIAL_ADMIN_USERS } from '@/lib/mock-data'
import { InstitutionTenant, LicenseTier, AdminUser, AdminRole } from '@/lib/supabase/types'
import { createClient } from '@/lib/supabase/client'

export default function SuperAdminPage() {
  // Institutions State
  const [institutions, setInstitutions] = useState<InstitutionTenant[]>(INITIAL_INSTITUTIONS)
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(INITIAL_ADMIN_USERS)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTierFilter, setSelectedTierFilter] = useState<'ALL' | LicenseTier>('ALL')
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL')
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<string>('ALL')

  // Navigation Sub-Tab
  const [activeTab, setActiveTab] = useState<'NETWORK_GRID' | 'ADMIN_DIRECTORY' | 'DATABASE_BYPASS'>('NETWORK_GRID')

  // Impersonation Mode State
  const [impersonatingTenant, setImpersonatingTenant] = useState<InstitutionTenant | null>(null)

  // Flyout / Drawer States
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false)
  const [isRootPanelOpen, setIsRootPanelOpen] = useState(false)
  const [selectedInstitutionForRoot, setSelectedInstitutionForRoot] = useState<InstitutionTenant | null>(null)
  const [rootPanelTab, setRootPanelTab] = useState<'OVERRIDE' | 'ADMIN_STAFF' | 'PASSWORD_RESET' | 'DB_LOGS'>('OVERRIDE')

  // Modals State
  const [isAddInstitutionOpen, setIsAddInstitutionOpen] = useState(false)
  const [isProvisionCredentialsOpen, setIsProvisionCredentialsOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'warning' | 'info' } | null>(null)

  const showToast = (text: string, type: 'success' | 'warning' | 'info' = 'success') => {
    setToastMessage({ text, type })
    setTimeout(() => setToastMessage(null), 5000)
  }

  // Super Admin Editable Profile State
  const [superAdminProfile, setSuperAdminProfile] = useState({
    name: 'Dr. Muhammad Tariq Alvi',
    email: 'root.superadmin@eaglets.edu.pk',
    username: 'root.superadmin',
    role: 'Root Super Administrator',
    designation: 'Chief Academic & Technology Officer',
    key_fingerprint: 'YUBI-FIDO2-PK-9821-EAGLETS-ROOT',
    session_timeout_mins: 30,
    two_factor_enforced: true,
    sql_bypass_permitted: true,
  })

  // Add Institution Form State
  const [newInstitutionForm, setNewInstitutionForm] = useState({
    name: '',
    campus_code: '',
    city: 'Lahore',
    region: 'Punjab (Central)',
    subdomain: '',
    primary_admin_name: '',
    primary_admin_email: '',
    primary_admin_phone: '+92 300 ',
    student_count: 0,
    capacity: 1500,
    license_tier: 'Enterprise Network' as LicenseTier,
    bise_affiliation: 'BISE Lahore Affiliated',
  })

  // Provision Credentials Form State
  const [provisionForm, setProvisionForm] = useState({
    campus_id: INITIAL_INSTITUTIONS[0]?.id || '',
    admin_name: '',
    admin_email: '',
    username: '',
    temp_password: 'EagSec#' + 8942 + '!2026',
    api_token: 'eag_live_sec_' + '9941a8b27f01c4e9',
    force_reset: true,
  })

  // Database Bypass Logs Feed State
  const [bypassLogs, setBypassLogs] = useState([
    {
      id: 'log-101',
      timestamp: 'Today, 02:41:18 PM',
      query: "SELECT count(*) FROM students WHERE campus_code='EAG-LHR-01';",
      caller: 'root.superadmin',
      ip: '10.0.4.12 (VPN-ENC)',
      latency_ms: 12,
      status: 'SUCCESS',
      campus_code: 'EAG-LHR-01',
    },
    {
      id: 'log-102',
      timestamp: 'Today, 01:15:02 PM',
      query: "UPDATE institutions SET license_status='Active' WHERE campus_code='EAG-RWP-01';",
      caller: 'root.superadmin',
      ip: '10.0.4.12 (VPN-ENC)',
      latency_ms: 18,
      status: 'MUTATION_COMMITTED',
      campus_code: 'EAG-RWP-01',
    },
    {
      id: 'log-103',
      timestamp: 'Today, 11:30:45 AM',
      query: "OVERRIDE late_surcharge_pkr = 0 ON fee_invoices WHERE invoice_no='INV-2026-10-8492';",
      caller: 'root.superadmin',
      ip: '10.0.4.12 (VPN-ENC)',
      latency_ms: 9,
      status: 'OVERRIDE_APPLIED',
      campus_code: 'EAG-LHR-01',
    },
    {
      id: 'log-104',
      timestamp: 'Yesterday, 06:12:30 PM',
      query: "SCHEMA_VERIFY institutions, campuses, fee_ledgers, admin_users; --integrity-pass",
      caller: 'SYSTEM_DAEMON',
      ip: '127.0.0.1 (INTERNAL)',
      latency_ms: 45,
      status: 'SUCCESS',
      campus_code: 'GLOBAL',
    },
  ])

  // Custom SQL Bypass Command State
  const [sqlQueryInput, setSqlQueryInput] = useState('')
  const [sqlResultOutput, setSqlResultOutput] = useState<string | null>(null)

  // Filtered Institutions
  const filteredInstitutions = institutions.filter((inst) => {
    const matchesSearch =
      inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.campus_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.primary_admin_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.subdomain.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesTier = selectedTierFilter === 'ALL' || inst.license_tier === selectedTierFilter
    const matchesStatus = selectedStatusFilter === 'ALL' || inst.license_status === selectedStatusFilter
    const matchesRegion = selectedRegionFilter === 'ALL' || inst.region.includes(selectedRegionFilter)

    return matchesSearch && matchesTier && matchesStatus && matchesRegion
  })

  // Dynamic Regions
  const availableRegions = ['ALL', 'Punjab', 'Sindh', 'Khyber Pakhtunkhwa', 'Federal Capital', 'Balochistan']

  // Handle Create Institution
  const handleCreateInstitution = (e: React.FormEvent) => {
    e.preventDefault()
    const newInst: InstitutionTenant = {
      id: `inst-${Date.now()}`,
      name: newInstitutionForm.name,
      campus_code: newInstitutionForm.campus_code.toUpperCase(),
      city: newInstitutionForm.city,
      region: newInstitutionForm.region,
      subdomain: newInstitutionForm.subdomain || `${newInstitutionForm.campus_code.toLowerCase()}.eaglets.edu.pk`,
      primary_admin_name: newInstitutionForm.primary_admin_name,
      primary_admin_email: newInstitutionForm.primary_admin_email,
      primary_admin_phone: newInstitutionForm.primary_admin_phone,
      student_count: Number(newInstitutionForm.student_count) || 0,
      faculty_count: 0,
      capacity: Number(newInstitutionForm.capacity) || 1500,
      license_tier: newInstitutionForm.license_tier,
      license_status: 'Provisioning',
      renewal_date: '2027-12-31',
      bise_affiliation: newInstitutionForm.bise_affiliation,
      created_at: new Date().toISOString().slice(0, 10),
      is_maintenance_mode: false,
      security_key_id: `SEC-RSA-${Date.now().toString().slice(-4)}`,
    }

    setInstitutions([newInst, ...institutions])
    setIsAddInstitutionOpen(false)
    showToast(`Institution "${newInst.name}" (${newInst.campus_code}) provisioned successfully!`)

    // Background sync to Supabase
    const supabase = createClient()
    if (supabase) {
      supabase.from('institutions').insert([newInst]).then(({ error }) => {
        if (error) console.warn('Supabase institutions insert note:', error)
      })
    }
  }

  // Handle Provision Credentials
  const handleProvisionSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    showToast(`Credentials and API token dispatched to ${provisionForm.admin_email}!`)
    setIsProvisionCredentialsOpen(false)
  }

  // Handle Root Override Update
  const handleSaveRootOverride = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedInstitutionForRoot) return

    setInstitutions(
      institutions.map((i) => (i.id === selectedInstitutionForRoot.id ? selectedInstitutionForRoot : i))
    )
    showToast(`Root override applied for ${selectedInstitutionForRoot.name}!`)
    setIsRootPanelOpen(false)
  }

  // Handle Execute SQL Query
  const handleExecuteSqlBypass = (e: React.FormEvent) => {
    e.preventDefault()
    if (!sqlQueryInput.trim()) return

    const newLog = {
      id: `log-${Date.now()}`,
      timestamp: 'Just now',
      query: sqlQueryInput,
      caller: 'root.superadmin',
      ip: '10.0.4.12 (DIRECT_ROOT_BYPASS)',
      latency_ms: 14,
      status: 'MUTATION_COMMITTED',
      campus_code: selectedInstitutionForRoot?.campus_code || 'GLOBAL',
    }

    setBypassLogs([newLog, ...bypassLogs])
    setSqlResultOutput(`Query OK, 1 row affected (${newLog.latency_ms}ms). Schema lock bypass active.`)
    setSqlQueryInput('')
    showToast('Direct SQL command executed via root bypass tunnel.', 'info')
  }

  // Toggle Maintenance Mode
  const handleToggleMaintenance = (instId: string) => {
    setInstitutions(
      institutions.map((i) => {
        if (i.id === instId) {
          const toggled = !i.is_maintenance_mode
          showToast(
            toggled
              ? `Tenant ${i.campus_code} locked into Read-Only Maintenance Mode.`
              : `Tenant ${i.campus_code} restored to Full Production.`,
            toggled ? 'warning' : 'success'
          )
          return { ...i, is_maintenance_mode: toggled }
        }
        return i
      })
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9ff] text-slate-800">
      {/* Toast Floating Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border text-xs font-semibold animate-in slide-in-from-bottom-3 duration-200 bg-white border-slate-200">
          <span
            className={`material-symbols-outlined text-[20px] ${
              toastMessage.type === 'success'
                ? 'text-emerald-600'
                : toastMessage.type === 'warning'
                ? 'text-amber-600'
                : 'text-blue-600'
            }`}
          >
            {toastMessage.type === 'success'
              ? 'verified'
              : toastMessage.type === 'warning'
              ? 'warning'
              : 'info'}
          </span>
          <span className="text-slate-800">{toastMessage.text}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-slate-700 ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* ⚠️ HIGH VISIBILITY ROOT IMPERSONATION ACTIVE BANNER */}
      {impersonatingTenant && (
        <div className="sticky top-0 z-50 bg-[#b3272c] text-white px-4 py-2.5 text-xs font-semibold shadow-lg flex items-center justify-between border-b border-red-800 animate-in fade-in">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="material-symbols-outlined text-[18px] text-[#f5bc71] animate-pulse">
              shield_person
            </span>
            <span className="tracking-wide uppercase font-bold text-[#f5bc71]">
              Root Override & Impersonation Active:
            </span>
            <span>
              Simulating session as Campus Admin: <strong>{impersonatingTenant.primary_admin_name}</strong>
            </span>
            <span className="opacity-80">|</span>
            <span>
              Institution: <strong>{impersonatingTenant.name}</strong> ({impersonatingTenant.campus_code})
            </span>
            <span className="bg-black/20 px-2 py-0.5 rounded text-[10px] font-mono">
              Audit Token: ROOT-SES-9921
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              setImpersonatingTenant(null)
              showToast('Root impersonation session terminated safely.', 'info')
            }}
            className="px-3 py-1 bg-white text-[#b3272c] hover:bg-slate-100 font-bold rounded-lg text-xs cursor-pointer shadow-sm flex items-center gap-1.5 flex-shrink-0"
          >
            <span className="material-symbols-outlined text-[15px]">logout</span>
            <span>Exit Impersonation</span>
          </button>
        </div>
      )}

      {/* 1. TOP BAR (System Health, Global Search, Notifications, Super Admin Profile Drawer Trigger) */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-3 sm:px-6 lg:px-8 py-3 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Left: Branding & Real-time Health */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#001639] p-1 flex items-center justify-center flex-shrink-0 shadow-sm border border-slate-700">
                <img
                  src="/images/eaglets-logo.jpg"
                  alt="Eaglets Insignia"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h1 className="font-baldwins text-base sm:text-lg font-bold text-[#001639] tracking-wider leading-none">
                    EAGLETS SCHOOLS
                  </h1>
                  <span className="px-2 py-0.5 rounded-full bg-red-100 text-[#b3272c] font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#b3272c]"></span>
                    Super Admin Console
                  </span>
                </div>
                <span className="font-aster text-[11px] text-slate-500 tracking-wide mt-0.5">
                  Multi-Tenant Education Network & Enterprise Control Center
                </span>
              </div>
            </div>

            {/* System Health Badge */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>All Systems Operational (99.98% SLA)</span>
              <span className="text-emerald-300">|</span>
              <span className="font-mono text-[11px] text-emerald-700">24ms Node Ping</span>
            </div>
          </div>

          {/* Right: Search, Alerts, & Editable Profile Drawer Trigger */}
          <div className="flex items-center gap-2 sm:gap-3 justify-end flex-wrap">
            {/* Global Search Bar */}
            <div className="relative min-w-[200px] sm:min-w-[260px]">
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search campus code, institution, admin..."
                className="w-full h-9 pl-9 pr-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639] transition-all"
              />
            </div>

            {/* Notifications Trigger */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative w-9 h-9 flex items-center justify-center rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 cursor-pointer transition-colors"
                title="Root Security Notifications"
              >
                <span className="material-symbols-outlined text-[20px]">notifications</span>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#b3272c]"></span>
              </button>

              {/* Notifications Dropdown */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 p-3 z-50 text-xs animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 font-bold text-slate-800">
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-[#b3272c]">
                        security
                      </span>
                      Root Security Alerts
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal">Live Log</span>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto mt-1">
                    <div className="py-2">
                      <p className="font-semibold text-slate-800">Direct SQL Bypass Query Logged</p>
                      <p className="text-[11px] text-slate-500">Root executed database mutation on EAG-LHR-01</p>
                      <span className="text-[9px] text-slate-400">12 minutes ago</span>
                    </div>
                    <div className="py-2">
                      <p className="font-semibold text-slate-800">New Tenant Provisioning Initiated</p>
                      <p className="text-[11px] text-slate-500">Eaglets Sargodha Citrus Campus (EAG-SGD-01)</p>
                      <span className="text-[9px] text-slate-400">1 hour ago</span>
                    </div>
                    <div className="py-2">
                      <p className="font-semibold text-slate-800">Emergency Backup Completed</p>
                      <p className="text-[11px] text-slate-500">All 18 tenant schemas mirrored to Cloud Vault</p>
                      <span className="text-[9px] text-slate-400">3 hours ago</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Editable "Super Admin Profile" Drawer Button with "Root Access Enabled" Badge */}
            <button
              type="button"
              onClick={() => setIsProfileDrawerOpen(true)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-slate-900 hover:bg-[#001639] text-white border border-slate-700 shadow-sm cursor-pointer transition-all group"
            >
              <div className="w-7 h-7 rounded-lg bg-[#b3272c] text-white font-bold flex items-center justify-center text-xs flex-shrink-0 shadow-xs">
                TA
              </div>
              <div className="flex flex-col text-left">
                <span className="font-bold text-xs leading-tight group-hover:text-[#f5bc71] transition-colors truncate max-w-[130px]">
                  Dr. Tariq Alvi
                </span>
                <span className="text-[9.5px] font-mono text-emerald-400 flex items-center gap-1 font-bold">
                  <span className="material-symbols-outlined text-[11px] text-[#f5bc71]">
                    verified_user
                  </span>
                  Root Access Enabled
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Sub-Tabs: Multi-Tenant Workspace vs Admin Directory vs Database Bypass */}
        <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-100 overflow-x-auto text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('NETWORK_GRID')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
              activeTab === 'NETWORK_GRID'
                ? 'bg-[#001639] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">hub</span>
            <span>Multi-Tenant Network (18 Institutions)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ADMIN_DIRECTORY')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
              activeTab === 'ADMIN_DIRECTORY'
                ? 'bg-[#001639] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">manage_accounts</span>
            <span>Campus Admin Directory & RBAC</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('DATABASE_BYPASS')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
              activeTab === 'DATABASE_BYPASS'
                ? 'bg-[#001639] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[17px] text-[#f5bc71]">terminal</span>
            <span>Direct Database Bypass & Security Logs</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 px-3 sm:px-6 lg:px-8 py-5 flex flex-col gap-5 max-w-7xl mx-auto w-full">
        {/* 2. GLOBAL OVERVIEW (TOP SECTION) - High-Level KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Institutions/Campuses (18) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs relative overflow-hidden flex flex-col justify-between group hover:border-[#001639] transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Network Footprint
              </span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#001639] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">account_balance</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className="font-domine text-3xl font-bold text-[#001639]">18</span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                  16 Active • 2 Onboarding
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-700 mt-1">
                Total Institutions / Campuses
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                5 Provinces: Punjab, Sindh, KPK, Balochistan & Federal
              </p>
            </div>
          </div>

          {/* Card 2: Global Active Users (24,500) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs relative overflow-hidden flex flex-col justify-between group hover:border-[#001639] transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Network Population
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">groups</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className="font-domine text-3xl font-bold text-[#001639]">24,500</span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                  +12.4% MoM
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-700 mt-1">
                Global Active Users
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                21,200 Enrolled Students + 1,450 Parent Portals + 1,850 Staff
              </p>
            </div>
          </div>

          {/* Card 3: Total Faculty (1,850) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs relative overflow-hidden flex flex-col justify-between group hover:border-[#001639] transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Instructional Staff
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">badge</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className="font-domine text-3xl font-bold text-[#001639]">1,850</span>
                <span className="text-xs font-bold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded-full">
                  98.2% Bio-Sync
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-700 mt-1">
                Total Teaching & Admin Faculty
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Centralized biometric payroll & BISE subject specialization
              </p>
            </div>
          </div>

          {/* Card 4: Global Subscription Status */}
          <div className="bg-gradient-to-br from-[#001639] to-[#122b54] text-white p-5 rounded-2xl shadow-md relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#f5bc71]">
                Network Tier Status
              </span>
              <span className="material-symbols-outlined text-[#f5bc71] text-[20px]">
                verified
              </span>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className="font-domine text-2xl font-bold text-white">
                  Enterprise
                </span>
                <span className="text-[10px] font-bold text-[#f5bc71] bg-white/10 px-2 py-0.5 rounded-full">
                  PKR 42.5M MRR
                </span>
              </div>
              <p className="text-xs font-medium text-slate-200 mt-1">
                Dedicated Multi-Tenant Cloud Architecture
              </p>
              <p className="text-[10px] text-[#7d93c2] mt-0.5">
                All 18 Campuses Licensed • Next Global Review: Q4 2027
              </p>
            </div>
          </div>
        </div>

        {/* 3. PRIMARY ACTION BAR (+ Add New Institution & Provision Admin Credentials) */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-3">
          {/* Filter Group */}
          <div className="flex items-center gap-2 flex-wrap w-full lg:w-auto">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-slate-400">filter_list</span>
              Filters:
            </span>

            {/* License Tier Filter */}
            <select
              value={selectedTierFilter}
              onChange={(e) => setSelectedTierFilter(e.target.value as any)}
              className="h-8 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:border-[#001639]"
            >
              <option value="ALL">All License Tiers</option>
              <option value="Enterprise Network">Enterprise Network</option>
              <option value="Pro Academic">Pro Academic</option>
              <option value="Standard Campus">Standard Campus</option>
              <option value="Pilot Trial">Pilot Trial</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="h-8 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:border-[#001639]"
            >
              <option value="ALL">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Provisioning">Provisioning</option>
              <option value="Expiring">Expiring</option>
            </select>

            {/* Region Filter */}
            <select
              value={selectedRegionFilter}
              onChange={(e) => setSelectedRegionFilter(e.target.value)}
              className="h-8 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:border-[#001639]"
            >
              {availableRegions.map((reg) => (
                <option key={reg} value={reg}>
                  {reg === 'ALL' ? 'All Regions' : reg}
                </option>
              ))}
            </select>

            <span className="text-xs text-slate-400 ml-1">
              Showing <strong>{filteredInstitutions.length}</strong> of 18 institutions
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap w-full lg:w-auto justify-end">
            {/* Quick Action: Provision Admin Credentials */}
            <button
              type="button"
              onClick={() => setIsProvisionCredentialsOpen(true)}
              className="h-9 px-3.5 bg-slate-100 hover:bg-slate-200 text-[#001639] border border-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <span className="material-symbols-outlined text-[17px] text-[#f5bc71]">
                key
              </span>
              <span>Provision Admin Credentials</span>
            </button>

            {/* Prominent Action: + Add New Institution */}
            <button
              type="button"
              onClick={() => setIsAddInstitutionOpen(true)}
              className="h-9 px-4 bg-[#b3272c] hover:bg-[#88131b] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <span className="material-symbols-outlined text-[18px]">add_business</span>
              <span>+ Add New Institution</span>
            </button>
          </div>
        </div>

        {/* 4. CENTRAL WORKSPACE / TAB CONTENT */}
        {activeTab === 'NETWORK_GRID' && (
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="bg-slate-50/80 text-slate-500 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">Institution Name & Location</th>
                    <th className="py-3.5 px-3">Campus Code</th>
                    <th className="py-3.5 px-3">Primary Admin Contact</th>
                    <th className="py-3.5 px-3">Cohort Metrics</th>
                    <th className="py-3.5 px-3">License Tier & Status</th>
                    <th className="py-3.5 px-4 text-right">Root Actions & Override</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredInstitutions.map((inst) => {
                    const capacityPercent = Math.round((inst.student_count / (inst.capacity || 1)) * 100)
                    const isCurrentImpersonated = impersonatingTenant?.id === inst.id

                    return (
                      <tr
                        key={inst.id}
                        className={`hover:bg-slate-50/80 transition-colors ${
                          isCurrentImpersonated
                            ? 'bg-amber-50/50 border-l-4 border-[#b3272c]'
                            : inst.is_maintenance_mode
                            ? 'bg-rose-50/30'
                            : ''
                        }`}
                      >
                        {/* Institution Name & Location */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-slate-100 p-0.5 border border-slate-200 flex items-center justify-center flex-shrink-0 shadow-2xs">
                              <img
                                src="/images/eaglets-logo.jpg"
                                alt="Crest"
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div className="flex flex-col">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-slate-900 text-sm">
                                  {inst.name}
                                </span>
                                {inst.is_maintenance_mode && (
                                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-100 text-rose-800">
                                    Maintenance
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                                <span>{inst.city}</span>
                                <span>•</span>
                                <a
                                  href={`https://${inst.subdomain}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline flex items-center gap-0.5 font-mono"
                                >
                                  {inst.subdomain}
                                  <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                                </a>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Campus Code */}
                        <td className="py-3.5 px-3">
                          <span className="font-mono font-bold text-xs bg-slate-100 text-slate-800 px-2 py-1 rounded-md border border-slate-200 shadow-2xs">
                            {inst.campus_code}
                          </span>
                        </td>

                        {/* Primary Admin Contact */}
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-[#122b54] text-white font-bold flex items-center justify-center text-[10px] flex-shrink-0">
                              {inst.admin_avatar || 'AD'}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-900 leading-tight">
                                {inst.primary_admin_name}
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono">
                                {inst.primary_admin_email}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Cohort Metrics */}
                        <td className="py-3.5 px-3">
                          <div className="flex flex-col gap-1 min-w-[130px]">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-semibold text-slate-800">
                                {inst.student_count.toLocaleString()} Students
                              </span>
                              <span className="text-slate-400 text-[10px]">
                                {inst.faculty_count} Staff
                              </span>
                            </div>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  capacityPercent > 90
                                    ? 'bg-rose-500'
                                    : capacityPercent > 70
                                    ? 'bg-amber-500'
                                    : 'bg-emerald-500'
                                }`}
                                style={{ width: `${Math.min(capacityPercent, 100)}%` }}
                              ></div>
                            </div>
                            <span className="text-[9.5px] text-slate-400">
                              {capacityPercent}% of {inst.capacity.toLocaleString()} seats
                            </span>
                          </div>
                        </td>

                        {/* License Tier & Status */}
                        <td className="py-3.5 px-3">
                          <div className="flex flex-col gap-1">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] font-bold w-fit ${
                                inst.license_tier === 'Enterprise Network'
                                  ? 'bg-[#001639] text-[#f5bc71]'
                                  : inst.license_tier === 'Pro Academic'
                                  ? 'bg-blue-100 text-blue-900'
                                  : inst.license_tier === 'Standard Campus'
                                  ? 'bg-slate-200 text-slate-800'
                                  : 'bg-amber-100 text-amber-900'
                              }`}
                            >
                              <span className="material-symbols-outlined text-[13px]">
                                {inst.license_tier === 'Enterprise Network' ? 'star' : 'workspace_premium'}
                              </span>
                              {inst.license_tier}
                            </span>
                            <div className="flex items-center gap-1 text-[10px] text-slate-500">
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  inst.license_status === 'Active'
                                    ? 'bg-emerald-500'
                                    : 'bg-amber-500'
                                }`}
                              ></span>
                              <span className="font-semibold">{inst.license_status}</span>
                              <span>• Renews {inst.renewal_date}</span>
                            </div>
                          </div>
                        </td>

                        {/* Actions Column (Root Override / Impersonate & Elevated Panel) */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Distinctive Root Override / Impersonate Switch */}
                            <button
                              type="button"
                              onClick={() => {
                                setImpersonatingTenant(inst)
                                showToast(
                                  `Root Impersonation Active: Logged in as ${inst.primary_admin_name} (${inst.name})`,
                                  'warning'
                                )
                              }}
                              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all shadow-2xs ${
                                isCurrentImpersonated
                                  ? 'bg-[#b3272c] text-white shadow-xs'
                                  : 'bg-slate-900 hover:bg-[#b3272c] text-white'
                              }`}
                              title="Root Override & Session Impersonation"
                            >
                              <span className="material-symbols-outlined text-[15px] text-[#f5bc71]">
                                shield_person
                              </span>
                              <span>{isCurrentImpersonated ? 'Impersonating' : 'Impersonate'}</span>
                            </button>

                            {/* Root Elevated Controls Panel Flyout */}
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedInstitutionForRoot(inst)
                                setIsRootPanelOpen(true)
                              }}
                              className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 flex items-center justify-center cursor-pointer transition-colors"
                              title="Elevated Root Access Flyout"
                            >
                              <span className="material-symbols-outlined text-[18px]">
                                tune
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUB-TAB 2: ADMIN DIRECTORY & RBAC */}
        {activeTab === 'ADMIN_DIRECTORY' && (
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="font-domine text-lg font-bold text-[#001639]">
                  Institutional Administrators & Security Keys
                </h2>
                <p className="text-xs text-slate-500">
                  Manage campus administrators, password reset policies, and 2FA hardware tokens across all 18 branches.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsProvisionCredentialsOpen(true)}
                className="px-3.5 py-1.5 bg-[#001639] text-white font-bold rounded-lg text-xs flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px] text-[#f5bc71]">add</span>
                <span>Provision Admin</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Admin Name & Profile</th>
                    <th className="py-2.5 px-3">Assigned Campus</th>
                    <th className="py-2.5 px-3">Role Designation</th>
                    <th className="py-2.5 px-3">Security 2FA</th>
                    <th className="py-2.5 px-3">Last Login</th>
                    <th className="py-2.5 px-3 text-right">Root Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {adminUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#001639] text-white flex items-center justify-center font-bold text-xs">
                            {user.full_name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">{user.full_name}</span>
                            <span className="text-slate-400 font-mono text-[10px]">{user.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-700">{user.campus}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-slate-100 font-mono text-[10.5px] font-bold text-[#001639]">
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        {user.two_factor_enabled ? (
                          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold text-[10px] border border-emerald-200">
                            Enforced (FIDO2)
                          </span>
                        ) : (
                          <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded font-bold text-[10px] border border-amber-200">
                            SMS Only
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-slate-500">{user.last_login || 'Never'}</td>
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            showToast(`Password reset link dispatched to ${user.email}`, 'info')
                          }}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded text-[11px] cursor-pointer"
                        >
                          Reset Credentials
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUB-TAB 3: DIRECT DATABASE BYPASS & SECURITY LOGS */}
        {activeTab === 'DATABASE_BYPASS' && (
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="font-domine text-lg font-bold text-[#001639] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#f5bc71]">terminal</span>
                  Direct Database Bypass & Security Audit Trail
                </h2>
                <p className="text-xs text-slate-500">
                  Live encrypted audit trail of raw database mutations, root overrides, and schema bypass actions across tenant clusters.
                </p>
              </div>

              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-mono text-xs font-bold border border-emerald-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Supabase CDC Stream Connected
              </span>
            </div>

            {/* Live Command Line / SQL Query Box */}
            <form onSubmit={handleExecuteSqlBypass} className="bg-slate-900 rounded-xl p-4 text-white font-mono text-xs shadow-inner">
              <div className="flex items-center justify-between text-slate-400 text-[11px] pb-2 border-b border-slate-800 mb-2">
                <span className="flex items-center gap-1.5 text-[#f5bc71]">
                  <span className="material-symbols-outlined text-[15px]">code</span>
                  Root SQL Query Bypass Console (Read/Write)
                </span>
                <span className="text-[10px] text-slate-500">Node: bom1.supabase.co / TLS 1.3</span>
              </div>
              <div className="flex gap-2">
                <span className="text-[#f5bc71] font-bold select-none">&gt;</span>
                <input
                  type="text"
                  value={sqlQueryInput}
                  onChange={(e) => setSqlQueryInput(e.target.value)}
                  placeholder="e.g. SELECT campus_code, count(*) FROM students GROUP BY campus_code;"
                  className="w-full bg-transparent border-none text-emerald-400 focus:outline-none text-xs font-mono"
                />
                <button
                  type="submit"
                  className="px-3 py-1 bg-[#b3272c] hover:bg-red-700 text-white rounded font-bold text-xs cursor-pointer flex-shrink-0"
                >
                  Execute
                </button>
              </div>
              {sqlResultOutput && (
                <div className="mt-3 pt-2 border-t border-slate-800 text-slate-300 text-[11px]">
                  {sqlResultOutput}
                </div>
              )}
            </form>

            {/* Log Records Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">Timestamp</th>
                    <th className="py-2.5 px-3">Tenant Scope</th>
                    <th className="py-2.5 px-3">SQL / Mutation Query</th>
                    <th className="py-2.5 px-3">Caller & IP</th>
                    <th className="py-2.5 px-3">Latency</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {bypassLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/70">
                      <td className="py-2.5 px-3 text-slate-400 text-[11px] whitespace-nowrap">
                        {log.timestamp}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 font-bold text-[10px]">
                          {log.campus_code}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-900 font-medium truncate max-w-md">
                        {log.query}
                      </td>
                      <td className="py-2.5 px-3 text-[11px] text-slate-500 whitespace-nowrap">
                        {log.caller} • {log.ip}
                      </td>
                      <td className="py-2.5 px-3 text-[11px] text-slate-400 whitespace-nowrap">
                        {log.latency_ms}ms
                      </td>
                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================
          5. ROOT ACCESS PANEL / FLYOUT MODAL (ELEVATED SIDE DRAWER)
          ======================================================== */}
      {isRootPanelOpen && selectedInstitutionForRoot && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="bg-[#001639] text-white p-5 border-b border-slate-700 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-white p-1 flex items-center justify-center flex-shrink-0 shadow-md">
                  <img
                    src="/images/eaglets-logo.jpg"
                    alt="Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-white">
                      {selectedInstitutionForRoot.name}
                    </span>
                    <span className="font-mono text-[10px] bg-[#b3272c] text-white px-2 py-0.5 rounded font-bold">
                      {selectedInstitutionForRoot.campus_code}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#f5bc71] font-semibold mt-0.5">
                    Root Elevated Control Flyout • {selectedInstitutionForRoot.license_tier}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsRootPanelOpen(false)}
                className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Elevated Tabs Selector */}
            <div className="flex items-center gap-1 p-2 bg-slate-100 border-b border-slate-200 text-xs overflow-x-auto">
              <button
                type="button"
                onClick={() => setRootPanelTab('OVERRIDE')}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 cursor-pointer transition-all ${
                  rootPanelTab === 'OVERRIDE'
                    ? 'bg-white text-[#001639] shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">edit_note</span>
                <span>Profile Override</span>
              </button>

              <button
                type="button"
                onClick={() => setRootPanelTab('ADMIN_STAFF')}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 cursor-pointer transition-all ${
                  rootPanelTab === 'ADMIN_STAFF'
                    ? 'bg-white text-[#001639] shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">badge</span>
                <span>Admin & Faculty</span>
              </button>

              <button
                type="button"
                onClick={() => setRootPanelTab('PASSWORD_RESET')}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 cursor-pointer transition-all ${
                  rootPanelTab === 'PASSWORD_RESET'
                    ? 'bg-white text-[#001639] shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="material-symbols-outlined text-[15px] text-[#b3272c]">lock_reset</span>
                <span>Force Reset</span>
              </button>

              <button
                type="button"
                onClick={() => setRootPanelTab('DB_LOGS')}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 cursor-pointer transition-all ${
                  rootPanelTab === 'DB_LOGS'
                    ? 'bg-white text-[#001639] shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="material-symbols-outlined text-[15px] text-[#f5bc71]">terminal</span>
                <span>DB Bypass</span>
              </button>
            </div>

            {/* Elevated Panel Body */}
            <div className="flex-1 p-5 overflow-y-auto text-xs flex flex-col gap-4">
              {/* TAB 1: Institution Profile Override */}
              {rootPanelTab === 'OVERRIDE' && (
                <form onSubmit={handleSaveRootOverride} className="flex flex-col gap-4">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900">
                    <p className="font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">info</span>
                      Root Authority Override Enabled
                    </p>
                    <p className="text-[11px] text-blue-800 mt-0.5">
                      Changes made here bypass standard local campus governance and apply directly to the central registry.
                    </p>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Institution Legal Title</label>
                    <input
                      type="text"
                      value={selectedInstitutionForRoot.name}
                      onChange={(e) =>
                        setSelectedInstitutionForRoot({
                          ...selectedInstitutionForRoot,
                          name: e.target.value,
                        })
                      }
                      className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Campus Subdomain</label>
                      <input
                        type="text"
                        value={selectedInstitutionForRoot.subdomain}
                        onChange={(e) =>
                          setSelectedInstitutionForRoot({
                            ...selectedInstitutionForRoot,
                            subdomain: e.target.value,
                          })
                        }
                        className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Student Capacity Limit</label>
                      <input
                        type="number"
                        value={selectedInstitutionForRoot.capacity}
                        onChange={(e) =>
                          setSelectedInstitutionForRoot({
                            ...selectedInstitutionForRoot,
                            capacity: Number(e.target.value) || 1000,
                          })
                        }
                        className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">License Tier</label>
                      <select
                        value={selectedInstitutionForRoot.license_tier}
                        onChange={(e) =>
                          setSelectedInstitutionForRoot({
                            ...selectedInstitutionForRoot,
                            license_tier: e.target.value as LicenseTier,
                          })
                        }
                        className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      >
                        <option value="Enterprise Network">Enterprise Network</option>
                        <option value="Pro Academic">Pro Academic</option>
                        <option value="Standard Campus">Standard Campus</option>
                        <option value="Pilot Trial">Pilot Trial</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">License Status</label>
                      <select
                        value={selectedInstitutionForRoot.license_status}
                        onChange={(e) =>
                          setSelectedInstitutionForRoot({
                            ...selectedInstitutionForRoot,
                            license_status: e.target.value as any,
                          })
                        }
                        className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      >
                        <option value="Active">Active</option>
                        <option value="Provisioning">Provisioning</option>
                        <option value="Expiring">Expiring</option>
                        <option value="Suspended">Suspended</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">BISE Board Accreditation</label>
                    <input
                      type="text"
                      value={selectedInstitutionForRoot.bise_affiliation}
                      onChange={(e) =>
                        setSelectedInstitutionForRoot({
                          ...selectedInstitutionForRoot,
                          bise_affiliation: e.target.value,
                        })
                      }
                      className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>

                  {/* Kill-switch / Emergency Freeze */}
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900">Emergency Maintenance Freeze</p>
                      <p className="text-[11px] text-slate-500">Lock tenant in read-only maintenance mode immediately.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleMaintenance(selectedInstitutionForRoot.id)}
                      className={`px-3 py-1.5 rounded-lg font-bold text-xs cursor-pointer ${
                        selectedInstitutionForRoot.is_maintenance_mode
                          ? 'bg-emerald-600 text-white'
                          : 'bg-rose-600 text-white'
                      }`}
                    >
                      {selectedInstitutionForRoot.is_maintenance_mode ? 'Unfreeze Tenant' : 'Freeze Tenant'}
                    </button>
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsRootPanelOpen(false)}
                      className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#001639] hover:bg-[#122b54] text-white font-bold rounded-lg shadow-sm cursor-pointer"
                    >
                      Save Override
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 2: Edit Campus Admin & Faculty Profiles */}
              {rootPanelTab === 'ADMIN_STAFF' && (
                <div className="flex flex-col gap-4">
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#122b54] text-white font-bold flex items-center justify-center text-sm shadow-xs">
                        {selectedInstitutionForRoot.admin_avatar || 'CA'}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">
                          {selectedInstitutionForRoot.primary_admin_name}
                        </h4>
                        <p className="text-slate-500 text-[11px]">Primary Campus Administrator</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-200">
                      <div>
                        <span className="text-slate-400 block">Official Email</span>
                        <span className="font-mono text-slate-800 font-semibold">
                          {selectedInstitutionForRoot.primary_admin_email}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Contact Phone</span>
                        <span className="font-mono text-slate-800 font-semibold">
                          {selectedInstitutionForRoot.primary_admin_phone}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Update Administrator Full Name</label>
                    <input
                      type="text"
                      value={selectedInstitutionForRoot.primary_admin_name}
                      onChange={(e) =>
                        setSelectedInstitutionForRoot({
                          ...selectedInstitutionForRoot,
                          primary_admin_name: e.target.value,
                        })
                      }
                      className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Update Admin Official Email</label>
                    <input
                      type="email"
                      value={selectedInstitutionForRoot.primary_admin_email}
                      onChange={(e) =>
                        setSelectedInstitutionForRoot({
                          ...selectedInstitutionForRoot,
                          primary_admin_email: e.target.value,
                        })
                      }
                      className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs"
                    />
                  </div>

                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-[11px]">
                    <span className="font-bold block">Assigned Faculty Registry:</span>
                    Currently managing <strong>{selectedInstitutionForRoot.faculty_count} verified teachers</strong> on {selectedInstitutionForRoot.name}. All faculty salary sheets are linked to central BISE payroll.
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setInstitutions(
                        institutions.map((i) =>
                          i.id === selectedInstitutionForRoot.id ? selectedInstitutionForRoot : i
                        )
                      )
                      showToast(`Administrator updated for ${selectedInstitutionForRoot.name}`)
                    }}
                    className="w-full py-2 bg-[#001639] text-white font-bold rounded-lg shadow-sm cursor-pointer"
                  >
                    Commit Admin Update
                  </button>
                </div>
              )}

              {/* TAB 3: Force Password Reset */}
              {rootPanelTab === 'PASSWORD_RESET' && (
                <div className="flex flex-col gap-4">
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-900">
                    <div className="flex items-center gap-2 font-bold text-sm">
                      <span className="material-symbols-outlined text-red-600 text-[20px]">
                        lock_reset
                      </span>
                      <span>Immediate Credential Revocation</span>
                    </div>
                    <p className="text-xs text-red-800 mt-1">
                      Forcing a reset will instantly terminate all active web & mobile sessions for{' '}
                      <strong>{selectedInstitutionForRoot.primary_admin_name}</strong> and issue a mandatory single-use unlock code.
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col gap-2">
                    <span className="text-slate-500 text-[11px]">Generated Single-Use Emergency Password</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value="EagReset#90412!PK"
                        className="w-full h-9 px-3 bg-white border border-slate-300 rounded-lg font-mono font-bold text-slate-800 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText('EagReset#90412!PK')
                          showToast('Temporary password copied to clipboard!')
                        }}
                        className="px-3 py-2 bg-slate-800 text-white rounded-lg text-xs font-bold cursor-pointer hover:bg-black"
                      >
                        Copy
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      showToast(
                        `Emergency reset token dispatched to ${selectedInstitutionForRoot.primary_admin_email} via SMS & Encrypted Email.`,
                        'warning'
                      )
                    }}
                    className="w-full py-2.5 bg-[#b3272c] hover:bg-[#88131b] text-white font-bold rounded-xl shadow-xs cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">send</span>
                    <span>Confirm & Force Password Reset</span>
                  </button>
                </div>
              )}

              {/* TAB 4: Direct Database Bypass Logs */}
              {rootPanelTab === 'DB_LOGS' && (
                <div className="flex flex-col gap-3 font-mono text-xs">
                  <div className="p-3 bg-slate-900 text-slate-300 rounded-xl space-y-2 text-[11px]">
                    <div className="flex justify-between text-[#f5bc71] font-bold pb-1 border-b border-slate-800">
                      <span>Live Bypass Feed: {selectedInstitutionForRoot.campus_code}</span>
                      <span>CLUSTER-01</span>
                    </div>
                    <p className="text-emerald-400">
                      &gt; SELECT count(*) FROM students WHERE campus_code='{selectedInstitutionForRoot.campus_code}';
                    </p>
                    <p className="text-slate-400 text-[10px]">Result: {selectedInstitutionForRoot.student_count} records returned in 11ms</p>
                    <p className="text-emerald-400">
                      &gt; VERIFY_AFFILIATION('{selectedInstitutionForRoot.bise_affiliation}');
                    </p>
                    <p className="text-slate-400 text-[10px]">Status: ACCREDITATION_ACTIVE</p>
                  </div>

                  <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 flex flex-col gap-2">
                    <span className="font-bold text-slate-800 font-sans">Direct Bypass Query</span>
                    <input
                      type="text"
                      placeholder="e.g. UPDATE faculty SET status='Active';"
                      className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded text-xs font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => showToast('Direct query executed with Root bypass authority.')}
                      className="py-1.5 bg-[#001639] text-white rounded font-bold text-xs cursor-pointer"
                    >
                      Run Mutation
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-mono">
                Key ID: {selectedInstitutionForRoot.security_key_id}
              </span>
              <button
                type="button"
                onClick={() => setIsRootPanelOpen(false)}
                className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-lg cursor-pointer"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          EDITABLE SUPER ADMIN PROFILE DRAWER (TOP BAR TRIGGER)
          ======================================================== */}
      {isProfileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300">
            <div className="bg-[#001639] text-white p-5 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#b3272c] text-white font-bold flex items-center justify-center text-sm shadow-md">
                  TA
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">{superAdminProfile.name}</h3>
                  <span className="text-[10px] text-[#f5bc71] font-mono block">
                    {superAdminProfile.role}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsProfileDrawerOpen(false)}
                className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Profile Drawer Body */}
            <div className="flex-1 p-5 overflow-y-auto text-xs flex flex-col gap-4">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-600 text-[20px]">
                  verified_user
                </span>
                <div>
                  <p className="font-bold">Hardware Root Authorization Active</p>
                  <p className="text-[10px] text-emerald-800">
                    Master FIDO2 / YubiKey authenticated for global tenant operations.
                  </p>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  value={superAdminProfile.name}
                  onChange={(e) => setSuperAdminProfile({ ...superAdminProfile, name: e.target.value })}
                  className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Root Master Email</label>
                <input
                  type="email"
                  value={superAdminProfile.email}
                  onChange={(e) => setSuperAdminProfile({ ...superAdminProfile, email: e.target.value })}
                  className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Root Username</label>
                <input
                  type="text"
                  value={superAdminProfile.username}
                  onChange={(e) => setSuperAdminProfile({ ...superAdminProfile, username: e.target.value })}
                  className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Hardware Key Fingerprint</label>
                <input
                  type="text"
                  readOnly
                  value={superAdminProfile.key_fingerprint}
                  className="w-full h-9 px-3 bg-slate-100 border border-slate-200 rounded-lg font-mono text-[11px] text-slate-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Session Inactivity Lockout</label>
                <select
                  value={superAdminProfile.session_timeout_mins}
                  onChange={(e) =>
                    setSuperAdminProfile({
                      ...superAdminProfile,
                      session_timeout_mins: Number(e.target.value) || 30,
                    })
                  }
                  className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                >
                  <option value={15}>15 Minutes</option>
                  <option value={30}>30 Minutes (Recommended)</option>
                  <option value={60}>1 Hour</option>
                </select>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">Enforce 2FA for Root Actions</span>
                    <span className="text-[10px] text-slate-500">Require token validation on mutations</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={superAdminProfile.two_factor_enforced}
                    onChange={(e) =>
                      setSuperAdminProfile({
                        ...superAdminProfile,
                        two_factor_enforced: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded text-[#001639]"
                  />
                </div>
              </div>
            </div>

            {/* Profile Drawer Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsProfileDrawerOpen(false)}
                className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast('Super Admin Profile settings saved successfully!')
                  setIsProfileDrawerOpen(false)
                }}
                className="px-5 py-2 bg-[#001639] hover:bg-[#122b54] text-white font-bold rounded-lg shadow-sm cursor-pointer"
              >
                Save Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 1: + ADD NEW INSTITUTION
          ======================================================== */}
      <Modal
        isOpen={isAddInstitutionOpen}
        onClose={() => setIsAddInstitutionOpen(false)}
        title="Add New Institution / Campus to Network"
        subtitle="Provision an isolated multi-tenant educational instance with dedicated database schema and campus administrator."
        maxWidth="2xl"
      >
        <form onSubmit={handleCreateInstitution} className="flex flex-col gap-3.5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Institution / Campus Title *</label>
              <input
                type="text"
                required
                value={newInstitutionForm.name}
                onChange={(e) =>
                  setNewInstitutionForm({
                    ...newInstitutionForm,
                    name: e.target.value,
                  })
                }
                placeholder="e.g. Eaglets Sahiwal Model Wing"
                className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Campus Code (Monospace) *</label>
              <input
                type="text"
                required
                value={newInstitutionForm.campus_code}
                onChange={(e) =>
                  setNewInstitutionForm({
                    ...newInstitutionForm,
                    campus_code: e.target.value.toUpperCase(),
                  })
                }
                placeholder="e.g. EAG-SHW-01"
                className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">City / Region *</label>
              <input
                type="text"
                required
                value={newInstitutionForm.city}
                onChange={(e) =>
                  setNewInstitutionForm({
                    ...newInstitutionForm,
                    city: e.target.value,
                  })
                }
                placeholder="e.g. Sahiwal"
                className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Administrative Region</label>
              <select
                value={newInstitutionForm.region}
                onChange={(e) =>
                  setNewInstitutionForm({
                    ...newInstitutionForm,
                    region: e.target.value,
                  })
                }
                className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg"
              >
                <option value="Punjab (Central)">Punjab (Central)</option>
                <option value="Punjab (North)">Punjab (North)</option>
                <option value="Punjab (South)">Punjab (South)</option>
                <option value="Sindh (South)">Sindh (South)</option>
                <option value="Sindh (Interior)">Sindh (Interior)</option>
                <option value="Khyber Pakhtunkhwa">Khyber Pakhtunkhwa</option>
                <option value="Federal Capital">Federal Capital</option>
                <option value="Balochistan">Balochistan</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Primary Admin Full Name *</label>
              <input
                type="text"
                required
                value={newInstitutionForm.primary_admin_name}
                onChange={(e) =>
                  setNewInstitutionForm({
                    ...newInstitutionForm,
                    primary_admin_name: e.target.value,
                  })
                }
                placeholder="e.g. Ch. Nadeem Akhtar"
                className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Primary Admin Official Email *</label>
              <input
                type="email"
                required
                value={newInstitutionForm.primary_admin_email}
                onChange={(e) =>
                  setNewInstitutionForm({
                    ...newInstitutionForm,
                    primary_admin_email: e.target.value,
                  })
                }
                placeholder="nadeem.akhtar@eaglets.edu.pk"
                className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Initial Capacity</label>
              <input
                type="number"
                value={newInstitutionForm.capacity}
                onChange={(e) =>
                  setNewInstitutionForm({
                    ...newInstitutionForm,
                    capacity: Number(e.target.value) || 1000,
                  })
                }
                className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">License Tier</label>
              <select
                value={newInstitutionForm.license_tier}
                onChange={(e) =>
                  setNewInstitutionForm({
                    ...newInstitutionForm,
                    license_tier: e.target.value as LicenseTier,
                  })
                }
                className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg"
              >
                <option value="Enterprise Network">Enterprise Network</option>
                <option value="Pro Academic">Pro Academic</option>
                <option value="Standard Campus">Standard Campus</option>
                <option value="Pilot Trial">Pilot Trial</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">BISE Board Affiliation</label>
              <input
                type="text"
                value={newInstitutionForm.bise_affiliation}
                onChange={(e) =>
                  setNewInstitutionForm({
                    ...newInstitutionForm,
                    bise_affiliation: e.target.value,
                  })
                }
                className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddInstitutionOpen(false)}
              className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#b3272c] hover:bg-[#88131b] text-white font-bold rounded-lg shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[17px]">add_business</span>
              <span>Provision Institution</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* ========================================================
          MODAL 2: PROVISION ADMIN CREDENTIALS
          ======================================================== */}
      <Modal
        isOpen={isProvisionCredentialsOpen}
        onClose={() => setIsProvisionCredentialsOpen(false)}
        title="Provision Campus Admin Credentials & Security Keys"
        subtitle="Auto-generate administrative usernames, temporary passwords, and RSA-256 API security tokens."
        maxWidth="xl"
      >
        <form onSubmit={handleProvisionSubmit} className="flex flex-col gap-3.5 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Target Educational Institution</label>
            <select
              value={provisionForm.campus_id}
              onChange={(e) => setProvisionForm({ ...provisionForm, campus_id: e.target.value })}
              className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg font-medium"
            >
              {institutions.map((inst) => (
                <option key={inst.id} value={inst.id}>
                  {inst.name} ({inst.campus_code}) - {inst.city}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Admin Full Name *</label>
              <input
                type="text"
                required
                value={provisionForm.admin_name}
                onChange={(e) => {
                  const name = e.target.value
                  const autoSlug = name.toLowerCase().trim().replace(/[^a-z0-9]/g, '.')
                  setProvisionForm({
                    ...provisionForm,
                    admin_name: name,
                    username: autoSlug ? `${autoSlug}.admin` : '',
                    admin_email: autoSlug ? `${autoSlug}@eaglets.edu.pk` : '',
                  })
                }}
                placeholder="e.g. Asim Raza"
                className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Official Email *</label>
              <input
                type="email"
                required
                value={provisionForm.admin_email}
                onChange={(e) => setProvisionForm({ ...provisionForm, admin_email: e.target.value })}
                className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg font-mono"
              />
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div>
              <span className="text-slate-500 text-[10.5px] block">Auto-Generated Username</span>
              <input
                type="text"
                readOnly
                value={provisionForm.username || 'admin.username'}
                className="w-full h-8 px-2.5 bg-white border border-slate-200 rounded font-mono font-bold text-slate-800 text-xs"
              />
            </div>

            <div>
              <div className="flex justify-between items-center text-[10.5px] text-slate-500">
                <span>Temporary Security Password</span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(provisionForm.temp_password)
                    showToast('Temporary password copied!')
                  }}
                  className="text-blue-600 hover:underline font-semibold"
                >
                  Copy Password
                </button>
              </div>
              <input
                type="text"
                readOnly
                value={provisionForm.temp_password}
                className="w-full h-8 px-2.5 bg-white border border-slate-200 rounded font-mono font-bold text-[#b3272c] text-xs"
              />
            </div>

            <div>
              <div className="flex justify-between items-center text-[10.5px] text-slate-500">
                <span>Campus RSA-256 Secret API Token</span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(provisionForm.api_token)
                    showToast('API token copied!')
                  }}
                  className="text-blue-600 hover:underline font-semibold"
                >
                  Copy Token
                </button>
              </div>
              <input
                type="text"
                readOnly
                value={provisionForm.api_token}
                className="w-full h-8 px-2.5 bg-white border border-slate-200 rounded font-mono text-[10.5px] text-slate-600"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="forceResetToggle"
              checked={provisionForm.force_reset}
              onChange={(e) => setProvisionForm({ ...provisionForm, force_reset: e.target.checked })}
              className="w-4 h-4 rounded text-[#001639]"
            />
            <label htmlFor="forceResetToggle" className="font-semibold text-slate-700">
              Force password reset and 2FA setup on first login
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsProvisionCredentialsOpen(false)}
              className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#001639] hover:bg-[#122b54] text-white font-bold rounded-lg shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[17px] text-[#f5bc71]">key</span>
              <span>Provision & Dispatch Credentials</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
