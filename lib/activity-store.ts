'use client'

export interface StaffActionItem {
  id: string
  timestamp: string
  type: 'added' | 'changed' | 'deleted'
  description: string
  entity?: string
}

export interface StaffActivityRecord {
  id: string
  name: string
  role: string
  roleCategory: 'Admin' | 'Principal' | 'Teacher' | 'Accounts' | 'Coordinator' | 'Other'
  department: string
  initials: string
  avatarBg: string
  isSignedInNow: boolean
  sessionStatus: string
  addedCount: number
  changedCount: number
  deletedCount: number
  activities: StaffActionItem[]
}

export const INITIAL_STAFF_ACTIVITIES: StaffActivityRecord[] = [
  {
    id: 'staff-01',
    name: 'M. Tariq Alvi',
    role: 'Principal & Chief Administrator',
    roleCategory: 'Admin',
    department: 'Administration',
    initials: 'TA',
    avatarBg: 'bg-[#b3272c] text-white',
    isSignedInNow: true,
    sessionStatus: 'Signed in now',
    addedCount: 2,
    changedCount: 5,
    deletedCount: 0,
    activities: [
      {
        id: 'act-1',
        timestamp: '08:15 AM',
        type: 'changed',
        description: 'Verified November 2026 examination date sheet for Matric Science cohorts',
        entity: 'Examinations',
      },
      {
        id: 'act-2',
        timestamp: '09:30 AM',
        type: 'added',
        description: 'Created winter uniform advisory circular on the School Noticeboard',
        entity: 'Noticeboard',
      },
      {
        id: 'act-3',
        timestamp: '11:10 AM',
        type: 'changed',
        description: 'Approved scholarship discount (15%) for Roll #121 Muhammad Ahmed',
        entity: 'Fee Waiver',
      },
      {
        id: 'act-4',
        timestamp: '01:25 PM',
        type: 'added',
        description: 'Dispatched broadcast SMS to all Grade 10 parents regarding evening coaching',
        entity: 'SMS Gateway',
      },
      {
        id: 'act-5',
        timestamp: '02:40 PM',
        type: 'changed',
        description: 'Updated campus operational timings for winter session in General Settings',
        entity: 'Settings',
      },
    ],
  },
  {
    id: 'staff-02',
    name: 'Engr. Masood Ahmad',
    role: 'Vice Principal & Academic Head',
    roleCategory: 'Principal',
    department: 'Academics',
    initials: 'MA',
    avatarBg: 'bg-[#122b54] text-white',
    isSignedInNow: true,
    sessionStatus: 'Signed in now',
    addedCount: 1,
    changedCount: 3,
    deletedCount: 0,
    activities: [
      {
        id: 'act-6',
        timestamp: '08:45 AM',
        type: 'changed',
        description: 'Revised 8-period weekly master timetable for Senior Cambridge section',
        entity: 'Timetable',
      },
      {
        id: 'act-7',
        timestamp: '10:00 AM',
        type: 'added',
        description: 'Uploaded Term 1 Mathematics Scheme of Study PDF for Grade 9 & 10',
        entity: 'Syllabus',
      },
      {
        id: 'act-8',
        timestamp: '01:50 PM',
        type: 'changed',
        description: 'Assigned substitution period in Grade 8-C for Chemistry laboratory',
        entity: 'Faculty Pacing',
      },
    ],
  },
  {
    id: 'staff-03',
    name: 'Anum Zaheer',
    role: 'Primary Teacher & Class Incharge',
    roleCategory: 'Teacher',
    department: 'Primary Wing',
    initials: 'AZ',
    avatarBg: 'bg-emerald-700 text-white',
    isSignedInNow: true,
    sessionStatus: 'Signed in now',
    addedCount: 3,
    changedCount: 2,
    deletedCount: 0,
    activities: [
      {
        id: 'act-9',
        timestamp: '08:20 AM',
        type: 'changed',
        description: 'Marked morning attendance register for Play Group - Section A (100% Present)',
        entity: 'Attendance',
      },
      {
        id: 'act-10',
        timestamp: '11:45 AM',
        type: 'added',
        description: 'Published English phonics classwork notes in Daily Homework Diary',
        entity: 'Daily Diary',
      },
      {
        id: 'act-11',
        timestamp: '12:30 PM',
        type: 'added',
        description: 'Added weekend craft activity instructions for Play Group parents',
        entity: 'Daily Diary',
      },
      {
        id: 'act-12',
        timestamp: '02:15 PM',
        type: 'added',
        description: 'Submitted student progress observation remarks for November assessment',
        entity: 'Assessments',
      },
    ],
  },
  {
    id: 'staff-04',
    name: 'Tariq Mehmood',
    role: 'Accounts Officer & Senior Cashier',
    roleCategory: 'Accounts',
    department: 'Finance & Accounts',
    initials: 'TM',
    avatarBg: 'bg-amber-700 text-white',
    isSignedInNow: true,
    sessionStatus: 'Signed in now',
    addedCount: 4,
    changedCount: 6,
    deletedCount: 1,
    activities: [
      {
        id: 'act-13',
        timestamp: '09:05 AM',
        type: 'added',
        description: 'Generated batch monthly fee challans (Series EAG-2026-001) for cohort',
        entity: 'Fee Invoicing',
      },
      {
        id: 'act-14',
        timestamp: '10:15 AM',
        type: 'changed',
        description: 'Reconciled Meezan Bank Islamic fee deposit batch (Rs 84,500 credited)',
        entity: 'Bank Reconciliation',
      },
      {
        id: 'act-15',
        timestamp: '11:30 AM',
        type: 'added',
        description: 'Recorded POS counter payment for Roll #121 Muhammad Ahmed (Rs 1,000 received)',
        entity: 'Cash Counter',
      },
      {
        id: 'act-16',
        timestamp: '01:10 PM',
        type: 'added',
        description: 'Created 2-part cashout voucher for Science Lab consumables (Rs 3,500)',
        entity: 'Expenses',
      },
      {
        id: 'act-17',
        timestamp: '03:15 PM',
        type: 'deleted',
        description: 'Cancelled voided duplicate challan voucher #INV-9281-DUP',
        entity: 'Invoice Deletion',
      },
    ],
  },
  {
    id: 'staff-05',
    name: 'Rukhsana Kausar',
    role: 'Senior Faculty & Department Coordinator',
    roleCategory: 'Coordinator',
    department: 'Urdu & Islamiat',
    initials: 'RK',
    avatarBg: 'bg-purple-700 text-white',
    isSignedInNow: false,
    sessionStatus: 'Signed out at 03:45 PM',
    addedCount: 1,
    changedCount: 1,
    deletedCount: 0,
    activities: [
      {
        id: 'act-18',
        timestamp: '09:10 AM',
        type: 'changed',
        description: 'Entered Grade 10 Urdu mid-term assessment marks into master gazette spreadsheet',
        entity: 'Examinations',
      },
      {
        id: 'act-19',
        timestamp: '01:00 PM',
        type: 'added',
        description: 'Submitted Nazm recitation schedule for annual Iqbal Day celebration',
        entity: 'Academics',
      },
    ],
  },
  {
    id: 'staff-06',
    name: 'Nasreen Akhtar',
    role: 'Junior Wing Coordinator',
    roleCategory: 'Coordinator',
    department: 'Junior Wing',
    initials: 'NA',
    avatarBg: 'bg-pink-700 text-white',
    isSignedInNow: false,
    sessionStatus: 'Signed out at 02:30 PM',
    addedCount: 1,
    changedCount: 2,
    deletedCount: 0,
    activities: [
      {
        id: 'act-20',
        timestamp: '08:30 AM',
        type: 'changed',
        description: 'Inspected class attendance registers for Prep and Nursery sections',
        entity: 'Attendance Audit',
      },
      {
        id: 'act-21',
        timestamp: '11:00 AM',
        type: 'added',
        description: 'Logged parent inquiry for Nursery 2027 admissions session',
        entity: 'Admissions Desk',
      },
    ],
  },
  {
    id: 'staff-07',
    name: 'Muhammad Bilal',
    role: 'IT Assistant & Computer Lab Incharge',
    roleCategory: 'Other',
    department: 'IT & Facilities',
    initials: 'MB',
    avatarBg: 'bg-slate-700 text-white',
    isSignedInNow: false,
    sessionStatus: 'Signed in, no changes made.',
    addedCount: 0,
    changedCount: 0,
    deletedCount: 0,
    activities: [],
  },
  {
    id: 'staff-08',
    name: 'Farhan Saeed',
    role: 'Discipline Incharge & Sports Officer',
    roleCategory: 'Other',
    department: 'Discipline & Sports',
    initials: 'FS',
    avatarBg: 'bg-sky-800 text-white',
    isSignedInNow: false,
    sessionStatus: 'Signed out at 01:15 PM',
    addedCount: 0,
    changedCount: 1,
    deletedCount: 0,
    activities: [
      {
        id: 'act-22',
        timestamp: '08:05 AM',
        type: 'changed',
        description: 'Logged uniform inspection and gate arrival timing check for senior boys wing',
        entity: 'Discipline Log',
      },
    ],
  },
]
