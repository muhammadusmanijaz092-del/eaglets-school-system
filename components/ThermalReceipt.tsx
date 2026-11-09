'use client'

import React from 'react'

interface ThermalReceiptProps {
  receiptNo?: string
  studentName?: string
  rollNo?: string
  className?: string
  amountPaid?: number
  paymentDate?: string
  cashierName?: string
  remarks?: string
}

export default function ThermalReceipt({
  receiptNo = 'REC-POS-90412',
  studentName = 'Muhammad Rayyan Butt',
  rollNo = 'EAG-10-042',
  className = 'Grade 10 - Science A (Rose)',
  amountPaid = 17500,
  paymentDate = 'Monday, 16 Sep 2026 11:45 AM',
  cashierName = 'M. Tariq Alvi / Admin Cashier',
  remarks = 'Monthly Fee - October 2026',
}: ThermalReceiptProps) {
  return (
    <div className="printable-area max-w-sm mx-auto bg-white p-5 rounded-lg border border-slate-300 shadow-sm font-mono text-xs text-slate-900">
      <div className="flex justify-between items-center mb-3 pb-2 border-b border-dashed border-slate-300 no-print">
        <span className="font-sans text-[11px] font-bold text-[#b3272c] uppercase">
          80mm Thermal Cash Receipt
        </span>
        <button
          type="button"
          onClick={() => window.print()}
          className="px-2.5 py-1 bg-slate-800 text-white text-[11px] font-sans font-bold rounded hover:bg-black transition-colors cursor-pointer"
        >
          Print Thermal Slip
        </button>
      </div>

      {/* Header */}
      <div className="text-center pb-3 border-b border-dashed border-slate-400">
        <div className="w-10 h-10 mx-auto rounded-lg bg-white p-0.5 border border-slate-300 overflow-hidden mb-1">
          <img
            src="/images/eaglets-logo.jpg"
            alt="Eaglets Schools Logo"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="font-baldwins font-bold text-sm tracking-wider uppercase mt-1">
          EAGLETS SCHOOLS
        </div>
        <div className="font-aster text-[9.5px] text-[#b3272c] font-semibold">
          Rebirth Of Knowledge & Character
        </div>
        <div className="text-[10px] text-slate-600 uppercase mt-0.5">
          Main Boys Campus, Lahore
        </div>
        <div className="text-[10px] text-slate-500 mt-0.5">
          Tel: +92 42 35889900
        </div>
        <div className="mt-2 text-[11px] font-bold bg-slate-100 py-0.5 uppercase">
          *** CASH COUNTER RECEIPT ***
        </div>
      </div>

      {/* Metadata */}
      <div className="py-2.5 border-b border-dashed border-slate-400 space-y-1 text-[11px]">
        <div className="flex justify-between">
          <span>Receipt #:</span>
          <span className="font-bold">{receiptNo}</span>
        </div>
        <div className="flex justify-between">
          <span>Date/Time:</span>
          <span>{paymentDate}</span>
        </div>
        <div className="flex justify-between">
          <span>Cashier:</span>
          <span className="truncate max-w-[150px]">{cashierName}</span>
        </div>
      </div>

      {/* Student Details */}
      <div className="py-2.5 border-b border-dashed border-slate-400 space-y-1 text-[11px]">
        <div className="flex justify-between">
          <span>Student:</span>
          <span className="font-bold">{studentName}</span>
        </div>
        <div className="flex justify-between">
          <span>Roll No:</span>
          <span className="font-bold">{rollNo}</span>
        </div>
        <div className="flex justify-between">
          <span>Class:</span>
          <span>{className}</span>
        </div>
        <div className="flex justify-between">
          <span>Description:</span>
          <span>{remarks}</span>
        </div>
      </div>

      {/* Billing Total */}
      <div className="py-3 border-b border-dashed border-slate-400 space-y-1.5">
        <div className="flex justify-between text-xs">
          <span>Gross Bill:</span>
          <span>PKR {amountPaid.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span>Concession / Disc:</span>
          <span>PKR 0</span>
        </div>
        <div className="flex justify-between text-sm font-bold pt-1 border-t border-slate-200">
          <span>NET CASH PAID:</span>
          <span>PKR {amountPaid.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-[10px] text-slate-500">
          <span>Payment Channel:</span>
          <span>DIRECT COUNTER CASH</span>
        </div>
      </div>

      {/* Barcode Simulation & Footer */}
      <div className="pt-3 text-center space-y-2">
        <div className="flex justify-center items-center gap-0.5 h-8">
          {[4, 2, 6, 2, 5, 1, 3, 4, 2, 7, 1, 4, 3, 2, 5, 2, 4, 1, 6, 3, 2].map(
            (w, i) => (
              <div
                key={i}
                className="bg-slate-900 h-full"
                style={{ width: `${w}px` }}
              ></div>
            )
          )}
        </div>
        <div className="text-[10px] text-slate-500 font-mono tracking-widest">
          *{receiptNo}*
        </div>
        <div className="text-[9px] text-slate-500 leading-tight">
          Computer generated official transaction receipt.
          <br />
          Thank you for choosing Eaglets Schools!
        </div>
      </div>
    </div>
  )
}

