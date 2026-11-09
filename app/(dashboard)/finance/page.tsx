'use client'

import React, { useState, useEffect } from 'react'
import Modal from '@/components/Modal'
import PrintableChallan from '@/components/PrintableChallan'
import ThermalReceipt from '@/components/ThermalReceipt'
import {
  INITIAL_INVOICES,
  INITIAL_STUDENTS,
  INITIAL_CLASSES,
} from '@/lib/mock-data'
import { FeeInvoiceItem } from '@/lib/supabase/types'
import { createClient } from '@/lib/supabase/client'

export default function FinancePage() {
  const [invoices, setInvoices] = useState<FeeInvoiceItem[]>(INITIAL_INVOICES)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'All' | 'Paid' | 'Unpaid'>('All')

  // Modals State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isChallanModalOpen, setIsChallanModalOpen] = useState(false)
  const [isThermalModalOpen, setIsThermalModalOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<FeeInvoiceItem>(invoices[0])
  const [batchGeneratedNotice, setBatchGeneratedNotice] = useState(false)

  // Payment Form State (3 Channels)
  const [paymentChannel, setPaymentChannel] = useState<
    'Cash Counter' | 'Bank Challan' | 'JazzCash'
  >('Cash Counter')

  const [paymentForm, setPaymentForm] = useState({
    invoice_id: invoices[0]?.id || '',
    student_id: invoices[0]?.student_id || '',
    amount_paid: invoices[0]?.total_due_pkr || 17500,
    bank_name: 'Habib Bank Limited (HBL)',
    challan_ref: '',
    jazzcash_tid: '',
    sender_mobile: '+92 300 4581290',
    cashier_notes: 'Paid at campus counter',
  })

  // Filtered Invoices
  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoice_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.challan_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inv.student_name &&
        inv.student_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (inv.roll_no &&
        inv.roll_no.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesStatus = statusFilter === 'All' || inv.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Handle Payment Settlement
  const handleSettlePayment = (e: React.FormEvent) => {
    e.preventDefault()
    // Mark invoice as paid
    setInvoices(
      invoices.map((inv) =>
        inv.id === paymentForm.invoice_id
          ? { ...inv, status: 'Paid', paid_amount_pkr: inv.total_due_pkr }
          : inv
      )
    )

    setIsPaymentModalOpen(false)

    // If cash counter, prompt thermal receipt
    if (paymentChannel === 'Cash Counter') {
      setIsThermalModalOpen(true)
    }
  }

  // Handle Batch Generation
  const handleBatchGenerate = () => {
    setBatchGeneratedNotice(true)
    setTimeout(() => setBatchGeneratedNotice(false), 5000)
  }

  return (
    <div className="px-8 py-6 flex flex-col gap-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-[#eff4ff] text-[#001639] text-[10px] font-bold uppercase tracking-wider">
              Fee Billing & Reconciliation Engine
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500">PKR Currency Matrix & Gateway Integration</span>
          </div>
          <h1 className="font-domine text-2xl font-bold text-[#001639]">
            Multi-Channel Fee Finance & Bank Challans
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated 3-part bank fee challan generation, campus POS counter receipts, and JazzCash/HBL/Meezan settlements.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={handleBatchGenerate}
            className="h-9 px-3.5 bg-slate-50 hover:bg-slate-100 text-[#001639] border border-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[17px] text-[#f5bc71]">
              bolt
            </span>
            <span>Batch Issue (October 2026)</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedInvoice(invoices[0])
              setIsPaymentModalOpen(true)
            }}
            className="h-9 px-3.5 bg-[#b3272c] hover:bg-[#88131b] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[17px]">receipt_long</span>
            <span>+ Record Fee Payment</span>
          </button>
        </div>
      </div>

      {batchGeneratedNotice && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-lg text-xs flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-emerald-600">
              check_circle
            </span>
            Batch Fee Invoices for October 2026 generated! 1,842 Challans dispatched to parent portal & HBL/Meezan CMS.
          </span>
          <button
            onClick={() => setBatchGeneratedNotice(false)}
            className="text-emerald-700 hover:text-emerald-900"
          >
            ✕
          </button>
        </div>
      )}

      {/* Campus Standard Monthly Tuition Matrix */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-domine text-sm font-bold text-[#001639] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#b3272c] text-[20px]">
                layers
              </span>
              Campus Standard Monthly Tuition Matrix (PKR Base)
            </h2>
            <p className="text-[11px] text-slate-500">
              Approved statutory fee structures for Main Boys Campus & Cambridge Model Wings
            </p>
          </div>
          <span className="px-2.5 py-1 rounded bg-[#eff4ff] text-[#001639] font-bold text-xs">
            Session 2026–2027
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 text-xs">
          {INITIAL_CLASSES.map((c) => (
            <div
              key={c.id}
              className="bg-slate-50 p-3 rounded-lg border border-slate-200/80 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">
                  {c.wing.split(' ')[0]} Wing
                </span>
                <span className="text-[10px] font-bold text-[#b3272c]">
                  {c.capacity} Seats
                </span>
              </div>
              <span className="font-domine font-bold text-slate-800 text-sm">
                {c.name}
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                {c.section}
              </span>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="font-bold text-[#001639] text-base font-mono">
                  PKR {c.monthly_tuition_pkr.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400">/mo</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1">
                Lab Fund: PKR {c.lab_charges_pkr}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Invoice Registry Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative min-w-[280px]">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Challan No, Roll No, or Student..."
              className="w-full h-9 pl-9 pr-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639]"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
            {(['All', 'Paid', 'Unpaid'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded font-semibold transition-colors cursor-pointer ${
                  statusFilter === st
                    ? 'bg-white text-[#001639] shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing <strong>{filteredInvoices.length}</strong> billing challans
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Challan / Inv #</th>
                <th className="py-3 px-3">Student Name & Roll No</th>
                <th className="py-3 px-3">Class</th>
                <th className="py-3 px-3">Billing Cycle</th>
                <th className="py-3 px-3">Total Due (PKR)</th>
                <th className="py-3 px-3">Due Date</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#001639]">
                    {inv.challan_no}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex flex-col">
                      <span className="font-bold text-[#001639]">
                        {inv.student_name}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {inv.roll_no}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-600 font-medium">
                    {inv.class_name}
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-700">
                    {inv.billing_month}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-800">
                    PKR {inv.total_due_pkr.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-slate-600 font-medium">
                    {inv.due_date}
                  </td>
                  <td className="py-3 px-3">
                    {inv.status === 'Paid' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="material-symbols-outlined text-[12px]">
                          check_circle
                        </span>
                        Paid
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-[#b3272c] border border-rose-200">
                        <span className="material-symbols-outlined text-[12px]">
                          pending_actions
                        </span>
                        Unpaid
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedInvoice(inv)
                          setIsChallanModalOpen(true)
                        }}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-[#001639] font-bold rounded text-[11px] transition-colors cursor-pointer"
                        title="View 3-Part Bank Challan"
                      >
                        3-Part Slip
                      </button>
                      {inv.status === 'Unpaid' ? (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedInvoice(inv)
                            setPaymentForm({
                              ...paymentForm,
                              invoice_id: inv.id,
                              student_id: inv.student_id,
                              amount_paid: inv.total_due_pkr,
                            })
                            setIsPaymentModalOpen(true)
                          }}
                          className="px-2.5 py-1 bg-[#b3272c] hover:bg-[#88131b] text-white font-bold rounded text-[11px] transition-colors cursor-pointer"
                        >
                          Settle
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedInvoice(inv)
                            setIsThermalModalOpen(true)
                          }}
                          className="px-2 py-1 bg-slate-800 hover:bg-black text-white font-bold rounded text-[11px] transition-colors cursor-pointer"
                        >
                          POS Slip
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Entry Modal (3 Settlement Channels) */}
      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        title="Fee Payment Entry & Channel Settlement"
        subtitle={`Invoice: ${selectedInvoice?.invoice_no} • Student: ${selectedInvoice?.student_name}`}
        maxWidth="2xl"
      >
        <form onSubmit={handleSettlePayment} className="flex flex-col gap-4 text-xs">
          {/* Channel Selector */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Select Settlement Channel *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'Cash Counter', icon: 'point_of_sale', label: 'Direct Cash Desk' },
                { id: 'Bank Challan', icon: 'account_balance', label: 'Bank Challan / Transfer' },
                { id: 'JazzCash', icon: 'phone_android', label: 'JazzCash / Till QR' },
              ].map((ch) => (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => setPaymentChannel(ch.id as any)}
                  className={`p-3 rounded-lg border flex flex-col items-center text-center gap-1 transition-all cursor-pointer ${
                    paymentChannel === ch.id
                      ? 'border-[#001639] bg-[#eff4ff] text-[#001639] font-bold shadow-2xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {ch.icon}
                  </span>
                  <span className="text-[11px]">{ch.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Amount Settling (PKR) *
              </label>
              <input
                type="number"
                required
                value={paymentForm.amount_paid}
                onChange={(e) =>
                  setPaymentForm({
                    ...paymentForm,
                    amount_paid: Number(e.target.value),
                  })
                }
                className="w-full h-9 px-3 font-mono font-bold text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639]"
              />
            </div>

            {paymentChannel === 'Cash Counter' && (
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Cashier Counter Station
                </label>
                <input
                  type="text"
                  readOnly
                  value="Campus Cash Desk 1 (M. Tariq Alvi)"
                  className="w-full h-9 px-3 bg-slate-100 text-slate-600 rounded-lg border border-slate-200"
                />
              </div>
            )}

            {paymentChannel === 'Bank Challan' && (
              <>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Partner Bank
                  </label>
                  <select
                    value={paymentForm.bank_name}
                    onChange={(e) =>
                      setPaymentForm({ ...paymentForm, bank_name: e.target.value })
                    }
                    className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="Habib Bank Limited (HBL)">Habib Bank Limited (HBL)</option>
                    <option value="Meezan Islamic Bank">Meezan Islamic Bank</option>
                    <option value="Allied Bank Limited (ABL)">Allied Bank Limited (ABL)</option>
                    <option value="Bank Alfalah">Bank Alfalah</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Bank Deposit Slip / Scroll Ref #
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. HBL-DEP-998822"
                    value={paymentForm.challan_ref}
                    onChange={(e) =>
                      setPaymentForm({ ...paymentForm, challan_ref: e.target.value })
                    }
                    className="w-full h-9 px-3 font-mono bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </>
            )}

            {paymentChannel === 'JazzCash' && (
              <>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    JazzCash Transaction ID (TID) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 0918274619"
                    value={paymentForm.jazzcash_tid}
                    onChange={(e) =>
                      setPaymentForm({ ...paymentForm, jazzcash_tid: e.target.value })
                    }
                    className="w-full h-9 px-3 font-mono bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Sender Mobile Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={paymentForm.sender_mobile}
                    onChange={(e) =>
                      setPaymentForm({ ...paymentForm, sender_mobile: e.target.value })
                    }
                    className="w-full h-9 px-3 font-mono bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </>
            )}
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Internal Reconciliation Remarks
            </label>
            <input
              type="text"
              value={paymentForm.cashier_notes}
              onChange={(e) =>
                setPaymentForm({ ...paymentForm, cashier_notes: e.target.value })
              }
              className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsPaymentModalOpen(false)}
              className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#b3272c] hover:bg-[#88131b] text-white font-bold rounded-lg shadow-sm cursor-pointer"
            >
              Confirm Settlement
            </button>
          </div>
        </form>
      </Modal>

      {/* 3-Part Challan Preview Modal */}
      {selectedInvoice && (
        <Modal
          isOpen={isChallanModalOpen}
          onClose={() => setIsChallanModalOpen(false)}
          title="Printable 3-Part Bank Challan"
          subtitle={`Challan: ${selectedInvoice.challan_no} • ${selectedInvoice.student_name}`}
          maxWidth="5xl"
        >
          <PrintableChallan
            challanNo={selectedInvoice.challan_no}
            studentName={selectedInvoice.student_name}
            rollNo={selectedInvoice.roll_no}
            className={selectedInvoice.class_name}
            tuitionFee={selectedInvoice.tuition_amount_pkr}
            labFund={selectedInvoice.lab_amount_pkr}
            examFund={selectedInvoice.exam_amount_pkr}
            devFund={selectedInvoice.development_amount_pkr}
            lateFee={selectedInvoice.late_surcharge_pkr}
            issueDate={selectedInvoice.issue_date}
            dueDate={selectedInvoice.due_date}
            expiryDate={selectedInvoice.expiry_date}
          />
        </Modal>
      )}

      {/* POS Thermal Receipt Modal */}
      {selectedInvoice && (
        <Modal
          isOpen={isThermalModalOpen}
          onClose={() => setIsThermalModalOpen(false)}
          title="POS Thermal Cash Receipt"
          subtitle="Instant 80mm Cash Desk Printout"
          maxWidth="md"
        >
          <ThermalReceipt
            receiptNo={`POS-${selectedInvoice.challan_no.replace('CH-', '')}`}
            studentName={selectedInvoice.student_name}
            rollNo={selectedInvoice.roll_no}
            className={selectedInvoice.class_name}
            amountPaid={selectedInvoice.total_due_pkr}
          />
        </Modal>
      )}
    </div>
  )
}

