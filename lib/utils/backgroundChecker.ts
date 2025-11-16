/**
 * バックグラウンドチェック
 */

import { checkAndSendReminders } from './reminderManager'
import { getNotificationSettings } from '../storage/notificationSettings'

let checkIntervalId: NodeJS.Timeout | null = null

/**
 * バックグラウンドチェックを開始
 */
export function startBackgroundCheck(): void {
  if (checkIntervalId) {
    return // 既に開始されている
  }

  const settings = getNotificationSettings()
  if (!settings.enabled) {
    return
  }

  // 初回チェック
  checkAndSendReminders()

  // 定期的にチェック
  const intervalMs = settings.checkInterval * 60 * 1000 // 分をミリ秒に変換
  checkIntervalId = setInterval(() => {
    checkAndSendReminders()
  }, intervalMs)
}

/**
 * バックグラウンドチェックを停止
 */
export function stopBackgroundCheck(): void {
  if (checkIntervalId) {
    clearInterval(checkIntervalId)
    checkIntervalId = null
  }
}

/**
 * バックグラウンドチェックを再起動
 */
export function restartBackgroundCheck(): void {
  stopBackgroundCheck()
  startBackgroundCheck()
}

