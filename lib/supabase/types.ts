export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type AdminRole = 'SUPER_ADMIN' | 'CAMPUS_ADMIN' | 'ACCOUNTS_MANAGER' | 'EXAM_CONTROLLER'

export type LicenseTier = 'Enterprise Network' | 'Pro Academic' | 'Standard Campus' | 'Pilot Trial'

export interface InstitutionTenant {
  id: string
  name: string
  campus_code: string
  city: string
  region: string
  subdomain: string
  primary_admin_name: string
  primary_admin_email: string
  primary_admin_phone: string
  admin_avatar?: string
  student_count: number
  faculty_count: number
  capacity: number
  license_tier: LicenseTier
  license_status: 'Active' | 'Expiring' | 'Suspended' | 'Provisioning'
  renewal_date: string
  bise_affiliation: string
  created_at: string
  is_maintenance_mode?: boolean
  security_key_id?: string
}

export interface AdminUser {
  id: string
  full_name: string
  email: string
  username: string
  role: AdminRole
  campus: string // 'Main Boys Campus' | 'Girls Junior Campus' | 'Gulberg Model Wing' | 'All Campuses'
  is_active: boolean
  two_factor_enabled: boolean
  force_password_reset: boolean
  last_login?: string
  created_at: string
}

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
  campus?: string
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
  due_date: string // e.g. 10th of billing month
  expiry_date: string
  tuition_amount_pkr: number // Base Tuition Fee
  discount_type?: 'None' | 'Kinship' | 'Teacher Child' | 'Merit' | 'Orphan' | 'Need-based'
  concession_amount_pkr: number // Scholarship_or_Discount_Amount
  adjusted_tuition_pkr?: number // Tuition - Concession
  lab_amount_pkr: number
  exam_amount_pkr: number
  development_amount_pkr: number
  library_amount_pkr?: number
  additional_charges_pkr?: number // Lab + Exam + Dev + Library
  arrears_amount_pkr: number // Prior Unpaid Arrears
  total_before_due_date_pkr?: number // Subtotal + Prior Arrears
  total_due_pkr: number // Total Payable Before 10th
  late_surcharge_pkr: number // Surcharge applied if post-10th
  total_after_due_date_pkr: number // Subtotal + Arrears + Surcharge
  paid_amount_pkr: number
  net_balance_pkr?: number // Total Payable - Paid Amount
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

