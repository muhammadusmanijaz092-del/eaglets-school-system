'use client'

import React, { useState } from 'react'
import HeaderFilterBar from '@/components/dashboard/HeaderFilterBar'
import QuickActionsGrid from '@/components/dashboard/QuickActionsGrid'
import DailySummaryStrip from '@/components/dashboard/DailySummaryStrip'
import AnalyticsOverviewGrid from '@/components/dashboard/AnalyticsOverviewGrid'
import DashboardCharts from '@/components/dashboard/DashboardCharts'
import OperationalAcademicCards from '@/components/dashboard/OperationalAcademicCards'
import AwardsHighlights from '@/components/dashboard/AwardsHighlights'
import PriorityAttentionTable from '@/components/dashboard/PriorityAttentionTable'
import BottomAdmissionsTasks from '@/components/dashboard/BottomAdmissionsTasks'
import ClassesTodayTable from '@/components/dashboard/ClassesTodayTable'
import DashboardModals from '@/components/dashboard/DashboardModals'
import {
  TimeFilter,
  ModalType,
  StudentRecord,
  StaffRecord,
  ExpenseRecord,
  SmsRecord,
} from '@/components/dashboard/types'

export default function DashboardOverviewPage() {
  const [activeTimeFilter, setActiveTimeFilter] = useState<TimeFilter>('today')
  const [activeModal, setActiveModal] = useState<ModalType>(null)

  // Students state
  const [students, setStudents] = useState<StudentRecord[]>([
    {
      id: '121',
      name: 'Muhammad Ahmed',
      roll_no: '121',
      class_name: 'Play Group',
      section: 'A',
      gender: 'Male',
      admission_date: '23 Nov 2026',
      guardian_name: 'Tariq Ahmed',
      guardian_phone: '0300-8472910',
      dues_pkr: 1700,
      attendance_status: 'Not Marked',
      status: 'Active',
    },
  ])

  // Staff state
  const [staff, setStaff] = useState<StaffRecord[]>([
    {
      id: 'staff-01',
      name: 'Anum Zaheer',
      emp_id: 'EAG-FAC-001',
      designation: 'Primary Teacher',
      department: 'None',
      gender: 'Female',
      monthly_salary: 26000,
      attendance_status: 'Not Marked',
    },
  ])

  // Financial state
  const [incomeToday, setIncomeToday] = useState(0)
  const [incomeMonth, setIncomeMonth] = useState(0)
  const [expenseToday, setExpenseToday] = useState(0)
  const [expenseMonth, setExpenseMonth] = useState(0)
  const [collectedToday, setCollectedToday] = useState(0)
  const [recoveredMonth, setRecoveredMonth] = useState(1000)
  const [stillDueMonth, setStillDueMonth] = useState(1700)
  const [unpaidFees, setUnpaidFees] = useState(1700)
  const [paidAmount, setPaidAmount] = useState(0)

  // Expenses log
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([])

  // SMS log
  const [smsLogs, setSmsLogs] = useState<SmsRecord[]>([])

  // Derived indicators
  const studentsPresentCount = students.filter((s) => s.attendance_status === 'Present').length
  const isAttendanceMarked = students.some((s) => s.attendance_status !== 'Not Marked')

  const staffPresentCount = staff.filter(
    (s) => s.attendance_status === 'Present' || s.attendance_status === 'Late'
  ).length
  const staffLateCount = staff.filter((s) => s.attendance_status === 'Late').length
  const staffAbsentCount = staff.filter((s) => s.attendance_status === 'Absent').length
  const isStaffAttendanceMarked = staff.some((s) => s.attendance_status !== 'Not Marked')

  const balanceToday = incomeToday - expenseToday
  const balanceMonth = incomeMonth - expenseMonth

  // Mutation Handlers
  const handleAddStudent = (newStudent: Partial<StudentRecord>) => {
    const student: StudentRecord = {
      id: newStudent.id || `st-${Date.now()}`,
      name: newStudent.name || 'New Student',
      roll_no: newStudent.roll_no || String(Math.floor(100 + Math.random() * 900)),
      class_name: newStudent.class_name || 'Play Group',
      section: newStudent.section || 'A',
      gender: newStudent.gender || 'Male',
      admission_date: newStudent.admission_date || '23 Nov 2026',
      guardian_name: newStudent.guardian_name || 'Parent / Guardian',
      guardian_phone: newStudent.guardian_phone || '0300-1234567',
      dues_pkr: newStudent.dues_pkr || 2700,
      attendance_status: 'Not Marked',
      status: 'Active',
    }
    setStudents((prev) => [student, ...prev])
  }

  const handleSaveStudentAttendance = (studentId: string, status: 'Present' | 'Absent' | 'Leave') => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, attendance_status: status } : s))
    )
  }

  const handleSaveStaffAttendance = (
    staffId: string,
    status: 'Present' | 'Absent' | 'Late' | 'Leave'
  ) => {
    setStaff((prev) =>
      prev.map((s) => (s.id === staffId ? { ...s, attendance_status: status } : s))
    )
  }

  const handleRecordFeePayment = (amount: number, studentId: string) => {
    setCollectedToday((prev) => prev + amount)
    setIncomeToday((prev) => prev + amount)
    setIncomeMonth((prev) => prev + amount)
    setPaidAmount((prev) => prev + amount)
    setRecoveredMonth((prev) => prev + amount)
    setStillDueMonth((prev) => Math.max(0, prev - amount))
    setUnpaidFees((prev) => Math.max(0, prev - amount))

    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId ? { ...s, dues_pkr: Math.max(0, s.dues_pkr - amount) } : s
      )
    )
  }

  const handleAddExpense = (exp: Partial<ExpenseRecord>) => {
    const amount = exp.amount_pkr || 0
    setExpenseToday((prev) => prev + amount)
    setExpenseMonth((prev) => prev + amount)
    const newRecord: ExpenseRecord = {
      id: exp.id || `exp-${Date.now()}`,
      title: exp.title || 'Expense',
      category: exp.category || 'General',
      amount_pkr: amount,
      date: exp.date || 'Today',
      payment_mode: exp.payment_mode || 'Cash',
    }
    setExpenses((prev) => [newRecord, ...prev])
  }

  const handleSendSms = (sms: Partial<SmsRecord>) => {
    const record: SmsRecord = {
      id: sms.id || `sms-${Date.now()}`,
      recipient_type: sms.recipient_type || 'Parent',
      recipient_name: sms.recipient_name || 'Parent',
      phone: sms.phone || '0300-XXXXXXX',
      message: sms.message || '',
      status: 'Delivered',
      timestamp: sms.timestamp || 'Just now',
    }
    setSmsLogs((prev) => [record, ...prev])
  }

  return (
    <div className="px-3 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col gap-5 min-w-0">
      {/* 1. Top Header & Filter Bar */}
      <HeaderFilterBar
        activeFilter={activeTimeFilter}
        onFilterChange={setActiveTimeFilter}
      />

      {/* 2. Quick Action Buttons Grid (17 Interactive Buttons) */}
      <QuickActionsGrid onOpenModal={setActiveModal} />

      {/* 3. Consolidated Non-Redundant Primary KPI Cards (Campus Real-time Metrics) */}
      <DailySummaryStrip
        studentsPresentCount={studentsPresentCount}
        totalStudents={students.length}
        boysCount={students.filter((s) => s.gender === 'Male').length}
        girlsCount={students.filter((s) => s.gender === 'Female').length}
        staffPresentCount={staffPresentCount}
        totalStaff={staff.length}
        staffLateCount={staffLateCount}
        staffAbsentCount={staffAbsentCount}
        collectedToday={collectedToday}
        recoveredMonth={recoveredMonth}
        balanceToday={balanceToday}
        unpaidFees={unpaidFees}
        unpaidInvoicesCount={1}
        unpaidStudentsCount={1}
        onCardClick={(target) => {
          if (target === 'student_attendance') setActiveModal('student_attendance')
          if (target === 'staff_attendance') setActiveModal('staff_attendance')
          if (target === 'fee_payment') setActiveModal('fee_payment')
          if (target === 'details_unpaid_age') setActiveModal('details_unpaid_age')
        }}
      />

      {/* 4. Analytics & Overview Widgets Grid (A, B, C, D, E) */}
      <AnalyticsOverviewGrid
        incomeToday={incomeToday}
        expenseToday={expenseToday}
        incomeMonth={incomeMonth}
        expenseMonth={expenseMonth}
        activeStudents={students.length}
        boysCount={students.filter((s) => s.gender === 'Male').length}
        girlsCount={students.filter((s) => s.gender === 'Female').length}
        notSetCount={students.filter((s) => s.gender === 'Not set').length}
        presentStudentsToday={studentsPresentCount}
        parentsCount={1}
        staffCount={staff.length}
        staffMaleCount={staff.filter((s) => s.gender === 'Male').length}
        staffFemaleCount={staff.filter((s) => s.gender === 'Female').length}
        recoveredMonth={recoveredMonth}
        stillDueMonth={stillDueMonth}
        collectedAnyMonth={0}
        thisMonthUnpaid={stillDueMonth}
        previousArrears={0}
        totalReceivable={stillDueMonth}
        classesNotMarkedCount={isAttendanceMarked ? 0 : 1}
        studentsInNotMarkedClasses={isAttendanceMarked ? 0 : 1}
        staffNotMarkedCount={isStaffAttendanceMarked ? 0 : 1}
        totalStaff={staff.length}
        isAttendanceMarked={isAttendanceMarked}
        onMarkAttendance={() => setActiveModal('student_attendance')}
        onMarkStaffAttendance={() => setActiveModal('staff_attendance')}
      />

      {/* 4.F Charts Section (Rendered with Recharts) */}
      <DashboardCharts
        onViewAllFees={() => setActiveModal('view_all_chart_fees')}
        onViewAllAdmissions={() => setActiveModal('view_all_chart_admissions')}
      />

      {/* 5. Operational & Academic Cards (10 Cards) */}
      <OperationalAcademicCards
        onOpenModal={setActiveModal}
        isAttendanceMarked={isAttendanceMarked}
        isStaffAttendanceMarked={isStaffAttendanceMarked}
      />

      {/* 6. Awards & Highlights (October 2026) */}
      <AwardsHighlights
        onStudentClick={() => setActiveModal('student_info')}
      />

      {/* 7. Priority Attention Action Table */}
      <PriorityAttentionTable
        isAttendanceMarked={isAttendanceMarked}
        isStaffAttendanceMarked={isStaffAttendanceMarked}
        onOpenAttendanceModal={() => setActiveModal('student_attendance')}
        onOpenStaffAttendanceModal={() => setActiveModal('staff_attendance')}
        onActionClick={(issue) => {
          setActiveModal('details_attendance')
        }}
      />

      {/* 8. Bottom Row: Latest Admissions & Tasks Overview */}
      <BottomAdmissionsTasks
        students={students}
        onViewAllAdmissions={() => setActiveModal('details_admissions')}
        onViewAllTasks={() => setActiveModal('view_all_tasks')}
        onStudentClick={() => setActiveModal('student_info')}
      />

      {/* 9. Classes Today Data Table */}
      <ClassesTodayTable
        isAttendanceMarked={isAttendanceMarked}
        paidAmount={paidAmount}
        onMarkAttendanceClick={() => setActiveModal('student_attendance')}
      />

      {/* Comprehensive Modals & Drawers Suite */}
      <DashboardModals
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
        students={students}
        staff={staff}
        expenses={expenses}
        smsLogs={smsLogs}
        onAddStudent={handleAddStudent}
        onSaveStudentAttendance={handleSaveStudentAttendance}
        onSaveStaffAttendance={handleSaveStaffAttendance}
        onRecordFeePayment={handleRecordFeePayment}
        onAddExpense={handleAddExpense}
        onSendSms={handleSendSms}
      />
    </div>
  )
}
