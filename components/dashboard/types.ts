export type TimeFilter = 'today' | 'week' | 'month' | 'session' | 'custom'

export type ModalType =
  | 'admit_student'
  | 'student_info'
  | 'student_attendance'
  | 'staff_attendance'
  | 'fee_payment'
  | 'generate_monthly_fee'
  | 'print_fee_slips'
  | 'add_expense'
  | 'balance_sheet'
  | 'manage_staff'
  | 'parent_account_requests'
  | 'sms_to_parents'
  | 'sms_to_staff'
  | 'sent_sms_history'
  | 'noticeboard'
  | 'school_settings'
  | 'daily_homework_diary'
  // Operational details modals
  | 'details_attendance'
  | 'details_results'
  | 'details_staff'
  | 'details_syllabus'
  | 'details_birthdays'
  | 'details_admissions'
  | 'details_staff_att'
  | 'details_funnel'
  | 'details_unpaid_age'
  | 'details_parents_families'
  | 'view_all_chart_fees'
  | 'view_all_chart_admissions'
  | 'view_all_tasks'
  | null

export interface StudentRecord {
  id: string
  name: string
  roll_no: string
  class_name: string
  section: string
  gender: 'Male' | 'Female' | 'Not set'
  admission_date: string
  guardian_name: string
  guardian_phone: string
  dues_pkr: number
  attendance_status: 'Not Marked' | 'Present' | 'Absent' | 'Leave'
  status: 'Active' | 'Withdrawn' | 'Deactivated'
}

export interface StaffRecord {
  id: string
  name: string
  emp_id: string
  designation: string
  department: string
  gender: 'Male' | 'Female'
  monthly_salary: number
  attendance_status: 'Not Marked' | 'Present' | 'Absent' | 'Late' | 'Leave'
}

export interface ExpenseRecord {
  id: string
  title: string
  category: string
  amount_pkr: number
  date: string
  payment_mode: string
}

export interface SmsRecord {
  id: string
  recipient_type: 'Parent' | 'Staff'
  recipient_name: string
  phone: string
  message: string
  status: 'Delivered' | 'Pending' | 'Failed'
  timestamp: string
}
