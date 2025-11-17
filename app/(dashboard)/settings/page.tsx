'use client'

import React from 'react'
import { Container } from '@/components'
import { LanguageSelector } from '@/components/settings/LanguageSelector'
import { NotificationSettings } from '@/components/settings/NotificationSettings'
import { KeyboardShortcuts } from '@/components/settings/KeyboardShortcuts'
import { SyncStatus } from '@/components/sync/SyncStatus'
import { ExportData } from '@/components/settings/ExportData'
import { ImportData } from '@/components/settings/ImportData'
import { ToastProvider } from '@/components/ui/Toast'
import { useTranslation } from '@/lib/hooks/useTranslation'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'

function SettingsPageContent() {
  const { t } = useTranslation()

  return (
    <Container className="py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('settings.title')}</h1>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900">{t('settings.language')}</h2>
            </CardHeader>
            <CardBody>
              <LanguageSelector />
            </CardBody>
          </Card>

          <NotificationSettings />

          <KeyboardShortcuts />

          <SyncStatus />

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

