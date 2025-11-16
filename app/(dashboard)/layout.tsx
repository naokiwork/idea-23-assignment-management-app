import React from 'react'
import { Header } from '@/components/layout/Header'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="md:ml-64 pt-16">
        {children}
      </main>
    </div>
  )
}

