'use client'

import React from 'react'
import { Container } from '@/components'
import { ReportGenerator } from '@/components/reports/ReportGenerator'
import { ToastProvider } from '@/components/ui/Toast'

function ReportsPageContent() {
  return (
    <Container className="py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">レポート</h1>
      
      <div className="space-y-6">
        <ReportGenerator />
      </div>
    </Container>
  )
}

export default function ReportsPage() {
  return (
    <ToastProvider>
      <ReportsPageContent />
    </ToastProvider>
  )
}

