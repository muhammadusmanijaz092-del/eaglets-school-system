'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useRootAdmin } from '@/lib/admin-store'

export default function LoginPage() {
  const router = useRouter()
  const { admin } = useRootAdmin()
  const [role, setRole] = useState<'admin' | 'faculty' | 'finance' | 'parent'>('admin')
  const [email, setEmail] = useState('admin')
  const [password, setPassword] = useState('Password@2026')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (role === 'admin') {
      setEmail(admin.username || 'admin')
      setPassword(admin.password || 'Password@2026')
    }
  }, [admin, role])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      router.push('/')
    }, 600)
  }

  return (
    <div className="min-h-screen bg-[#f8f9ff] flex flex-col justify-center items-center p-4">
      {/* Container */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200/80 p-8 flex flex-col gap-6">
        {/* Crest & Heading */}
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-2xl bg-white p-1 flex items-center justify-center shadow-md border border-slate-200 mb-3 overflow-hidden">
            <img
              src="/images/eaglets-logo.jpg"
              alt="Eaglets Schools Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="font-baldwins text-3xl font-bold tracking-wider text-[#001639]">
            EAGLETS SCHOOLS
          </h1>
          <span className="font-aster text-xs text-[#b3272c] tracking-wide mt-1">
            Rebirth Of Knowledge & Character
          </span>
          <p className="text-xs text-slate-500 mt-2">
            Enterprise Academic & Fee Finance Management Portal
          </p>
        </div>

        {/* Role Selector */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-lg text-xs font-semibold">
          {[
            { id: 'admin', label: 'Admin' },
            { id: 'faculty', label: 'Teacher' },
            { id: 'finance', label: 'Finance' },
            { id: 'parent', label: 'Parent' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setRole(item.id as any)
                if (item.id === 'admin') {
                  setEmail(admin.username || 'admin')
                  setPassword(admin.password || 'Password@2026')
                }
                if (item.id === 'faculty') {
                  setEmail('masood.ahmad')
                  setPassword('Password@2026')
                }
                if (item.id === 'finance') {
                  setEmail('accounts')
                  setPassword('Password@2026')
                }
                if (item.id === 'parent') {
                  setEmail('tariq.butt')
                  setPassword('Password@2026')
                }
              }}
              className={`py-1.5 rounded transition-all cursor-pointer ${
                role === item.id
                  ? 'bg-white text-[#001639] font-bold shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Institutional Username / Email
            </label>
            <input
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639]"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-semibold text-slate-700">Password</label>
              <a href="#" className="text-[11px] text-[#b3272c] hover:underline">
                Forgot password?
              </a>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639]"
            />
          </div>

          <div className="flex items-center gap-2 text-slate-600">
            <input
              type="checkbox"
              id="remember"
              defaultChecked
              className="rounded accent-[#122b54]"
            />
            <label htmlFor="remember" className="cursor-pointer">
              Remember this secure workstation
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-10 bg-[#001639] hover:bg-[#122b54] text-white font-bold rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-75"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">lock_open</span>
                <span>Sign In to Executive Portal</span>
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center pt-2 border-t border-slate-100 text-[11px] text-slate-500">
          <span>Main Boys Campus, Lahore • Session 2026–2027</span>
          <div className="mt-1 flex items-center justify-center gap-1 text-[10px] text-slate-400">
            <span className="material-symbols-outlined text-[12px] text-emerald-600">
              verified
            </span>
            <span>256-Bit SSL Encrypted Campus Connection</span>
          </div>
        </div>
      </div>
    </div>
  )
}

