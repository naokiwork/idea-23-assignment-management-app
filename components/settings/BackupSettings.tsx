'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardBody, CardHeader } from '../ui/Card'
import { Button } from '../ui/Button'
import { Switch } from '../ui/Switch'
import { Input } from '../ui'
import { Save, Download } from 'lucide-react'
import {
  getBackupSchedule,
  saveBackupSchedule,
  startBackupSchedule,
  stopBackupSchedule,
} from '@/lib/utils/backupScheduler'
import { createManualBackup } from '@/lib/api/backups'
import { useToast } from '../ui/Toast'

export const BackupSettings: React.FC = () => {
  const { showToast } = useToast()
  const [schedule, setSchedule] = useState(getBackupSchedule())
  const [intervalInput, setIntervalInput] = useState<string>(schedule.interval.toString())
  const [keepDaysInput, setKeepDaysInput] = useState<string>(schedule.keepDays.toString())
  const [isCreatingBackup, setIsCreatingBackup] = useState(false)

  useEffect(() => {
    // スケジュールを初期化
    if (schedule.enabled) {
      startBackupSchedule()
    } else {
      stopBackupSchedule()
    }
    
    return () => {
      stopBackupSchedule()
    }
  }, [schedule.enabled])

  const handleToggleEnabled = (enabled: boolean) => {
    const newSchedule = { ...schedule, enabled }
    setSchedule(newSchedule)
    saveBackupSchedule(newSchedule)
    
    if (enabled) {
      startBackupSchedule()
      showToast('自動バックアップを有効にしました', 'success')
    } else {
      stopBackupSchedule()
      showToast('自動バックアップを無効にしました', 'success')
    }
  }

  const handleSave = () => {
    const interval = parseInt(intervalInput, 10)
    const keepDays = parseInt(keepDaysInput, 10)
    
    if (isNaN(interval) || interval < 1) {
      showToast('バックアップ間隔は1分以上である必要があります', 'error')
      return
    }
    
    if (isNaN(keepDays) || keepDays < 1) {
      showToast('保持期間は1日以上である必要があります', 'error')
      return
    }
    
    const newSchedule = {
      ...schedule,
      interval,
      keepDays,
    }
    setSchedule(newSchedule)
    saveBackupSchedule(newSchedule)
    
    if (newSchedule.enabled) {
      startBackupSchedule()
    }
    
    showToast('バックアップ設定を保存しました', 'success')
  }

  const handleCreateBackup = async () => {
    setIsCreatingBackup(true)
    try {
      const metadata = createManualBackup()
      showToast('バックアップを作成しました', 'success')
    } catch (error) {
      console.error('Failed to create backup:', error)
      showToast('バックアップの作成に失敗しました', 'error')
    } finally {
      setIsCreatingBackup(false)
    }
  }

  const formatLastBackupTime = (): string => {
    if (!schedule.lastBackupTime) {
      return '未実行'
    }
    return new Date(schedule.lastBackupTime).toLocaleString('ja-JP')
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold text-gray-900">自動バックアップ設定</h2>
      </CardHeader>
      <CardBody className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">自動バックアップを有効にする</p>
            <p className="text-sm text-gray-500">定期的にデータを自動バックアップします</p>
          </div>
          <Switch checked={schedule.enabled} onCheckedChange={handleToggleEnabled} />
        </div>

        {schedule.enabled && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                バックアップ間隔（分）
              </label>
              <Input
                type="number"
                value={intervalInput}
                onChange={(e) => setIntervalInput(e.target.value)}
                min={1}
                placeholder="60"
              />
              <p className="text-xs text-gray-500 mt-1">
                データを自動バックアップする間隔（分単位）
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                バックアップ保持期間（日）
              </label>
              <Input
                type="number"
                value={keepDaysInput}
                onChange={(e) => setKeepDaysInput(e.target.value)}
                min={1}
                placeholder="30"
              />
              <p className="text-xs text-gray-500 mt-1">
                バックアップを保持する日数（この期間を超えたバックアップは自動削除されます）
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-600">
                <span className="font-medium">最終バックアップ:</span> {formatLastBackupTime()}
              </p>
            </div>

            <Button variant="primary" onClick={handleSave} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              設定を保存
            </Button>
          </>
        )}

        <div className="pt-4 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={handleCreateBackup}
            disabled={isCreatingBackup}
            className="w-full"
          >
            <Download className="h-4 w-4 mr-2" />
            {isCreatingBackup ? 'バックアップ作成中...' : '手動でバックアップを作成'}
          </Button>
        </div>

        <p className="text-xs text-gray-500">
          注意: 現在は基本構造のみを実装しています。実際の定期バックアップ機能は将来の拡張として実装予定です。
        </p>
      </CardBody>
    </Card>
  )
}


