'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardBody, CardHeader } from '../ui/Card'
import { Button } from '../ui'
import { Switch } from '../ui/Switch'
import { Input } from '../ui'
import {
  getNotificationSettings,
  saveNotificationSettings,
  type NotificationSettings as NotificationSettingsType,
} from '@/lib/storage/notificationSettings'
import {
  requestNotificationPermission,
  getNotificationPermission,
  isNotificationGranted,
} from '@/lib/utils/notificationPermission'
import { useToast } from '../ui/Toast'
import { startBackgroundCheck, stopBackgroundCheck, restartBackgroundCheck } from '@/lib/utils/backgroundChecker'

export const NotificationSettings: React.FC = () => {
  const { showToast } = useToast()
  const [settings, setSettings] = useState<NotificationSettingsType>(getNotificationSettings())
  const [permission, setPermission] = useState<NotificationPermission>(getNotificationPermission())
  const [reminderDaysInput, setReminderDaysInput] = useState<string>('')

  useEffect(() => {
    // リマインダー日数の入力フィールドを初期化
    setReminderDaysInput(settings.reminderDays.join(', '))
  }, [])

  useEffect(() => {
    // 設定が変更されたらバックグラウンドチェックを再起動
    if (settings.enabled && isNotificationGranted()) {
      restartBackgroundCheck()
    } else {
      stopBackgroundCheck()
    }
  }, [settings.enabled])

  const handleRequestPermission = async () => {
    const newPermission = await requestNotificationPermission()
    setPermission(newPermission)

    if (newPermission === 'granted') {
      showToast('通知が許可されました', 'success')
      if (settings.enabled) {
        startBackgroundCheck()
      }
    } else if (newPermission === 'denied') {
      showToast('通知が拒否されました。ブラウザの設定から許可してください。', 'error')
    }
  }

  const handleToggleEnabled = (enabled: boolean) => {
    const newSettings: Partial<NotificationSettingsType> = { ...settings, enabled }
    setSettings({ ...settings, ...newSettings })
    saveNotificationSettings(newSettings)

    if (enabled) {
      if (isNotificationGranted()) {
        startBackgroundCheck()
        showToast('通知を有効にしました', 'success')
      } else {
        handleRequestPermission()
      }
    } else {
      stopBackgroundCheck()
      showToast('通知を無効にしました', 'success')
    }
  }

  const handleToggleShowOverdue = (showOverdue: boolean) => {
    const newSettings: Partial<NotificationSettingsType> = { ...settings, showOverdue }
    setSettings({ ...settings, ...newSettings })
    saveNotificationSettings(newSettings)
  }

  const handleReminderDaysChange = (value: string) => {
    setReminderDaysInput(value)
    const days = value
      .split(',')
      .map((d) => parseInt(d.trim(), 10))
      .filter((d) => !isNaN(d) && d > 0)
      .sort((a, b) => a - b)

    if (days.length > 0) {
      const newSettings: Partial<NotificationSettingsType> = { ...settings, reminderDays: days }
      setSettings({ ...settings, ...newSettings })
      saveNotificationSettings(newSettings)
    }
  }

  const handleCheckIntervalChange = (value: string) => {
    const interval = parseInt(value, 10)
    if (!isNaN(interval) && interval > 0) {
      const newSettings: Partial<NotificationSettingsType> = { ...settings, checkInterval: interval }
      setSettings({ ...settings, ...newSettings })
      saveNotificationSettings(newSettings)
      restartBackgroundCheck()
    }
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold text-gray-900">通知設定</h2>
      </CardHeader>
      <CardBody className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">通知を有効にする</p>
            <p className="text-sm text-gray-500">タスクの期限リマインダーを受け取ります</p>
          </div>
          <Switch checked={settings.enabled} onCheckedChange={handleToggleEnabled} />
        </div>

        {permission !== 'granted' && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800 mb-2">
              通知を有効にするには、ブラウザの通知許可が必要です。
            </p>
            <Button variant="primary" size="sm" onClick={handleRequestPermission}>
              通知を許可する
            </Button>
          </div>
        )}

        {settings.enabled && permission === 'granted' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                リマインダー日数（カンマ区切り）
              </label>
              <Input
                type="text"
                value={reminderDaysInput}
                onChange={(e) => handleReminderDaysChange(e.target.value)}
                placeholder="例: 1, 3, 7"
              />
              <p className="text-xs text-gray-500 mt-1">
                期限の何日前に通知するか（例: 1, 3, 7 = 1日前、3日前、7日前）
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                チェック間隔（分）
              </label>
              <Input
                type="number"
                value={settings.checkInterval}
                onChange={(e) => handleCheckIntervalChange(e.target.value)}
                min={1}
              />
              <p className="text-xs text-gray-500 mt-1">
                タスクをチェックする間隔（分単位）
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">期限切れタスクを通知</p>
                <p className="text-sm text-gray-500">期限が過ぎたタスクも通知します</p>
              </div>
              <Switch
                checked={settings.showOverdue}
                onCheckedChange={handleToggleShowOverdue}
              />
            </div>
          </>
        )}
      </CardBody>
    </Card>
  )
}

