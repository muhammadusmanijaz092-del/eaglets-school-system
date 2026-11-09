'use client'

import React, { useState } from 'react'
import Modal from '@/components/Modal'
import {
  INITIAL_CLASSES,
  INITIAL_DIARIES,
  INITIAL_TIMETABLE,
} from '@/lib/mock-data'
import { DailyDiaryItem, TimetableSlot } from '@/lib/supabase/types'

export default function AcademicsPage() {
  const [activeTab, setActiveTab] = useState<'timetable' | 'syllabus' | 'diary'>('timetable')
  const [selectedClass, setSelectedClass] = useState('Grade 10 - Science A')
  const [diaries, setDiaries] = useState<DailyDiaryItem[]>(INITIAL_DIARIES)
  const [isAddDiaryModalOpen, setIsAddDiaryModalOpen] = useState(false)
  const [syllabusTerm, setSyllabusTerm] = useState<'1st Term' | '2nd Term'>('1st Term')

  // New Diary Form State
  const [newDiary, setNewDiary] = useState({
    class_name: 'Grade 10 - Science A',
    section: 'Rose',
    subject_name: 'Physics',
    teacher_name: 'Engr. Masood Ahmad',
    classwork: '',
    homework: '',
    teacher_notes: '',
  })

  const handleAddDiary = (e: React.FormEvent) => {
    e.preventDefault()
    const item: DailyDiaryItem = {
      id: `d-${Date.now()}`,
      class_name: newDiary.class_name,
      section: newDiary.section,
      subject_name: newDiary.subject_name,
      teacher_name: newDiary.teacher_name,
      diary_date: 'Today, 16 Sep 2026',
      classwork: newDiary.classwork,
      homework: newDiary.homework,
      teacher_notes: newDiary.teacher_notes,
    }
    setDiaries([item, ...diaries])
    setIsAddDiaryModalOpen(false)
    setNewDiary({
      class_name: 'Grade 10 - Science A',
      section: 'Rose',
      subject_name: 'Physics',
      teacher_name: 'Engr. Masood Ahmad',
      classwork: '',
      homework: '',
      teacher_notes: '',
    })
  }

  const syllabusList = [
    {
      subject: 'Physics',
      chapters: 'Chapters 10 to 14 (Simple Harmonic Motion, Waves, Sound, Geometrical Optics)',
      size: '2.4 MB',
      term: '1st Term',
      compliance: 'BISE Punjab Approved',
    },
    {
      subject: 'Mathematics (Science)',
      chapters: 'Unit 1 to 4 (Quadratic Equations, Theory of Quadratic Equations, Variations, Partial Fractions)',
      size: '3.1 MB',
      term: '1st Term',
      compliance: 'PTB Lahore',
    },
    {
      subject: 'Chemistry',
      chapters: 'Chapters 9 to 12 (Chemical Equilibrium, Acids Bases & Salts, Organic Chemistry, Hydrocarbons)',
      size: '1.9 MB',
      term: '1st Term',
      compliance: 'BISE Punjab Approved',
    },
    {
      subject: 'English Compulsory',
      chapters: 'Lessons 1 to 7, Grammar Composition (Active/Passive, Direct/Indirect, Essays 1-10)',
      size: '4.2 MB',
      term: '1st Term',
      compliance: 'Punjab Curriculum Textbook Board',
    },
    {
      subject: 'Islamiat & Nazra',
      chapters: 'Surah Al-Ahzab (Ayat 1-40), Hadith 1 to 10, Faraiz-o-Wajibat',
      size: '1.5 MB',
      term: '1st Term',
      compliance: 'National Curriculum Council',
    },
  ]

  const periods = [1, 2, 3, 4, 5, 6, 7, 8]
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  return (
    <div className="px-8 py-6 flex flex-col gap-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-[#eff4ff] text-[#001639] text-[10px] font-bold uppercase tracking-wider">
              Academic Operations Hub
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500">Curriculum & Classwork Registry</span>
          </div>
          <h1 className="font-domine text-2xl font-bold text-[#001639]">
            Timetable, Syllabus & Daily Diary
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Weekly 8-period schedule grid, term-wise downloadable syllabus documents, and parent daily diaries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'diary' && (
            <button
              type="button"
              onClick={() => setIsAddDiaryModalOpen(true)}
              className="h-9 px-3.5 bg-[#b3272c] hover:bg-[#88131b] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[17px]">edit_note</span>
              <span>+ Post Daily Diary</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl text-xs w-full sm:w-auto self-start">
        <button
          type="button"
          onClick={() => setActiveTab('timetable')}
          className={`px-4 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'timetable'
              ? 'bg-white text-[#001639] shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span className="material-symbols-outlined text-[17px]">calendar_month</span>
          <span>Weekly Timetable Grid</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('syllabus')}
          className={`px-4 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'syllabus'
              ? 'bg-white text-[#001639] shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span className="material-symbols-outlined text-[17px]">menu_book</span>
          <span>Syllabus Repository</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('diary')}
          className={`px-4 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'diary'
              ? 'bg-white text-[#001639] shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span className="material-symbols-outlined text-[17px]">auto_stories</span>
          <span>Daily Diary Feed</span>
        </button>
      </div>

      {/* TAB 1: WEEKLY TIMETABLE GRID */}
      {activeTab === 'timetable' && (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-5 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-domine text-sm font-bold text-[#001639]">
                Class Schedule: Grade 10 - Matric Science (Section A)
              </h2>
              <span className="text-[11px] text-slate-500">
                8 Periods / Day • Monday to Saturday • Morning Assembly 07:45 AM
              </span>
            </div>

            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="h-8 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg cursor-pointer"
            >
              <option value="Grade 10 - Science A">Grade 10 - Science A</option>
              <option value="Grade 9 - Jasmine">Grade 9 - Jasmine</option>
              <option value="Grade 8 - Cambridge">Grade 8 - Cambridge</option>
            </select>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-center text-xs">
              <thead className="bg-[#122b54] text-white text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3 text-left">Day / Period</th>
                  {periods.map((p) => (
                    <th key={p} className="py-2.5 px-2">
                      P{p}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {days.map((day, dIdx) => (
                  <tr key={day} className={dIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                    <td className="py-3 px-3 text-left font-bold text-[#001639] bg-slate-50/70 border-r border-slate-200">
                      {day}
                    </td>
                    {periods.map((p) => {
                      const slot = INITIAL_TIMETABLE.find(
                        (t) => t.period_number === p
                      )
                      return (
                        <td key={p} className="py-2 px-1.5 border-r border-slate-100">
                          {slot ? (
                            <div className="p-1 rounded bg-[#eff4ff] border border-[#dee9fc] text-[10px]">
                              <span className="font-bold text-[#001639] block truncate">
                                {slot.subject_name}
                              </span>
                              <span className="text-[9px] text-slate-500 block truncate">
                                {slot.teacher_name.split(' ')[1] || slot.teacher_name}
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-300 text-[10px]">Free</span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: SYLLABUS REPOSITORY */}
      {activeTab === 'syllabus' && (
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs">
            <button
              type="button"
              onClick={() => setSyllabusTerm('1st Term')}
              className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer ${
                syllabusTerm === '1st Term'
                  ? 'bg-[#001639] text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              [ 1st Term Syllabus ]
            </button>
            <button
              type="button"
              onClick={() => setSyllabusTerm('2nd Term')}
              className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer ${
                syllabusTerm === '2nd Term'
                  ? 'bg-[#001639] text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              [ 2nd Term & Pre-Board Syllabus ]
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {syllabusList.map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-domine font-bold text-sm text-[#001639]">
                      {item.subject}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                      {item.compliance}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] mt-1 leading-relaxed">
                    {item.chapters}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                  <span className="text-slate-400 font-mono">PDF • {item.size}</span>
                  <button
                    type="button"
                    onClick={() =>
                      alert(`Downloading ${item.subject} ${syllabusTerm} Syllabus PDF from Supabase Storage...`)
                    }
                    className="px-3 py-1 bg-[#122b54] hover:bg-[#001639] text-white rounded font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[15px]">
                      download
                    </span>
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: DAILY DIARY FEED */}
      {activeTab === 'diary' && (
        <div className="flex flex-col gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between text-xs">
            <div>
              <h2 className="font-domine text-sm font-bold text-[#001639]">
                Parent-Facing Daily Diary Broadcast Feed
              </h2>
              <p className="text-[11px] text-slate-500">
                Published daily by class teachers for parental homework review
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAddDiaryModalOpen(true)}
              className="h-8 px-3 bg-[#001639] text-white rounded font-bold hover:bg-[#122b54] flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>Submit Today&apos;s Diary</span>
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {diaries.map((diary) => (
              <div
                key={diary.id}
                className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col gap-3 text-xs"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#122b54] text-white font-bold text-[10px]">
                      {diary.class_name} ({diary.section})
                    </span>
                    <span className="font-bold text-[#001639] text-sm">
                      {diary.subject_name}
                    </span>
                  </div>
                  <span className="text-slate-400 font-mono text-[11px]">
                    {diary.diary_date} • By {diary.teacher_name}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-3.5 rounded-lg border border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                      Classwork Covered:
                    </span>
                    <p className="text-slate-800 leading-relaxed">{diary.classwork}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#b3272c] uppercase block mb-1">
                      Assigned Homework:
                    </span>
                    <p className="text-slate-800 leading-relaxed">{diary.homework}</p>
                  </div>
                </div>

                {diary.teacher_notes && (
                  <div className="text-[11px] text-[#633f00] bg-[#ffddb5]/30 p-2 rounded border border-[#ffddb5]">
                    <strong>Note for Parents:</strong> {diary.teacher_notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Post Daily Diary Modal */}
      <Modal
        isOpen={isAddDiaryModalOpen}
        onClose={() => setIsAddDiaryModalOpen(false)}
        title="Post Daily Classwork & Homework Diary"
        subtitle="Automatic Notification Broadcast to Parents on Eaglets Portal"
        maxWidth="2xl"
      >
        <form onSubmit={handleAddDiary} className="flex flex-col gap-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Class & Cohort *
              </label>
              <select
                value={newDiary.class_name}
                onChange={(e) =>
                  setNewDiary({ ...newDiary, class_name: e.target.value })
                }
                className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg"
              >
                <option value="Grade 10 - Science A">Grade 10 - Science A (Rose)</option>
                <option value="Grade 9 - Science">Grade 9 - Science (Jasmine)</option>
                <option value="Grade 8 - Cambridge">Grade 8 - Cambridge (Lily)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Subject *
              </label>
              <input
                type="text"
                required
                value={newDiary.subject_name}
                onChange={(e) =>
                  setNewDiary({ ...newDiary, subject_name: e.target.value })
                }
                placeholder="e.g. Physics"
                className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Classwork Covered Today *
            </label>
            <textarea
              required
              rows={3}
              value={newDiary.classwork}
              onChange={(e) =>
                setNewDiary({ ...newDiary, classwork: e.target.value })
              }
              placeholder="e.g. Chapter 12: Solved numerical problems 12.1 to 12.5..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Homework & Exercises Assigned *
            </label>
            <textarea
              required
              rows={3}
              value={newDiary.homework}
              onChange={(e) =>
                setNewDiary({ ...newDiary, homework: e.target.value })
              }
              placeholder="e.g. Practice numerical examples in notebook..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Special Instructions / Parent Notes
            </label>
            <input
              type="text"
              value={newDiary.teacher_notes}
              onChange={(e) =>
                setNewDiary({ ...newDiary, teacher_notes: e.target.value })
              }
              placeholder="e.g. Bring lab coat tomorrow for practical..."
              className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddDiaryModalOpen(false)}
              className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#b3272c] hover:bg-[#88131b] text-white font-bold rounded-lg shadow-sm cursor-pointer"
            >
              Publish Diary
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
