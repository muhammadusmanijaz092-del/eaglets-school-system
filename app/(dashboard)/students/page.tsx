'use client'

import React, { useState, useEffect, useRef } from 'react'
import * as XLSX from 'xlsx'
import Modal from '@/components/Modal'
import PrintableChallan from '@/components/PrintableChallan'
import {
  INITIAL_STUDENTS,
  INITIAL_CLASSES,
  INITIAL_INVOICES,
  CLASS_PRESETS,
  SECTION_PRESETS,
} from '@/lib/mock-data'
import { StudentItem } from '@/lib/supabase/types'
import { createClient } from '@/lib/supabase/client'
import { useRBAC } from '@/lib/rbac-store'

const STUDENTS_STORAGE_KEY = 'eaglets_students_v2'

function getStoredStudents(): StudentItem[] {
  if (typeof window === 'undefined') return INITIAL_STUDENTS
  try {
    const raw = localStorage.getItem(STUDENTS_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch (err) {
    console.warn('Failed to load students from localStorage:', err)
  }
  return INITIAL_STUDENTS
}

function saveStoredStudents(list: StudentItem[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(list))
    window.dispatchEvent(new CustomEvent('eaglets_students_updated', { detail: list }))
  } catch (err) {
    console.warn('Failed to save students to localStorage:', err)
  }
}

interface ParsedImportRow {
  index: number
  full_name: string
  father_name: string
  b_form_number: string
  gender: 'Male' | 'Female'
  dob_yyyy_mm_dd: string
  class_grade: string
  section: string
  parent_phone: string
  address: string
  previous_school: string
  base_monthly_fee: string
  discount_type: string
  discount_amount: string
  errors: string[]
  isValid: boolean
}

export default function StudentsPage() {
  const { hasPermission, currentUser, isRootAdmin, switchToRootAdmin } = useRBAC()
  const canView = hasPermission('view_students')
  const canCreate = hasPermission('create_students')
  const canEdit = hasPermission('edit_students')
  const canDelete = hasPermission('delete_students')

  const [students, setStudents] = useState<StudentItem[]>(() => INITIAL_STUDENTS)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedClass, setSelectedClass] = useState('ALL')
  const [selectedSection, setSelectedSection] = useState('ALL')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isChallanModalOpen, setIsChallanModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<StudentItem | null>(null)
  const [studentToEdit, setStudentToEdit] = useState<StudentItem | null>(null)
  const [studentToDelete, setStudentToDelete] = useState<StudentItem | null>(null)

  // Bulk Import State
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false)
  const [importRows, setImportRows] = useState<ParsedImportRow[]>([])
  const [importFileName, setImportFileName] = useState('')
  const [bulkSuccessMessage, setBulkSuccessMessage] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // New Student Form State
  const [formData, setFormData] = useState({
    student_name: '',
    b_form: '',
    dob: '',
    gender: 'Male' as 'Male' | 'Female',
    father_name: '',
    guardian_name: '',
    family_id: '',
    father_cnic: '',
    contact_phone: '',
    whatsapp_no: '',
    class_name: 'Grade 10',
    section: 'Section A',
    address: '',
    previous_school: '',
  })

  // Load from LocalStorage and Supabase if connected
  useEffect(() => {
    setStudents(getStoredStudents())

    const handleUpdate = (e: any) => {
      if (e?.detail) setStudents(e.detail)
      else setStudents(getStoredStudents())
    }

    window.addEventListener('eaglets_students_updated', handleUpdate)
    window.addEventListener('storage', handleUpdate)

    const supabase = createClient()
    if (supabase) {
      const loadStudents = async () => {
        try {
          const { data, error } = await supabase
            .from('students')
            .select('*')
            .order('created_at', { ascending: false })
          if (!error && data && data.length > 0) {
            setStudents(data as StudentItem[])
            saveStoredStudents(data as StudentItem[])
          }
        } catch (err) {
          console.warn('Falling back to local data:', err)
        }
      }
      loadStudents()
    }

    return () => {
      window.removeEventListener('eaglets_students_updated', handleUpdate)
      window.removeEventListener('storage', handleUpdate)
    }
  }, [])

  // Filtered Students
  const filteredStudents = students.filter((s) => {
    const q = searchQuery.toLowerCase().trim()
    const matchesSearch =
      !q ||
      s.student_name.toLowerCase().includes(q) ||
      (s.roll_no && s.roll_no.toLowerCase().includes(q)) ||
      (s.admission_no && s.admission_no.toLowerCase().includes(q)) ||
      (s.b_form && s.b_form.includes(q)) ||
      (s.father_name && s.father_name.toLowerCase().includes(q)) ||
      (s.guardian_name && s.guardian_name.toLowerCase().includes(q)) ||
      (s.family_id && s.family_id.toLowerCase().includes(q)) ||
      (s.contact_phone && s.contact_phone.includes(q))

    const matchesClass =
      selectedClass === 'ALL' ||
      (s.class_name && s.class_name.toLowerCase().includes(selectedClass.toLowerCase()))

    const matchesSection =
      selectedSection === 'ALL' ||
      (s.section && s.section.toLowerCase().includes(selectedSection.toLowerCase())) ||
      (s.class_name && s.class_name.toLowerCase().includes(selectedSection.toLowerCase()))

    return matchesSearch && matchesClass && matchesSection
  })

  // CSV Export with exact requested columns
  const handleExportCSV = () => {
    const headers = [
      'Serial Number',
      'Student Name',
      'Class',
      'Section',
      'Student ID',
      'Family ID',
      'Guardian Name',
      'Contact Number',
      'Gender',
      'Status',
    ]
    const rows = filteredStudents.map((s, idx) => [
      idx + 1,
      `"${s.student_name}"`,
      `"${s.class_name ? (s.class_name.includes(' - ') ? s.class_name.split(' - ')[0] : s.class_name) : 'Grade 10'}"`,
      `"${s.section || 'Section A'}"`,
      s.roll_no || s.admission_no,
      s.family_id || `FAM-${1000 + idx + 1}`,
      `"${s.guardian_name || s.father_name || ''}"`,
      s.contact_phone,
      s.gender,
      s.status,
    ])
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute(
      'download',
      `Eaglets_Students_Roster_${new Date().toISOString().slice(0, 10)}.csv`
    )
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // 1. Download Sample CSV Template
  const handleDownloadSampleTemplate = () => {
    const headers = [
      'full_name',
      'father_name',
      'guardian_name',
      'family_id',
      'b_form_number',
      'gender',
      'dob_yyyy_mm_dd',
      'class_grade',
      'section',
      'parent_phone',
      'address',
      'previous_school',
      'base_monthly_fee',
      'discount_type',
      'discount_amount',
    ]
    const sampleRows = [
      [
        'Muhammad Hamza',
        'Nadeem Akhtar',
        'Nadeem Akhtar',
        'FAM-1042',
        '35202-8491021-3',
        'Male',
        '2010-06-15',
        'Grade 10',
        'Section A',
        '+923001234567',
        'House 14-B Model Town, Lahore',
        'Beaconhouse School System',
        '14000',
        'Merit',
        '2000',
      ],
      [
        'Ayesha Tariq',
        'Tariq Mehmood',
        'Tariq Mehmood',
        'FAM-1088',
        '35201-9988112-2',
        'Female',
        '2011-03-22',
        'Grade 9',
        'Section B',
        '+923219871234',
        'House 88, Faisal Town, Lahore',
        'Lahore Grammar School',
        '14000',
        'Sibling',
        '1400',
      ],
      [
        'Bilal Ali Shah',
        'Syed Ali Shah',
        'Syed Ali Shah',
        'FAM-1120',
        '35202-9912831-7',
        'Male',
        '2010-11-08',
        'Grade 8',
        'Section C',
        '+923214567890',
        'Ferozepur Road, Lahore',
        'Army Public School',
        '11500',
        'None',
        '0',
      ],
    ]

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...sampleRows.map((r) => r.map((c) => `"${c}"`).join(','))].join('\n')

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', 'Eaglets_Bulk_Student_Admission_Template.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // 2. Data Validation & Sanitization Engine
  const bFormRegex = /^\d{5}-\d{7}-\d{1}$/
  const phoneRegex = /^(\+92|03)\d{9,10}$/

  const parseAndValidateData = (rawRows: Record<string, any>[]) => {
    const parsed: ParsedImportRow[] = rawRows.map((row, idx) => {
      const full_name = String(row.full_name || row['Full Name'] || row['full name'] || '').trim()
      const father_name = String(row.father_name || row['Father Name'] || row['father name'] || '').trim()
      const b_form_number = String(
        row.b_form_number || row['B-Form'] || row['b_form'] || row['B Form Number'] || ''
      ).trim()
      const rawGender = String(row.gender || row['Gender'] || 'Male').trim()
      const gender: 'Male' | 'Female' =
        rawGender.toLowerCase() === 'female' || rawGender.toLowerCase() === 'f'
          ? 'Female'
          : 'Male'
      const dob_yyyy_mm_dd = String(
        row.dob_yyyy_mm_dd || row['dob'] || row['DOB'] || '2011-01-01'
      ).trim()
      const class_grade = String(
        row.class_grade || row['Class'] || row['class'] || 'Grade 10'
      ).trim()
      const section = String(
        row.section || row['Section'] || 'Section A'
      ).trim()
      const parent_phone = String(
        row.parent_phone || row['phone'] || row['contact_phone'] || row['Parent Phone'] || ''
      ).trim()
      const address = String(row.address || row['Address'] || 'Lahore, Pakistan').trim()
      const previous_school = String(
        row.previous_school || row['Previous School'] || ''
      ).trim()
      const base_monthly_fee = String(row.base_monthly_fee || '14000').trim()
      const discount_type = String(row.discount_type || 'None').trim()
      const discount_amount = String(row.discount_amount || '0').trim()

      const errors: string[] = []
      if (!full_name) errors.push('Student Full Name is required')
      if (!father_name) errors.push('Father Name is required')
      if (!b_form_number) {
        errors.push('B-Form is required')
      } else if (!bFormRegex.test(b_form_number)) {
        errors.push('Invalid NADRA B-Form format (expected XXXXX-XXXXXXX-X)')
      }
      const cleanPhone = parent_phone.replace(/[\s-]/g, '')
      if (!parent_phone) {
        errors.push('Parent phone is required')
      } else if (!phoneRegex.test(cleanPhone)) {
        errors.push('Invalid Pakistani phone (must match +923XXXXXXXXX or 03XXXXXXXXX)')
      }

      return {
        index: idx + 1,
        full_name,
        father_name,
        b_form_number,
        gender,
        dob_yyyy_mm_dd,
        class_grade,
        section,
        parent_phone,
        address,
        previous_school,
        base_monthly_fee,
        discount_type,
        discount_amount,
        errors,
        isValid: errors.length === 0,
      }
    })
    setImportRows(parsed)
  }

  // 3. File Parser (CSV & XLSX Drag & Drop)
  const handleFileUpload = (file: File) => {
    setImportFileName(file.name)
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]
        const rawJson = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet)
        parseAndValidateData(rawJson)
      } catch (err) {
        console.error('File parsing error:', err)
        alert('Could not read the uploaded file. Please ensure it is a valid CSV or XLSX spreadsheet.')
      }
    }
    reader.readAsArrayBuffer(file)
  }

  // 4. Batch Commit Action
  const handleCommitBulkImport = async () => {
    const validRows = importRows.filter((r) => r.isValid)
    if (validRows.length === 0) return

    const newEnrolled: StudentItem[] = validRows.map((row, i) => {
      const classNum = row.class_grade.includes('9') ? '09' : '10'
      const rollNumber = `EAG-${classNum}-${String(students.length + 50 + i).padStart(3, '0')}`
      const admissionNo = `ADM-2026-${String(students.length + 120 + i)}`

      return {
        id: `s-bulk-${Date.now()}-${i}`,
        admission_no: admissionNo,
        roll_no: rollNumber,
        student_name: row.full_name,
        b_form: row.b_form_number,
        dob: row.dob_yyyy_mm_dd || '2011-01-01',
        gender: row.gender,
        father_name: row.father_name,
        father_cnic: '35201-XXXXXXX-X',
        contact_phone: row.parent_phone,
        whatsapp_no: row.parent_phone,
        address: row.address || 'Lahore, Pakistan',
        class_name: row.class_grade,
        section: row.section || 'Section A',
        previous_school: row.previous_school,
        family_id: `FAM-${1000 + students.length + i + 1}`,
        guardian_name: row.father_name,
        status: 'Active',
        admission_date: new Date().toISOString().slice(0, 10),
      }
    })

    const updatedBulk = [...newEnrolled, ...students]
    setStudents(updatedBulk)
    saveStoredStudents(updatedBulk)
    setIsBulkModalOpen(false)
    setImportRows([])
    setImportFileName('')
    setBulkSuccessMessage(
      `🎉 ${newEnrolled.length} Students Successfully Enrolled into Academic Year 2026–2027 with Generated Roll Numbers & Admission Records!`
    )
    setTimeout(() => setBulkSuccessMessage(null), 8000)

    // Sync to Supabase in background
    const supabase = createClient()
    if (supabase) {
      try {
        const { error } = await supabase.from('students').insert(newEnrolled)
        if (error) console.error('Supabase bulk insert error:', error)
      } catch (err) {
        console.error('Cloud bulk insert error:', err)
      }
    }
  }

  // Handle Create Student
  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault()
    const classNum = formData.class_name.replace(/[^0-9]/g, '') || '01'
    const nextRoll = `EAG-${classNum.padStart(2, '0')}-${String(
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
      guardian_name: formData.guardian_name || formData.father_name,
      family_id: formData.family_id || `FAM-${1000 + students.length + 1}`,
      father_cnic: formData.father_cnic,
      contact_phone: formData.contact_phone,
      whatsapp_no: formData.whatsapp_no || formData.contact_phone,
      address: formData.address || 'Lahore, Pakistan',
      class_name: formData.class_name,
      section: formData.section || 'Section A',
      previous_school: formData.previous_school,
      status: 'Active',
      admission_date: new Date().toISOString().slice(0, 10),
    }

    const updated = [newStudent, ...students]
    setStudents(updated)
    saveStoredStudents(updated)
    setIsAddModalOpen(false)

    // Sync to Supabase in background if connected
    const supabase = createClient()
    if (supabase) {
      supabase.from('students').insert([newStudent]).then(({ error }) => {
        if (error) console.error('Supabase student insert error:', error)
      })
    }
    setFormData({
      student_name: '',
      b_form: '',
      dob: '',
      gender: 'Male',
      father_name: '',
      guardian_name: '',
      family_id: '',
      father_cnic: '',
      contact_phone: '',
      whatsapp_no: '',
      class_name: 'Grade 10',
      section: 'Section A',
      address: '',
      previous_school: '',
    })
  }

  // Open Edit Modal
  const handleOpenEdit = (student: StudentItem) => {
    setStudentToEdit({ ...student })
    setIsDetailModalOpen(false)
    setIsEditModalOpen(true)
  }

  // Handle Save Edit
  const handleUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!studentToEdit) return

    const updated = students.map((s) => (s.id === studentToEdit.id ? studentToEdit : s))
    setStudents(updated)
    saveStoredStudents(updated)
    if (selectedStudent?.id === studentToEdit.id) {
      setSelectedStudent(studentToEdit)
    }
    setIsEditModalOpen(false)

    // Sync to Supabase
    const supabase = createClient()
    if (supabase) {
      try {
        const { error } = await supabase
          .from('students')
          .update({
            student_name: studentToEdit.student_name,
            b_form: studentToEdit.b_form,
            dob: studentToEdit.dob,
            gender: studentToEdit.gender,
            father_name: studentToEdit.father_name,
            guardian_name: studentToEdit.guardian_name || studentToEdit.father_name,
            family_id: studentToEdit.family_id,
            father_cnic: studentToEdit.father_cnic,
            contact_phone: studentToEdit.contact_phone,
            whatsapp_no: studentToEdit.whatsapp_no,
            class_name: studentToEdit.class_name,
            section: studentToEdit.section,
            address: studentToEdit.address,
            previous_school: studentToEdit.previous_school,
            status: studentToEdit.status,
          })
          .eq('id', studentToEdit.id)
        if (error) console.error('Supabase update student error:', error)
      } catch (err) {
        console.error('Failed to update student in cloud:', err)
      }
    }
  }

  // Open Delete Confirmation
  const handleOpenDelete = (student: StudentItem) => {
    setStudentToDelete(student)
    setIsDeleteModalOpen(true)
  }

  // Handle Confirm Delete
  const handleConfirmDelete = async () => {
    if (!studentToDelete) return

    const updated = students.filter((s) => s.id !== studentToDelete.id)
    setStudents(updated)
    saveStoredStudents(updated)
    if (selectedStudent?.id === studentToDelete.id) {
      setSelectedStudent(null)
      setIsDetailModalOpen(false)
    }
    setIsDeleteModalOpen(false)

    // Sync to Supabase
    const supabase = createClient()
    if (supabase) {
      try {
        const { error } = await supabase.from('students').delete().eq('id', studentToDelete.id)
        if (error) console.error('Supabase delete student error:', error)
      } catch (err) {
        console.error('Failed to delete student from cloud:', err)
      }
    }
    setStudentToDelete(null)
  }

  if (!canView) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-red-200 shadow-xl p-8 text-center flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shadow-inner">
            <span className="material-symbols-outlined text-[36px]">lock</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-red-600 bg-red-100/60 px-2.5 py-0.5 rounded-full inline-block mx-auto">
              Permission Required
            </span>
            <h1 className="font-domine text-2xl font-bold text-[#001639] mt-2">
              Student Records Access Restricted
            </h1>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Your active designation (<strong className="text-slate-800">{currentUser.designation}</strong>) does not have permission to view Student Admissions & Profiles.
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

          {canCreate ? (
            <>
              <button
                type="button"
                onClick={() => setIsBulkModalOpen(true)}
                className="h-9 px-3.5 bg-[#122b54] hover:bg-[#001639] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-[17px] text-[#f5bc71]">upload_file</span>
                <span>Bulk Import Students</span>
              </button>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="h-9 px-3.5 bg-[#b3272c] hover:bg-[#88131b] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-[17px]">person_add</span>
                <span>+ Quick Admission Form</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                disabled
                className="h-9 px-3.5 bg-slate-100 text-slate-400 border border-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-not-allowed opacity-60"
                title="Action Disabled: Requires 'create_students' permission."
              >
                <span className="material-symbols-outlined text-[17px]">lock</span>
                <span>Bulk Import Students</span>
              </button>
              <button
                type="button"
                disabled
                className="h-9 px-3.5 bg-slate-100 text-slate-400 border border-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-not-allowed opacity-60"
                title="Action Disabled: Requires 'create_students' permission."
              >
                <span className="material-symbols-outlined text-[17px]">lock</span>
                <span>+ Quick Admission Form</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Bulk Success Banner */}
      {bulkSuccessMessage && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-xl text-xs flex items-center justify-between shadow-xs animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-emerald-600 text-[20px]">
              check_circle
            </span>
            <span className="font-semibold">{bulkSuccessMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setBulkSuccessMessage(null)}
            className="text-emerald-700 hover:text-emerald-950 font-bold px-2 py-0.5 rounded cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-auto sm:min-w-[280px]">
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
            <option value="ALL">All Classes (Playgroup - Grade 10)</option>
            {CLASS_PRESETS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="h-9 px-3 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Sections (A - D)</option>
            {SECTION_PRESETS.map((sec) => (
              <option key={sec} value={sec}>
                {sec}
              </option>
            ))}
          </select>

          {(selectedClass !== 'ALL' || selectedSection !== 'ALL' || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setSelectedClass('ALL')
                setSelectedSection('ALL')
                setSearchQuery('')
              }}
              className="h-9 px-2.5 text-xs text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
              title="Reset all filters"
            >
              <span className="material-symbols-outlined text-[15px]">filter_alt_off</span>
              <span>Reset</span>
            </button>
          )}
        </div>

        <div className="text-xs text-slate-500 self-end md:self-auto font-medium">
          Showing <strong>{filteredStudents.length}</strong> of {students.length} enrolled students
        </div>
      </div>

      {/* Student Registry Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-3 text-center w-12">Serial Number</th>
                <th className="py-3 px-3">Student Name</th>
                <th className="py-3 px-3">Class</th>
                <th className="py-3 px-3">Section</th>
                <th className="py-3 px-3">Student ID</th>
                <th className="py-3 px-3">Family ID</th>
                <th className="py-3 px-3">Gaurdian Name</th>
                <th className="py-3 px-3">Contact Number</th>
                <th className="py-3 px-3">Gender</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400">
                    <span className="material-symbols-outlined text-[36px] block text-slate-300 mb-1">
                      school
                    </span>
                    No student records match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s, idx) => {
                  const initials = s.student_name
                    ? s.student_name
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase()
                    : 'ST'

                  const cleanClass = s.class_name
                    ? s.class_name.includes(' - ')
                      ? s.class_name.split(' - ')[0]
                      : s.class_name
                    : 'Grade 10'

                  const cleanSection = s.section || 'Section A'
                  const familyId = s.family_id || `FAM-${1000 + idx + 1}`
                  const guardianName = s.guardian_name || s.father_name || 'N/A'

                  return (
                    <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* 1. Serial Number */}
                      <td className="py-3 px-3 font-mono font-bold text-slate-500 text-center text-xs">
                        {idx + 1}
                      </td>

                      {/* 2. Student Name */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#001639] text-[#f5bc71] flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-2xs">
                            {initials}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-bold text-[#001639] truncate">
                              {s.student_name}
                            </span>
                            {s.b_form && (
                              <span className="text-[10px] text-slate-400 font-mono">
                                B-Form: {s.b_form}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* 3. Class */}
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[11px] font-bold border border-slate-200">
                          {cleanClass}
                        </span>
                      </td>

                      {/* 4. Section */}
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          {cleanSection}
                        </span>
                      </td>

                      {/* 5. Student ID */}
                      <td className="py-3 px-3 font-mono">
                        <div className="flex flex-col">
                          <span className="font-bold text-[#001639] text-xs">
                            {s.roll_no || s.admission_no}
                          </span>
                          {s.admission_no && s.roll_no && s.admission_no !== s.roll_no && (
                            <span className="text-[10px] text-slate-400">
                              {s.admission_no}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 6. Family ID */}
                      <td className="py-3 px-3 font-mono">
                        <span className="inline-flex items-center gap-1 font-bold text-[11px] px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                          <span className="material-symbols-outlined text-[13px] text-amber-600">group</span>
                          {familyId}
                        </span>
                      </td>

                      {/* 7. Gaurdian Name */}
                      <td className="py-3 px-3">
                        <div className="flex flex-col min-w-0">
                          <span className="font-semibold text-slate-800 truncate">
                            {guardianName}
                          </span>
                          {s.father_cnic && (
                            <span className="text-[10px] text-slate-400 font-mono">
                              CNIC: {s.father_cnic}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 8. Contact Number */}
                      <td className="py-3 px-3 font-mono text-slate-700 font-medium">
                        {s.contact_phone}
                      </td>

                      {/* 9. Gender */}
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10.5px] font-semibold ${
                            s.gender === 'Female'
                              ? 'bg-pink-50 text-pink-700 border border-pink-200'
                              : 'bg-sky-50 text-sky-700 border border-sky-200'
                          }`}
                        >
                          {s.gender}
                        </span>
                      </td>

                      {/* 10. Status */}
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                            s.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : s.status === 'Suspended'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              s.status === 'Active'
                                ? 'bg-emerald-500'
                                : s.status === 'Suspended'
                                ? 'bg-amber-500'
                                : 'bg-slate-400'
                            }`}
                          ></span>
                          {s.status}
                        </span>
                      </td>

                      {/* 11. Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedStudent(s)
                              setIsDetailModalOpen(true)
                            }}
                            className="p-1 text-slate-400 hover:text-[#001639] hover:bg-slate-100 rounded transition-colors cursor-pointer"
                            title="View Profile"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              visibility
                            </span>
                          </button>
                          {canEdit ? (
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(s)}
                              className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                              title="Edit Student"
                            >
                              <span className="material-symbols-outlined text-[18px]">
                                edit
                              </span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              disabled
                              className="p-1 text-slate-300 cursor-not-allowed opacity-40"
                              title="Disabled: Requires 'edit_students' permission"
                            >
                              <span className="material-symbols-outlined text-[18px]">
                                lock
                              </span>
                            </button>
                          )}

                          {canDelete ? (
                            <button
                              type="button"
                              onClick={() => handleOpenDelete(s)}
                              className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                              title="Delete Student"
                            >
                              <span className="material-symbols-outlined text-[18px]">
                                delete
                              </span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              disabled
                              className="p-1 text-slate-300 cursor-not-allowed opacity-40"
                              title="Disabled: Requires 'delete_students' permission"
                            >
                              <span className="material-symbols-outlined text-[18px]">
                                lock
                              </span>
                            </button>
                          )}
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
                  )
                })
              )}
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
                Father Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.father_name}
                onChange={(e) =>
                  setFormData({ ...formData, father_name: e.target.value })
                }
                placeholder="e.g. Tariq Mehmood Khan"
                className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Gaurdian Name
              </label>
              <input
                type="text"
                value={formData.guardian_name}
                onChange={(e) =>
                  setFormData({ ...formData, guardian_name: e.target.value })
                }
                placeholder="Defaults to Father Name if blank"
                className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Family ID (Siblings Grouping)
              </label>
              <input
                type="text"
                value={formData.family_id}
                onChange={(e) =>
                  setFormData({ ...formData, family_id: e.target.value })
                }
                placeholder="e.g. FAM-1042 (Auto-generated if left empty)"
                className="w-full h-9 px-3 font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639]"
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
                Emergency Contact Number *
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
                Academic Class / Grade *
              </label>
              <select
                value={
                  formData.class_name.includes(' - ')
                    ? formData.class_name.split(' - ')[0]
                    : formData.class_name
                }
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    class_name: e.target.value,
                  })
                }}
                className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639] font-medium"
              >
                {CLASS_PRESETS.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Section Assigned *
              </label>
              <select
                value={formData.section || 'Section A'}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    section: e.target.value,
                  })
                }}
                className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639] font-medium"
              >
                {SECTION_PRESETS.map((sec) => (
                  <option key={sec} value={sec}>
                    {sec}
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
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="px-2 py-0.5 rounded bg-blue-50 text-[#001639] border border-blue-200 font-bold text-[11px]">
                    Class: {selectedStudent.class_name?.includes(' - ') ? selectedStudent.class_name.split(' - ')[0] : selectedStudent.class_name}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-bold text-[11px]">
                    Section: {selectedStudent.section || (selectedStudent.class_name?.includes(' - ') ? selectedStudent.class_name.split(' - ')[1] : 'Standard')}
                  </span>
                </div>
                <span className="text-[#b3272c] font-bold mt-1 text-[11px]">
                  NADRA B-Form: {selectedStudent.b_form}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl">
              <div>
                <span className="text-slate-400 block font-semibold text-[10px] uppercase">Student ID / Roll No:</span>
                <span className="font-mono font-bold text-[#001639]">
                  {selectedStudent.roll_no || selectedStudent.admission_no}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold text-[10px] uppercase">Family ID:</span>
                <span className="font-mono font-bold text-amber-800">
                  {selectedStudent.family_id || 'FAM-1042'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold text-[10px] uppercase">Gaurdian Name:</span>
                <span className="font-bold text-slate-800">
                  {selectedStudent.guardian_name || selectedStudent.father_name}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold text-[10px] uppercase">Father Name:</span>
                <span className="font-bold text-slate-800">
                  {selectedStudent.father_name}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold text-[10px] uppercase">Father CNIC:</span>
                <span className="font-mono text-slate-800">
                  {selectedStudent.father_cnic}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold text-[10px] uppercase">Contact Phone:</span>
                <span className="font-mono text-slate-800">
                  {selectedStudent.contact_phone}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold text-[10px] uppercase">Date of Birth:</span>
                <span className="text-slate-800">{selectedStudent.dob}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold text-[10px] uppercase">Gender:</span>
                <span className="text-slate-800">{selectedStudent.gender}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold text-[10px] uppercase">Address:</span>
                <span className="text-slate-800 truncate block">{selectedStudent.address}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => {
                  handleOpenDelete(selectedStudent)
                }}
                className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-lg border border-red-200 flex items-center gap-1.5 transition-colors cursor-pointer text-xs"
              >
                <span className="material-symbols-outlined text-[16px]">delete</span>
                <span>Delete Student</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(selectedStudent)}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#001639] font-bold rounded-lg border border-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer text-xs"
                >
                  <span className="material-symbols-outlined text-[16px]">edit</span>
                  <span>Edit Profile</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsDetailModalOpen(false)
                    setIsChallanModalOpen(true)
                  }}
                  className="px-4 py-1.5 bg-[#001639] hover:bg-[#122b54] text-white font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer text-xs"
                >
                  <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                  <span>View Fee Challan</span>
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Student Modal */}
      {studentToEdit && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title={`Edit Student Profile: ${studentToEdit.student_name}`}
          subtitle={`Roll No: ${studentToEdit.roll_no} • ${studentToEdit.admission_no}`}
          maxWidth="3xl"
        >
          <form onSubmit={handleUpdateStudent} className="flex flex-col gap-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Student Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={studentToEdit.student_name}
                  onChange={(e) =>
                    setStudentToEdit({ ...studentToEdit, student_name: e.target.value })
                  }
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
                  value={studentToEdit.b_form}
                  onChange={(e) =>
                    setStudentToEdit({ ...studentToEdit, b_form: e.target.value })
                  }
                  placeholder="35201-XXXXXXX-X"
                  className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639] font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={studentToEdit.dob}
                  onChange={(e) =>
                    setStudentToEdit({ ...studentToEdit, dob: e.target.value })
                  }
                  className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Gender
                </label>
                <select
                  value={studentToEdit.gender}
                  onChange={(e) =>
                    setStudentToEdit({
                      ...studentToEdit,
                      gender: e.target.value as 'Male' | 'Female',
                    })
                  }
                  className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639]"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Father Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={studentToEdit.father_name}
                  onChange={(e) =>
                    setStudentToEdit({ ...studentToEdit, father_name: e.target.value })
                  }
                  className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Gaurdian Name
                </label>
                <input
                  type="text"
                  value={studentToEdit.guardian_name || ''}
                  onChange={(e) =>
                    setStudentToEdit({ ...studentToEdit, guardian_name: e.target.value })
                  }
                  placeholder="Defaults to Father Name if blank"
                  className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Family ID (Siblings Grouping)
                </label>
                <input
                  type="text"
                  value={studentToEdit.family_id || ''}
                  onChange={(e) =>
                    setStudentToEdit({ ...studentToEdit, family_id: e.target.value })
                  }
                  placeholder="e.g. FAM-1042"
                  className="w-full h-9 px-3 font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Father CNIC (13 digits) *
                </label>
                <input
                  type="text"
                  required
                  value={studentToEdit.father_cnic}
                  onChange={(e) =>
                    setStudentToEdit({ ...studentToEdit, father_cnic: e.target.value })
                  }
                  placeholder="35201-XXXXXXX-X"
                  className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639] font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Contact Mobile Phone *
                </label>
                <input
                  type="text"
                  required
                  value={studentToEdit.contact_phone}
                  onChange={(e) =>
                    setStudentToEdit({ ...studentToEdit, contact_phone: e.target.value })
                  }
                  placeholder="+92 3XX XXXXXXX"
                  className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  WhatsApp Number
                </label>
                <input
                  type="text"
                  value={studentToEdit.whatsapp_no}
                  onChange={(e) =>
                    setStudentToEdit({ ...studentToEdit, whatsapp_no: e.target.value })
                  }
                  placeholder="+92 3XX XXXXXXX"
                  className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Academic Class / Grade *
                </label>
                <select
                  value={
                    (studentToEdit.class_name || '').includes(' - ')
                      ? (studentToEdit.class_name || '').split(' - ')[0]
                      : studentToEdit.class_name || 'Grade 10'
                  }
                  onChange={(e) => {
                    setStudentToEdit({
                      ...studentToEdit,
                      class_name: e.target.value,
                    })
                  }}
                  className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639] font-medium"
                >
                  {CLASS_PRESETS.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Section Assigned *
                </label>
                <select
                  value={studentToEdit.section || 'Section A'}
                  onChange={(e) => {
                    setStudentToEdit({
                      ...studentToEdit,
                      section: e.target.value,
                    })
                  }}
                  className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639] font-medium"
                >
                  {SECTION_PRESETS.map((sec) => (
                    <option key={sec} value={sec}>
                      {sec}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Enrollment Status
                </label>
                <select
                  value={studentToEdit.status}
                  onChange={(e) =>
                    setStudentToEdit({
                      ...studentToEdit,
                      status: e.target.value as 'Active' | 'Suspended' | 'Withdrawn' | 'Alumni',
                    })
                  }
                  className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639]"
                >
                  <option value="Active">Active</option>
                  <option value="Suspended">Suspended</option>
                  <option value="Withdrawn">Withdrawn</option>
                  <option value="Alumni">Alumni</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Residential Address
              </label>
              <input
                type="text"
                value={studentToEdit.address}
                onChange={(e) =>
                  setStudentToEdit({ ...studentToEdit, address: e.target.value })
                }
                className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Previous School Attended
              </label>
              <input
                type="text"
                value={studentToEdit.previous_school || ''}
                onChange={(e) =>
                  setStudentToEdit({ ...studentToEdit, previous_school: e.target.value })
                }
                className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639]"
              />
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
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {studentToDelete && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Delete Student Record"
          subtitle="Are you sure you want to permanently remove this student?"
          maxWidth="md"
        >
          <div className="flex flex-col gap-4 text-xs">
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-800 flex items-start gap-3">
              <span className="material-symbols-outlined text-red-600 text-[24px] flex-shrink-0">
                warning
              </span>
              <div>
                <p className="font-bold text-sm">Action cannot be undone</p>
                <p className="text-slate-600 mt-1">
                  You are about to delete <strong>{studentToDelete.student_name}</strong> (Roll No: <strong>{studentToDelete.roll_no}</strong>, B-Form: {studentToDelete.b_form}). All associated records will be purged.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">delete_forever</span>
                <span>Confirm & Delete</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Bulk Student Admission Modal */}
      <Modal
        isOpen={isBulkModalOpen}
        onClose={() => {
          setIsBulkModalOpen(false)
          setImportRows([])
          setImportFileName('')
        }}
        title="Bulk Student Admission Engine & NADRA Verifier"
        subtitle="Batch-onboard cohorts via CSV / Excel (.xlsx) with automated NADRA B-Form validation and roll-number generation."
        maxWidth="5xl"
      >
        <div className="flex flex-col gap-4 text-xs">
          {/* Top Bar with Guidelines & Template Download */}
          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#122b54] text-white flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[18px] text-[#f5bc71]">
                  description
                </span>
              </div>
              <div>
                <p className="font-semibold text-slate-800">Standard Intake Roster Format</p>
                <p className="text-[11px] text-slate-500">
                  Includes mandatory NADRA B-Form (`XXXXX-XXXXXXX-X`), Parent Mobile (`+92...`), Class, and Concession columns.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDownloadSampleTemplate}
              className="px-3.5 py-1.5 bg-white border border-slate-200 text-[#001639] font-bold text-xs rounded-lg hover:bg-slate-100 flex items-center gap-1.5 shadow-2xs cursor-pointer flex-shrink-0"
            >
              <span className="material-symbols-outlined text-[16px] text-[#b3272c]">
                file_download
              </span>
              <span>Download Sample CSV Template</span>
            </button>
          </div>

          {/* File Dropzone */}
          <div
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault()
              setIsDragging(false)
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFileUpload(e.dataTransfer.files[0])
              }
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-[#001639] bg-blue-50/50 scale-[0.99]'
                : importFileName
                ? 'border-emerald-300 bg-emerald-50/30'
                : 'border-slate-300 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-400'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0])
                }
              }}
              className="hidden"
            />

            <div className="flex flex-col items-center justify-center gap-2">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  importFileName ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                }`}
              >
                <span className="material-symbols-outlined text-[26px]">
                  {importFileName ? 'task' : 'cloud_upload'}
                </span>
              </div>

              {importFileName ? (
                <div>
                  <p className="font-bold text-slate-800 text-sm">{importFileName}</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    File uploaded & parsed. Click to upload a different sheet or drop a new file.
                  </p>
                </div>
              ) : (
                <div>
                  <p className="font-bold text-slate-700 text-sm">
                    Drag & Drop your .csv or .xlsx file here
                  </p>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    or click to browse your computer files
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Pre-Import Preview Grid */}
          {importRows.length > 0 && (
            <div className="flex flex-col gap-2.5">
              {/* Validation Summary Bar */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-100 border border-slate-200">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-800">
                    Parsed Cohort: {importRows.length} Rows
                  </span>
                  <span className="text-slate-300">|</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded text-[11px]">
                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                    {importRows.filter((r) => r.isValid).length} Ready for Enrollment
                  </span>
                  {importRows.filter((r) => !r.isValid).length > 0 && (
                    <span className="inline-flex items-center gap-1 font-semibold text-red-700 bg-red-100/70 px-2 py-0.5 rounded text-[11px]">
                      <span className="material-symbols-outlined text-[14px]">error</span>
                      {importRows.filter((r) => !r.isValid).length} Flagged Errors
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setImportRows([])
                    setImportFileName('')
                  }}
                  className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
                >
                  Clear Sheet
                </button>
              </div>

              {/* Table */}
              <div className="max-h-72 overflow-y-auto border border-slate-200 rounded-lg shadow-inner">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold tracking-wider sticky top-0 border-b border-slate-200 z-10">
                    <tr>
                      <th className="py-2.5 px-3">#</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Student Name</th>
                      <th className="py-2.5 px-3">Father Name</th>
                      <th className="py-2.5 px-3">NADRA B-Form</th>
                      <th className="py-2.5 px-3">Class & Section</th>
                      <th className="py-2.5 px-3">Parent Phone</th>
                      <th className="py-2.5 px-3">Concession</th>
                      <th className="py-2.5 px-3">Validation Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {importRows.map((row) => (
                      <tr
                        key={row.index}
                        className={
                          row.isValid
                            ? 'hover:bg-slate-50/80 transition-colors'
                            : 'bg-red-50/40 hover:bg-red-50/70 transition-colors'
                        }
                      >
                        <td className="py-2 px-3 font-mono text-slate-400 text-[11px]">
                          {row.index}
                        </td>
                        <td className="py-2 px-3">
                          {row.isValid ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              <span className="material-symbols-outlined text-[12px]">check</span>
                              Valid
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800">
                              <span className="material-symbols-outlined text-[12px]">warning</span>
                              Error ({row.errors.length})
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-3 font-semibold text-slate-800">
                          {row.full_name || <span className="text-red-500 italic">Missing</span>}
                        </td>
                        <td className="py-2 px-3 text-slate-600">
                          {row.father_name || <span className="text-red-500 italic">Missing</span>}
                        </td>
                        <td className="py-2 px-3 font-mono">
                          <span
                            className={
                              bFormRegex.test(row.b_form_number)
                                ? 'text-slate-700'
                                : 'text-red-600 font-bold bg-red-100 px-1 py-0.5 rounded'
                            }
                          >
                            {row.b_form_number || 'Empty'}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-slate-700">
                          {row.class_grade} - {row.section}
                        </td>
                        <td className="py-2 px-3 font-mono">
                          <span
                            className={
                              phoneRegex.test(row.parent_phone.replace(/[\s-]/g, ''))
                                ? 'text-slate-700'
                                : 'text-red-600 font-bold bg-red-100 px-1 py-0.5 rounded'
                            }
                          >
                            {row.parent_phone || 'Empty'}
                          </span>
                        </td>
                        <td className="py-2 px-3">
                          <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[10px]">
                            {row.discount_type !== 'None'
                              ? `${row.discount_type} (-${row.discount_amount})`
                              : 'Standard'}
                          </span>
                        </td>
                        <td className="py-2 px-3">
                          {row.isValid ? (
                            <span className="text-[11px] text-emerald-600 flex items-center gap-1 font-medium">
                              <span className="material-symbols-outlined text-[14px]">verified</span>
                              Ready to Enroll
                            </span>
                          ) : (
                            <div className="flex flex-col gap-0.5">
                              {row.errors.map((err, eIdx) => (
                                <span
                                  key={eIdx}
                                  className="text-[10px] text-red-600 font-medium flex items-center gap-1"
                                >
                                  • {err}
                                </span>
                              ))}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Modal Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <div className="text-xs text-slate-500">
              {importRows.length > 0 && (
                <span>
                  Only valid rows will be committed. Invalid rows will be ignored.
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsBulkModalOpen(false)
                  setImportRows([])
                  setImportFileName('')
                }}
                className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 cursor-pointer font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCommitBulkImport}
                disabled={importRows.filter((r) => r.isValid).length === 0}
                className={`px-5 py-2 font-bold rounded-lg shadow-sm flex items-center gap-2 cursor-pointer transition-all ${
                  importRows.filter((r) => r.isValid).length > 0
                    ? 'bg-[#001639] hover:bg-[#122b54] text-white'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span className="material-symbols-outlined text-[18px] text-[#f5bc71]">
                  group_add
                </span>
                <span>
                  Enroll {importRows.filter((r) => r.isValid).length} Verified Students
                </span>
              </button>
            </div>
          </div>
        </div>
      </Modal>

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

