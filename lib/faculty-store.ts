'use client'

import { useState, useEffect } from 'react'
import { FacultyItem } from './supabase/types'
import { INITIAL_FACULTY } from './mock-data'

export const DESIGNATION_PRESETS = [
  'Principal & Head Of Department',
  'Vice Principal & Administrator',
  'Co-ordinator',
  'Faculty Teachers',
  'Accounts & Cashier',
  'House keeping',
] as const

export type DesignationPreset = (typeof DESIGNATION_PRESETS)[number]

const FACULTY_STORAGE_KEY = 'eaglets_faculty_roster_v4'

// Filter out Global Root Admin so they never appear in faculty rosters
export function filterNonRootFaculty(list: FacultyItem[]): FacultyItem[] {
  return list.filter(
    (f) =>
      f.id !== 'f-101' &&
      f.emp_id !== 'EAG-FAC-101' &&
      !f.designation.toLowerCase().includes('chief administrator')
  )
}

export function getInitialFacultyRoster(): FacultyItem[] {
  return filterNonRootFaculty(INITIAL_FACULTY)
}

export function getStoredFaculty(): FacultyItem[] {
  if (typeof window === 'undefined') return getInitialFacultyRoster()
  try {
    const raw = localStorage.getItem(FACULTY_STORAGE_KEY)
    if (raw) {
      const parsed: FacultyItem[] = JSON.parse(raw)
      return filterNonRootFaculty(parsed)
    }
  } catch (err) {
    console.error('Failed to read faculty from localStorage:', err)
  }
  const initial = getInitialFacultyRoster()
  try {
    localStorage.setItem(FACULTY_STORAGE_KEY, JSON.stringify(initial))
  } catch {}
  return initial
}

export function saveStoredFaculty(list: FacultyItem[]): FacultyItem[] {
  const filtered = filterNonRootFaculty(list)
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(FACULTY_STORAGE_KEY, JSON.stringify(filtered))
      window.dispatchEvent(new CustomEvent('eaglets_faculty_updated', { detail: filtered }))
    } catch (err) {
      console.error('Failed to write faculty to localStorage:', err)
    }
  }
  return filtered
}

export function useFacultyStore() {
  const [faculty, setFaculty] = useState<FacultyItem[]>(() => {
    // SSR Safe initial state
    return getInitialFacultyRoster()
  })

  useEffect(() => {
    setFaculty(getStoredFaculty())

    const handleUpdate = (e: any) => {
      if (e?.detail) {
        setFaculty(filterNonRootFaculty(e.detail))
      } else {
        setFaculty(getStoredFaculty())
      }
    }

    window.addEventListener('eaglets_faculty_updated', handleUpdate)
    window.addEventListener('storage', handleUpdate)
    return () => {
      window.removeEventListener('eaglets_faculty_updated', handleUpdate)
      window.removeEventListener('storage', handleUpdate)
    }
  }, [])

  const setFacultyList = (list: FacultyItem[]) => {
    const saved = saveStoredFaculty(list)
    setFaculty(saved)
  }

  const deleteFaculty = (id: string) => {
    setFaculty((prev) => {
      const next = prev.filter((f) => f.id !== id)
      saveStoredFaculty(next)
      return next
    })
  }

  const upsertFaculty = (staff: FacultyItem) => {
    setFaculty((prev) => {
      const exists = prev.some((f) => f.id === staff.id)
      const next = exists ? prev.map((f) => (f.id === staff.id ? staff : f)) : [staff, ...prev]
      saveStoredFaculty(next)
      return next
    })
  }

  return {
    faculty,
    setFacultyList,
    deleteFaculty,
    upsertFaculty,
  }
}
