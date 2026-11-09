'use client'

import React, { useState, useEffect } from 'react'
import Modal from '@/components/Modal'
import PrintableChallan from '@/components/PrintableChallan'
import ThermalReceipt from '@/components/ThermalReceipt'
import {
  INITIAL_INVOICES,
  INITIAL_CLASSES,
} from '@/lib/mock-data'
import { FeeInvoiceItem } from '@/lib/supabase/types'
import { createClient } from '@/lib/supabase/client'

export default function FinancePage() {
  const [invoices, setInvoices] = useState<FeeInvoiceItem[]>(INITIAL_INVOICES)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'All' | 'Paid' | 'Unpaid' | 'Arrears'>('All')

  // Modals State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isChallanModalOpen, setIsChallanModalOpen] = useState(false)
  const [isThermalModalOpen, setIsThermalModalOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<FeeInvoiceItem>(invoices[0])
  const [batchGeneratedNotice, setBatchGeneratedNotice] = useState(false)

  // Payment Settlement Form State
  const [paymentChannel, setPaymentChannel] = useState<
    'Cash Counter' | 'Bank Challan' | 'JazzCash'
  >('Cash Counter')

  const [isLateSettlement, setIsLateSettlement] = useState(false)
  const [enteredAmount, setEnteredAmount] = useState<number>(14500)
  const [paymentForm, setPaymentForm] = useState({
    invoice_id: invoices[0]?.id || '',
    student_id: invoices[0]?.student_id || '',
    bank_name: 'Habib Bank Limited (HBL)',
    challan_ref: 'HBL-B-2026-891',
    jazzcash_tid: 'JC-9028172901',
    sender_mobile: '+92 300 4581290',
    cashier_notes: 'Paid at campus cash counter',
  })

  // Load from Supabase if connected
  useEffect(() => {
    const supabase = createClient()
    if (!supabase) return

    const loadInvoices = async () => {
      try {
        const { data, error } = await supabase
          .from('fee_invoices')
          .select('*')
          .order('created_at', { ascending: false })
        if (!error && data && data.length > 0) {
          setInvoices(data as FeeInvoiceItem[])
        }
      } catch (err) {
        console.warn('Falling back to local invoices:', err)
      }
    }

    loadInvoices()
  }, [])

  // Aggregate KPI Calculations
  const totalGrossTuition = invoices.reduce(
    (acc, inv) => acc + (inv.tuition_amount_pkr || 0),
    0
  )
  const totalConcessions = invoices.reduce(
    (acc, inv) => acc + (inv.concession_amount_pkr || 0),
    0
  )
  const totalAddlCharges = invoices.reduce(
    (acc, inv) => acc + (inv.additional_charges_pkr || 0),
    0
  )
  const totalArrears = invoices.reduce(
    (acc, inv) => acc + (inv.arrears_amount_pkr || 0),
    0
  )
  const totalRealizedCollections = invoices.reduce(
    (acc, inv) => acc + (inv.paid_amount_pkr || 0),
    0
  )
  const totalOutstandingBalance = invoices.reduce(
    (acc, inv) =>
      acc + (inv.status === 'Unpaid' ? (inv.net_balance_pkr || inv.total_before_due_date_pkr || inv.total_due_pkr) : 0),
    0
  )

  // Filtered Invoices
  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoice_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.challan_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inv.student_name &&
        inv.student_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (inv.roll_no &&
        inv.roll_no.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (inv.discount_type &&
        inv.discount_type.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesStatus =
      statusFilter === 'All'
        ? true
        : statusFilter === 'Paid'
        ? inv.status === 'Paid'
        : statusFilter === 'Unpaid'
        ? inv.status === 'Unpaid'
        : (inv.arrears_amount_pkr || 0) > 0

    return matchesSearch && matchesStatus
  })

  // Open Payment Modal with target invoice preloaded
  const handleOpenPayment = (inv: FeeInvoiceItem) => {
    setSelectedInvoice(inv)
    const defaultAmount = inv.total_before_due_date_pkr || inv.total_due_pkr
    setEnteredAmount(defaultAmount)
    setIsLateSettlement(false)
    setPaymentForm({
      ...paymentForm,
      invoice_id: inv.id,
      student_id: inv.student_id,
      challan_ref: `CH-DEP-${inv.challan_no.replace('CH-', '')}`,
    })
    setIsPaymentModalOpen(true)
  }

  // Handle Payment Settlement
  const handleSettlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedInvoice) return

    const targetPayable = isLateSettlement
      ? selectedInvoice.total_after_due_date_pkr || selectedInvoice.total_due_pkr + 500
      : selectedInvoice.total_before_due_date_pkr || selectedInvoice.total_due_pkr

    const calculatedBalance = Math.max(0, targetPayable - enteredAmount)
    const isFullyPaid = calculatedBalance === 0

    const updatedInvoices = invoices.map((inv) => {
      if (inv.id === selectedInvoice.id) {
        return {
          ...inv,
          status: isFullyPaid ? ('Paid' as const) : ('Unpaid' as const),
          paid_amount_pkr: (inv.paid_amount_pkr || 0) + enteredAmount,
          net_balance_pkr: calculatedBalance,
        }
      }
      return inv
    })

    setInvoices(updatedInvoices)
    setIsPaymentModalOpen(false)

    // Sync to Supabase in background
    const supabase = createClient()
    if (supabase) {
      try {
        await supabase
          .from('fee_invoices')
          .update({
            status: isFullyPaid ? 'Paid' : 'Unpaid',
            paid_amount_pkr: (selectedInvoice.paid_amount_pkr || 0) + enteredAmount,
            net_balance_pkr: calculatedBalance,
          })
          .eq('id', selectedInvoice.id)
      } catch (err) {
        console.error('Supabase invoice update error:', err)
      }
    }

    // If cash counter, prompt thermal receipt
    if (paymentChannel === 'Cash Counter') {
      setIsThermalModalOpen(true)
    }
  }

  // Handle Batch Generation Notice
  const handleBatchGenerate = () => {
    setBatchGeneratedNotice(true)
    setTimeout(() => setBatchGeneratedNotice(false), 5000)
  }

  return (
    <div className="px-3 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col gap-4 sm:gap-6 min-w-0">
      {/* Top Banner */}
      <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-[#eff4ff] text-[#001639] text-[10px] font-bold uppercase tracking-wider">
              Pakistani Statutory Fee Ledger & Reconciliation
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500">Post-10th Surcharge & Scholarship Ledger</span>
          </div>
          <h1 className="font-domine text-2xl font-bold text-[#001639]">
            Fee & Finance Ledger Overhaul
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated 3-part bank fee challans (Bank/School/Student copies), NADRA student concessions, prior arrears tracking & post-10th PKR 500 late surcharge calculations.
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
            onClick={() => handleOpenPayment(invoices[0])}
            className="h-9 px-3.5 bg-[#b3272c] hover:bg-[#88131b] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[17px]">receipt_long</span>
            <span>+ Record Fee Payment</span>
          </button>
        </div>
      </div>

      {batchGeneratedNotice && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs flex items-center justify-between shadow-xs">
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-emerald-600">
              check_circle
            </span>
            Batch Fee Invoices for October 2026 generated! 1,842 Challans dispatched to parent portal & HBL/Meezan CMS.
          </span>
          <button
            onClick={() => setBatchGeneratedNotice(false)}
            className="text-emerald-700 hover:text-emerald-900 cursor-pointer font-bold px-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Financial Overview KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Gross Tuition */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Gross Tuition</span>
            <span className="material-symbols-outlined text-[20px] text-blue-600">account_balance</span>
          </div>
          <div className="mt-2">
            <span className="text-lg sm:text-xl font-bold font-mono text-[#001639]">
              PKR {totalGrossTuition.toLocaleString()}
            </span>
            <p className="text-[10px] text-slate-400 mt-0.5">Approved campus tariff</p>
          </div>
        </div>

        {/* Scholarships / Concessions */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Concessions</span>
            <span className="material-symbols-outlined text-[20px] text-emerald-600">loyalty</span>
          </div>
          <div className="mt-2">
            <span className="text-lg sm:text-xl font-bold font-mono text-emerald-600">
              - PKR {totalConcessions.toLocaleString()}
            </span>
            <p className="text-[10px] text-slate-400 mt-0.5">Kinship, Merit & Orphans</p>
          </div>
        </div>

        {/* Addl Charges */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Funds & Charges</span>
            <span className="material-symbols-outlined text-[20px] text-amber-600">science</span>
          </div>
          <div className="mt-2">
            <span className="text-lg sm:text-xl font-bold font-mono text-slate-800">
              + PKR {totalAddlCharges.toLocaleString()}
            </span>
            <p className="text-[10px] text-slate-400 mt-0.5">Lab, Exam, Dev & Library</p>
          </div>
        </div>

        {/* Realized Collections */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Realized Paid</span>
            <span className="material-symbols-outlined text-[20px] text-[#001639]">payments</span>
          </div>
          <div className="mt-2">
            <span className="text-lg sm:text-xl font-bold font-mono text-[#001639]">
              PKR {totalRealizedCollections.toLocaleString()}
            </span>
            <p className="text-[10px] text-slate-400 mt-0.5">Cash counter & bank cleared</p>
          </div>
        </div>

        {/* Prior Arrears / Outstanding */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Net Receivables</span>
            <span className="material-symbols-outlined text-[20px] text-[#b3272c]">warning</span>
          </div>
          <div className="mt-2">
            <span className="text-lg sm:text-xl font-bold font-mono text-[#b3272c]">
              PKR {totalOutstandingBalance.toLocaleString()}
            </span>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Includes PKR {totalArrears.toLocaleString()} prior arrears
            </p>
          </div>
        </div>
      </div>

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
              placeholder="Search Challan No, Roll No, Student, or Concession..."
              className="w-full h-9 pl-9 pr-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639]"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
            {(['All', 'Paid', 'Unpaid', 'Arrears'] as const).map((st) => (
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

      {/* Overhauled Pakistani Fee Ledger Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Challan / Inv #</th>
                <th className="py-3 px-3">Student & Roll No</th>
                <th className="py-3 px-3">Class</th>
                <th className="py-3 px-3">Base Tuition</th>
                <th className="py-3 px-3">Scholarship / Concession</th>
                <th className="py-3 px-3">Adjusted Tuition</th>
                <th className="py-3 px-3">Addl Funds</th>
                <th className="py-3 px-3">Prior Arrears</th>
                <th className="py-3 px-3">Payable Before 10th</th>
                <th className="py-3 px-3">Late Fee</th>
                <th className="py-3 px-3">Payable After 10th</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredInvoices.map((inv) => {
                const baseTuition = inv.tuition_amount_pkr || 14000
                const concession = inv.concession_amount_pkr || 0
                const adjustedTuition = inv.adjusted_tuition_pkr ?? Math.max(0, baseTuition - concession)
                const addlCharges = inv.additional_charges_pkr || 4000
                const arrears = inv.arrears_amount_pkr || 0
                const beforeDueDate = inv.total_before_due_date_pkr || (adjustedTuition + addlCharges + arrears)
                const lateFee = inv.late_surcharge_pkr || 500
                const afterDueDate = inv.total_after_due_date_pkr || (beforeDueDate + lateFee)

                return (
                  <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Challan No */}
                    <td className="py-3 px-4 font-mono font-bold text-[#001639]">
                      {inv.challan_no}
                    </td>

                    {/* Student & Roll No */}
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

                    {/* Class */}
                    <td className="py-3 px-3 text-slate-600 font-medium">
                      {inv.class_name}
                    </td>

                    {/* Base Tuition */}
                    <td className="py-3 px-3 font-mono text-slate-700">
                      PKR {baseTuition.toLocaleString()}
                    </td>

                    {/* Scholarship / Concession */}
                    <td className="py-3 px-3">
                      {inv.discount_type && inv.discount_type !== 'None' ? (
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                            inv.discount_type === 'Merit'
                              ? 'bg-amber-100 text-amber-800'
                              : inv.discount_type === 'Kinship'
                              ? 'bg-blue-100 text-blue-800'
                              : inv.discount_type === 'Orphan'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[11px]">loyalty</span>
                          {inv.discount_type} (-PKR {concession.toLocaleString()})
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">—</span>
                      )}
                    </td>

                    {/* Adjusted Tuition */}
                    <td className="py-3 px-3 font-mono font-semibold text-[#001639]">
                      PKR {adjustedTuition.toLocaleString()}
                    </td>

                    {/* Addl Funds */}
                    <td className="py-3 px-3 font-mono text-slate-600">
                      +PKR {addlCharges.toLocaleString()}
                    </td>

                    {/* Prior Arrears */}
                    <td className="py-3 px-3 font-mono">
                      {arrears > 0 ? (
                        <span className="font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                          PKR {arrears.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-slate-400">PKR 0</span>
                      )}
                    </td>

                    {/* Total Before 10th */}
                    <td className="py-3 px-3 font-mono font-bold text-slate-900 bg-slate-50/50">
                      PKR {beforeDueDate.toLocaleString()}
                    </td>

                    {/* Late Fee */}
                    <td className="py-3 px-3 font-mono text-[#b3272c] font-medium">
                      +PKR {lateFee.toLocaleString()}
                    </td>

                    {/* Total After 10th */}
                    <td className="py-3 px-3 font-mono font-bold text-[#b3272c]">
                      PKR {afterDueDate.toLocaleString()}
                    </td>

                    {/* Status */}
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

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedInvoice(inv)
                            setIsChallanModalOpen(true)
                          }}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-[#001639] font-bold rounded text-[11px] transition-colors cursor-pointer flex items-center gap-1"
                          title="View 3-Part Bank Challan"
                        >
                          <span className="material-symbols-outlined text-[13px] text-[#f5bc71]">
                            receipt
                          </span>
                          <span>3-Part Slip</span>
                        </button>

                        {inv.status === 'Unpaid' ? (
                          <button
                            type="button"
                            onClick={() => handleOpenPayment(inv)}
                            className="px-2.5 py-1 bg-[#b3272c] hover:bg-[#88131b] text-white font-bold rounded text-[11px] transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                          >
                            <span className="material-symbols-outlined text-[13px]">
                              point_of_sale
                            </span>
                            <span>Settle</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedInvoice(inv)
                              setIsThermalModalOpen(true)
                            }}
                            className="px-2 py-1 bg-slate-800 hover:bg-black text-white font-bold rounded text-[11px] transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-[13px]">
                              print
                            </span>
                            <span>POS Slip</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Entry Modal (3 Settlement Channels + Real-Time Pakistani Ledger Breakdown) */}
      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        title="Fee Payment Entry & Channel Settlement"
        subtitle={`Challan: ${selectedInvoice?.challan_no} • Student: ${selectedInvoice?.student_name} (${selectedInvoice?.roll_no})`}
        maxWidth="2xl"
      >
        <form onSubmit={handleSettlePayment} className="flex flex-col gap-4 text-xs">
          {/* Real-Time Ledger Breakdown Card */}
          {selectedInvoice && (
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 mb-2.5">
                <span className="font-bold text-[#001639] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#f5bc71]">
                    calculate
                  </span>
                  Challan Breakdown ({selectedInvoice.billing_month})
                </span>
                <span className="text-[11px] font-semibold text-slate-500">
                  Due: 10th of Billing Month
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                <div className="p-2 rounded bg-white border border-slate-200/60">
                  <span className="text-slate-400 block text-[10px]">Base Tuition</span>
                  <span className="font-bold text-slate-800 font-mono">
                    PKR {(selectedInvoice.tuition_amount_pkr || 14000).toLocaleString()}
                  </span>
                </div>

                <div className="p-2 rounded bg-white border border-slate-200/60">
                  <span className="text-slate-400 block text-[10px]">
                    Scholarship ({selectedInvoice.discount_type || 'None'})
                  </span>
                  <span className="font-bold text-emerald-600 font-mono">
                    -PKR {(selectedInvoice.concession_amount_pkr || 0).toLocaleString()}
                  </span>
                </div>

                <div className="p-2 rounded bg-white border border-slate-200/60">
                  <span className="text-slate-400 block text-[10px]">Adjusted Tuition</span>
                  <span className="font-bold text-[#001639] font-mono">
                    PKR {((selectedInvoice.adjusted_tuition_pkr ?? (selectedInvoice.tuition_amount_pkr - (selectedInvoice.concession_amount_pkr || 0)))).toLocaleString()}
                  </span>
                </div>

                <div className="p-2 rounded bg-white border border-slate-200/60">
                  <span className="text-slate-400 block text-[10px]">Prior Arrears</span>
                  <span className="font-bold text-amber-700 font-mono">
                    PKR {(selectedInvoice.arrears_amount_pkr || 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Due Date / Late Surcharge Toggle */}
              <div className="mt-3 p-2.5 rounded-lg bg-amber-50/80 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-amber-700">
                    schedule
                  </span>
                  <div>
                    <p className="font-bold text-amber-950 text-[11px]">Payment Timing</p>
                    <p className="text-[10px] text-amber-800">
                      Standard due date is 10th. Post-10th surcharge is PKR 500.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsLateSettlement(false)
                      setEnteredAmount(selectedInvoice.total_before_due_date_pkr || 14500)
                    }}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer transition-all ${
                      !isLateSettlement
                        ? 'bg-[#001639] text-white shadow-2xs'
                        : 'bg-white text-slate-700 border border-slate-200'
                    }`}
                  >
                    Before 10th (PKR {(selectedInvoice.total_before_due_date_pkr || 14500).toLocaleString()})
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsLateSettlement(true)
                      setEnteredAmount(selectedInvoice.total_after_due_date_pkr || 15000)
                    }}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer transition-all ${
                      isLateSettlement
                        ? 'bg-[#b3272c] text-white shadow-2xs'
                        : 'bg-white text-slate-700 border border-slate-200'
                    }`}
                  >
                    After 10th (+PKR 500)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Amount Paid Input & Real Time Balance */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Amount Received (PKR)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                  PKR
                </span>
                <input
                  type="number"
                  value={enteredAmount}
                  onChange={(e) => setEnteredAmount(Number(e.target.value) || 0)}
                  className="w-full h-9 pl-12 pr-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#001639] font-mono font-bold text-sm"
                  required
                />
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-100 border border-slate-200 flex flex-col justify-center">
              <span className="text-[10px] text-slate-500 font-medium">Resulting Net Balance</span>
              <span
                className={`text-base font-bold font-mono ${
                  Math.max(
                    0,
                    (isLateSettlement
                      ? selectedInvoice?.total_after_due_date_pkr || 15000
                      : selectedInvoice?.total_before_due_date_pkr || 14500) - enteredAmount
                  ) === 0
                    ? 'text-emerald-600'
                    : 'text-[#b3272c]'
                }`}
              >
                PKR{' '}
                {Math.max(
                  0,
                  (isLateSettlement
                    ? selectedInvoice?.total_after_due_date_pkr || 15000
                    : selectedInvoice?.total_before_due_date_pkr || 14500) - enteredAmount
                ).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Channel Selector */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Settlement Channel
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Cash Counter', 'Bank Challan', 'JazzCash'] as const).map((ch) => (
                <button
                  key={ch}
                  type="button"
                  onClick={() => setPaymentChannel(ch)}
                  className={`p-2.5 rounded-lg border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                    paymentChannel === ch
                      ? 'border-[#001639] bg-[#eff4ff] text-[#001639] font-bold shadow-2xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {ch === 'Cash Counter'
                      ? 'point_of_sale'
                      : ch === 'Bank Challan'
                      ? 'account_balance'
                      : 'phone_android'}
                  </span>
                  <span className="text-xs">{ch}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Fields Based on Channel */}
          {paymentChannel === 'Cash Counter' && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 text-xs">
              <span className="font-bold text-slate-800 block mb-1">
                Campus Cash Desk Settlement
              </span>
              Cash collected at admin fee window. Submitting will immediately trigger an 80mm thermal receipt slip for the parent.
            </div>
          )}

          {paymentChannel === 'Bank Challan' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Designated Bank
                </label>
                <select
                  value={paymentForm.bank_name}
                  onChange={(e) =>
                    setPaymentForm({ ...paymentForm, bank_name: e.target.value })
                  }
                  className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                >
                  <option value="Habib Bank Limited (HBL)">Habib Bank Limited (HBL)</option>
                  <option value="Meezan Bank Limited">Meezan Bank Limited (Islamic)</option>
                  <option value="Bank Alfalah">Bank Alfalah</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Bank Scroll / Deposit Ref #
                </label>
                <input
                  type="text"
                  value={paymentForm.challan_ref}
                  onChange={(e) =>
                    setPaymentForm({ ...paymentForm, challan_ref: e.target.value })
                  }
                  className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs"
                  placeholder="e.g. HBL-DEP-8492"
                />
              </div>
            </div>
          )}

          {paymentChannel === 'JazzCash' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  JazzCash / EasyPaisa Transaction ID (TID)
                </label>
                <input
                  type="text"
                  value={paymentForm.jazzcash_tid}
                  onChange={(e) =>
                    setPaymentForm({ ...paymentForm, jazzcash_tid: e.target.value })
                  }
                  className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs"
                  placeholder="e.g. JC-9028172901"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Sender Mobile Wallet #
                </label>
                <input
                  type="text"
                  value={paymentForm.sender_mobile}
                  onChange={(e) =>
                    setPaymentForm({ ...paymentForm, sender_mobile: e.target.value })
                  }
                  className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs"
                />
              </div>
            </div>
          )}

          {/* Cashier Notes */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Internal Cashier Memo / Audit Notes
            </label>
            <input
              type="text"
              value={paymentForm.cashier_notes}
              onChange={(e) =>
                setPaymentForm({ ...paymentForm, cashier_notes: e.target.value })
              }
              className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsPaymentModalOpen(false)}
              className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 cursor-pointer font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#b3272c] hover:bg-[#88131b] text-white font-bold rounded-lg shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span>Confirm & Record Settlement</span>
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
          subtitle={`Challan: ${selectedInvoice.challan_no} • Student: ${selectedInvoice.student_name}`}
          maxWidth="5xl"
        >
          <PrintableChallan
            challanNo={selectedInvoice.challan_no}
            studentName={selectedInvoice.student_name}
            rollNo={selectedInvoice.roll_no}
            className={selectedInvoice.class_name}
            tuitionFee={selectedInvoice.tuition_amount_pkr}
            concessionAmount={selectedInvoice.concession_amount_pkr}
            discountType={selectedInvoice.discount_type}
            labFund={selectedInvoice.lab_amount_pkr}
            examFund={selectedInvoice.exam_amount_pkr}
            devFund={selectedInvoice.development_amount_pkr}
            libraryFund={selectedInvoice.library_amount_pkr}
            arrearsAmount={selectedInvoice.arrears_amount_pkr}
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
            amountPaid={enteredAmount || selectedInvoice.total_before_due_date_pkr || 14500}
          />
        </Modal>
      )}
    </div>
  )
}
