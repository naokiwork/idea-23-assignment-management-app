'use client'

import React from 'react'
import { Header } from '@/components/layout/Header'
import { useKeyboardShortcuts, defaultShortcuts } from '@/lib/hooks/useKeyboardShortcuts'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // グローバルなキーボードショートカットを有効化
  useKeyboardShortcuts(defaultShortcuts)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="md:ml-64 pt-16 p-8">
        {children}
      </main>
    </div>
  )
}

