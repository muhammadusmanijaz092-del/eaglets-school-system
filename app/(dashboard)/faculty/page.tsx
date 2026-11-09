'use client'

import React, { useState } from 'react'
import Modal from '@/components/Modal'
import { INITIAL_FACULTY } from '@/lib/mock-data'
import { FacultyItem } from '@/lib/supabase/types'

export default function FacultyPage() {
  const [facultyList, setFacultyList] = useState<FacultyItem[]>(INITIAL_FACULTY)
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'On Leave' | 'Resigned'>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isSalarySlipModalOpen, setIsSalarySlipModalOpen] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState<FacultyItem | null>(null)
  const [disbursedAll, setDisbursedAll] = useState(false)

  // Registration Form
  const [formData, setFormData] = useState({
    full_name: '',
    cnic: '',
    phone: '',
    email: '',
    qualification: '',
    designation: '',
    department: 'Science',
    assigned_classes: 'Grade 10, Grade 9',
    assigned_subjects: 'Physics',
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
    const newStaff: FacultyItem = {
      id: `f-${Date.now()}`,
      emp_id: `EAG-FAC-${String(facultyList.length + 106)}`,
      full_name: formData.full_name,
      cnic: formData.cnic,
      phone: formData.phone,
      email: formData.email,
      qualification: formData.qualification,
      designation: formData.designation,
      department: formData.department,
      assigned_classes: formData.assigned_classes.split(',').map((s) => s.trim()),
      assigned_subjects: formData.assigned_subjects.split(',').map((s) => s.trim()),
      joining_date: new Date().toISOString().slice(0, 10),
      basic_salary_pkr: Number(formData.basic_salary_pkr),
      allowances_pkr: Number(formData.allowances_pkr),
      payment_mode: formData.payment_mode,
      bank_name: formData.bank_name,
      account_number: formData.account_number,
      status: 'Active',
    }

    setFacultyList([newStaff, ...facultyList])
    setIsAddModalOpen(false)
  }

  const handleDisbursePayroll = () => {
    setDisbursedAll(true)
    setTimeout(() => setDisbursedAll(false), 4000)
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
          <div className="relative min-w-[260px]">
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
                      <span className="text-[10px] font-mono text-slate-400">
                        {f.cnic}
                      </span>
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
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedStaff(f)
                        setIsSalarySlipModalOpen(true)
                      }}
                      className="px-2.5 py-1 bg-[#122b54] hover:bg-[#001639] text-white rounded text-[11px] font-semibold transition-colors cursor-pointer"
                    >
                      Salary Slip
                    </button>
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
        onClose={() => setIsAddModalOpen(false)}
        title="Faculty & Staff Registration"
        subtitle="Pakistan Labor Law & Institutional Appointment Dossier"
        maxWidth="3xl"
      >
        <form onSubmit={handleAddFaculty} className="flex flex-col gap-4 text-xs">
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
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Mobile Number *
              </label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+92 300 1234567"
                className="w-full h-9 px-3 font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639]"
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
                Designation / Position *
              </label>
              <input
                type="text"
                required
                value={formData.designation}
                onChange={(e) =>
                  setFormData({ ...formData, designation: e.target.value })
                }
                placeholder="e.g. Senior Subject Specialist"
                className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Department *
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
                <option value="Administration">Administration</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Basic Monthly Salary (PKR) *
              </label>
              <input
                type="number"
                required
                value={formData.basic_salary_pkr}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    basic_salary_pkr: Number(e.target.value),
                  })
                }
                className="w-full h-9 px-3 font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Allowances & Perks (PKR)
              </label>
              <input
                type="number"
                value={formData.allowances_pkr}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    allowances_pkr: Number(e.target.value),
                  })
                }
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
              <div className="flex items-center gap-2">
                <span className="text-xl">🦅</span>
                <div>
                  <h3 className="font-domine font-bold text-sm text-[#001639] uppercase">
                    EAGLETS SCHOOLS
                  </h3>
                  <span className="text-[10px] text-slate-500">
                    Main Boys Campus, Lahore • Accounts & Payroll
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
    </div>
  )
}

