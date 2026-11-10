'use client'

import React, { useState } from 'react'
import Modal from '@/components/Modal'
import { FacultyItem } from '@/lib/supabase/types'
import { createClient } from '@/lib/supabase/client'
import { useFacultyStore, DESIGNATION_PRESETS } from '@/lib/faculty-store'
import { useRBAC } from '@/lib/rbac-store'

const ALL_CLASS_OPTIONS = [
  'Playgroup',
  'Nursery',
  'Prep / KG',
  'Grade 1',
  'Grade 2',
  'Grade 3',
  'Grade 4',
  'Grade 5',
  'Grade 6',
  'Grade 7',
  'Grade 8',
  'Grade 9',
  'Grade 10',
]

export default function FacultyPage() {
  const { hasPermission, currentUser, isRootAdmin, switchToRootAdmin } = useRBAC()
  const canView = hasPermission('view_faculty')
  const canManage = hasPermission('manage_faculty')

  const { faculty: facultyList, deleteFaculty, upsertFaculty } = useFacultyStore()
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'On Leave' | 'Resigned'>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isSalarySlipModalOpen, setIsSalarySlipModalOpen] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState<FacultyItem | null>(null)
  const [disbursedAll, setDisbursedAll] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  // Edit & Delete Profile State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [staffToEdit, setStaffToEdit] = useState<FacultyItem | null>(null)
  const [staffToDelete, setStaffToDelete] = useState<FacultyItem | null>(null)
  const [editValidationError, setEditValidationError] = useState<string | null>(null)
  const [editSalaryText, setEditSalaryText] = useState('')
  const [editAllowancesText, setEditAllowancesText] = useState('')

  // Dedicated Credentials Modal State
  const [isCredModalOpen, setIsCredModalOpen] = useState(false)
  const [staffForCred, setStaffForCred] = useState<FacultyItem | null>(null)
  const [credName, setCredName] = useState('')
  const [credUsername, setCredUsername] = useState('')
  const [credPassword, setCredPassword] = useState('')
  const [showCredPassword, setShowCredPassword] = useState(false)
  const [credCopySuccess, setCredCopySuccess] = useState(false)
  const [credError, setCredError] = useState<string | null>(null)
  const [showEditPassword, setShowEditPassword] = useState(false)

  // Registration Form State
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    password: 'Password@2026',
    cnic: '',
    phone: '',
    email: '',
    campus: '',
    qualification: '',
    designation: 'Faculty Teachers',
    department: 'Science',
    assigned_classes: 'Grade 10, Grade 9',
    assigned_subjects: 'Physics',
    joining_date: '2026-09-01',
    basic_salary_pkr: 85000,
    allowances_pkr: 15000,
    payment_mode: 'Bank Transfer' as 'Cash' | 'Bank Transfer' | 'Raast / Mobile Wallet',
    bank_name: 'Habib Bank Limited',
    account_number: '',
  })

  const filteredFaculty = facultyList.filter((f) => {
    const matchesSearch =
      f.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.cnic.includes(searchQuery) ||
      f.emp_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.designation.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === 'All' || f.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalPayroll = facultyList.reduce(
    (acc, f) => acc + f.basic_salary_pkr + f.allowances_pkr,
    0
  )

  const handleAddFaculty = (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError(null)

    // Pakistani CNIC Format Validation: XXXXX-XXXXXXX-X (13 digits with hyphens)
    const cnicRegex = /^\d{5}-\d{7}-\d{1}$/
    if (!cnicRegex.test(formData.cnic.trim())) {
      setValidationError('Invalid CNIC format. Expected standard Pakistani NADRA format: 35201-1234567-1')
      return
    }

    // Pakistani Mobile Number Validation
    const phoneRegex = /^(\+92|03)\d{2}[-\s]?\d{7}$/
    if (!phoneRegex.test(formData.phone.trim().replace(/\s+/g, ''))) {
      setValidationError('Invalid Contact Phone format. Expected valid Pakistani mobile: +92 300 1234567 or 03001234567')
      return
    }

    const newStaff: FacultyItem = {
      id: `f-${Date.now()}`,
      emp_id: `EAG-FAC-${String(facultyList.length + 106)}`,
      full_name: formData.full_name,
      username: formData.username || formData.full_name.toLowerCase().replace(/\s+/g, '.'),
      password: formData.password || 'Password@2026',
      cnic: formData.cnic,
      phone: formData.phone,
      email: formData.email || `${formData.full_name.toLowerCase().replace(/\s+/g, '.')}@eaglets.edu.pk`,
      qualification: formData.qualification,
      designation: formData.designation,
      department: formData.department,
      assigned_classes: formData.assigned_classes.split(',').map((s) => s.trim()),
      assigned_subjects: formData.assigned_subjects.split(',').map((s) => s.trim()),
      joining_date: formData.joining_date || new Date().toISOString().slice(0, 10),
      basic_salary_pkr: Number(formData.basic_salary_pkr),
      allowances_pkr: Number(formData.allowances_pkr),
      payment_mode: formData.payment_mode,
      bank_name: formData.bank_name,
      account_number: formData.account_number,
      status: 'Active',
    }

    upsertFaculty(newStaff)
    setIsAddModalOpen(false)

    // Sync to Supabase in background if connected
    const supabase = createClient()
    if (supabase) {
      supabase.from('faculty').insert([newStaff]).then(({ error }) => {
        if (error) console.error('Supabase faculty insert error:', error)
      })
    }

    // Reset Form
    setFormData({
      full_name: '',
      username: '',
      password: 'Password@2026',
      cnic: '',
      phone: '',
      email: '',
      campus: '',
      qualification: '',
      designation: 'Faculty Teachers',
      department: 'Science',
      assigned_classes: 'Grade 10, Grade 9',
      assigned_subjects: 'Physics',
      joining_date: '2026-09-01',
      basic_salary_pkr: 85000,
      allowances_pkr: 15000,
      payment_mode: 'Bank Transfer',
      bank_name: 'Habib Bank Limited',
      account_number: '',
    })
  }

  const handleDisbursePayroll = () => {
    setDisbursedAll(true)
    setTimeout(() => setDisbursedAll(false), 4000)
  }

  // Open Edit Profile Modal
  const handleOpenEdit = (staff: FacultyItem) => {
    const fallbackUsername = staff.username || staff.email?.split('@')[0] || staff.full_name.toLowerCase().replace(/\s+/g, '.')
    const fallbackPassword = staff.password || 'Password@2026'
    setStaffToEdit({
      ...staff,
      username: fallbackUsername,
      password: fallbackPassword,
    })
    setEditSalaryText(String(staff.basic_salary_pkr ?? ''))
    setEditAllowancesText(String(staff.allowances_pkr ?? ''))
    setEditValidationError(null)
    setIsEditModalOpen(true)
  }

  // Handle Save Edit Profile
  const handleUpdateFaculty = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!staffToEdit) return
    setEditValidationError(null)

    // Pakistani CNIC Format Validation: XXXXX-XXXXXXX-X (13 digits with hyphens)
    const cnicRegex = /^\d{5}-\d{7}-\d{1}$/
    if (!cnicRegex.test(staffToEdit.cnic.trim())) {
      setEditValidationError('Invalid CNIC format. Expected standard Pakistani NADRA format: 35201-1234567-1')
      return
    }

    // Pakistani Mobile Number Validation
    const phoneRegex = /^(\+92|03)\d{2}[-\s]?\d{7}$/
    if (!phoneRegex.test(staffToEdit.phone.trim().replace(/\s+/g, ''))) {
      setEditValidationError('Invalid Contact Phone format. Expected valid Pakistani mobile: +92 300 1234567 or 03001234567')
      return
    }

    // Parse Text-Edited Basic Salary and Monthly Allowances
    const cleanSalary = editSalaryText.replace(/[^0-9.]/g, '')
    const cleanAllowances = editAllowancesText.replace(/[^0-9.]/g, '')
    const parsedSalary = parseFloat(cleanSalary) || 0
    const parsedAllowances = parseFloat(cleanAllowances) || 0

    const finalClasses =
      !staffToEdit.assigned_classes || staffToEdit.assigned_classes.length === 0
        ? ['No class assigned']
        : staffToEdit.assigned_classes

    const updatedStaff: FacultyItem = {
      ...staffToEdit,
      username: staffToEdit.username?.trim(),
      password: staffToEdit.password,
      basic_salary_pkr: parsedSalary,
      allowances_pkr: parsedAllowances,
      assigned_classes: finalClasses,
    }

    upsertFaculty(updatedStaff)
    if (selectedStaff?.id === updatedStaff.id) {
      setSelectedStaff(updatedStaff)
    }
    setIsEditModalOpen(false)

    // Sync to Supabase in background if connected
    const supabase = createClient()
    if (supabase) {
      try {
        const { error } = await supabase
          .from('faculty')
          .update({
            full_name: updatedStaff.full_name,
            username: updatedStaff.username,
            password: updatedStaff.password,
            cnic: updatedStaff.cnic,
            phone: updatedStaff.phone,
            email: updatedStaff.email,
            campus: updatedStaff.campus,
            qualification: updatedStaff.qualification,
            designation: updatedStaff.designation,
            department: updatedStaff.department,
            assigned_classes: updatedStaff.assigned_classes,
            assigned_subjects: updatedStaff.assigned_subjects,
            joining_date: updatedStaff.joining_date,
            basic_salary_pkr: updatedStaff.basic_salary_pkr,
            allowances_pkr: updatedStaff.allowances_pkr,
            payment_mode: updatedStaff.payment_mode,
            bank_name: updatedStaff.bank_name,
            account_number: updatedStaff.account_number,
            status: updatedStaff.status,
          })
          .eq('id', updatedStaff.id)
        if (error) console.error('Supabase faculty update error:', error)
      } catch (err) {
        console.error('Failed to update faculty in cloud:', err)
      }
    }
  }

  // Open Dedicated Credentials Modal
  const handleOpenCredentials = (staff: FacultyItem) => {
    setStaffForCred(staff)
    setCredName(staff.full_name)
    const fallbackUsername =
      staff.username ||
      staff.email?.split('@')[0] ||
      staff.full_name.toLowerCase().replace(/\s+/g, '.')
    setCredUsername(fallbackUsername)
    setCredPassword(staff.password || 'Password@2026')
    setShowCredPassword(false)
    setCredCopySuccess(false)
    setCredError(null)
    setIsCredModalOpen(true)
  }

  // Generate random strong password
  const handleGenerateFacultyPassword = () => {
    const randomDigits = Math.floor(1000 + Math.random() * 9000)
    setCredPassword(`Eaglets@${randomDigits}`)
  }

  // Copy Credentials to Clipboard
  const handleCopyCredentials = () => {
    const text = `Eaglets Schools - Faculty Portal Access\nTeacher: ${credName}\nUsername: ${credUsername}\nPassword: ${credPassword}\nLogin Portal: https://eagletsschoolsystem.vercel.app/login`
    navigator.clipboard.writeText(text)
    setCredCopySuccess(true)
    setTimeout(() => setCredCopySuccess(false), 3000)
  }

  // Save Credentials
  const handleSaveCredentials = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!staffForCred) return
    setCredError(null)

    if (!credName.trim()) {
      setCredError('Faculty Name cannot be empty.')
      return
    }
    if (!credUsername.trim()) {
      setCredError('Portal Username cannot be empty.')
      return
    }
    if (credPassword.length < 6) {
      setCredError('Password must be at least 6 characters.')
      return
    }

    const updatedStaff: FacultyItem = {
      ...staffForCred,
      full_name: credName.trim(),
      username: credUsername.trim(),
      password: credPassword,
    }

    upsertFaculty(updatedStaff)
    if (selectedStaff?.id === updatedStaff.id) setSelectedStaff(updatedStaff)
    if (staffToEdit?.id === updatedStaff.id) setStaffToEdit(updatedStaff)

    setIsCredModalOpen(false)

    // Sync to Supabase in background
    const supabase = createClient()
    if (supabase) {
      try {
        await supabase
          .from('faculty')
          .update({
            full_name: updatedStaff.full_name,
            username: updatedStaff.username,
            password: updatedStaff.password,
          })
          .eq('id', updatedStaff.id)
      } catch (err) {
        console.error('Failed to sync faculty credentials to cloud:', err)
      }
    }
  }

  // Open Delete Confirmation
  const handleOpenDelete = (staff: FacultyItem) => {
    setStaffToDelete(staff)
    setIsDeleteModalOpen(true)
  }

  // Handle Confirm Delete
  const handleConfirmDelete = async () => {
    if (!staffToDelete) return

    deleteFaculty(staffToDelete.id)
    if (selectedStaff?.id === staffToDelete.id) {
      setSelectedStaff(null)
      setIsSalarySlipModalOpen(false)
    }
    setIsDeleteModalOpen(false)

    // Sync to Supabase
    const supabase = createClient()
    if (supabase) {
      try {
        const { error } = await supabase.from('faculty').delete().eq('id', staffToDelete.id)
        if (error) console.error('Supabase faculty delete error:', error)
      } catch (err) {
        console.error('Failed to delete faculty from cloud:', err)
      }
    }
    setStaffToDelete(null)
  }

  if (!canView) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-red-200 shadow-xl p-8 text-center flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shadow-inner">
            <span className="material-symbols-outlined text-[36px]">badge</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-red-600 bg-red-100/60 px-2.5 py-0.5 rounded-full inline-block mx-auto">
              Permission Required
            </span>
            <h1 className="font-domine text-2xl font-bold text-[#001639] mt-2">
              Faculty Directory Restricted
            </h1>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Your active designation (<strong className="text-slate-800">{currentUser.designation}</strong>) does not have permission to view the Faculty & Staff Directory.
            </p>
          </div>
          {!isRootAdmin && (
            <button
              type="button"
              onClick={switchToRootAdmin}
              className="mt-2 w-full h-9 bg-slate-100 hover:bg-slate-200 text-[#001639] rounded-lg font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] text-[#f5bc71]">shield_person</span>
              <span>Switch to Root Admin Session</span>
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="px-3 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col gap-4 sm:gap-6 min-w-0">
      {/* Top Banner */}
      <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-[#eff4ff] text-[#001639] text-[10px] font-bold uppercase tracking-wider">
              Human Resource & Payroll Management
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500">State Bank of Pakistan / Raast Standard</span>
          </div>
          <h1 className="font-domine text-2xl font-bold text-[#001639]">
            Faculty Hiring & Monthly Payroll
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage teacher contracts, CNIC profiles, subjects matrix, allowances, and 1-click salary slip disbursement.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {canManage ? (
            <>
              <button
                type="button"
                onClick={handleDisbursePayroll}
                className="h-9 px-3.5 bg-slate-50 hover:bg-slate-100 text-[#001639] border border-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-[17px] text-[#f5bc71]">
                  payments
                </span>
                <span>Disburse Monthly Payroll</span>
              </button>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="h-9 px-3.5 bg-[#b3272c] hover:bg-[#88131b] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-[17px]">badge</span>
                <span>+ New Faculty Member</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                disabled
                className="h-9 px-3.5 bg-slate-100 text-slate-400 border border-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-not-allowed opacity-60"
                title="Action Disabled: Requires 'manage_faculty' permission"
              >
                <span className="material-symbols-outlined text-[17px]">lock</span>
                <span>Disburse Monthly Payroll</span>
              </button>
              <button
                type="button"
                disabled
                className="h-9 px-3.5 bg-slate-100 text-slate-400 border border-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-not-allowed opacity-60"
                title="Action Disabled: Requires 'manage_faculty' permission"
              >
                <span className="material-symbols-outlined text-[17px]">lock</span>
                <span>+ New Faculty Member</span>
              </button>
            </>
          )}
        </div>
      </div>

      {disbursedAll && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2.5 rounded-lg text-xs flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-emerald-600">
              check_circle
            </span>
            Monthly payroll of PKR {totalPayroll.toLocaleString()} settled! Salary credit slips generated via 1Link / Raast.
          </span>
          <button
            onClick={() => setDisbursedAll(false)}
            className="text-emerald-700 hover:text-emerald-900"
          >
            ✕
          </button>
        </div>
      )}

      {/* KPI Ribbons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#eff4ff] text-[#001639] flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px]">badge</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              Total Staff Strength
            </span>
            <div className="text-xl font-bold font-domine text-[#001639]">
              {facultyList.length} Members
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#ffdad7] text-[#b3272c] flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px]">
              account_balance_wallet
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              Monthly Payroll
            </span>
            <div className="text-xl font-bold font-domine text-[#b3272c]">
              PKR {(totalPayroll / 1000).toFixed(0)}k
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px]">fact_check</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              Staff Attendance Rate
            </span>
            <div className="text-xl font-bold font-domine text-emerald-700">97.8%</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#ffddb5] text-[#633f00] flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px]">verified</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              Active Contracts
            </span>
            <div className="text-xl font-bold font-domine text-[#402700]">100% Verified</div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-auto sm:min-w-[260px]">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search faculty by name, CNIC, Emp ID..."
              className="w-full h-9 pl-9 pr-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639]"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
            {(['All', 'Active', 'On Leave', 'Resigned'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded font-semibold transition-colors cursor-pointer ${
                  statusFilter === st
                    ? 'bg-white text-[#001639] shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing <strong>{filteredFaculty.length}</strong> staff members
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Emp ID</th>
                <th className="py-3 px-3">Faculty Name & CNIC</th>
                <th className="py-3 px-3">Designation & Dept</th>
                <th className="py-3 px-3">Subjects / Classes</th>
                <th className="py-3 px-3">Basic Salary</th>
                <th className="py-3 px-3">Allowances</th>
                <th className="py-3 px-3">Payment Mode</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredFaculty.map((f) => (
                <tr key={f.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#001639]">
                    {f.emp_id}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex flex-col">
                      <span className="font-bold text-[#001639]">{f.full_name}</span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-mono text-slate-400">
                          {f.cnic}
                        </span>
                        <span className="text-[9.5px] font-mono px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
                          @{f.username || f.email?.split('@')[0] || f.full_name.toLowerCase().replace(/\s+/g, '.')}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-800">{f.designation}</span>
                      <span className="text-[10px] text-slate-500">
                        {f.qualification}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {f.assigned_subjects.map((s, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-800">
                    PKR {f.basic_salary_pkr.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-600">
                    PKR {f.allowances_pkr.toLocaleString()}
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold">
                      {f.payment_mode}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedStaff(f)
                          setIsSalarySlipModalOpen(true)
                        }}
                        className="px-2.5 py-1 bg-[#122b54] hover:bg-[#001639] text-white rounded text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                        title="Generate Official Salary Slip"
                      >
                        <span className="material-symbols-outlined text-[14px]">receipt_long</span>
                        <span className="hidden sm:inline">Salary Slip</span>
                      </button>
                      {canManage ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleOpenCredentials(f)}
                            className="p-1 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors cursor-pointer border border-slate-200"
                            title="Change Login Credentials (Username & Password)"
                            aria-label="Change Login Credentials"
                          >
                            <span className="material-symbols-outlined text-[16px]">key</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(f)}
                            className="p-1 text-slate-500 hover:text-[#001639] hover:bg-slate-100 rounded transition-colors cursor-pointer border border-slate-200"
                            title="Edit Faculty Profile"
                            aria-label="Edit Faculty Profile"
                          >
                            <span className="material-symbols-outlined text-[16px]">edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenDelete(f)}
                            className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer border border-slate-200"
                            title="Delete Faculty Profile"
                            aria-label="Delete Faculty Profile"
                          >
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            disabled
                            className="p-1 text-slate-300 cursor-not-allowed opacity-40 border border-slate-200 rounded"
                            title="Disabled: Requires 'manage_faculty' permission"
                          >
                            <span className="material-symbols-outlined text-[16px]">lock</span>
                          </button>
                          <button
                            type="button"
                            disabled
                            className="p-1 text-slate-300 cursor-not-allowed opacity-40 border border-slate-200 rounded"
                            title="Disabled: Requires 'manage_faculty' permission"
                          >
                            <span className="material-symbols-outlined text-[16px]">lock</span>
                          </button>
                          <button
                            type="button"
                            disabled
                            className="p-1 text-slate-300 cursor-not-allowed opacity-40 border border-slate-200 rounded"
                            title="Disabled: Requires 'manage_faculty' permission"
                          >
                            <span className="material-symbols-outlined text-[16px]">lock</span>
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Faculty Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false)
          setValidationError(null)
        }}
        title="Faculty Member & Teacher Registration"
        subtitle="Pakistan Labor Law & Institutional Appointment Dossier (SUPER_ADMIN & CAMPUS_ADMIN)"
        maxWidth="3xl"
      >
        <form onSubmit={handleAddFaculty} className="flex flex-col gap-4 text-xs">
          {validationError && (
            <div className="p-3 bg-red-50 border border-red-300 rounded-lg text-red-800 text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-red-600 text-[18px]">error</span>
              <span>{validationError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.full_name}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
                placeholder="e.g. Dr. Shahbaz Alam"
                className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                National CNIC Number *
              </label>
              <input
                type="text"
                required
                value={formData.cnic}
                onChange={(e) => setFormData({ ...formData, cnic: e.target.value })}
                placeholder="35201-XXXXXXX-X"
                className="w-full h-9 px-3 font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639]"
              />
              <span className="text-[10px] text-slate-400">NADRA Format: XXXXX-XXXXXXX-X</span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Contact Phone *
              </label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+92 300 1234567"
                className="w-full h-9 px-3 font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639]"
              />
              <span className="text-[10px] text-slate-400">Format: +92 300 1234567 or 03001234567</span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Assigned Campus *
              </label>
              <input
                type="text"
                required
                value={formData.campus}
                onChange={(e) => setFormData({ ...formData, campus: e.target.value })}
                placeholder="Enter Assigned Campus"
                className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Date of Joining *
              </label>
              <input
                type="date"
                required
                value={formData.joining_date}
                onChange={(e) => setFormData({ ...formData, joining_date: e.target.value })}
                className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Highest Qualification *
              </label>
              <input
                type="text"
                required
                value={formData.qualification}
                onChange={(e) =>
                  setFormData({ ...formData, qualification: e.target.value })
                }
                placeholder="e.g. M.Sc Mathematics, GCU Lahore"
                className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Designation & Role-Based Access Preset <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.designation}
                onChange={(e) =>
                  setFormData({ ...formData, designation: e.target.value })
                }
                className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639] font-medium text-slate-800"
              >
                {DESIGNATION_PRESETS.map((preset) => (
                  <option key={preset} value={preset}>
                    {preset}
                  </option>
                ))}
              </select>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Assigns initial role-based access level for faculty portal authentication.
              </span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Department / Subject *
              </label>
              <select
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
                className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639]"
              >
                <option value="Science">Science (Physics, Chem, Bio)</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Humanities">Humanities & Languages</option>
                <option value="Computer Science">Computer Science & Robotics</option>
                <option value="Administration">Administration & Accounts</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Base Monthly Salary (PKR) *
              </label>
              <input
                type="text"
                required
                value={formData.basic_salary_pkr}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    basic_salary_pkr: e.target.value.replace(/[^0-9.]/g, '') as any,
                  })
                }
                placeholder="e.g. 85000"
                className="w-full h-9 px-3 font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Allowances & Perks (PKR)
              </label>
              <input
                type="text"
                value={formData.allowances_pkr}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    allowances_pkr: e.target.value.replace(/[^0-9.]/g, '') as any,
                  })
                }
                placeholder="e.g. 15000"
                className="w-full h-9 px-3 font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Disbursement Mode *
              </label>
              <select
                value={formData.payment_mode}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    payment_mode: e.target.value as any,
                  })
                }
                className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639]"
              >
                <option value="Bank Transfer">Bank Transfer (HBL / Meezan)</option>
                <option value="Raast / Mobile Wallet">Raast / Fast Mobile Settlement</option>
                <option value="Cash">Cash Voucher</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Bank Account / IBAN
              </label>
              <input
                type="text"
                value={formData.account_number}
                onChange={(e) =>
                  setFormData({ ...formData, account_number: e.target.value })
                }
                placeholder="PKXX HABB 0000 0000 0000 0000"
                className="w-full h-9 px-3 font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#b3272c] hover:bg-[#88131b] text-white font-bold rounded-lg shadow-sm"
            >
              Register Faculty Member
            </button>
          </div>
        </form>
      </Modal>

      {/* Salary Slip Modal */}
      {selectedStaff && (
        <Modal
          isOpen={isSalarySlipModalOpen}
          onClose={() => setIsSalarySlipModalOpen(false)}
          title={`Monthly Salary Voucher: ${selectedStaff.full_name}`}
          subtitle={`Employee ID: ${selectedStaff.emp_id} • September 2026`}
          maxWidth="2xl"
        >
          <div className="printable-area bg-white p-6 rounded-xl border border-slate-200 text-xs text-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-white p-0.5 border border-slate-200 overflow-hidden shadow-2xs">
                  <img
                    src="/images/eaglets-logo.jpg"
                    alt="Eaglets Schools Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-baldwins font-bold text-sm text-[#001639] uppercase tracking-wider">
                    EAGLETS SCHOOLS
                  </h3>
                  <span className="font-aster text-[10px] text-[#b3272c] font-semibold block">
                    Rebirth Of Knowledge & Character
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[11px] border border-emerald-200">
                Disbursed via {selectedStaff.payment_mode}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg">
              <div>
                <span className="text-slate-400 block font-semibold">Faculty Name:</span>
                <span className="font-bold text-[#001639]">{selectedStaff.full_name}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Designation:</span>
                <span className="font-semibold">{selectedStaff.designation}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">CNIC:</span>
                <span className="font-mono">{selectedStaff.cnic}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Department:</span>
                <span>{selectedStaff.department}</span>
              </div>
            </div>

            <table className="w-full text-left border border-slate-200 rounded">
              <thead className="bg-[#001639] text-white">
                <tr>
                  <th className="p-2">Salary Component</th>
                  <th className="p-2 text-right">Amount (PKR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-2 font-medium">Basic Monthly Salary</td>
                  <td className="p-2 text-right font-mono">
                    {selectedStaff.basic_salary_pkr.toLocaleString()}
                  </td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">Teaching / Academic Allowance</td>
                  <td className="p-2 text-right font-mono">
                    {selectedStaff.allowances_pkr.toLocaleString()}
                  </td>
                </tr>
                <tr className="bg-slate-50 font-bold text-[#001639]">
                  <td className="p-2">Gross Payable</td>
                  <td className="p-2 text-right font-mono">
                    PKR{' '}
                    {(
                      selectedStaff.basic_salary_pkr + selectedStaff.allowances_pkr
                    ).toLocaleString()}
                  </td>
                </tr>
                <tr>
                  <td className="p-2 text-slate-500">Income Tax / EOIB Deduction</td>
                  <td className="p-2 text-right font-mono text-slate-500">PKR 0</td>
                </tr>
                <tr className="bg-[#122b54] text-white font-bold">
                  <td className="p-2">NET PAYABLE CREDIT</td>
                  <td className="p-2 text-right font-mono">
                    PKR{' '}
                    {(
                      selectedStaff.basic_salary_pkr + selectedStaff.allowances_pkr
                    ).toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="flex justify-between items-center pt-3 border-t border-slate-200">
              <span className="text-[10px] text-slate-400">
                Authorized Electronic Sign: Principal M. Tariq Alvi
              </span>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-3 py-1.5 bg-[#001639] text-white rounded font-bold hover:bg-[#122b54] cursor-pointer"
              >
                Print Salary Slip
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Faculty Profile Modal */}
      {staffToEdit && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false)
            setEditValidationError(null)
          }}
          title={`Edit Faculty Profile: ${staffToEdit.full_name}`}
          subtitle={`Employee ID: ${staffToEdit.emp_id} • Update HR & Compensation Records`}
          maxWidth="3xl"
        >
          <form onSubmit={handleUpdateFaculty} className="flex flex-col gap-4 text-xs">
            {editValidationError && (
              <div className="p-3 bg-red-50 border border-red-300 rounded-lg text-red-800 text-xs flex items-center gap-2">
                <span className="material-symbols-outlined text-red-600 text-[18px]">error</span>
                <span>{editValidationError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={staffToEdit.full_name}
                  onChange={(e) => setStaffToEdit({ ...staffToEdit, full_name: e.target.value })}
                  className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Pakistani CNIC (NADRA) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={staffToEdit.cnic}
                  onChange={(e) => setStaffToEdit({ ...staffToEdit, cnic: e.target.value })}
                  placeholder="35201-1234567-1"
                  className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639] font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Contact Phone (PK Mobile) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={staffToEdit.phone}
                  onChange={(e) => setStaffToEdit({ ...staffToEdit, phone: e.target.value })}
                  placeholder="+92 300 1234567"
                  className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Official Email</label>
                <input
                  type="email"
                  value={staffToEdit.email || ''}
                  onChange={(e) => setStaffToEdit({ ...staffToEdit, email: e.target.value })}
                  className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Assigned Campus
                </label>
                <input
                  type="text"
                  value={staffToEdit.campus || ''}
                  onChange={(e) => setStaffToEdit({ ...staffToEdit, campus: e.target.value })}
                  placeholder="Enter Campus Name (e.g. Main Boys Campus, Lahore)"
                  className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Designation & Role-Based Access Preset <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={staffToEdit.designation}
                  onChange={(e) => setStaffToEdit({ ...staffToEdit, designation: e.target.value })}
                  className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639] font-medium text-slate-800"
                >
                  {!DESIGNATION_PRESETS.includes(staffToEdit.designation as any) && (
                    <option value={staffToEdit.designation}>{staffToEdit.designation} (Custom)</option>
                  )}
                  {DESIGNATION_PRESETS.map((preset) => (
                    <option key={preset} value={preset}>
                      {preset}
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Role preset determines system permissions and module authorization.
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Department</label>
                <input
                  type="text"
                  value={staffToEdit.department}
                  onChange={(e) => setStaffToEdit({ ...staffToEdit, department: e.target.value })}
                  className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Highest Qualification
                </label>
                <input
                  type="text"
                  value={staffToEdit.qualification || ''}
                  onChange={(e) => setStaffToEdit({ ...staffToEdit, qualification: e.target.value })}
                  placeholder="e.g. M.Phil Physics (PU)"
                  className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639]"
                />
              </div>

              {/* Assigned Classes Multiple Select */}
              <div className="sm:col-span-2 flex flex-col gap-2.5 p-3.5 bg-slate-50/80 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <label className="block font-semibold text-slate-800 text-xs">
                      Assigned Classes <span className="text-slate-400 font-normal">(Playgroup to Grade 10)</span>
                    </label>
                    <p className="text-[11px] text-slate-500">
                      Multi-select all roster allocations or set &ldquo;No class assigned&rdquo;
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setStaffToEdit({
                          ...staffToEdit,
                          assigned_classes: [...ALL_CLASS_OPTIONS],
                        })
                      }
                      className="text-[11px] font-semibold text-[#122b54] hover:text-[#001639] hover:underline cursor-pointer"
                    >
                      Select All (PG–10)
                    </button>
                    <span className="text-slate-300">•</span>
                    <button
                      type="button"
                      onClick={() =>
                        setStaffToEdit({
                          ...staffToEdit,
                          assigned_classes: ['No class assigned'],
                        })
                      }
                      className="text-[11px] font-semibold text-red-600 hover:text-red-700 hover:underline cursor-pointer"
                    >
                      Clear / No Class
                    </button>
                  </div>
                </div>

                {/* Option for No class assigned */}
                <button
                  type="button"
                  onClick={() => {
                    setStaffToEdit({
                      ...staffToEdit,
                      assigned_classes: ['No class assigned'],
                    })
                  }}
                  className={`w-full p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                    !staffToEdit.assigned_classes ||
                    staffToEdit.assigned_classes.length === 0 ||
                    staffToEdit.assigned_classes.includes('No class assigned') ||
                    staffToEdit.assigned_classes.includes('None')
                      ? 'bg-[#001639] text-white border-[#001639] shadow-xs ring-2 ring-[#001639]/20'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[17px]">
                      {!staffToEdit.assigned_classes ||
                      staffToEdit.assigned_classes.length === 0 ||
                      staffToEdit.assigned_classes.includes('No class assigned') ||
                      staffToEdit.assigned_classes.includes('None')
                        ? 'check_box'
                        : 'check_box_outline_blank'}
                    </span>
                    <span>No class assigned (Administrative / Section Head / Non-teaching Staff)</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white/15">
                    No Allocation
                  </span>
                </button>

                {/* Multi-select Grid from Playgroup to Grade 10 */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1.5 pt-1">
                  {ALL_CLASS_OPTIONS.map((cls) => {
                    const isNoneSelected =
                      !staffToEdit.assigned_classes ||
                      staffToEdit.assigned_classes.includes('No class assigned') ||
                      staffToEdit.assigned_classes.includes('None')
                    const isSelected = !isNoneSelected && staffToEdit.assigned_classes?.includes(cls)

                    return (
                      <button
                        key={cls}
                        type="button"
                        onClick={() => {
                          const current = (staffToEdit.assigned_classes || []).filter(
                            (c) => c !== 'No class assigned' && c !== 'None' && c !== ''
                          )
                          let updated: string[]
                          if (current.includes(cls)) {
                            updated = current.filter((c) => c !== cls)
                            if (updated.length === 0) {
                              updated = ['No class assigned']
                            }
                          } else {
                            updated = [...current, cls]
                          }
                          setStaffToEdit({
                            ...staffToEdit,
                            assigned_classes: updated,
                          })
                        }}
                        className={`px-2.5 py-2 rounded-lg border text-xs font-semibold flex items-center justify-between gap-1.5 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#b3272c] text-white border-[#b3272c] shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                        }`}
                      >
                        <span className="truncate">{cls}</span>
                        <span className={`material-symbols-outlined text-[15px] flex-shrink-0 ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                          {isSelected ? 'check' : 'add'}
                        </span>
                      </button>
                    )
                  })}
                </div>

                {/* Selected Classes Chips Preview */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[11px] text-slate-600">
                  <span className="font-semibold text-slate-700">Selected Classes:</span>
                  {!staffToEdit.assigned_classes ||
                  staffToEdit.assigned_classes.length === 0 ||
                  staffToEdit.assigned_classes.includes('No class assigned') ||
                  staffToEdit.assigned_classes.includes('None') ? (
                    <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-semibold">
                      No class assigned
                    </span>
                  ) : (
                    staffToEdit.assigned_classes.map((c, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-[#b3272c]/10 text-[#b3272c] font-semibold border border-[#b3272c]/20"
                      >
                        {c}
                      </span>
                    ))
                  )}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Assigned Subjects (comma separated)
                </label>
                <input
                  type="text"
                  value={staffToEdit.assigned_subjects.join(', ')}
                  onChange={(e) =>
                    setStaffToEdit({
                      ...staffToEdit,
                      assigned_subjects: e.target.value.split(',').map((s) => s.trim()),
                    })
                  }
                  className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Basic Salary (PKR) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editSalaryText}
                  onChange={(e) => setEditSalaryText(e.target.value)}
                  placeholder="e.g. 85000"
                  className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639] font-mono text-xs"
                />
                <span className="text-[10px] text-slate-400">Text-editable currency field (e.g. 85000)</span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Monthly Allowances (PKR)
                </label>
                <input
                  type="text"
                  value={editAllowancesText}
                  onChange={(e) => setEditAllowancesText(e.target.value)}
                  placeholder="e.g. 15000"
                  className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639] font-mono text-xs"
                />
                <span className="text-[10px] text-slate-400">Text-editable currency field (e.g. 15000)</span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Payment Channel</label>
                <select
                  value={staffToEdit.payment_mode}
                  onChange={(e) =>
                    setStaffToEdit({
                      ...staffToEdit,
                      payment_mode: e.target.value as 'Cash' | 'Bank Transfer' | 'Raast / Mobile Wallet',
                    })
                  }
                  className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639]"
                >
                  <option value="Bank Transfer">Bank Transfer (HBL / Meezan)</option>
                  <option value="Cash">Cash Disbursement Counter</option>
                  <option value="Raast / Mobile Wallet">Raast / JazzCash / Nayapay</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Bank Name</label>
                <input
                  type="text"
                  value={staffToEdit.bank_name || ''}
                  onChange={(e) => setStaffToEdit({ ...staffToEdit, bank_name: e.target.value })}
                  placeholder="e.g. Habib Bank Limited"
                  className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Account Number / IBAN</label>
                <input
                  type="text"
                  value={staffToEdit.account_number || ''}
                  onChange={(e) => setStaffToEdit({ ...staffToEdit, account_number: e.target.value })}
                  placeholder="PK36HABB0000..."
                  className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639] font-mono"
                />
              </div>

              {/* Portal Login Credentials Section */}
              <div className="sm:col-span-2 p-3.5 bg-amber-50/60 rounded-xl border border-amber-200/80 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-amber-600 text-[18px]">key</span>
                    <span className="font-bold text-xs text-[#001639]">Faculty Portal Login Credentials</span>
                  </div>
                  <span className="text-[10px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full font-bold">
                    Web & Mobile Portal Access
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Portal Username <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono">@</span>
                      <input
                        type="text"
                        value={staffToEdit.username || ''}
                        onChange={(e) => setStaffToEdit({ ...staffToEdit, username: e.target.value })}
                        placeholder="e.g. masood.ahmad"
                        className="w-full h-9 pl-7 pr-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639] font-mono text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-semibold text-slate-700">
                        Portal Password <span className="text-red-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const randomDigits = Math.floor(1000 + Math.random() * 9000)
                          setStaffToEdit({ ...staffToEdit, password: `Eaglets@${randomDigits}` })
                        }}
                        className="text-[10px] text-[#b3272c] hover:underline font-bold"
                      >
                        Generate Random
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showEditPassword ? 'text' : 'password'}
                        value={staffToEdit.password || ''}
                        onChange={(e) => setStaffToEdit({ ...staffToEdit, password: e.target.value })}
                        placeholder="Enter password"
                        className="w-full h-9 pl-3 pr-9 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639] font-mono text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowEditPassword(!showEditPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[17px]">
                          {showEditPassword ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Employment Status</label>
                <select
                  value={staffToEdit.status}
                  onChange={(e) =>
                    setStaffToEdit({
                      ...staffToEdit,
                      status: e.target.value as 'Active' | 'On Leave' | 'Resigned',
                    })
                  }
                  className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639]"
                >
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Resigned">Resigned</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-200 mt-2">
              <button
                type="button"
                onClick={() => {
                  setIsEditModalOpen(false)
                  setEditValidationError(null)
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
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Faculty Profile Confirmation Modal */}
      {staffToDelete && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Delete Faculty Profile"
          subtitle="Are you sure you want to permanently remove this faculty record?"
          maxWidth="md"
        >
          <div className="flex flex-col gap-4 text-xs">
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-900 flex items-start gap-3">
              <span className="material-symbols-outlined text-red-600 text-[24px] flex-shrink-0 mt-0.5">
                warning
              </span>
              <div className="flex flex-col gap-1">
                <span className="font-bold text-sm">Permanent Action Warning</span>
                <p className="text-red-700">
                  You are about to delete the employee dossier for{' '}
                  <strong className="text-red-900">{staffToDelete.full_name}</strong> (
                  <span className="font-mono font-semibold">{staffToDelete.emp_id}</span>,{' '}
                  {staffToDelete.designation}). This will remove them from active payroll rosters and attendance allocations.
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex flex-col gap-1.5 font-mono text-[11px] text-slate-600">
              <div className="flex justify-between">
                <span className="text-slate-400">Employee ID:</span>
                <span className="font-bold text-[#001639]">{staffToDelete.emp_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">CNIC:</span>
                <span>{staffToDelete.cnic}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Designation & Dept:</span>
                <span>{staffToDelete.designation} • {staffToDelete.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Basic Salary:</span>
                <span>PKR {staffToDelete.basic_salary_pkr.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-colors cursor-pointer shadow-sm flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[17px]">delete</span>
                <span>Confirm & Delete Profile</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Dedicated Faculty Credentials Modal */}
      {staffForCred && (
        <Modal
          isOpen={isCredModalOpen}
          onClose={() => {
            setIsCredModalOpen(false)
            setCredError(null)
          }}
          title={`Faculty Login Credentials: ${staffForCred.full_name}`}
          subtitle={`Employee ID: ${staffForCred.emp_id} • Portal Access Management`}
          maxWidth="md"
        >
          <form onSubmit={handleSaveCredentials} className="flex flex-col gap-4 text-xs">
            {credError && (
              <div className="p-3 bg-red-50 border border-red-300 rounded-lg text-red-800 text-xs flex items-center gap-2">
                <span className="material-symbols-outlined text-red-600 text-[18px]">error</span>
                <span>{credError}</span>
              </div>
            )}

            {credCopySuccess && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-600 text-[18px]">check_circle</span>
                <span>Credentials copied to clipboard! Ready to send to teacher.</span>
              </div>
            )}

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Faculty Member Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={credName}
                onChange={(e) => setCredName(e.target.value)}
                className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Portal Username <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono">@</span>
                <input
                  type="text"
                  required
                  value={credUsername}
                  onChange={(e) => setCredUsername(e.target.value)}
                  placeholder="e.g. masood.ahmad"
                  className="w-full h-9 pl-7 pr-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639] font-mono"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-slate-700">
                  Portal Password <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleGenerateFacultyPassword}
                  className="text-[10px] text-[#b3272c] hover:underline font-bold cursor-pointer"
                >
                  Generate Strong Password
                </button>
              </div>
              <div className="relative">
                <input
                  type={showCredPassword ? 'text' : 'password'}
                  required
                  value={credPassword}
                  onChange={(e) => setCredPassword(e.target.value)}
                  placeholder="Enter teacher password"
                  className="w-full h-9 pl-3 pr-9 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639] font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowCredPassword(!showCredPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[17px]">
                    {showCredPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-bold text-slate-700">Share with Teacher</span>
                <span className="text-[10px] text-slate-500">Copy login credentials to send via SMS or WhatsApp</span>
              </div>
              <button
                type="button"
                onClick={handleCopyCredentials}
                className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-[15px]">content_copy</span>
                <span>Copy</span>
              </button>
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setIsCredModalOpen(false)
                  setCredError(null)
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
                <span>Save Credentials</span>
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

