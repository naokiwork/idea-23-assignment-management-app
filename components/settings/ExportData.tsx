'use client'

import React, { useState } from 'react'
import { Card, CardBody, CardHeader } from '../ui/Card'
import { Button, Select } from '../ui'
import { Download, FileJson, FileSpreadsheet as FileSpreadsheetIcon } from 'lucide-react'
import { exportAllData, downloadBackupFile } from '@/lib/api/backup'
import { exportTasksToCSV } from '@/lib/utils/exportTasks'
import { exportStudyLogsToCSV } from '@/lib/utils/exportStudyLogs'
import { exportSubjectsToCSV } from '@/lib/utils/exportSubjects'
import { useToast } from '../ui/Toast'

export const ExportData: React.FC = () => {
  const { showToast } = useToast()
  const [exportFormat, setExportFormat] = useState<'json' | 'csv'>('json')
  const [csvType, setCsvType] = useState<'tasks' | 'logs' | 'subjects'>('tasks')

  const handleExportJSON = () => {
    try {
      const data = exportAllData()
      downloadBackupFile(data)
      showToast('データをエクスポートしました', 'success')
    } catch (error) {
      console.error('Failed to export data:', error)
      showToast('データのエクスポートに失敗しました', 'error')
    }
  }

  const handleExportCSV = () => {
    try {
      switch (csvType) {
        case 'tasks':
          exportTasksToCSV({ includeSubtasks: true })
          showToast('タスクデータをCSV形式でエクスポートしました', 'success')
          break
        case 'logs':
          exportStudyLogsToCSV()
          showToast('学習ログデータをCSV形式でエクスポートしました', 'success')
          break
        case 'subjects':
          exportSubjectsToCSV({ includeTimetables: true })
          showToast('科目データをCSV形式でエクスポートしました', 'success')
          break
      }
    } catch (error) {
      console.error('Failed to export CSV:', error)
      showToast('CSVエクスポートに失敗しました', 'error')
    }
  }

  const handleExport = () => {
    if (exportFormat === 'json') {
      handleExportJSON()
    } else {
      handleExportCSV()
    }
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold text-gray-900">データのエクスポート</h2>
      </CardHeader>
      <CardBody className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            エクスポート形式
          </label>
          <Select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value as 'json' | 'csv')}
            options={[
              { value: 'json', label: 'JSON（全データ）' },
              { value: 'csv', label: 'CSV（表計算ソフト用）' },
            ]}
          />
        </div>

        {exportFormat === 'csv' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              エクスポート対象
            </label>
            <Select
              value={csvType}
              onChange={(e) => setCsvType(e.target.value as 'tasks' | 'logs' | 'subjects')}
              options={[
                { value: 'tasks', label: 'タスクデータ' },
                { value: 'logs', label: '学習ログデータ' },
                { value: 'subjects', label: '科目データ' },
              ]}
            />
          </div>
        )}

        <div className="pt-4">
          <Button onClick={handleExport} variant="primary" className="w-full">
            {exportFormat === 'json' ? (
              <>
                <FileJson className="h-5 w-5 mr-2" />
                JSON形式でエクスポート
              </>
            ) : (
              <>
                <FileSpreadsheetIcon className="h-5 w-5 mr-2" />
                CSV形式でエクスポート
              </>
            )}
          </Button>
        </div>

        <p className="text-xs text-gray-500">
          {exportFormat === 'json'
            ? 'すべてのデータをJSON形式でエクスポートします。バックアップとして保存しておくことをおすすめします。'
            : '選択したデータをCSV形式でエクスポートします。ExcelやGoogleスプレッドシートで開くことができます。'}
        </p>
      </CardBody>
    </Card>
  )
}

