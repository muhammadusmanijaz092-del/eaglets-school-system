'use client'

import React from 'react'

interface PrintableCashoutReceiptProps {
  challanNo?: string
  receiptNo?: string
  studentName?: string
  fatherName?: string
  rollNo?: string
  className?: string
  bForm?: string
  billingMonth?: string
  tuitionFee?: number
  concessionAmount?: number
  discountType?: string
  labFund?: number
  examFund?: number
  devFund?: number
  libraryFund?: number
  arrearsAmount?: number
  lateFee?: number
  isLateSettlement?: boolean
  paidAmount?: number
  paymentDate?: string
  paymentChannel?: string
  cashierNotes?: string
}

function numberToWordsPKR(num: number): string {
  if (!num || num === 0) return 'Zero Rupees Only'
  const ones = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen'
  ]
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']

  function convertChunk(n: number): string {
    let str = ''
    if (n >= 100) {
      str += ones[Math.floor(n / 100)] + ' Hundred '
      n %= 100
    }
    if (n >= 20) {
      str += tens[Math.floor(n / 10)] + ' '
      n %= 10
    }
    if (n > 0) {
      str += ones[n] + ' '
    }
    return str.trim()
  }

  let result = ''
  const thousands = Math.floor(num / 1000)
  const remainder = num % 1000

  if (thousands > 0) {
    result += convertChunk(thousands) + ' Thousand '
  }
  if (remainder > 0) {
    result += convertChunk(remainder) + ' '
  }

  return (result.trim() || 'Zero') + ' Rupees Only'
}

export default function PrintableCashoutReceipt({
  challanNo = 'CH-2026-10-8492',
  receiptNo,
  studentName = 'Muhammad Rayyan Butt',
  fatherName = 'Tariq Mehmood Butt',
  rollNo = 'EAG-10-042',
  className = 'Grade 10 - Section A',
  bForm = '35201-8491023-1',
  billingMonth = 'October 2026',
  tuitionFee = 14000,
  concessionAmount = 3500,
  discountType = 'Kinship',
  labFund = 1500,
  examFund = 1000,
  devFund = 1000,
  libraryFund = 500,
  arrearsAmount = 0,
  lateFee = 500,
  isLateSettlement = false,
  paidAmount,
  paymentDate,
  paymentChannel = 'Cash Desk (Counter #1)',
  cashierNotes = 'Paid in cash at campus accounts office',
}: PrintableCashoutReceiptProps) {
  const baseTuition = tuitionFee || 0
  const scholarship = concessionAmount || 0
  const adjustedTuition = Math.max(0, baseTuition - scholarship)
  const additionalCharges = (labFund || 0) + (examFund || 0) + (devFund || 0) + (libraryFund || 0)
  const subtotal = adjustedTuition + additionalCharges
  const totalBeforeDue = subtotal + (arrearsAmount || 0)
  const surcharge = isLateSettlement ? (lateFee || 500) : 0
  const calculatedTotal = totalBeforeDue + surcharge
  const actualPaid = paidAmount !== undefined ? paidAmount : calculatedTotal

  const generatedReceiptNo = receiptNo || `CSH-${challanNo.replace(/^(CH-|INV-)/, '')}`
  const todayDateStr = paymentDate || new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
  const amountInWords = numberToWordsPKR(actualPaid)

  const parts = [
    {
      copyTitle: 'PART 1 : ACCOUNTS COPY',
      copySubtitle: 'OFFICE / CASH DESK RETENTION',
      badgeClass: 'bg-[#122b54] text-white',
      borderTone: 'border-[#122b54]/20',
      stampTone: 'text-[#122b54] border-[#122b54]',
    },
    {
      copyTitle: 'PART 2 : STUDENT / PARENT COPY',
      copySubtitle: 'DEPOSITOR OFFICIAL RECEIPT',
      badgeClass: 'bg-[#b3272c] text-white',
      borderTone: 'border-[#b3272c]/20',
      stampTone: 'text-[#b3272c] border-[#b3272c]',
    },
  ]

  return (
    <div className="cashout-print-area bg-white p-3 sm:p-5 rounded-xl border border-slate-200 text-slate-800">
      {/* Landscape Print Engine Override */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 landscape !important;
            margin: 6mm 8mm !important;
          }
          body {
            background: #ffffff !important;
            color: #000000 !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
          .cashout-landscape-container {
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
            border: none !important;
          }
          .cashout-column {
            page-break-inside: avoid;
            break-inside: avoid;
          }
        }
      `}</style>

      {/* Action / Print Toolbar (Hidden on Print) */}
      <div className="flex flex-col sm:flex-row items-center justify-between pb-3 mb-4 border-b border-slate-200 gap-3 no-print">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#122b54]"></span>
          <span className="text-xs font-bold uppercase tracking-wider text-[#001639]">
            A4 Landscape 2-Part Cashout Voucher (Accounts & Student Copies)
          </span>
          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center gap-1">
            <span className="material-symbols-outlined text-[12px]">payments</span>
            Cash Desk Settled
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="h-8 px-4 bg-[#122b54] text-white hover:bg-[#001639] rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">print</span>
            <span>Print 2-Part Cashout (A4 Landscape)</span>
          </button>
        </div>
      </div>

      {/* 2-Part Side-by-Side Landscape Layout */}
      <div className="cashout-landscape-container grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 relative">
        {/* Subtle Perforation Cut Line in center */}
        <div className="hidden lg:flex absolute inset-y-0 left-1/2 -translate-x-1/2 flex-col items-center justify-center pointer-events-none z-10">
          <div className="h-full border-r-2 border-dashed border-slate-300"></div>
          <div className="absolute top-1/2 -translate-y-1/2 bg-white px-1 py-1 rounded border border-slate-300 text-slate-400 text-[10px] flex items-center gap-0.5 font-mono">
            <span>✂</span>
            <span className="text-[8px] uppercase font-bold tracking-widest">Cut</span>
          </div>
        </div>

        {parts.map((part, index) => (
          <div
            key={index}
            className={`cashout-column flex flex-col justify-between border ${part.borderTone} rounded-lg p-3 sm:p-4 bg-white relative shadow-2xs ${
              index === 1 ? 'lg:pl-5' : 'lg:pr-5'
            }`}
          >
            {/* Watermark Crest Simulation */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
              <span className="text-8xl font-black text-slate-900 select-none">EAGLETS</span>
            </div>

            <div>
              {/* Part Header Ribbon */}
              <div className="flex items-center justify-between px-2.5 py-1 rounded mb-2.5 font-bold shadow-2xs">
                <span className={`text-[10px] tracking-wider uppercase px-2 py-0.5 rounded font-extrabold ${part.badgeClass}`}>
                  {part.copyTitle}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-slate-500 font-semibold">
                  {part.copySubtitle}
                </span>
              </div>

              {/* School Header */}
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-white p-0.5 flex items-center justify-center flex-shrink-0 border border-slate-200 shadow-2xs overflow-hidden">
                    <img
                      src="/images/eaglets-logo.jpg"
                      alt="Eaglets Schools Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h2 className="font-baldwins font-bold text-xs tracking-wider text-[#001639] uppercase leading-tight">
                      EAGLETS SCHOOLS SYSTEM
                    </h2>
                    <p className="font-aster text-[8.5px] text-[#b3272c] font-bold tracking-wide leading-tight">
                      Rebirth Of Knowledge & Character
                    </p>
                    <p className="text-[8px] text-slate-500 leading-tight">
                      Main Boys & Cambridge Model Campus, Lahore • Tel: 0300-4581290
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-block px-1.5 py-0.5 bg-slate-100 text-[#001639] border border-slate-200 text-[9px] font-bold uppercase rounded">
                    Cashout Voucher
                  </span>
                  <p className="font-mono text-[9px] font-bold text-slate-600 mt-0.5">
                    {generatedReceiptNo}
                  </p>
                </div>
              </div>

              {/* Receipt Identifiers Bar */}
              <div className="grid grid-cols-3 gap-1.5 bg-slate-50 p-2 rounded border border-slate-200/80 mb-2.5 text-[10px]">
                <div>
                  <span className="text-slate-400 block text-[8px] uppercase">Challan Ref</span>
                  <span className="font-mono font-bold text-[#001639]">{challanNo}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[8px] uppercase">Billing Month</span>
                  <span className="font-semibold text-slate-800">{billingMonth}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[8px] uppercase">Payment Date</span>
                  <span className="font-bold text-slate-700">{todayDateStr}</span>
                </div>
              </div>

              {/* Student Demographic Box */}
              <div className="bg-slate-50/60 p-2 rounded border border-slate-100 text-[10px] space-y-1 mb-2.5">
                <div className="flex justify-between items-center">
                  <div className="flex gap-1.5 items-center">
                    <span className="text-slate-500">Student:</span>
                    <span className="font-bold text-[#001639] text-[11px]">{studentName}</span>
                  </div>
                  <div className="flex gap-1.5 items-center">
                    <span className="text-slate-500">Roll No:</span>
                    <span className="font-mono font-bold text-slate-800">{rollNo}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex gap-1.5 items-center">
                    <span className="text-slate-500">Class:</span>
                    <span className="font-semibold text-slate-700">{className}</span>
                  </div>
                  {fatherName && (
                    <div className="flex gap-1.5 items-center">
                      <span className="text-slate-500">Father/Guardian:</span>
                      <span className="font-medium text-slate-700">{fatherName}</span>
                    </div>
                  )}
                </div>

                {bForm && (
                  <div className="flex justify-between text-[9px] text-slate-500">
                    <span>NADRA B-Form / CNIC:</span>
                    <span className="font-mono font-medium text-slate-600">{bForm}</span>
                  </div>
                )}
              </div>

              {/* Itemized Fee Table */}
              <div className="border border-slate-200 rounded overflow-hidden mb-2.5">
                <table className="w-full text-left text-[10px]">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-1 px-2">Description / Fee Head</th>
                      <th className="py-1 px-2 text-right">Amount (PKR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr>
                      <td className="py-0.5 px-2">Base Tuition Fee</td>
                      <td className="py-0.5 px-2 text-right font-medium">{baseTuition.toLocaleString()}</td>
                    </tr>
                    {scholarship > 0 && (
                      <tr className="bg-emerald-50/50 text-emerald-800 font-semibold">
                        <td className="py-0.5 px-2">Less: {discountType || 'Concession'}</td>
                        <td className="py-0.5 px-2 text-right">- {scholarship.toLocaleString()}</td>
                      </tr>
                    )}
                    {scholarship > 0 && (
                      <tr className="bg-slate-50/70 font-semibold text-slate-800">
                        <td className="py-0.5 px-2">Adjusted Net Tuition</td>
                        <td className="py-0.5 px-2 text-right font-mono">{adjustedTuition.toLocaleString()}</td>
                      </tr>
                    )}
                    {labFund > 0 && (
                      <tr>
                        <td className="py-0.5 px-2">Science Lab & Practical Fund</td>
                        <td className="py-0.5 px-2 text-right font-medium">{labFund.toLocaleString()}</td>
                      </tr>
                    )}
                    {examFund > 0 && (
                      <tr>
                        <td className="py-0.5 px-2">Examination & Gazette Fee</td>
                        <td className="py-0.5 px-2 text-right font-medium">{examFund.toLocaleString()}</td>
                      </tr>
                    )}
                    {(devFund + libraryFund) > 0 && (
                      <tr>
                        <td className="py-0.5 px-2">Development, Library & Sports</td>
                        <td className="py-0.5 px-2 text-right font-medium">{(devFund + libraryFund).toLocaleString()}</td>
                      </tr>
                    )}
                    {arrearsAmount > 0 && (
                      <tr className="bg-amber-50 text-amber-900 font-semibold">
                        <td className="py-0.5 px-2">Prior Unpaid Arrears</td>
                        <td className="py-0.5 px-2 text-right">+ {arrearsAmount.toLocaleString()}</td>
                      </tr>
                    )}
                    {surcharge > 0 && (
                      <tr className="bg-rose-50 text-[#b3272c] font-semibold">
                        <td className="py-0.5 px-2">Late Payment Surcharge</td>
                        <td className="py-0.5 px-2 text-right">+ {surcharge.toLocaleString()}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Highlighted Amount Received Box */}
              <div className="bg-[#eff4ff] border-2 border-[#122b54]/30 rounded-lg p-2.5 mb-2.5">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#122b54]">
                      verified
                    </span>
                    <span className="font-bold text-[#001639] text-xs uppercase">
                      Total Received in Cash
                    </span>
                  </div>
                  <span className="font-mono font-black text-sm text-[#001639]">
                    PKR {actualPaid.toLocaleString()}
                  </span>
                </div>
                <div className="text-[9px] text-slate-600 italic">
                  <strong>In words:</strong> {amountInWords}
                </div>
                <div className="mt-1 pt-1 border-t border-blue-200/60 flex items-center justify-between text-[8.5px] text-slate-500">
                  <span>Channel: {paymentChannel}</span>
                  <span className="font-mono font-semibold text-emerald-700">STATUS: PAID IN FULL</span>
                </div>
              </div>
            </div>

            {/* Verification Stamp & Signatures */}
            <div className="pt-2 border-t border-slate-200 mt-1">
              <div className="grid grid-cols-2 gap-3 mb-1.5">
                <div className="h-12 border border-slate-200 rounded p-1 flex flex-col justify-end text-center bg-slate-50/50">
                  <span className="text-[8px] uppercase tracking-wider text-slate-500 font-semibold border-t border-slate-300 pt-0.5">
                    Student / Depositor Signature
                  </span>
                </div>
                <div className={`h-12 border-2 border-dashed ${part.stampTone} rounded p-1 flex flex-col items-center justify-center text-center bg-slate-50/50 relative overflow-hidden`}>
                  <span className="text-[7.5px] uppercase tracking-wider font-extrabold leading-tight">
                    ★ EAGLETS ACCOUNTS ★
                  </span>
                  <span className="text-[8.5px] font-black uppercase tracking-widest text-[#122b54]">
                    CASH RECEIVED
                  </span>
                  <span className="text-[7px] text-slate-500 font-mono">
                    {todayDateStr} • DESK-01
                  </span>
                </div>
              </div>
              <p className="text-[7.5px] text-slate-400 text-center leading-tight">
                Computer-generated Cash Receipt Voucher • Official Record of Eaglets Schools System Lahore
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

