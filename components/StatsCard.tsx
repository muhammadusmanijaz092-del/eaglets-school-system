import React from 'react'

interface StatsCardProps {
  title: string
  value: string
  subValue?: string
  icon: string
  accentColor?: 'navy' | 'crimson' | 'gold' | 'emerald'
  progressPercent?: number
  footerText?: string
  secondaryFooterText?: string
}

export default function StatsCard({
  title,
  value,
  subValue,
  icon,
  accentColor = 'navy',
  progressPercent,
  footerText,
  secondaryFooterText,
}: StatsCardProps) {
  const accentClasses = {
    navy: {
      bar: 'bg-[#001639]',
      iconBg: 'bg-[#eff4ff] text-[#001639]',
      text: 'text-[#001639]',
      prog: 'bg-[#001639]',
    },
    crimson: {
      bar: 'bg-[#b3272c]',
      iconBg: 'bg-[#ffdad7] text-[#b3272c]',
      text: 'text-[#b3272c]',
      prog: 'bg-[#b3272c]',
    },
    gold: {
      bar: 'bg-[#f5bc71]',
      iconBg: 'bg-[#ffddb5] text-[#633f00]',
      text: 'text-[#402700]',
      prog: 'bg-[#b4833e]',
    },
    emerald: {
      bar: 'bg-emerald-600',
      iconBg: 'bg-emerald-50 text-emerald-700',
      text: 'text-emerald-700',
      prog: 'bg-emerald-600',
    },
  }[accentColor]

  return (
    <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-200/80 flex flex-col justify-between group hover:shadow-md transition-shadow relative overflow-hidden">
      {/* Top 3px accent line */}
      <div className={`h-1 w-full absolute top-0 left-0 ${accentClasses.bar}`}></div>

      {/* Top Section */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            {title}
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`text-2xl font-bold font-domine ${accentClasses.text}`}>
              {value}
            </span>
            {subValue && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-semibold">
                {subValue}
              </span>
            )}
          </div>
        </div>
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${accentClasses.iconBg}`}
        >
          <span className="material-symbols-outlined text-[22px]">{icon}</span>
        </div>
      </div>

      {/* Bottom Progress / Submetrics */}
      {(progressPercent !== undefined || footerText) && (
        <div className="mt-4 pt-2 border-t border-slate-100 flex flex-col gap-1.5">
          {progressPercent !== undefined && (
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-1.5 rounded-full ${accentClasses.prog}`}
                style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
              ></div>
            </div>
          )}
          <div className="flex justify-between items-center text-xs text-slate-600">
            {footerText && <span>{footerText}</span>}
            {secondaryFooterText && (
              <span className="font-semibold">{secondaryFooterText}</span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
