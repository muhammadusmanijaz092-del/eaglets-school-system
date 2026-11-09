import React from 'react'
import Sidebar from '@/components/Sidebar'
import TopBar from '@/components/TopBar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#f8f9ff]">
      <Sidebar />
      <div className="pl-72">
        <TopBar />
        <main className="pt-16 min-h-[calc(100vh-4rem)]">{children}</main>
      </div>
    </div>
  )
}

