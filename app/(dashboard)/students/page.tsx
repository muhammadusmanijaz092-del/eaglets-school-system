'use client'

import React, { useState } from 'react'
import Modal from '@/components/Modal'
import PrintableChallan from '@/components/PrintableChallan'
import { INITIAL_STUDENTS, INITIAL_CLASSES, INITIAL_INVOICES } from '@/lib/mock-data'
import { StudentItem } from '@/lib/supabase/types'

export default function StudentsPage() {
  const [students, setStudents] = useState<StudentItem[]>(INITIAL_STUDENTS)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedClass, setSelectedClass] = useState('ALL')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isChallanModalOpen, setIsChallanModalOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<StudentItem | null>(null)

  // New Student Form State
  const [formData, setFormData] = useState({
    student_name: '',
    b_form: '',
    dob: '',
    gender: 'Male' as 'Male' | 'Female',
    father_name: '',
    father_cnic: '',
    contact_phone: '',
    whatsapp_no: '',
    class_name: 'Grade 10 - Science A (Rose)',
    section: 'Science A (Rose)',
    address: '',
    previous_school: '',
  })

  // Filtered Students
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.roll_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.b_form.includes(searchQuery) ||
      s.father_name.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesClass =
      selectedClass === 'ALL' || (s.class_name && s.class_name.includes(selectedClass))

    return matchesSearch && matchesClass
  })

  // CSV Export
  const handleExportCSV = () => {
    const headers = [
      'Admission No',
      'Roll No',
      'Student Name',
      'B-Form',
      'Father Name',
      'Father CNIC',
      'Contact Phone',
      'Class',
      'Section',
      'Status',
    ]
    const rows = filteredStudents.map((s) => [
      s.admission_no,
      s.roll_no,
      `"${s.student_name}"`,
      s.b_form,
      `"${s.father_name}"`,
      s.father_cnic,
      s.contact_phone,
      `"${s.class_name || ''}"`,
      s.section,
      s.status,
    ])
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `Eaglets_Students_Roster_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Handle Create Student
  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault()
    const nextRoll = `EAG-${formData.class_name.includes('10') ? '10' : '09'}-${String(
      students.length + 43
    ).padStart(3, '0')}`
    const newStudent: StudentItem = {
      id: `s-${Date.now()}`,
      admission_no: `ADM-2026-${String(students.length + 105)}`,
      roll_no: nextRoll,
      student_name: formData.student_name,
      b_form: formData.b_form,
      dob: formData.dob || '2011-01-01',
      gender: formData.gender,
      father_name: formData.father_name,
      father_cnic: formData.father_cnic,
      contact_phone: formData.contact_phone,
      whatsapp_no: formData.whatsapp_no || formData.contact_phone,
      address: formData.address || 'Lahore, Pakistan',
      class_name: formData.class_name,
      section: formData.section,
      previous_school: formData.previous_school,
      status: 'Active',
      admission_date: new Date().toISOString().slice(0, 10),
    }

    setStudents([newStudent, ...students])
    setIsAddModalOpen(false)
    setFormData({
      student_name: '',
      b_form: '',
      dob: '',
      gender: 'Male',
      father_name: '',
      father_cnic: '',
      contact_phone: '',
      whatsapp_no: '',
      class_name: 'Grade 10 - Science A (Rose)',
      section: 'Science A (Rose)',
      address: '',
      previous_school: '',
    })
  }

  return (
    <div className="px-8 py-6 flex flex-col gap-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-[#eff4ff] text-[#001639] text-[10px] font-bold uppercase tracking-wider">
              Student Information System (SIS)
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500">NADRA B-Form Verified Registry</span>
          </div>
          <h1 className="font-domine text-2xl font-bold text-[#001639]">
            Student Admissions & Records
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage enrolled cohort particulars, biometric B-Form identification, parent contact directories & dossier files.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={handleExportCSV}
            className="h-9 px-3.5 bg-slate-50 hover:bg-slate-100 text-[#001639] border border-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[17px]">download</span>
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="h-9 px-3.5 bg-[#b3272c] hover:bg-[#88131b] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[17px]">person_add</span>
            <span>+ Quick Admission Form</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative min-w-[280px]">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Roll No, B-Form, Name or Father..."
              className="w-full h-9 pl-9 pr-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639]"
            />
          </div>

          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="h-9 px-3 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Classes & Wings</option>
            {INITIAL_CLASSES.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name} - {c.section}
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-slate-500 self-end md:self-auto font-medium">
          Showing <strong>{filteredStudents.length}</strong> enrolled students
        </div>
      </div>

      {/* Student Registry Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Roll No</th>
                <th className="py-3 px-3">Student Name</th>
                <th className="py-3 px-3">B-Form # (NADRA)</th>
                <th className="py-3 px-3">Father / Contact</th>
                <th className="py-3 px-3">Class & Section</th>
                <th className="py-3 px-3">Gender</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredStudents.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#001639]">
                    {s.roll_no}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-[#001639] text-xs">
                        {s.student_name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-[#001639]">{s.student_name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {s.admission_no}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-600 text-[11px]">
                    {s.b_form}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-800">{s.father_name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {s.contact_phone}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-700">
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-semibold">
                      {s.class_name}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600">{s.gender}</td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      {s.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedStudent(s)
                          setIsDetailModalOpen(true)
                        }}
                        className="p-1 text-slate-400 hover:text-[#001639] hover:bg-slate-100 rounded transition-colors"
                        title="View Profile"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          visibility
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedStudent(s)
                          setIsChallanModalOpen(true)
                        }}
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-[#001639] font-semibold rounded text-[11px] transition-colors cursor-pointer"
                        title="Fee Challan"
                      >
                        Challan
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Admission Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="New Student Admission Form"
        subtitle="Pakistan Standard School Registration & NADRA B-Form Dossier"
        maxWidth="3xl"
      >
        <form onSubmit={handleCreateStudent} className="flex flex-col gap-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Student Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.student_name}
                onChange={(e) =>
                  setFormData({ ...formData, student_name: e.target.value })
                }
                placeholder="e.g. Zubair Ahmad Khan"
                className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                NADRA B-Form Number *
              </label>
              <input
                type="text"
                required
                value={formData.b_form}
                onChange={(e) => setFormData({ ...formData, b_form: e.target.value })}
                placeholder="35201-XXXXXXX-X"
                className="w-full h-9 px-3 font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Father / Guardian Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.father_name}
                onChange={(e) =>
                  setFormData({ ...formData, father_name: e.target.value })
                }
                placeholder="e.g. Tariq Khan"
                className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Father National CNIC *
              </label>
              <input
                type="text"
                required
                value={formData.father_cnic}
                onChange={(e) =>
                  setFormData({ ...formData, father_cnic: e.target.value })
                }
                placeholder="35201-XXXXXXX-X"
                className="w-full h-9 px-3 font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Emergency Mobile / WhatsApp *
              </label>
              <input
                type="text"
                required
                value={formData.contact_phone}
                onChange={(e) =>
                  setFormData({ ...formData, contact_phone: e.target.value })
                }
                placeholder="+92 300 1234567"
                className="w-full h-9 px-3 font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Date of Birth *
              </label>
              <input
                type="date"
                required
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Assigned Class & Section *
              </label>
              <select
                value={formData.class_name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    class_name: e.target.value,
                    section: e.target.value.split('- ')[1] || 'General',
                  })
                }
                className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639]"
              >
                {INITIAL_CLASSES.map((c) => (
                  <option key={c.id} value={`${c.name} - ${c.section}`}>
                    {c.name} - {c.section} (PKR {c.monthly_tuition_pkr.toLocaleString()}
                    /mo)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Gender *</label>
              <select
                value={formData.gender}
                onChange={(e) =>
                  setFormData({ ...formData, gender: e.target.value as 'Male' | 'Female' })
                }
                className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639]"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Residential Address (Lahore)
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="e.g. House 45, Gulberg 3, Lahore"
              className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639]"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Previous School Attended (If Transfer)
            </label>
            <input
              type="text"
              value={formData.previous_school}
              onChange={(e) =>
                setFormData({ ...formData, previous_school: e.target.value })
              }
              placeholder="e.g. Crescent Model School"
              className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639]"
            />
          </div>

          {/* Document Upload Box */}
          <div className="border border-dashed border-slate-300 rounded-lg p-3 bg-slate-50 text-center">
            <span className="material-symbols-outlined text-slate-400 text-[24px]">
              cloud_upload
            </span>
            <p className="text-slate-600 font-medium mt-1">
              Attach Student Photo & B-Form Scanned Copy (Supabase Storage)
            </p>
            <p className="text-[10px] text-slate-400">PDF, PNG or JPG up to 5MB</p>
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
              Confirm Admission
            </button>
          </div>
        </form>
      </Modal>

      {/* Student Profile Modal */}
      {selectedStudent && (
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title={`Student Profile: ${selectedStudent.student_name}`}
          subtitle={`Roll No: ${selectedStudent.roll_no} • ${selectedStudent.admission_no}`}
          maxWidth="2xl"
        >
          <div className="flex flex-col gap-4 text-xs">
            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="w-16 h-16 rounded-full bg-[#122b54] text-white flex items-center justify-center text-xl font-bold">
                {selectedStudent.student_name.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="font-domine text-base font-bold text-[#001639]">
                  {selectedStudent.student_name}
                </span>
                <span className="text-slate-500 font-medium">
                  {selectedStudent.class_name}
                </span>
                <span className="text-[#b3272c] font-bold mt-1">
                  NADRA B-Form: {selectedStudent.b_form}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl">
              <div>
                <span className="text-slate-400 block font-semibold">Father Name:</span>
                <span className="font-bold text-slate-800">
                  {selectedStudent.father_name}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Father CNIC:</span>
                <span className="font-mono text-slate-800">
                  {selectedStudent.father_cnic}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Contact Phone:</span>
                <span className="font-mono text-slate-800">
                  {selectedStudent.contact_phone}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Date of Birth:</span>
                <span className="text-slate-800">{selectedStudent.dob}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Gender:</span>
                <span className="text-slate-800">{selectedStudent.gender}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Address:</span>
                <span className="text-slate-800">{selectedStudent.address}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setIsDetailModalOpen(false)
                  setIsChallanModalOpen(true)
                }}
                className="px-4 py-2 bg-[#001639] hover:bg-[#122b54] text-white font-bold rounded-lg shadow-sm"
              >
                View Fee Challan
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Printable Challan Modal */}
      {selectedStudent && (
        <Modal
          isOpen={isChallanModalOpen}
          onClose={() => setIsChallanModalOpen(false)}
          title="Printable 3-Part Bank Challan"
          subtitle={`Student: ${selectedStudent.student_name} (${selectedStudent.roll_no})`}
          maxWidth="5xl"
        >
          <PrintableChallan
            studentName={selectedStudent.student_name}
            rollNo={selectedStudent.roll_no}
            bForm={selectedStudent.b_form}
            className={selectedStudent.class_name}
          />
        </Modal>
      )}
    </div>
  )
}
