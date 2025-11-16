'use client'

import React from 'react'
import { Button } from '../ui/Button'
import { Download } from 'lucide-react'
import { exportAllData, downloadBackupFile } from '@/lib/api/backup'
import { useToast } from '../ui/Toast'

export const ExportData: React.FC = () => {
  const { showToast } = useToast()

  const handleExport = () => {
    try {
      const data = exportAllData()
      downloadBackupFile(data)
      showToast('データをエクスポートしました', 'success')
    } catch (error) {
      console.error('Failed to export data:', error)
      showToast('データのエクスポートに失敗しました', 'error')
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">データのエクスポート</h3>
      <p className="text-sm text-gray-600 mb-4">
        すべてのデータをJSON形式でエクスポートします。バックアップとして保存しておくことをおすすめします。
      </p>
      <Button onClick={handleExport} variant="primary">
        <Download className="h-5 w-5 mr-2" />
        データをエクスポート
      </Button>
    </div>
  )
}

