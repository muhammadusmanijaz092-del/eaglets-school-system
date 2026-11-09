export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface ClassItem {
  id: string
  name: string
  section: string
  grade_level: number
  wing: string
  stream: string
  monthly_tuition_pkr: number
  lab_charges_pkr: number
  capacity: number
  created_at?: string
  updated_at?: string
}

export interface FacultyItem {
  id: string
  emp_id: string
  full_name: string
  cnic: string
  phone: string
  email?: string
  address?: string
  qualification: string
  designation: string
  department: string
  assigned_classes: string[]
  assigned_subjects: string[]
  joining_date: string
  basic_salary_pkr: number
  allowances_pkr: number
  payment_mode: 'Cash' | 'Bank Transfer' | 'Raast / Mobile Wallet'
  bank_name?: string
  account_number?: string
  status: 'Active' | 'On Leave' | 'Resigned'
}

export interface StudentItem {
  id: string
  admission_no: string
  roll_no: string
  student_name: string
  b_form: string
  dob: string
  gender: 'Male' | 'Female'
  father_name: string
  father_cnic: string
  contact_phone: string
  whatsapp_no?: string
  address: string
  class_id?: string
  class_name?: string
  section: string
  previous_school?: string
  photo_url?: string
  status: 'Active' | 'Suspended' | 'Withdrawn' | 'Alumni'
  admission_date: string
}

export interface FeeInvoiceItem {
  id: string
  invoice_no: string
  challan_no: string
  student_id: string
  student_name?: string
  roll_no?: string
  class_name?: string
  billing_month: string
  issue_date: string
  due_date: string
  expiry_date: string
  tuition_amount_pkr: number
  lab_amount_pkr: number
  exam_amount_pkr: number
  development_amount_pkr: number
  concession_amount_pkr: number
  arrears_amount_pkr: number
  total_due_pkr: number
  late_surcharge_pkr: number
  total_after_due_date_pkr: number
  paid_amount_pkr: number
  status: 'Unpaid' | 'Paid' | 'Partial' | 'Overdue'
}

export interface FeePaymentItem {
  id: string
  invoice_id?: string
  invoice_no?: string
  student_id: string
  student_name: string
  roll_no: string
  class_name: string
  receipt_no: string
  amount_paid_pkr: number
  payment_channel: 'Direct Cash Counter' | 'Bank Challan (HBL / Meezan)' | 'JazzCash / Mobile'
  payment_mode: string
  transaction_ref?: string
  bank_name?: string
  sender_mobile?: string
  proof_attachment_url?: string
  received_by: string
  payment_date: string
  reconciliation_status: 'Verified' | 'Pending Reconcile' | 'Rejected'
  remarks?: string
}

export interface AttendanceRecord {
  id: string
  attendance_date: string
  entity_type: 'Student' | 'Faculty'
  entity_id: string
  entity_name: string
  identifier: string // Roll No or Emp ID
  class_name?: string
  section?: string
  status: 'Present' | 'Absent' | 'Late' | 'Leave'
  time_in?: string
  remarks?: string
}

export interface ExamResultRow {
  id: string
  subject_name: string
  max_theory: number
  max_practical: number
  total_max_marks: number
  passing_marks: number
  obt_theory: number
  obt_practical: number
  obt_total_marks: number
  percentage: number
  letter_grade: string
  class_rank?: string
  teacher_remarks?: string
}

export interface DailyDiaryItem {
  id: string
  class_name: string
  section: string
  subject_name: string
  teacher_name: string
  diary_date: string
  classwork: string
  homework: string
  teacher_notes?: string
}

export interface TimetableSlot {
  id: string
  day_of_week: string
  period_number: number
  start_time: string
  end_time: string
  subject_name: string
  teacher_name: string
  room_number: string
  class_name: string
}

