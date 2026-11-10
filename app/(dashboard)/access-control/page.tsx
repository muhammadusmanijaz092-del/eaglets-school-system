'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Modal from '@/components/Modal'
import {
  useRBAC,
  ALL_PERMISSIONS,
  PermissionId,
  RoleDefinition,
  CurrentUser,
} from '@/lib/rbac-store'
import { useFacultyStore } from '@/lib/faculty-store'

export default function AccessControlPage() {
  const {
    roles,
    currentUser,
    isRootAdmin,
    saveRolePermissions,
    addCustomRole,
    deleteCustomRole,
    assignStaffDesignation,
    switchUser,
    switchToRootAdmin,
    resetToDefaults,
  } = useRBAC()

  const { faculty: facultyList } = useFacultyStore()

  // Selected designation in permissions editor
  const [selectedRoleName, setSelectedRoleName] = useState<string>('Principal')
  const [activeTab, setActiveTab] = useState<'matrix' | 'assignment'>('matrix')

  // Add Designation Modal State
  const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState(false)
  const [newRoleName, setNewRoleName] = useState('')
  const [newRoleDept, setNewRoleDept] = useState('General Operations')
  const [newRoleDesc, setNewRoleDesc] = useState('')
  const [addRoleError, setAddRoleError] = useState<string | null>(null)

  // Success Notification
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null)

  // Staff search in assignment tab
  const [staffSearchQuery, setStaffSearchQuery] = useState('')

  // 403 Forbidden Screen if not Root Admin
  if (!isRootAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-red-200 shadow-xl p-8 text-center flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shadow-inner">
            <span className="material-symbols-outlined text-[36px]">lock</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-red-600 bg-red-100/60 px-2.5 py-0.5 rounded-full inline-block mx-auto">
              Root Authority Required
            </span>
            <h1 className="font-domine text-2xl font-bold text-[#001639] mt-2">
              Access Control Restricted
            </h1>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              You are currently signed in as{' '}
              <strong className="text-slate-800">{currentUser.name}</strong> (
              <span className="text-[#001639] font-medium">{currentUser.designation}</span>).
              The Access Control Panel is strictly confidential and reserved for the Global Root Administrator.
            </p>
          </div>

          <div className="w-full pt-4 border-t border-slate-100 flex flex-col gap-2">
            <Link
              href="/"
              className="w-full h-10 bg-[#001639] hover:bg-[#122b54] text-white rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[17px]">arrow_back</span>
              <span>Return to Dashboard</span>
            </Link>

            <button
              type="button"
              onClick={switchToRootAdmin}
              className="w-full h-9 bg-slate-100 hover:bg-slate-200 text-[#001639] rounded-lg font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] text-[#f5bc71]">shield_person</span>
              <span>Switch Back to Root Admin Session</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Find active role being edited
  const currentRole =
    roles.find((r) => r.name.toLowerCase() === selectedRoleName.toLowerCase()) || roles[0]

  // Handle toggle single permission
  const handleTogglePermission = (permId: PermissionId) => {
    if (!currentRole) return
    const has = currentRole.permissions.includes(permId)
    const updated = has
      ? currentRole.permissions.filter((p) => p !== permId)
      : [...currentRole.permissions, permId]

    saveRolePermissions(currentRole.name, updated)
    setSaveSuccessMsg(`Updated permission for "${currentRole.name}"`)
    setTimeout(() => setSaveSuccessMsg(null), 2500)
  }

  // Handle check all permissions
  const handleCheckAll = () => {
    if (!currentRole) return
    const allIds = ALL_PERMISSIONS.map((p) => p.id)
    saveRolePermissions(currentRole.name, allIds)
    setSaveSuccessMsg(`All ${allIds.length} features enabled for "${currentRole.name}"`)
    setTimeout(() => setSaveSuccessMsg(null), 2500)
  }

  // Handle uncheck all permissions
  const handleUncheckAll = () => {
    if (!currentRole) return
    saveRolePermissions(currentRole.name, [])
    setSaveSuccessMsg(`All features revoked for "${currentRole.name}"`)
    setTimeout(() => setSaveSuccessMsg(null), 2500)
  }

  // Handle create new designation
  const handleCreateRole = (e: React.FormEvent) => {
    e.preventDefault()
    setAddRoleError(null)

    if (!newRoleName.trim()) {
      setAddRoleError('Designation name is required.')
      return
    }

    const exists = roles.some(
      (r) => r.name.toLowerCase() === newRoleName.trim().toLowerCase()
    )
    if (exists) {
      setAddRoleError('A designation with this name already exists.')
      return
    }

    const created = addCustomRole({
      name: newRoleName.trim(),
      department: newRoleDept.trim(),
      description: newRoleDesc.trim() || `Designation for ${newRoleName.trim()}`,
      initialPermissions: ['view_students', 'view_attendance'],
    })

    if (created) {
      setSelectedRoleName(created.name)
      setIsAddRoleModalOpen(false)
      setNewRoleName('')
      setNewRoleDesc('')
      setSaveSuccessMsg(`New designation "${created.name}" created successfully!`)
      setTimeout(() => setSaveSuccessMsg(null), 3000)
    }
  }

  // Categories list
  const categories = Array.from(new Set(ALL_PERMISSIONS.map((p) => p.category)))

  // Filter staff list
  const filteredStaff = facultyList.filter(
    (s) =>
      s.full_name.toLowerCase().includes(staffSearchQuery.toLowerCase()) ||
      s.emp_id.toLowerCase().includes(staffSearchQuery.toLowerCase()) ||
      s.designation.toLowerCase().includes(staffSearchQuery.toLowerCase())
  )

  return (
    <div className="px-3 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col gap-4 sm:gap-6 min-w-0 text-xs">
      {/* Top Banner */}
      <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200/80 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#001639] text-[#f5bc71] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 border border-slate-700">
              <span className="material-symbols-outlined text-[13px]">shield_person</span>
              Hidden Root Console
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500">Manual Role-Based Access Control (RBAC)</span>
          </div>
          <h1 className="font-domine text-2xl font-bold text-[#001639]">
            Access Control Panel
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure institutional designations, manually check/uncheck feature permissions, and assign staff members to roles.
          </p>
        </div>

        {/* User Session Simulation & Quick Testing Widget */}
        <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#b3272c] text-white font-bold text-xs flex items-center justify-center">
              RA
            </div>
            <div>
              <span className="font-bold text-slate-900 block leading-tight text-xs">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-[#b3272c] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Root Bypass Active (All Features Enabled)
              </span>
            </div>
          </div>
          <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
          <button
            type="button"
            onClick={() => setIsAddRoleModalOpen(true)}
            className="h-8 px-3 bg-[#001639] hover:bg-[#122b54] text-white rounded-lg font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px]">add_moderator</span>
            <span>+ Add Designation</span>
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {saveSuccessMsg && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-2.5 rounded-xl text-xs flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-600 text-[18px]">
              check_circle
            </span>
            <span className="font-semibold">{saveSuccessMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setSaveSuccessMsg(null)}
            className="text-emerald-700 hover:text-emerald-900 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab('matrix')}
          className={`pb-3 px-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'matrix'
              ? 'border-[#001639] text-[#001639]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">checklist</span>
          <span>Designations & Feature Permissions Matrix</span>
          <span className="px-2 py-0.2 rounded-full bg-slate-100 text-slate-700 text-[10px]">
            {roles.length} Roles
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('assignment')}
          className={`pb-3 px-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'assignment'
              ? 'border-[#001639] text-[#001639]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">group_add</span>
          <span>Staff User Assignment</span>
          <span className="px-2 py-0.2 rounded-full bg-slate-100 text-slate-700 text-[10px]">
            {facultyList.length} Staff Members
          </span>
        </button>
      </div>

      {/* TAB 1: DESIGNATIONS & FEATURE PERMISSIONS */}
      {activeTab === 'matrix' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Designation Selector */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col gap-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-bold text-[#001639] text-xs uppercase tracking-wider">
                  School Designations
                </span>
                <button
                  type="button"
                  onClick={() => setIsAddRoleModalOpen(true)}
                  className="text-[11px] font-bold text-[#b3272c] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">add</span>
                  <span>New Role</span>
                </button>
              </div>

              <div className="flex flex-col gap-1.5 max-h-[580px] overflow-y-auto pr-1">
                {roles.map((r) => {
                  const isSelected = r.name.toLowerCase() === selectedRoleName.toLowerCase()
                  const permCount = r.permissions.length
                  const totalPerms = ALL_PERMISSIONS.length

                  return (
                    <div
                      key={r.id}
                      onClick={() => setSelectedRoleName(r.name)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1.5 ${
                        isSelected
                          ? 'bg-[#001639] border-[#001639] text-white shadow-sm'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`font-bold text-xs truncate ${
                            isSelected ? 'text-white' : 'text-[#001639]'
                          }`}
                        >
                          {r.name}
                        </span>
                        {r.isCustom && (
                          <span
                            onClick={(e) => {
                              e.stopPropagation()
                              if (confirm(`Delete custom designation "${r.name}"?`)) {
                                deleteCustomRole(r.name)
                                setSelectedRoleName('Principal')
                              }
                            }}
                            className={`p-1 rounded hover:bg-red-500 hover:text-white transition-colors cursor-pointer text-[10px] ${
                              isSelected ? 'text-slate-300' : 'text-slate-400'
                            }`}
                            title="Delete custom designation"
                          >
                            <span className="material-symbols-outlined text-[13px]">delete</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[10px]">
                        <span
                          className={`truncate max-w-[150px] ${
                            isSelected ? 'text-slate-300' : 'text-slate-500'
                          }`}
                        >
                          {r.department}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded font-mono font-bold ${
                            isSelected
                              ? 'bg-white/20 text-[#f5bc71]'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {permCount}/{totalPerms} perms
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>

              <button
                type="button"
                onClick={() => {
                  if (confirm('Reset all roles back to recommended system defaults?')) {
                    resetToDefaults()
                    setSaveSuccessMsg('All role presets have been reset to default permissions.')
                    setTimeout(() => setSaveSuccessMsg(null), 3000)
                  }
                }}
                className="mt-2 text-center text-[10px] text-slate-400 hover:text-slate-700 underline cursor-pointer"
              >
                Reset all roles to factory defaults
              </button>
            </div>
          </div>

          {/* Right Column: Feature Permission Checkboxes for Selected Role */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col gap-4">
              {/* Header for Active Designation */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-domine font-bold text-lg text-[#001639]">
                      {currentRole?.name}
                    </h2>
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-[#001639] text-[10px] font-bold border border-blue-200">
                      {currentRole?.department}
                    </span>
                    {currentRole?.isCustom && (
                      <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 text-[10px] font-bold border border-purple-200">
                        Custom Role
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {currentRole?.description}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCheckAll}
                    className="h-8 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold text-[11px] transition-colors cursor-pointer"
                  >
                    Check All
                  </button>
                  <button
                    type="button"
                    onClick={handleUncheckAll}
                    className="h-8 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold text-[11px] transition-colors cursor-pointer"
                  >
                    Uncheck All
                  </button>
                </div>
              </div>

              {/* Categorized Checkbox List */}
              <div className="flex flex-col gap-5">
                {categories.map((category) => {
                  const categoryPerms = ALL_PERMISSIONS.filter((p) => p.category === category)

                  return (
                    <div
                      key={category}
                      className="p-4 bg-slate-50/70 rounded-xl border border-slate-200 flex flex-col gap-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#001639] text-xs uppercase tracking-wider flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#b3272c]"></span>
                          {category}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {
                            categoryPerms.filter((p) =>
                              currentRole?.permissions.includes(p.id)
                            ).length
                          }
                          /{categoryPerms.length} allowed
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                        {categoryPerms.map((perm) => {
                          const isChecked = currentRole?.permissions.includes(perm.id)

                          return (
                            <label
                              key={perm.id}
                              className={`p-3 rounded-lg border transition-all cursor-pointer flex items-start gap-3 select-none ${
                                isChecked
                                  ? 'bg-white border-blue-200 shadow-2xs'
                                  : 'bg-white/50 border-slate-200 hover:bg-white text-slate-500'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleTogglePermission(perm.id)}
                                className="mt-0.5 w-4 h-4 rounded text-[#001639] accent-[#001639] focus:ring-[#001639] cursor-pointer"
                              />
                              <div className="flex flex-col min-w-0">
                                <span
                                  className={`font-bold text-xs ${
                                    isChecked ? 'text-slate-900' : 'text-slate-600'
                                  }`}
                                >
                                  {perm.label}
                                </span>
                                <span className="text-[10.5px] text-slate-500 mt-0.5 leading-relaxed">
                                  {perm.description}
                                </span>
                                {perm.navLink && (
                                  <span className="text-[9.5px] text-blue-600 font-mono mt-1">
                                    Controls route: {perm.navLink}
                                  </span>
                                )}
                              </div>
                            </label>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Save Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 flex-wrap gap-2">
                <span className="text-[11px] text-slate-500">
                  Total Active Permissions:{' '}
                  <strong className="text-[#001639]">
                    {currentRole?.permissions.length} of {ALL_PERMISSIONS.length} Features
                  </strong>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSaveSuccessMsg(
                        `Permissions for "${currentRole?.name}" are actively synced and saved!`
                      )
                      setTimeout(() => setSaveSuccessMsg(null), 3000)
                    }}
                    className="h-9 px-4 bg-[#001639] hover:bg-[#122b54] text-white rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[16px]">save</span>
                    <span>Save Role Permissions</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STAFF USER ASSIGNMENT */}
      {activeTab === 'assignment' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
            <div>
              <h2 className="font-domine font-bold text-sm text-[#001639]">
                Staff Member Designation & Role Assignment
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Assign teachers, accountants, coordinators, and administrators to designations. Each user immediately inherits the exact feature permissions checked above.
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                search
              </span>
              <input
                type="text"
                placeholder="Search staff by name or emp ID..."
                value={staffSearchQuery}
                onChange={(e) => setStaffSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#001639]"
              />
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-[11px]">
                  <th className="py-2.5 px-3">Emp ID</th>
                  <th className="py-2.5 px-3">Staff Member</th>
                  <th className="py-2.5 px-3">Campus</th>
                  <th className="py-2.5 px-3">Assigned Designation (Select to Change)</th>
                  <th className="py-2.5 px-3">Permitted Features</th>
                  <th className="py-2.5 px-3 text-right">Testing Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStaff.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No staff members match your search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredStaff.map((staff) => {
                    const assignedRole = roles.find(
                      (r) => r.name.toLowerCase() === staff.designation.toLowerCase()
                    )
                    const permCount = assignedRole ? assignedRole.permissions.length : 0

                    return (
                      <tr key={staff.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-700">
                          {staff.emp_id}
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-[#001639] text-[#f5bc71] font-bold text-[10px] flex items-center justify-center flex-shrink-0">
                              {staff.full_name
                                .split(' ')
                                .map((n) => n[0])
                                .slice(0, 2)
                                .join('')}
                            </div>
                            <div>
                              <span className="font-bold text-slate-900 block leading-tight">
                                {staff.full_name}
                              </span>
                              <span className="text-[10px] text-slate-400 block font-mono">
                                @{staff.username || staff.email?.split('@')[0]}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">
                          {staff.campus || 'Main Campus'}
                        </td>
                        <td className="py-2.5 px-3">
                          <select
                            value={staff.designation}
                            onChange={(e) => {
                              assignStaffDesignation(staff.id, e.target.value)
                              setSaveSuccessMsg(
                                `Updated ${staff.full_name} to designation "${e.target.value}"`
                              )
                              setTimeout(() => setSaveSuccessMsg(null), 3000)
                            }}
                            className="h-8 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-[#001639] focus:outline-none focus:border-[#001639] cursor-pointer"
                          >
                            {roles.map((r) => (
                              <option key={r.id} value={r.name}>
                                {r.name} ({r.department})
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded font-mono font-bold text-[10.5px] bg-slate-100 text-slate-700">
                            {permCount} of {ALL_PERMISSIONS.length} Features
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              const testUser: CurrentUser = {
                                id: staff.id,
                                name: staff.full_name,
                                username: staff.username || staff.email?.split('@')[0] || 'staff',
                                designation: staff.designation,
                                isRoot: false,
                                email: staff.email,
                              }
                              switchUser(testUser)
                            }}
                            className="h-7 px-2.5 bg-slate-100 hover:bg-slate-200 text-[#001639] rounded font-semibold text-[11px] inline-flex items-center gap-1 transition-colors cursor-pointer"
                            title="Sign in as this user to test active app restrictions"
                          >
                            <span className="material-symbols-outlined text-[14px]">login</span>
                            <span>Test Permissions</span>
                          </button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add New Designation Modal */}
      <Modal
        isOpen={isAddRoleModalOpen}
        onClose={() => {
          setIsAddRoleModalOpen(false)
          setAddRoleError(null)
        }}
        title="Add New Institutional Designation"
        subtitle="Create a new role title (e.g., Front Desk, Accountant, Librarian) to customize its permissions"
        maxWidth="md"
      >
        <form onSubmit={handleCreateRole} className="flex flex-col gap-4 text-xs">
          {addRoleError && (
            <div className="p-3 bg-red-50 border border-red-300 rounded-lg text-red-800 text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-red-600 text-[18px]">error</span>
              <span>{addRoleError}</span>
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Designation Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
              placeholder="e.g. Front Desk Officer, Exam Controller, Lab Assistant"
              className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639]"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Department / Section
            </label>
            <input
              type="text"
              value={newRoleDept}
              onChange={(e) => setNewRoleDept(e.target.value)}
              placeholder="e.g. Admissions Office, Science Labs, Library"
              className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639]"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Role Description / Scope
            </label>
            <textarea
              rows={3}
              value={newRoleDesc}
              onChange={(e) => setNewRoleDesc(e.target.value)}
              placeholder="Describe what responsibilities this designation handles in the school..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639]"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => {
                setIsAddRoleModalOpen(false)
                setAddRoleError(null)
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#001639] hover:bg-[#122b54] text-white rounded-lg font-bold transition-colors cursor-pointer shadow-sm flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[17px]">add_circle</span>
              <span>Create Designation</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

