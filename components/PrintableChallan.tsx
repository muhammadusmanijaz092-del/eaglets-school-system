'use client'

import React from 'react'

interface ChallanProps {
  challanNo?: string
  studentName?: string
  rollNo?: string
  bForm?: string
  className?: string
  tuitionFee?: number
  concessionAmount?: number
  discountType?: string
  labFund?: number
  examFund?: number
  devFund?: number
  libraryFund?: number
  arrearsAmount?: number
  lateFee?: number
  issueDate?: string
  dueDate?: string
  expiryDate?: string
}

export default function PrintableChallan({
  challanNo = 'CH-2026-10-8492',
  studentName = 'Muhammad Rayyan Butt',
  rollNo = 'EAG-10-042',
  bForm = '35201-8491023-1',
  className = '10th Science (Section A - Rose)',
  tuitionFee = 14000,
  concessionAmount = 3500,
  discountType = 'Kinship Discount',
  labFund = 1500,
  examFund = 1000,
  devFund = 1000,
  libraryFund = 500,
  arrearsAmount = 0,
  lateFee = 500,
  issueDate = '01-Oct-2026',
  dueDate = '10-Oct-2026',
  expiryDate = '20-Oct-2026',
}: ChallanProps) {
  const baseTuition = tuitionFee
  const scholarship = concessionAmount
  const adjustedTuition = Math.max(0, baseTuition - scholarship)
  const additionalCharges = labFund + examFund + devFund + libraryFund
  const subtotal = adjustedTuition + additionalCharges
  const totalWithinDueDate = subtotal + arrearsAmount
  const totalAfterDueDate = totalWithinDueDate + lateFee

  const copies = [
    { label: 'PART 1 : BANK COPY', note: 'BRANCH RETENTION', headerBg: 'bg-slate-100 text-[#b3272c]' },
    { label: 'PART 2 : SCHOOL COPY', note: 'ACCOUNTS DEPARTMENT', headerBg: 'bg-[#122b54] text-white' },
    { label: 'PART 3 : STUDENT COPY', note: 'PARENT RECORD', headerBg: 'bg-slate-800 text-[#f5bc71]' },
  ]

  return (
    <div className="printable-area bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm text-slate-800">
      {/* Printable Actions Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between pb-4 mb-4 border-b border-slate-200 gap-3 no-print">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#b3272c]"></span>
          <span className="text-xs font-bold uppercase tracking-wider text-[#001639]">
            Official 3-Part Bank Challan Voucher (A4 Cut-Slip)
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px]">
            HBL / Meezan Bank Islamic
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="h-8 px-4 bg-[#b3272c] text-white hover:bg-[#88131b] rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">print</span>
            <span>Print 3-Part Voucher (A4)</span>
          </button>
        </div>
      </div>

      {/* 3-Column Perforated Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 divide-y lg:divide-y-0 lg:divide-x divide-dashed divide-slate-300">
        {copies.map((copy, idx) => (
          <div
            key={idx}
            className={`flex flex-col justify-between text-xs ${
              idx > 0 ? 'lg:pl-5 pt-4 lg:pt-0' : ''
            }`}
          >
            {/* Part Ribbon */}
            <div
              className={`flex items-center justify-between px-2 py-1 rounded mb-2.5 font-bold ${copy.headerBg}`}
            >
              <span className="text-[10px] tracking-wider uppercase">{copy.label}</span>
              <span className="text-[9px] uppercase tracking-wider opacity-85">
                {copy.note}
              </span>
            </div>

            {/* School Crest & Heading */}
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-9 h-9 rounded-lg bg-white p-0.5 flex items-center justify-center flex-shrink-0 border border-slate-200 shadow-xs overflow-hidden">
                <img
                  src="/images/eaglets-logo.jpg"
                  alt="Eaglets Schools Crest"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-baldwins font-bold text-xs tracking-wider text-[#001639] uppercase">
                  EAGLETS SCHOOLS
                </span>
                <span className="font-aster text-[8.5px] text-[#b3272c] font-bold tracking-wide">
                  Rebirth Of Knowledge & Character
                </span>
              </div>
            </div>

            {/* Bank Particulars */}
            <div className="bg-slate-50 p-2 rounded mb-2.5 border border-slate-200/80 text-[10px]">
              <div className="flex justify-between font-bold text-[#001639]">
                <span>HABIB BANK LIMITED</span>
                <span>CMD: EAGL-78</span>
              </div>
              <div className="text-slate-600">A/C: 0042-79018420-03 (Islamic / Regular)</div>
              <div className="text-slate-500">Main Campus Designated Branch, Lahore</div>
            </div>

            {/* Challan Identifiers */}
            <div className="space-y-0.5 text-[11px] mb-2.5 bg-slate-50/50 p-1.5 rounded border border-slate-100">
              <div className="flex justify-between font-mono font-bold text-[#001639] bg-slate-100 px-1.5 py-0.5 rounded">
                <span>Challan No:</span>
                <span>{challanNo}</span>
              </div>
              <div className="flex justify-between px-1 text-[10px] text-slate-600">
                <span>Issue Date:</span>
                <span>{issueDate}</span>
              </div>
              <div className="flex justify-between px-1 text-[10px] font-bold text-[#b3272c]">
                <span>Due Date (Valid):</span>
                <span>{dueDate}</span>
              </div>
              <div className="flex justify-between px-1 text-[10px] text-slate-500">
                <span>Final Expiry:</span>
                <span>{expiryDate}</span>
              </div>
            </div>

            {/* Student Particulars */}
            <div className="bg-slate-50 p-2 rounded mb-2.5 space-y-0.5 border border-slate-100 text-[10px]">
              <div className="flex justify-between">
                <span className="text-slate-500">Student:</span>
                <span className="font-bold text-[#001639]">{studentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Roll No:</span>
                <span className="font-mono font-bold">{rollNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Class:</span>
                <span className="font-semibold">{className}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">B-Form #:</span>
                <span className="font-mono">{bForm}</span>
              </div>
            </div>

            {/* Fee Slabs Table */}
            <div className="overflow-hidden rounded border border-slate-200 mb-2.5">
              <table className="w-full text-left text-[10px]">
                <thead className="bg-[#122b54] text-white">
                  <tr>
                    <th className="py-1 px-1.5">Account Particulars</th>
                    <th className="py-1 px-1.5 text-right">PKR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="py-0.8 px-1.5">Base Monthly Tuition</td>
                    <td className="py-0.8 px-1.5 text-right font-medium">
                      {baseTuition.toLocaleString()}
                    </td>
                  </tr>
                  {scholarship > 0 && (
                    <tr className="text-emerald-700 bg-emerald-50/50">
                      <td className="py-0.8 px-1.5">Less: {discountType || 'Scholarship'}</td>
                      <td className="py-0.8 px-1.5 text-right font-bold">
                        - {scholarship.toLocaleString()}
                      </td>
                    </tr>
                  )}
                  {scholarship > 0 && (
                    <tr className="bg-slate-50/70 font-semibold text-slate-700">
                      <td className="py-0.8 px-1.5">Adjusted Tuition Fee</td>
                      <td className="py-0.8 px-1.5 text-right font-mono">
                        {adjustedTuition.toLocaleString()}
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td className="py-0.8 px-1.5">Science Lab & Practical Charges</td>
                    <td className="py-0.8 px-1.5 text-right font-medium">
                      {labFund.toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-0.8 px-1.5">Term Examination & Gazette Fund</td>
                    <td className="py-0.8 px-1.5 text-right font-medium">
                      {examFund.toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-0.8 px-1.5">Development & Library Fund</td>
                    <td className="py-0.8 px-1.5 text-right font-medium">
                      {(devFund + libraryFund).toLocaleString()}
                    </td>
                  </tr>
                  {arrearsAmount > 0 && (
                    <tr className="text-[#b3272c] bg-rose-50/60 font-semibold">
                      <td className="py-0.8 px-1.5">Prior Unpaid Arrears Carried Over</td>
                      <td className="py-0.8 px-1.5 text-right font-bold">
                        + {arrearsAmount.toLocaleString()}
                      </td>
                    </tr>
                  )}
                  <tr className="bg-[#122b54] text-white font-bold">
                    <td className="py-1 px-1.5">Total Payable (Before 10th)</td>
                    <td className="py-1 px-1.5 text-right">
                      PKR {totalWithinDueDate.toLocaleString()}
                    </td>
                  </tr>
                  <tr className="text-[#b3272c] font-semibold bg-rose-50/50">
                    <td className="py-0.8 px-1.5">Late Surcharge (After 10th)</td>
                    <td className="py-0.8 px-1.5 text-right">
                      {lateFee.toLocaleString()}
                    </td>
                  </tr>
                  <tr className="bg-[#b3272c] text-white font-bold">
                    <td className="py-1 px-1.5">Total Payable (After 10th)</td>
                    <td className="py-1 px-1.5 text-right">
                      PKR {totalAfterDueDate.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Official Stamp & Signatures */}
            <div className="pt-2 border-t border-slate-200">
              <div className="grid grid-cols-2 gap-2 text-center mb-1.5">
                <div className="h-10 bg-slate-50 border border-slate-200 rounded p-1 flex flex-col justify-end">
                  <span className="text-[8px] uppercase tracking-wider text-slate-500 font-semibold">
                    Bank Stamp
                  </span>
                </div>
                <div className="h-10 bg-slate-50 border border-slate-200 rounded p-1 flex flex-col justify-end">
                  <span className="text-[8px] uppercase tracking-wider text-slate-500 font-semibold">
                    Cashier Signature
                  </span>
                </div>
              </div>
              <p className="text-[8px] text-slate-500 text-center leading-tight">
                Non-refundable. Cash/Online deposit valid across authorized branches.
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

