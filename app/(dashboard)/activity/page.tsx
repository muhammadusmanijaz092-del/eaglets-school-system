'use client'

import React, { useState, useMemo } from 'react'
import {
  INITIAL_STAFF_ACTIVITIES,
  StaffActivityRecord,
  StaffActionItem,
} from '@/lib/activity-store'

export default function TodaysActivityPage() {
  // Format default date: 24-11-2026 or current date
  const todayStr = '2026-11-24'
  const [selectedDate, setSelectedDate] = useState(todayStr)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRole, setSelectedRole] = useState('Everyone')
  const [staffData, setStaffData] = useState<StaffActivityRecord[]>(INITIAL_STAFF_ACTIVITIES)

  // Quick Action Modal to simulate adding a new activity
  const [isAddActionModalOpen, setIsAddActionModalOpen] = useState(false)
  const [actionStaffId, setActionStaffId] = useState('staff-01')
  const [actionType, setActionType] = useState<'added' | 'changed' | 'deleted'>('added')
  const [actionDesc, setActionDesc] = useState('')
  const [actionEntity, setActionEntity] = useState('General')

  // Convert YYYY-MM-DD to DD-MM-YYYY
  const formattedDisplayDate = useMemo(() => {
    if (!selectedDate) return '24-11-2026'
    const parts = selectedDate.split('-')
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`
    }
    return selectedDate
  }, [selectedDate])

  const isToday = selectedDate === todayStr

  // Compute records for selected date (on other dates, simulate historical shift)
  const activeStaffList = useMemo(() => {
    if (isToday) return staffData
    // For historical dates, show archive view
    return staffData.map((s, idx) => ({
      ...s,
      isSignedInNow: false,
      sessionStatus: `Logged out on ${formattedDisplayDate}`,
      addedCount: Math.max(0, s.addedCount - (idx % 2)),
      changedCount: Math.max(0, s.changedCount - (idx % 3)),
      deletedCount: 0,
      activities: s.activities.slice(0, Math.max(1, s.activities.length - 1)),
    }))
  }, [isToday, staffData, formattedDisplayDate])

  // Dynamic list of roles for filter buttons
  const availableRoles = useMemo(() => {
    const rolesSet = new Set<string>()
    activeStaffList.forEach((s) => {
      if (s.roleCategory) rolesSet.add(s.roleCategory)
    })
    return ['Everyone', ...Array.from(rolesSet)]
  }, [activeStaffList])

  // Filter staff by search name and role category
  const filteredStaff = useMemo(() => {
    return activeStaffList.filter((staff) => {
      const matchesSearch =
        staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.department.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesRole =
        selectedRole === 'Everyone' || staff.roleCategory === selectedRole

      return matchesSearch && matchesRole
    })
  }, [activeStaffList, searchQuery, selectedRole])

  // Metric totals
  const totalStaffActive = activeStaffList.length
  const totalSignedInNow = activeStaffList.filter((s) => s.isSignedInNow).length
  const totalChanges = activeStaffList.reduce(
    (acc, s) => acc + s.addedCount + s.changedCount,
    0
  )
  const totalDeleted = activeStaffList.reduce(
    (acc, s) => acc + s.deletedCount,
    0
  )

  // Currently online staff members for live presence indicator
  const onlineStaffMembers = activeStaffList.filter((s) => s.isSignedInNow)

  // Toggle staff online/offline state
  const handleToggleOnlineStatus = (id: string) => {
    setStaffData((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const nextState = !s.isSignedInNow
          return {
            ...s,
            isSignedInNow: nextState,
            sessionStatus: nextState ? 'Signed in now' : 'Signed out just now',
          }
        }
        return s
      })
    )
  }

  // Handle adding a new activity item
  const handleAddActionSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!actionDesc.trim()) return

    const now = new Date()
    const timeStr = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })

    const newAction: StaffActionItem = {
      id: `act-${Date.now()}`,
      timestamp: timeStr,
      type: actionType,
      description: actionDesc.trim(),
      entity: actionEntity,
    }

    setStaffData((prev) =>
      prev.map((s) => {
        if (s.id === actionStaffId) {
          return {
            ...s,
            addedCount: actionType === 'added' ? s.addedCount + 1 : s.addedCount,
            changedCount: actionType === 'changed' ? s.changedCount + 1 : s.changedCount,
            deletedCount: actionType === 'deleted' ? s.deletedCount + 1 : s.deletedCount,
            activities: [newAction, ...s.activities],
          }
        }
        return s
      })
    )

    setActionDesc('')
    setIsAddActionModalOpen(false)
  }

  return (
    <div className="px-3 sm:px-6 lg:px-8 py-5 flex flex-col gap-5 min-w-0">
      {/* 2. PAGE HEADER & DATE PICKER */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#001639] text-[#f5bc71] flex items-center justify-center flex-shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-[24px]">monitoring</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-domine text-2xl font-bold text-[#001639] tracking-tight">
                Today&apos;s Activity
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Live Audit
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              What each staff member did on <strong className="text-slate-700 font-mono">{formattedDisplayDate}</strong> (parents and students not included)
            </p>
          </div>
        </div>

        {/* Date Picker Input */}
        <div className="flex items-center gap-2.5 self-start md:self-center">
          <label htmlFor="activity-date" className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <span className="material-symbols-outlined text-[17px] text-[#001639]">calendar_month</span>
            <span>Date:</span>
          </label>
          <input
            id="activity-date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white cursor-pointer shadow-2xs font-mono"
          />
          <button
            type="button"
            onClick={() => setIsAddActionModalOpen(true)}
            className="h-9 px-3 bg-[#b3272c] hover:bg-[#88131b] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs whitespace-nowrap"
            title="Log manual staff activity"
          >
            <span className="material-symbols-outlined text-[16px]">add_circle</span>
            <span className="hidden sm:inline">Log Action</span>
          </button>
        </div>
      </div>

      {/* 2.B LIVE PRESENCE INDICATOR (DIRECTLY BENEATH HEADER) */}
      <div className="bg-white px-5 py-3.5 rounded-xl border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-bold text-slate-800">
            {totalSignedInNow} {totalSignedInNow === 1 ? 'staff member' : 'staff members'} currently active
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-[11px] text-slate-500">
            Real-time campus console sessions
          </span>
        </div>

        {/* Avatar initials group */}
        <div className="flex items-center gap-1.5">
          <div className="flex -space-x-2 overflow-hidden py-1">
            {onlineStaffMembers.map((member) => (
              <div
                key={member.id}
                title={`${member.name} (${member.role}) — Online Now`}
                className={`inline-block h-7 w-7 rounded-full ring-2 ring-white flex items-center justify-center text-[10px] font-bold shadow-xs cursor-pointer ${member.avatarBg}`}
              >
                {member.initials}
              </div>
            ))}
          </div>
          <span className="text-[11px] font-medium text-slate-400 ml-1">
            ({onlineStaffMembers.map((m) => m.initials).join(', ')})
          </span>
        </div>
      </div>

      {/* 3. FOUR SUMMARY METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Staff active */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Staff active
            </span>
            <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shadow-2xs">
              <span className="material-symbols-outlined text-[19px]">groups</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold font-mono text-[#001639]">
              {totalStaffActive}
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Staff tracked on {formattedDisplayDate}
            </p>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full" style={{ width: '100%' }} />
          </div>
        </div>

        {/* Card 2: Signed in now */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Signed in now
            </span>
            <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shadow-2xs">
              <span className="material-symbols-outlined text-[19px]">online_prediction</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold font-mono text-emerald-700 flex items-baseline gap-2">
              <span>{totalSignedInNow}</span>
              <span className="text-xs font-normal text-slate-400 font-sans">
                / {totalStaffActive} total
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Live presence right now
            </p>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-emerald-600 rounded-full transition-all duration-500"
              style={{
                width: `${totalStaffActive > 0 ? (totalSignedInNow / totalStaffActive) * 100 : 0}%`,
              }}
            />
          </div>
        </div>

        {/* Card 3: Changes */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Changes
            </span>
            <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shadow-2xs">
              <span className="material-symbols-outlined text-[19px]">monitoring</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold font-mono text-[#001639]">
              {totalChanges}
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Additions and modifications
            </p>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-indigo-600 rounded-full" style={{ width: '100%' }} />
          </div>
        </div>

        {/* Card 4: Deleted */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Deleted
            </span>
            <span className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center shadow-2xs">
              <span className="material-symbols-outlined text-[19px]">delete</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold font-mono text-rose-700">
              {totalDeleted}
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Vouchers or records removed
            </p>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-rose-600 rounded-full transition-all duration-500"
              style={{ width: totalDeleted > 0 ? '100%' : '0%' }}
            />
          </div>
        </div>
      </div>

      {/* 4. SEARCH AND ROLE FILTERING */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
            search
          </span>
          <input
            type="text"
            placeholder="Search a name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-8 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              &times;
            </button>
          )}
        </div>

        {/* Dynamic Role Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          {availableRoles.map((role) => {
            const isActive = selectedRole === role
            return (
              <button
                key={role}
                type="button"
                onClick={() => setSelectedRole(role)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#001639] text-white shadow-xs font-bold'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {role}
              </button>
            )
          })}
        </div>
      </div>

      {/* 5. STAFF ACTIVITY CARDS GRID */}
      {filteredStaff.length === 0 ? (
        <div className="bg-white p-10 rounded-xl border border-slate-200 text-center">
          <span className="material-symbols-outlined text-slate-300 text-[40px] mb-2">
            person_search
          </span>
          <h3 className="font-domine text-sm font-bold text-slate-700">
            No matching staff members found
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Try adjusting your search query or role filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredStaff.map((member) => {
            const totalMemberChanges = member.addedCount + member.changedCount + member.deletedCount

            return (
              <div
                key={member.id}
                className="bg-white rounded-xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between overflow-hidden"
              >
                <div>
                  {/* Card Header Section */}
                  <div className="p-4 border-b border-slate-100 flex items-start justify-between gap-3 bg-slate-50/40">
                    <div className="flex items-start gap-3 min-w-0">
                      {/* Avatar with live online indicator */}
                      <div className="relative flex-shrink-0">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-xs ${member.avatarBg}`}
                        >
                          {member.initials}
                        </div>
                        {member.isSignedInNow && (
                          <span
                            className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white"
                            title="Signed in now"
                          />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="text-xs sm:text-sm font-bold text-[#001639] truncate">
                            {member.name}
                          </h3>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">
                          {member.role}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              member.isSignedInNow
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {member.sessionStatus}
                          </span>
                          {/* Interactive Toggle for Testing Presence */}
                          <button
                            type="button"
                            onClick={() => handleToggleOnlineStatus(member.id)}
                            className="text-[10px] text-slate-400 hover:text-blue-600 underline cursor-pointer"
                            title="Toggle session presence"
                          >
                            (toggle)
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Total Change Count */}
                    <div className="text-right flex-shrink-0">
                      <span className="text-xs font-bold font-mono text-[#001639] px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                        {totalMemberChanges} changes
                      </span>
                    </div>
                  </div>

                  {/* Action Breakdown Counters */}
                  <div className="px-4 py-2.5 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between text-xs font-mono">
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      + {member.addedCount} added
                    </span>
                    <span className="inline-flex items-center gap-1 text-blue-700 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                      {member.changedCount} changed
                    </span>
                    <span className="inline-flex items-center gap-1 text-rose-700 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                      {member.deletedCount} deleted
                    </span>
                  </div>

                  {/* Activity Log Section */}
                  <div className="p-4 space-y-2.5">
                    {member.activities.length === 0 ? (
                      <div className="py-6 text-center text-xs text-slate-400 italic">
                        Signed in, no changes made.
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                        {member.activities.map((act) => (
                          <div
                            key={act.id}
                            className="p-2.5 rounded-lg bg-slate-50/80 border border-slate-100 text-xs flex items-start gap-2.5 hover:bg-slate-50 transition-colors"
                          >
                            <span
                              className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded font-mono flex-shrink-0 mt-0.5 ${
                                act.type === 'added'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : act.type === 'changed'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {act.type}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-slate-700 leading-snug">
                                {act.description}
                              </p>
                              <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                                <span className="font-mono">{act.timestamp}</span>
                                {act.entity && (
                                  <span className="font-medium text-slate-500 bg-white px-1.5 py-0.2 rounded border border-slate-200">
                                    {act.entity}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-4 py-2.5 bg-slate-50/40 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{member.department}</span>
                  <span className="font-mono font-medium text-slate-500">
                    ID: {member.id}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* QUICK LOG ACTION MODAL */}
      {isAddActionModalOpen && (
        <div
          onClick={() => setIsAddActionModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg p-5 space-y-4 animate-in fade-in zoom-in-95 duration-100"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#001639] text-[20px]">
                  edit_note
                </span>
                <h3 className="font-domine font-bold text-sm text-[#001639]">
                  Log Staff Activity Record
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddActionModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAddActionSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Staff Member
                </label>
                <select
                  value={actionStaffId}
                  onChange={(e) => setActionStaffId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {staffData.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.role})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Action Type
                  </label>
                  <select
                    value={actionType}
                    onChange={(e) =>
                      setActionType(e.target.value as 'added' | 'changed' | 'deleted')
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="added">+ added</option>
                    <option value="changed">changed</option>
                    <option value="deleted">deleted</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Entity / Module
                  </label>
                  <input
                    type="text"
                    value={actionEntity}
                    onChange={(e) => setActionEntity(e.target.value)}
                    placeholder="e.g. Attendance, Fees, Exam"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Description of Action *
                </label>
                <textarea
                  required
                  rows={3}
                  value={actionDesc}
                  onChange={(e) => setActionDesc(e.target.value)}
                  placeholder="e.g. Updated fee slip discount or verified examination date sheet..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddActionModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 cursor-pointer font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#001639] hover:bg-[#122b54] text-white rounded-lg font-bold cursor-pointer transition-colors shadow-xs"
                >
                  Record Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
