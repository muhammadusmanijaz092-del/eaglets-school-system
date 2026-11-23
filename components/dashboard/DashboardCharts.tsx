'use client'

import React, { useState, useEffect } from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'

interface DashboardChartsProps {
  onViewAllFees?: () => void
  onViewAllAdmissions?: () => void
}

const yearlyIncomeExpenseData = [
  { name: 'Dec', income: 450000, expense: 320000 },
  { name: 'Jan', income: 480000, expense: 340000 },
  { name: 'Feb', income: 520000, expense: 360000 },
  { name: 'Mar', income: 610000, expense: 410000 },
  { name: 'Apr', income: 590000, expense: 390000 },
  { name: 'May', income: 490000, expense: 380000 },
  { name: 'Jun', income: 420000, expense: 350000 },
  { name: 'Jul', income: 430000, expense: 330000 },
  { name: 'Aug', income: 580000, expense: 400000 },
  { name: 'Sep', income: 640000, expense: 420000 },
  { name: 'Oct', income: 620000, expense: 410000 },
  { name: 'Nov', income: 0, expense: 0 },
]

const weeklyIncomeExpenseData = [
  { name: 'Wk 1', income: 0, expense: 0 },
  { name: 'Wk 2', income: 0, expense: 0 },
  { name: 'Wk 3', income: 0, expense: 0 },
  { name: 'Wk 4', income: 0, expense: 0 },
]

const monthWiseFeeData = [
  { name: 'Dec', paid: 4200, unpaid: 300 },
  { name: 'Jan', paid: 4500, unpaid: 350 },
  { name: 'Feb', paid: 4800, unpaid: 400 },
  { name: 'Mar', paid: 5600, unpaid: 500 },
  { name: 'Apr', paid: 5300, unpaid: 600 },
  { name: 'May', paid: 4600, unpaid: 300 },
  { name: 'Jun', paid: 4000, unpaid: 200 },
  { name: 'Jul', paid: 4100, unpaid: 200 },
  { name: 'Aug', paid: 5400, unpaid: 400 },
  { name: 'Sep', paid: 6000, unpaid: 400 },
  { name: 'Oct', paid: 5800, unpaid: 400 },
  { name: 'Nov', paid: 1000, unpaid: 1700 },
]

const admissionsWithdrawalsData = [
  { name: 'Aug', admissions: 14, withdrawals: 1 },
  { name: 'Sep', admissions: 8, withdrawals: 0 },
  { name: 'Oct', admissions: 3, withdrawals: 0 },
  { name: 'Nov', admissions: 1, withdrawals: 0 },
]

export default function DashboardCharts({
  onViewAllFees,
  onViewAllAdmissions,
}: DashboardChartsProps) {
  const [incomeMode, setIncomeMode] = useState<'yearly' | 'weekly'>('yearly')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200 h-80 animate-pulse" />
        <div className="bg-white p-5 rounded-xl border border-slate-200 h-80 animate-pulse" />
        <div className="bg-white p-5 rounded-xl border border-slate-200 h-80 animate-pulse" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* 1. Weekly/Yearly Income & Expense Overview */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <h3 className="font-domine text-sm font-bold text-[#001639]">
              Income & Expense Overview
            </h3>
            <div className="inline-flex p-0.5 bg-slate-100 rounded-md text-[10.5px]">
              <button
                type="button"
                onClick={() => setIncomeMode('yearly')}
                className={`px-2 py-0.5 rounded font-medium cursor-pointer transition-colors ${
                  incomeMode === 'yearly'
                    ? 'bg-white text-[#001639] font-bold shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Yearly
              </button>
              <button
                type="button"
                onClick={() => setIncomeMode('weekly')}
                className={`px-2 py-0.5 rounded font-medium cursor-pointer transition-colors ${
                  incomeMode === 'weekly'
                    ? 'bg-white text-[#001639] font-bold shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Weekly
              </button>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Last 12 months
          </p>

          <div className="h-60 mt-4 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={incomeMode === 'yearly' ? yearlyIncomeExpenseData : weeklyIncomeExpenseData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(val: unknown) => [
                    `Rs ${Number(val).toLocaleString()}`,
                    '',
                  ]}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '11px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="income" name="Income" fill="#0284c7" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" name="Expense" fill="#e11d48" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 2. Month Wise Paid Unpaid Fee Report */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <h3 className="font-domine text-sm font-bold text-[#001639]">
              Month Wise Paid/Unpaid Fee
            </h3>
            <button
              type="button"
              onClick={onViewAllFees}
              className="text-xs font-bold text-blue-700 hover:text-blue-900 cursor-pointer"
            >
              View All
            </button>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Invoices of the last 12 months
          </p>

          <div className="h-60 mt-4 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthWiseFeeData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(val: unknown) => [
                    `Rs ${Number(val).toLocaleString()}`,
                    '',
                  ]}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '11px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="paid" name="Paid Fee" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="unpaid" name="Unpaid Dues" fill="#b3272c" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3. Admissions & Withdrawals */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <h3 className="font-domine text-sm font-bold text-[#001639]">
              Admissions & Withdrawals
            </h3>
            <button
              type="button"
              onClick={onViewAllAdmissions}
              className="text-xs font-bold text-blue-700 hover:text-blue-900 cursor-pointer"
            >
              View All
            </button>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Month by month this session
          </p>

          <div className="h-60 mt-4 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={admissionsWithdrawalsData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '11px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Line
                  type="monotone"
                  dataKey="admissions"
                  name="Admissions"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="withdrawals"
                  name="Withdrawals"
                  stroke="#ef4444"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
