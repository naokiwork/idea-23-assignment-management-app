'use client'

import React from 'react'
import { Container } from '@/components'
import { ExportData } from '@/components/settings/ExportData'
import { ImportData } from '@/components/settings/ImportData'
import { ToastProvider } from '@/components/ui/Toast'

function SettingsPageContent() {
  return (
    <Container className="py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">設定</h1>

        <div className="space-y-6">
          <ExportData />
          <ImportData />
        </div>
      </Container>
  )
}

export default function SettingsPage() {
  return (
    <ToastProvider>
      <SettingsPageContent />
    </ToastProvider>
  )
}

