'use client'

import { useState, useEffect } from 'react'

export interface RootAdminData {
  name: string
  username: string
  email: string
  password?: string
  lastUpdated?: string
}

export const DEFAULT_ROOT_ADMIN: RootAdminData = {
  name: 'M. Tariq Alvi',
  username: 'admin',
  email: 'tariq.alvi@eaglets.edu.pk',
  password: 'Password@2026',
  lastUpdated: '2026-09-01T00:00:00.000Z',
}

const STORAGE_KEY = 'eaglets_root_admin_profile'

export function getRootAdmin(): RootAdminData {
  if (typeof window === 'undefined') return DEFAULT_ROOT_ADMIN
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      return { ...DEFAULT_ROOT_ADMIN, ...JSON.parse(raw) }
    }
  } catch (e) {
    console.error('Error reading root admin profile:', e)
  }
  return DEFAULT_ROOT_ADMIN
}

export function saveRootAdmin(data: Partial<RootAdminData>): RootAdminData {
  if (typeof window === 'undefined') return DEFAULT_ROOT_ADMIN
  try {
    const current = getRootAdmin()
    const updated: RootAdminData = {
      ...current,
      ...data,
      lastUpdated: '2026-09-01T00:00:00.000Z',
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    window.dispatchEvent(new CustomEvent('eaglets_admin_updated', { detail: updated }))
    return updated
  } catch (e) {
    console.error('Error saving root admin profile:', e)
    return DEFAULT_ROOT_ADMIN
  }
}

export function getInitials(name: string): string {
  if (!name) return 'RA'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function useRootAdmin() {
  const [admin, setAdmin] = useState<RootAdminData>(DEFAULT_ROOT_ADMIN)

  useEffect(() => {
    setAdmin(getRootAdmin())

    const handleUpdate = (e: any) => {
      if (e?.detail) {
        setAdmin(e.detail)
      } else {
        setAdmin(getRootAdmin())
      }
    }

    window.addEventListener('eaglets_admin_updated', handleUpdate)
    window.addEventListener('storage', handleUpdate)
    return () => {
      window.removeEventListener('eaglets_admin_updated', handleUpdate)
      window.removeEventListener('storage', handleUpdate)
    }
  }, [])

  const updateAdmin = (data: Partial<RootAdminData>) => {
    const updated = saveRootAdmin(data)
    setAdmin(updated)
    return updated
  }

  return { admin, updateAdmin, initials: getInitials(admin.name) }
}

