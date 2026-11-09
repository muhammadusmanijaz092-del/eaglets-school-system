'use client'

import React, { useState } from 'react'
import Modal from '@/components/Modal'
import { INITIAL_ADMIN_USERS } from '@/lib/mock-data'
import { AdminUser, AdminRole } from '@/lib/supabase/types'
import { createClient } from '@/lib/supabase/client'

export default function SuperAdminPage() {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(INITIAL_ADMIN_USERS)
  const [activeRole, setActiveRole] = useState<AdminRole>('SUPER_ADMIN')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<'ALL' | AdminRole>('ALL')
  const [selectedCampusFilter, setSelectedCampusFilter] = useState('ALL')

  // Modals
  const [isProvisionModalOpen, setIsProvisionModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isPasswordResetModalOpen, setIsPasswordResetModalOpen] = useState(false)
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null)
  const [generatedTempPassword, setGeneratedTempPassword] = useState('')

  // Notifications
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'warning' } | null>(null)

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState([
    { id: 'log-1', action: 'ADMIN_PROVISIONED', details: 'Admin user "junaid.exams" created with EXAM_CONTROLLER role', user: 'tariq.alvi', timestamp: 'Today, 08:45 AM', ip: '192.168.1.10' },
    { id: 'log-2', action: 'GLOBAL_FEE_OVERRIDE', details: 'Late fee surcharge waived for Student Rayyan Butt (Challan #8492)', user: 'tariq.alvi', timestamp: 'Today, 08:30 AM', ip: '192.168.1.10' },
    { id: 'log-3', action: 'PASSWORD_RESET', details: 'Temporary credentials generated for "masood.ahmad"', user: 'tariq.alvi', timestamp: 'Yesterday, 04:18 PM', ip: '192.168.1.12' },
    { id: 'log-4', action: 'CAMPUS_ACCESS_LOGGED', details: 'Campus Admin accessed Girls Junior Campus student registry', user: 'nighat.sultana', timestamp: '14 Sep 2026, 11:20 AM', ip: '192.168.2.45' },
  ])

  // New Admin Provisioning Form State
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    username: '',
    password: 'Eaglets@2026',
    force_password_reset: true,
    campus: 'Main Boys Campus, Lahore',
    role: 'CAMPUS_ADMIN' as AdminRole,
    two_factor_enabled: true,
  })

  // Auto-generate username from full name
  const handleFullNameChange = (name: string) => {
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '.')
    setFormData((prev) => ({
      ...prev,
      full_name: name,
      username: slug,
      email: slug ? `${slug}@eaglets.edu.pk` : '',
    }))
  }

  // Handle Provisioning Submit
  const handleProvisionSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (activeRole !== 'SUPER_ADMIN') {
      alert('Access Denied: Only SUPER_ADMIN can provision new administrator accounts.')
      return
    }

    const newAdmin: AdminUser = {
      id: `adm-${Date.now()}`,
      full_name: formData.full_name,
      email: formData.email,
      username: formData.username,
      role: formData.role,
      campus: formData.campus,
      is_active: true,
      two_factor_enabled: formData.two_factor_enabled,
      force_password_reset: formData.force_password_reset,
      last_login: 'Never',
      created_at: new Date().toISOString().slice(0, 10),
    }

    setAdminUsers([newAdmin, ...adminUsers])
    setAuditLogs([
      {
        id: `log-${Date.now()}`,
        action: 'ADMIN_PROVISIONED',
        details: `Provisioned "${newAdmin.username}" with role ${newAdmin.role} for ${newAdmin.campus}`,
        user: 'tariq.alvi',
        timestamp: 'Just now',
        ip: '192.168.1.10',
      },
      ...auditLogs,
    ])

    // Sync to Supabase if connected
    const supabase = createClient()
    if (supabase) {
      supabase.from('admin_users').insert([newAdmin]).then(({ error }) => {
        if (error) console.error('Supabase admin insert error:', error)
      })
    }

    setIsProvisionModalOpen(false)
    setNotification({
      message: `Admin account for ${newAdmin.full_name} (${newAdmin.username}) provisioned successfully!`,
      type: 'success',
    })
    setTimeout(() => setNotification(null), 5000)

    // Reset Form
    setFormData({
      full_name: '',
      email: '',
      username: '',
      password: 'Eaglets@' + Math.floor(1000 + Math.random() * 9000),
      force_password_reset: true,
      campus: 'Main Boys Campus, Lahore',
      role: 'CAMPUS_ADMIN',
      two_factor_enabled: true,
    })
  }

  // Toggle Admin Status
  const handleToggleStatus = (admin: AdminUser) => {
    if (activeRole !== 'SUPER_ADMIN') {
      alert('Access Denied: Only SUPER_ADMIN can activate/deactivate administrators.')
      return
    }
    const updated = adminUsers.map((a) =>
      a.id === admin.id ? { ...a, is_active: !a.is_active } : a
    )
    setAdminUsers(updated)
    setAuditLogs([
      {
        id: `log-${Date.now()}`,
        action: admin.is_active ? 'ADMIN_DEACTIVATED' : 'ADMIN_ACTIVATED',
        details: `${admin.username} status changed to ${admin.is_active ? 'Deactivated' : 'Active'}`,
        user: 'tariq.alvi',
        timestamp: 'Just now',
        ip: '192.168.1.10',
      },
      ...auditLogs,
    ])
  }

  // Handle Password Reset
  const handleOpenPasswordReset = (admin: AdminUser) => {
    if (activeRole !== 'SUPER_ADMIN') {
      alert('Access Denied: Only SUPER_ADMIN can reset admin passwords.')
      return
    }
    const tempPass = 'EagPass#' + Math.floor(100000 + Math.random() * 900000)
    setSelectedAdmin(admin)
    setGeneratedTempPassword(tempPass)
    setIsPasswordResetModalOpen(true)
  }

  const handleConfirmPasswordReset = () => {
    if (!selectedAdmin) return
    setAuditLogs([
      {
        id: `log-${Date.now()}`,
        action: 'PASSWORD_RESET',
        details: `Temporary credentials generated for ${selectedAdmin.username}`,
        user: 'tariq.alvi',
        timestamp: 'Just now',
        ip: '192.168.1.10',
      },
      ...auditLogs,
    ])
    setIsPasswordResetModalOpen(false)
    setNotification({
      message: `New temporary password generated for ${selectedAdmin.full_name}: ${generatedTempPassword}`,
      type: 'success',
    })
    setTimeout(() => setNotification(null), 7000)
  }

  // Handle Edit Permissions
  const handleOpenEdit = (admin: AdminUser) => {
    if (activeRole !== 'SUPER_ADMIN') {
      alert('Access Denied: Only SUPER_ADMIN can modify administrator permissions.')
      return
    }
    setSelectedAdmin({ ...admin })
    setIsEditModalOpen(true)
  }

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedAdmin) return
    setAdminUsers(adminUsers.map((a) => (a.id === selectedAdmin.id ? selectedAdmin : a)))
    setAuditLogs([
      {
        id: `log-${Date.now()}`,
        action: 'PERMISSIONS_MODIFIED',
        details: `Permissions updated for ${selectedAdmin.username} -> Role: ${selectedAdmin.role}, Campus: ${selectedAdmin.campus}`,
        user: 'tariq.alvi',
        timestamp: 'Just now',
        ip: '192.168.1.10',
      },
      ...auditLogs,
    ])
    setIsEditModalOpen(false)
    setNotification({
      message: `Permissions updated for ${selectedAdmin.full_name}.`,
      type: 'success',
    })
    setTimeout(() => setNotification(null), 4000)
  }

  // Clear Audit Logs
  const handleClearLogs = () => {
    if (activeRole !== 'SUPER_ADMIN') {
      alert('Access Denied: Only SUPER_ADMIN can purge system audit logs.')
      return
    }
    if (confirm('Are you sure you want to clear the system audit trail? This root action is logged.')) {
      setAuditLogs([
        {
          id: `log-${Date.now()}`,
          action: 'AUDIT_LOG_PURGED',
          details: 'Root Super Admin cleared historical security trail',
          user: 'tariq.alvi',
          timestamp: 'Just now',
          ip: '192.168.1.10',
        },
      ])
    }
  }

  // Filtered Directory
  const filteredAdmins = adminUsers.filter((a) => {
    const matchesSearch =
      a.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.email.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRole = selectedRoleFilter === 'ALL' || a.role === selectedRoleFilter
    const matchesCampus = selectedCampusFilter === 'ALL' || a.campus.includes(selectedCampusFilter)

    return matchesSearch && matchesRole && matchesCampus
  })

  // Role Badges Color Matrix
  const getRoleBadge = (role: AdminRole) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#ffdad7] text-[#93000a] border border-[#b3272c]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#b3272c] animate-pulse"></span>
            SUPER ADMIN (Root)
          </span>
        )
      case 'CAMPUS_ADMIN':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#eff4ff] text-[#001639] border border-[#122b54]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#122b54]"></span>
            CAMPUS ADMIN
          </span>
        )
      case 'ACCOUNTS_MANAGER':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            ACCOUNTS MANAGER
          </span>
        )
      case 'EXAM_CONTROLLER':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
            EXAM CONTROLLER
          </span>
        )
    }
  }

  return (
    <div className="px-3 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col gap-5 min-w-0">
      {/* Top Banner & Role Simulator */}
      <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200/80 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="px-2.5 py-0.5 rounded bg-[#ffdad7] text-[#93000a] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">shield_person</span>
              Root Security Console
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium">Role-Based Access Control (RBAC)</span>
          </div>
          <h1 className="font-domine text-2xl font-bold text-[#001639]">
            Super Admin Console & Identity Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Provision branch administrators, configure scoped access limits, enforce 2FA verification, and monitor live audit trails.
          </p>
        </div>

        {/* Live Role Switcher / Simulator */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Active Session Guard
            </span>
            <span className="text-xs font-semibold text-[#001639]">
              Simulating Role:
            </span>
          </div>
          <select
            value={activeRole}
            onChange={(e) => setActiveRole(e.target.value as AdminRole)}
            className="h-9 px-3 bg-white text-xs font-bold rounded-lg border border-slate-300 text-[#001639] focus:outline-none focus:border-[#122b54] cursor-pointer shadow-2xs"
          >
            <option value="SUPER_ADMIN">👑 SUPER_ADMIN (Root Access)</option>
            <option value="CAMPUS_ADMIN">🏢 CAMPUS_ADMIN (Branch Scoped)</option>
            <option value="ACCOUNTS_MANAGER">💳 ACCOUNTS_MANAGER (Fee Only)</option>
            <option value="EXAM_CONTROLLER">📝 EXAM_CONTROLLER (Academics)</option>
          </select>
        </div>
      </div>

      {/* Role Guard Permission Notice */}
      {activeRole !== 'SUPER_ADMIN' ? (
        <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 text-xs flex items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-amber-600 text-[20px] flex-shrink-0">
              lock
            </span>
            <span>
              <strong>Restricted Access Guard Active:</strong> You are simulating <strong>{activeRole}</strong>. In this role, user provisioning, role deactivations, password overrides, and audit purge controls are disabled.
            </span>
          </div>
          <button
            onClick={() => setActiveRole('SUPER_ADMIN')}
            className="px-3 py-1 bg-amber-200 hover:bg-amber-300 text-amber-900 rounded-md font-bold text-[11px] whitespace-nowrap cursor-pointer"
          >
            Switch to Super Admin
          </button>
        </div>
      ) : (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs flex items-center gap-2">
          <span className="material-symbols-outlined text-emerald-600 text-[18px]">
            verified_user
          </span>
          <span>
            <strong>Root Authority Verified:</strong> Full administrative clearance enabled. You can provision branch admins, reset passwords, clear logs, and modify global financial overrides.
          </span>
        </div>
      )}

      {/* Notification Toast */}
      {notification && (
        <div
          className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-3 ${
            notification.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">
              {notification.type === 'success' ? 'check_circle' : 'warning'}
            </span>
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-slate-500 hover:text-slate-800 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#eff4ff] text-[#001639] flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px]">admin_panel_settings</span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Admins</span>
            <div className="text-xl font-bold text-[#001639]">{adminUsers.length} Users</div>
            <span className="text-[10px] text-emerald-600 font-semibold">
              {adminUsers.filter((a) => a.is_active).length} Active • {adminUsers.filter((a) => !a.is_active).length} Inactive
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#ffdad7] text-[#b3272c] flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px]">shield</span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Super Admins</span>
            <div className="text-xl font-bold text-[#b3272c]">
              {adminUsers.filter((a) => a.role === 'SUPER_ADMIN').length} Root Users
            </div>
            <span className="text-[10px] text-slate-500 font-semibold">Global Authority</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px]">security</span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">2FA Compliance</span>
            <div className="text-xl font-bold text-emerald-700">
              {Math.round(
                (adminUsers.filter((a) => a.two_factor_enabled).length / adminUsers.length) * 100
              )}%
            </div>
            <span className="text-[10px] text-slate-500 font-semibold">
              {adminUsers.filter((a) => a.two_factor_enabled).length} of {adminUsers.length} Enforced
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px]">domain</span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Campuses Covered</span>
            <div className="text-xl font-bold text-slate-800">3 Branches</div>
            <span className="text-[10px] text-slate-500 font-semibold">Lahore Districts</span>
          </div>
        </div>
      </div>

      {/* Admin Directory Table Card */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col">
        {/* Table Toolbar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1 max-w-2xl">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px]">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by admin name, username or email..."
                className="w-full h-9 pl-9 pr-3 bg-slate-50 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-[#122b54]"
              />
            </div>

            {/* Role Filter */}
            <select
              value={selectedRoleFilter}
              onChange={(e) => setSelectedRoleFilter(e.target.value as any)}
              className="h-9 px-3 bg-slate-50 text-xs font-semibold rounded-lg border border-slate-200 text-slate-700 focus:outline-none focus:border-[#122b54] cursor-pointer"
            >
              <option value="ALL">All Roles</option>
              <option value="SUPER_ADMIN">SUPER_ADMIN</option>
              <option value="CAMPUS_ADMIN">CAMPUS_ADMIN</option>
              <option value="ACCOUNTS_MANAGER">ACCOUNTS_MANAGER</option>
              <option value="EXAM_CONTROLLER">EXAM_CONTROLLER</option>
            </select>

            {/* Campus Filter */}
            <select
              value={selectedCampusFilter}
              onChange={(e) => setSelectedCampusFilter(e.target.value)}
              className="h-9 px-3 bg-slate-50 text-xs font-semibold rounded-lg border border-slate-200 text-slate-700 focus:outline-none focus:border-[#122b54] cursor-pointer"
            >
              <option value="ALL">All Campuses</option>
              <option value="Main Boys Campus">Main Boys Campus</option>
              <option value="Girls Junior Campus">Girls Junior Campus</option>
              <option value="Gulberg Model Wing">Gulberg Model Wing</option>
            </select>
          </div>

          {/* Provision Button */}
          <button
            type="button"
            disabled={activeRole !== 'SUPER_ADMIN'}
            onClick={() => setIsProvisionModalOpen(true)}
            className={`h-9 px-4 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors shadow-xs ${
              activeRole === 'SUPER_ADMIN'
                ? 'bg-[#b3272c] hover:bg-[#88131b] text-white cursor-pointer'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
            title={activeRole !== 'SUPER_ADMIN' ? 'Restricted to Super Admin' : 'Provision Admin'}
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            <span>+ Provision New Admin</span>
          </button>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Administrator</th>
                <th className="py-3 px-3">Role Badge</th>
                <th className="py-3 px-3">Assigned Campus</th>
                <th className="py-3 px-3">2FA Status</th>
                <th className="py-3 px-3">Last Login</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredAdmins.map((admin) => (
                <tr key={admin.id} className="hover:bg-slate-50/70 transition-colors">
                  {/* User Profile */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#122b54] text-white flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-2xs">
                        {admin.full_name
                          .split(' ')
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join('')
                          .toUpperCase()}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-[#001639] truncate">{admin.full_name}</span>
                        <span className="text-[10px] text-slate-400 font-mono truncate">
                          @{admin.username} • {admin.email}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="py-3 px-3">{getRoleBadge(admin.role)}</td>

                  {/* Campus */}
                  <td className="py-3 px-3 font-medium text-slate-700">
                    <span className="inline-flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px] text-slate-400">
                        apartment
                      </span>
                      {admin.campus}
                    </span>
                  </td>

                  {/* 2FA */}
                  <td className="py-3 px-3">
                    {admin.two_factor_enabled ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                        <span className="material-symbols-outlined text-[15px] text-emerald-600">
                          verified_user
                        </span>
                        Enforced
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                        <span className="material-symbols-outlined text-[15px] text-slate-400">
                          gpp_bad
                        </span>
                        Disabled
                      </span>
                    )}
                  </td>

                  {/* Last Login */}
                  <td className="py-3 px-3 text-slate-500 text-[11px] font-mono">
                    {admin.last_login || 'Never'}
                  </td>

                  {/* Status */}
                  <td className="py-3 px-3">
                    {admin.is_active ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                        Deactivated
                      </span>
                    )}
                  </td>

                  {/* Action Buttons */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Edit Permissions */}
                      <button
                        type="button"
                        disabled={activeRole !== 'SUPER_ADMIN'}
                        onClick={() => handleOpenEdit(admin)}
                        className={`p-1 rounded transition-colors ${
                          activeRole === 'SUPER_ADMIN'
                            ? 'text-slate-500 hover:text-[#001639] hover:bg-slate-100 cursor-pointer'
                            : 'text-slate-300 cursor-not-allowed'
                        }`}
                        title="Edit Permissions"
                      >
                        <span className="material-symbols-outlined text-[18px]">manage_accounts</span>
                      </button>

                      {/* Reset Password */}
                      <button
                        type="button"
                        disabled={activeRole !== 'SUPER_ADMIN'}
                        onClick={() => handleOpenPasswordReset(admin)}
                        className={`p-1 rounded transition-colors ${
                          activeRole === 'SUPER_ADMIN'
                            ? 'text-slate-500 hover:text-amber-600 hover:bg-amber-50 cursor-pointer'
                            : 'text-slate-300 cursor-not-allowed'
                        }`}
                        title="Reset Password"
                      >
                        <span className="material-symbols-outlined text-[18px]">lock_reset</span>
                      </button>

                      {/* Deactivate / Activate */}
                      <button
                        type="button"
                        disabled={activeRole !== 'SUPER_ADMIN'}
                        onClick={() => handleToggleStatus(admin)}
                        className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                          activeRole !== 'SUPER_ADMIN'
                            ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                            : admin.is_active
                            ? 'bg-rose-50 hover:bg-rose-100 text-[#b3272c] border border-rose-200 cursor-pointer'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 cursor-pointer'
                        }`}
                        title={admin.is_active ? 'Deactivate Admin' : 'Activate Admin'}
                      >
                        {admin.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Permissions Matrix & Security Guard Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Role Permissions Matrix */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col gap-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <span className="material-symbols-outlined text-[#001639] text-[20px]">
              key
            </span>
            <h2 className="font-domine font-bold text-sm text-[#001639]">
              Role Permissions & Access Matrix
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#b3272c] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  SUPER_ADMIN (Root Access)
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#ffdad7] text-[#93000a] font-bold">
                  All Branches
                </span>
              </div>
              <p className="text-slate-600 text-[11px]">
                Full root authority. Admin user provisioning, password resets, audit clearance, global fee overrides, and multi-campus reporting.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#122b54] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">apartment</span>
                  CAMPUS_ADMIN (Branch Scoped)
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#eff4ff] text-[#001639] font-bold">
                  Single Campus
                </span>
              </div>
              <p className="text-slate-600 text-[11px]">
                Autonomous control over local student admissions, faculty roster, timetable, attendance, and branch fee tracking. <em>Cannot provision other admin accounts.</em>
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">payments</span>
                  ACCOUNTS_MANAGER (Financial Ledger)
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                  Finance Only
                </span>
              </div>
              <p className="text-slate-600 text-[11px]">
                Fee billing, 3-part HBL challans, 80mm POS receipts, payment reconciliation, and arrears management.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-800 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">school</span>
                  EXAM_CONTROLLER (Academics)
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
                  Examinations
                </span>
              </div>
              <p className="text-slate-600 text-[11px]">
                Term date sheets, marks entry spreadsheet gazette, BISE grading compliance, and official result card certificate printing.
              </p>
            </div>
          </div>
        </div>

        {/* Live Security Audit Trail */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#001639] text-[20px]">
                  history
                </span>
                <h2 className="font-domine font-bold text-sm text-[#001639]">
                  Live System Audit Trail
                </h2>
              </div>
              <button
                type="button"
                disabled={activeRole !== 'SUPER_ADMIN'}
                onClick={handleClearLogs}
                className={`text-[11px] font-semibold transition-colors ${
                  activeRole === 'SUPER_ADMIN'
                    ? 'text-red-600 hover:text-red-800 cursor-pointer'
                    : 'text-slate-300 cursor-not-allowed'
                }`}
                title={activeRole !== 'SUPER_ADMIN' ? 'Restricted to Super Admin' : 'Clear Trail'}
              >
                Clear Log
              </button>
            </div>

            <div className="space-y-2.5 max-h-[310px] overflow-y-auto pr-1">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 text-[11px] flex flex-col gap-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[#b3272c]">{log.action}</span>
                    <span className="text-slate-400 font-mono text-[10px]">{log.timestamp}</span>
                  </div>
                  <p className="text-slate-700 font-medium">{log.details}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200/50">
                    <span>Admin: @{log.user}</span>
                    <span>IP: {log.ip}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Audit Daemon Running
            </span>
            <span>Immutable Ledger</span>
          </div>
        </div>
      </div>

      {/* Provision New Admin Modal */}
      <Modal
        isOpen={isProvisionModalOpen}
        onClose={() => setIsProvisionModalOpen(false)}
        title="Provision New System Administrator"
        subtitle="Role-Based Provisioning, Campus Scoping & Credential Issuance"
        maxWidth="2xl"
      >
        <form onSubmit={handleProvisionSubmit} className="flex flex-col gap-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.full_name}
                onChange={(e) => handleFullNameChange(e.target.value)}
                placeholder="e.g. Malik Shaukat Hayat"
                className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#122b54]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Username (Auto-Suggested) *
              </label>
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="shaukat.hayat"
                className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#122b54] font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Official Institutional Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@eaglets.edu.pk"
                className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#122b54]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Initial Temporary Password *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full h-9 px-3 pr-20 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#122b54] font-mono text-[11px]"
                />
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      password: 'Eaglets@' + Math.floor(1000 + Math.random() * 9000),
                    })
                  }
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-[10px] font-bold"
                >
                  Generate
                </button>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Assigned Role *
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as AdminRole })}
                className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#122b54] font-medium"
              >
                <option value="CAMPUS_ADMIN">CAMPUS_ADMIN (Branch Operations)</option>
                <option value="ACCOUNTS_MANAGER">ACCOUNTS_MANAGER (Fee & Billing)</option>
                <option value="EXAM_CONTROLLER">EXAM_CONTROLLER (Academics & Gazette)</option>
                <option value="SUPER_ADMIN">SUPER_ADMIN (Root System Authority)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Campus / Branch Assignment *
              </label>
              <select
                value={formData.campus}
                onChange={(e) => setFormData({ ...formData, campus: e.target.value })}
                className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#122b54] font-medium"
              >
                <option value="Main Boys Campus, Lahore">Main Boys Campus, Lahore</option>
                <option value="Girls Junior Campus">Girls Junior Campus</option>
                <option value="Gulberg Model Wing">Gulberg Model Wing</option>
                <option value="All Campuses">All Campuses (Enterprise)</option>
              </select>
            </div>
          </div>

          {/* Security Policy Checks */}
          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 flex flex-col gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.force_password_reset}
                onChange={(e) =>
                  setFormData({ ...formData, force_password_reset: e.target.checked })
                }
                className="w-4 h-4 text-[#b3272c] rounded focus:ring-0 cursor-pointer"
              />
              <span className="font-semibold text-slate-700">
                Force password change on initial login (Recommended)
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.two_factor_enabled}
                onChange={(e) =>
                  setFormData({ ...formData, two_factor_enabled: e.target.checked })
                }
                className="w-4 h-4 text-[#b3272c] rounded focus:ring-0 cursor-pointer"
              />
              <span className="font-semibold text-slate-700">
                Enforce Two-Factor Authentication (SMS / Authenticator App OTP)
              </span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsProvisionModalOpen(false)}
              className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#b3272c] hover:bg-[#88131b] text-white font-bold rounded-lg shadow-sm cursor-pointer"
            >
              Provision Administrator
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Permissions Modal */}
      {selectedAdmin && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title={`Edit Permissions: ${selectedAdmin.full_name}`}
          subtitle={`Username: @${selectedAdmin.username} • ${selectedAdmin.email}`}
          maxWidth="lg"
        >
          <form onSubmit={handleSaveEdit} className="flex flex-col gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Assigned Role
              </label>
              <select
                value={selectedAdmin.role}
                onChange={(e) =>
                  setSelectedAdmin({
                    ...selectedAdmin,
                    role: e.target.value as AdminRole,
                  })
                }
                className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#122b54]"
              >
                <option value="CAMPUS_ADMIN">CAMPUS_ADMIN</option>
                <option value="ACCOUNTS_MANAGER">ACCOUNTS_MANAGER</option>
                <option value="EXAM_CONTROLLER">EXAM_CONTROLLER</option>
                <option value="SUPER_ADMIN">SUPER_ADMIN (Root)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Assigned Campus Scope
              </label>
              <select
                value={selectedAdmin.campus}
                onChange={(e) =>
                  setSelectedAdmin({
                    ...selectedAdmin,
                    campus: e.target.value,
                  })
                }
                className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#122b54]"
              >
                <option value="Main Boys Campus, Lahore">Main Boys Campus, Lahore</option>
                <option value="Girls Junior Campus">Girls Junior Campus</option>
                <option value="Gulberg Model Wing">Gulberg Model Wing</option>
                <option value="All Campuses">All Campuses</option>
              </select>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedAdmin.two_factor_enabled}
                  onChange={(e) =>
                    setSelectedAdmin({
                      ...selectedAdmin,
                      two_factor_enabled: e.target.checked,
                    })
                  }
                  className="w-4 h-4 text-[#b3272c] rounded focus:ring-0 cursor-pointer"
                />
                <span className="font-semibold text-slate-700">
                  Enforce Two-Factor Authentication (2FA)
                </span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#001639] hover:bg-[#122b54] text-white font-bold rounded-lg shadow-sm cursor-pointer"
              >
                Save Permissions
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Password Reset Modal */}
      {selectedAdmin && (
        <Modal
          isOpen={isPasswordResetModalOpen}
          onClose={() => setIsPasswordResetModalOpen(false)}
          title={`Emergency Password Reset: ${selectedAdmin.full_name}`}
          subtitle={`Username: @${selectedAdmin.username}`}
          maxWidth="md"
        >
          <div className="flex flex-col gap-4 text-xs">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 flex items-start gap-2.5">
              <span className="material-symbols-outlined text-amber-600 text-[20px] flex-shrink-0">
                lock
              </span>
              <div>
                <p className="font-bold">Temporary Password Generated</p>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  The admin will be forced to choose a new password upon their next login. Provide this temporary key safely:
                </p>
                <div className="mt-2 p-2 bg-white rounded border border-amber-300 font-mono font-bold text-base text-[#001639] text-center select-all">
                  {generatedTempPassword}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsPasswordResetModalOpen(false)}
                className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmPasswordReset}
                className="px-4 py-2 bg-[#b3272c] hover:bg-[#88131b] text-white font-bold rounded-lg shadow-sm cursor-pointer"
              >
                Confirm & Log Event
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
