'use client'

import { useState, useEffect, useCallback } from 'react'
import { getRootAdmin } from './admin-store'
import { getStoredFaculty, saveStoredFaculty } from './faculty-store'

export type PermissionId =
  | 'view_students'
  | 'create_students'
  | 'edit_students'
  | 'delete_students'
  | 'view_finance'
  | 'manage_finance'
  | 'print_finance'
  | 'view_attendance'
  | 'mark_attendance'
  | 'view_faculty'
  | 'manage_faculty'
  | 'manage_academics'
  | 'manage_examinations'
  | 'view_settings'

export interface PermissionDef {
  id: PermissionId
  label: string
  category: 'Students' | 'Fee & Finance' | 'Attendance' | 'Faculty & HR' | 'Academics & Exams' | 'Administration'
  description: string
  navLink?: string
}

export const ALL_PERMISSIONS: PermissionDef[] = [
  // Students
  {
    id: 'view_students',
    label: 'View Students & Profiles',
    category: 'Students',
    description: 'Browse enrolled students, search B-Forms, view family and academic dossiers',
    navLink: '/students',
  },
  {
    id: 'create_students',
    label: 'Admit New Students (Quick & Bulk)',
    category: 'Students',
    description: 'Submit + Quick Admission Form and upload Bulk Import CSV/XLSX files',
  },
  {
    id: 'edit_students',
    label: 'Edit Student Profiles',
    category: 'Students',
    description: 'Update class, section, parent phone, address, and scholarship details',
  },
  {
    id: 'delete_students',
    label: 'Delete Student Records',
    category: 'Students',
    description: 'Permanently remove or archive student registration files',
  },

  // Fee & Finance
  {
    id: 'view_finance',
    label: 'View Fee Ledger & Reports',
    category: 'Fee & Finance',
    description: 'View fee ledger, billing summaries, collection KPI cards, and overdue arrears',
    navLink: '/finance',
  },
  {
    id: 'manage_finance',
    label: 'Record Fee Payments & Waive Surcharges',
    category: 'Fee & Finance',
    description: 'Process POS cash settlements, bank challan entries, and adjust late surcharges',
  },
  {
    id: 'print_finance',
    label: 'Print Challans & Thermal Slips',
    category: 'Fee & Finance',
    description: 'Generate 3-part bank fee challans and 80mm thermal counter slips',
  },

  // Attendance
  {
    id: 'view_attendance',
    label: 'View Attendance Records',
    category: 'Attendance',
    description: 'Inspect daily student/staff attendance sheets and monthly statistics',
    navLink: '/attendance',
  },
  {
    id: 'mark_attendance',
    label: 'Mark Daily Attendance & Send SMS',
    category: 'Attendance',
    description: 'Submit daily roll-call, toggle Present/Absent/Late, and trigger absentee SMS alerts',
  },

  // Faculty & HR
  {
    id: 'view_faculty',
    label: 'View Staff & Faculty Directory',
    category: 'Faculty & HR',
    description: 'View teacher roster, assigned subjects, and contact directories',
    navLink: '/faculty',
  },
  {
    id: 'manage_faculty',
    label: 'Hire Staff, Edit Salary & Disburse Payroll',
    category: 'Faculty & HR',
    description: 'Add new faculty contracts, modify basic salaries/allowances, and disburse payroll',
  },

  // Academics & Exams
  {
    id: 'manage_academics',
    label: 'Timetable, Syllabus & Daily Diary',
    category: 'Academics & Exams',
    description: 'Schedule class periods, update term syllabi, and publish student daily homework diary',
    navLink: '/academics',
  },
  {
    id: 'manage_examinations',
    label: 'Examinations, Marks Entry & Result Cards',
    category: 'Academics & Exams',
    description: 'Enter BISE exam marks, compute GPA/percentage, and print official report cards',
    navLink: '/examinations',
  },

  // Administration
  {
    id: 'view_settings',
    label: 'Institutional Settings & Partners',
    category: 'Administration',
    description: 'Inspect campus bank accounts, BISE registration, and academic session parameters',
    navLink: '/settings',
  },
]

export interface RoleDefinition {
  id: string
  name: string
  department: string
  description: string
  isCustom: boolean
  permissions: PermissionId[]
}

export interface CurrentUser {
  id: string
  name: string
  username: string
  designation: string
  isRoot: boolean
  email?: string
}

const DEFAULT_ROLES: RoleDefinition[] = [
  {
    id: 'principal',
    name: 'Principal',
    department: 'Executive Administration',
    description: 'Institutional academic and administrative head with elevated management authority',
    isCustom: false,
    permissions: [
      'view_students',
      'create_students',
      'edit_students',
      'view_finance',
      'manage_finance',
      'print_finance',
      'view_attendance',
      'mark_attendance',
      'view_faculty',
      'manage_faculty',
      'manage_academics',
      'manage_examinations',
      'view_settings',
    ],
  },
  {
    id: 'principal_hod',
    name: 'Principal & Head Of Department',
    department: 'Administration',
    description: 'Full institutional authority over curriculum, staff, students, and campus operations',
    isCustom: false,
    permissions: [
      'view_students',
      'create_students',
      'edit_students',
      'view_finance',
      'manage_finance',
      'print_finance',
      'view_attendance',
      'mark_attendance',
      'view_faculty',
      'manage_faculty',
      'manage_academics',
      'manage_examinations',
      'view_settings',
    ],
  },
  {
    id: 'vice_principal',
    name: 'Vice Principal & Administrator',
    department: 'Academic Operations',
    description: 'Day-to-day campus management, student discipline, timetable, and examinations',
    isCustom: false,
    permissions: [
      'view_students',
      'create_students',
      'edit_students',
      'view_attendance',
      'mark_attendance',
      'view_faculty',
      'manage_academics',
      'manage_examinations',
    ],
  },
  {
    id: 'teacher',
    name: 'Teacher',
    department: 'Teaching Faculty',
    description: 'Classroom instruction, daily student attendance roll-call, homework diary, and marks entry',
    isCustom: false,
    permissions: [
      'view_students',
      'view_attendance',
      'mark_attendance',
      'manage_academics',
      'manage_examinations',
    ],
  },
  {
    id: 'faculty_teachers',
    name: 'Faculty Teachers',
    department: 'Teaching Faculty',
    description: 'Senior teaching staff with syllabus oversight, marks grading, and attendance submission',
    isCustom: false,
    permissions: [
      'view_students',
      'view_attendance',
      'mark_attendance',
      'manage_academics',
      'manage_examinations',
    ],
  },
  {
    id: 'accountant',
    name: 'Accountant',
    department: 'Finance & Accounts',
    description: 'Fee collection, challan issuance, counter cash settlements, and finance ledgers',
    isCustom: false,
    permissions: [
      'view_students',
      'view_finance',
      'manage_finance',
      'print_finance',
      'view_attendance',
    ],
  },
  {
    id: 'accounts_cashier',
    name: 'Accounts & Cashier',
    department: 'Accounts Office',
    description: 'Counter cashier desk for bank reconciliation, POS fee recording, and printing',
    isCustom: false,
    permissions: [
      'view_students',
      'view_finance',
      'manage_finance',
      'print_finance',
    ],
  },
  {
    id: 'front_desk',
    name: 'Front Desk',
    department: 'Admissions & Reception',
    description: 'Parent inquiries, new student registrations, visitor logs, and basic attendance roll-call',
    isCustom: false,
    permissions: [
      'view_students',
      'create_students',
      'view_attendance',
      'mark_attendance',
    ],
  },
  {
    id: 'coordinator',
    name: 'Co-ordinator',
    department: 'Academic Section',
    description: 'Grade level coordination, diary review, teacher substitution, and exam scheduling',
    isCustom: false,
    permissions: [
      'view_students',
      'view_attendance',
      'mark_attendance',
      'view_faculty',
      'manage_academics',
      'manage_examinations',
    ],
  },
  {
    id: 'house_keeping',
    name: 'House keeping',
    department: 'Facilities & Support',
    description: 'Support staff with facility check-in and personal attendance view',
    isCustom: false,
    permissions: [
      'view_attendance',
      'mark_attendance',
    ],
  },
]

const RBAC_ROLES_STORAGE_KEY = 'eaglets_rbac_roles_v2'
const ACTIVE_USER_STORAGE_KEY = 'eaglets_active_user_v2'

export function getStoredRoles(): RoleDefinition[] {
  if (typeof window === 'undefined') return DEFAULT_ROLES
  try {
    const raw = localStorage.getItem(RBAC_ROLES_STORAGE_KEY)
    if (raw) {
      const parsed: RoleDefinition[] = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (err) {
    console.error('Failed to load RBAC roles:', err)
  }
  return DEFAULT_ROLES
}

export function saveStoredRoles(roles: RoleDefinition[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(RBAC_ROLES_STORAGE_KEY, JSON.stringify(roles))
    window.dispatchEvent(new CustomEvent('eaglets_rbac_roles_updated', { detail: roles }))
  } catch (err) {
    console.error('Failed to save RBAC roles:', err)
  }
}

export function getDefaultRootUser(): CurrentUser {
  const root = getRootAdmin()
  return {
    id: 'root-admin',
    name: root.name || 'M. Tariq Alvi',
    username: root.username || 'admin',
    designation: 'Global Root Administrator',
    isRoot: true,
    email: root.email || 'tariq.alvi@eaglets.edu.pk',
  }
}

export function getStoredActiveUser(): CurrentUser {
  if (typeof window === 'undefined') return getDefaultRootUser()
  try {
    const raw = localStorage.getItem(ACTIVE_USER_STORAGE_KEY)
    if (raw) {
      return JSON.parse(raw)
    }
  } catch (err) {
    console.error('Failed to load active user:', err)
  }
  return getDefaultRootUser()
}

export function saveStoredActiveUser(user: CurrentUser): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(ACTIVE_USER_STORAGE_KEY, JSON.stringify(user))
    window.dispatchEvent(new CustomEvent('eaglets_active_user_updated', { detail: user }))
  } catch (err) {
    console.error('Failed to save active user:', err)
  }
}

export function useRBAC() {
  const [roles, setRoles] = useState<RoleDefinition[]>(() => DEFAULT_ROLES)
  const [currentUser, setCurrentUser] = useState<CurrentUser>(() => getDefaultRootUser())

  useEffect(() => {
    setRoles(getStoredRoles())
    setCurrentUser(getStoredActiveUser())

    const handleRolesUpdate = (e: any) => {
      if (e?.detail) setRoles(e.detail)
      else setRoles(getStoredRoles())
    }

    const handleUserUpdate = (e: any) => {
      if (e?.detail) setCurrentUser(e.detail)
      else setCurrentUser(getStoredActiveUser())
    }

    window.addEventListener('eaglets_rbac_roles_updated', handleRolesUpdate)
    window.addEventListener('eaglets_active_user_updated', handleUserUpdate)
    window.addEventListener('storage', handleRolesUpdate)

    return () => {
      window.removeEventListener('eaglets_rbac_roles_updated', handleRolesUpdate)
      window.removeEventListener('eaglets_active_user_updated', handleUserUpdate)
      window.removeEventListener('storage', handleRolesUpdate)
    }
  }, [])

  // Check if current user is Root Administrator
  const isRootAdmin = currentUser.isRoot === true

  // Check if a specific permission is granted
  const hasPermission = useCallback(
    (permissionId: PermissionId): boolean => {
      if (currentUser.isRoot) return true

      // Find role definition for current user's designation
      const userRole = roles.find(
        (r) => r.name.toLowerCase() === currentUser.designation.toLowerCase()
      )

      if (!userRole) {
        // Fallback matching
        const partialRole = roles.find(
          (r) =>
            currentUser.designation.toLowerCase().includes(r.name.toLowerCase()) ||
            r.name.toLowerCase().includes(currentUser.designation.toLowerCase())
        )
        return partialRole ? partialRole.permissions.includes(permissionId) : false
      }

      return userRole.permissions.includes(permissionId)
    },
    [currentUser, roles]
  )

  // Switch Active User / Session (for test simulation & multi-user login)
  const switchUser = (user: CurrentUser) => {
    saveStoredActiveUser(user)
    setCurrentUser(user)
  }

  // Switch back to Root Admin
  const switchToRootAdmin = () => {
    const root = getDefaultRootUser()
    switchUser(root)
  }

  // Update permissions for a specific role
  const saveRolePermissions = (roleName: string, permissions: PermissionId[]) => {
    const updated = roles.map((r) =>
      r.name.toLowerCase() === roleName.toLowerCase() ? { ...r, permissions } : r
    )
    saveStoredRoles(updated)
    setRoles(updated)
  }

  // Add a brand new custom designation/role
  const addCustomRole = (newRole: {
    name: string
    department?: string
    description?: string
    initialPermissions?: PermissionId[]
  }) => {
    const trimmedName = newRole.name.trim()
    if (!trimmedName) return

    const slug = trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, '_')
    const roleObj: RoleDefinition = {
      id: `role_${slug}_${Date.now()}`,
      name: trimmedName,
      department: newRole.department?.trim() || 'General Operations',
      description: newRole.description?.trim() || `Custom designation for ${trimmedName}`,
      isCustom: true,
      permissions: newRole.initialPermissions || [
        'view_students',
        'view_attendance',
      ],
    }

    const updated = [...roles, roleObj]
    saveStoredRoles(updated)
    setRoles(updated)
    return roleObj
  }

  // Delete a custom designation
  const deleteCustomRole = (roleName: string) => {
    const updated = roles.filter(
      (r) => !(r.name.toLowerCase() === roleName.toLowerCase() && r.isCustom)
    )
    saveStoredRoles(updated)
    setRoles(updated)
  }

  // Assign staff member to a designation
  const assignStaffDesignation = (staffId: string, newDesignation: string) => {
    const staffList = getStoredFaculty()
    const updatedStaff = staffList.map((s) =>
      s.id === staffId ? { ...s, designation: newDesignation } : s
    )
    saveStoredFaculty(updatedStaff)

    // If the active user happens to be this staff member, update session
    if (currentUser.id === staffId) {
      const updatedUser = { ...currentUser, designation: newDesignation }
      saveStoredActiveUser(updatedUser)
      setCurrentUser(updatedUser)
    }
  }

  // Reset roles to default canonical permissions
  const resetToDefaults = () => {
    saveStoredRoles(DEFAULT_ROLES)
    setRoles(DEFAULT_ROLES)
  }

  return {
    roles,
    currentUser,
    isRootAdmin,
    hasPermission,
    switchUser,
    switchToRootAdmin,
    saveRolePermissions,
    addCustomRole,
    deleteCustomRole,
    assignStaffDesignation,
    resetToDefaults,
  }
}

