/**
 * バックアップスケジューラー
 * 
 * 注意: この実装は基本構造のみです。
 * 実際の定期バックアップ機能を実装するには、Service Workerとの統合が必要です。
 */

import { createAutoBackup, cleanupOldBackups } from './autoBackup'

export interface BackupSchedule {
  enabled: boolean
  interval: number // バックアップ間隔（分）
  keepDays: number // バックアップ保持期間（日）
  lastBackupTime: Date | null
}

const BACKUP_SCHEDULE_KEY = 'backup-schedule'
const DEFAULT_SCHEDULE: BackupSchedule = {
  enabled: false,
  interval: 60, // 60分
  keepDays: 30, // 30日
  lastBackupTime: null,
}

let scheduleInterval: NodeJS.Timeout | null = null

/**
 * バックアップスケジュールを取得
 */
export function getBackupSchedule(): BackupSchedule {
  if (typeof window === 'undefined') return DEFAULT_SCHEDULE
  
  try {
    const stored = localStorage.getItem(BACKUP_SCHEDULE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return {
        ...DEFAULT_SCHEDULE,
        ...parsed,
        lastBackupTime: parsed.lastBackupTime ? new Date(parsed.lastBackupTime) : null,
      }
    }
  } catch (error) {
    console.error('Failed to load backup schedule:', error)
  }
  
  return DEFAULT_SCHEDULE
}

/**
 * バックアップスケジュールを保存
 */
export function saveBackupSchedule(schedule: Partial<BackupSchedule>): void {
  if (typeof window === 'undefined') return
  
  try {
    const current = getBackupSchedule()
    const updated = {
      ...current,
      ...schedule,
      lastBackupTime: schedule.lastBackupTime instanceof Date
        ? schedule.lastBackupTime.toISOString()
        : schedule.lastBackupTime,
    }
    localStorage.setItem(BACKUP_SCHEDULE_KEY, JSON.stringify(updated))
    
    // スケジュールを再起動
    if (updated.enabled) {
      startBackupSchedule()
    } else {
      stopBackupSchedule()
    }
  } catch (error) {
    console.error('Failed to save backup schedule:', error)
  }
}

/**
 * バックアップスケジュールを開始
 */
export function startBackupSchedule(): void {
  stopBackupSchedule() // 既存のスケジュールを停止
  
  const schedule = getBackupSchedule()
  if (!schedule.enabled) {
    return
  }
  
  // 初回バックアップを実行
  if (!schedule.lastBackupTime) {
    executeBackup()
  }
  
  // 定期バックアップを開始
  scheduleInterval = setInterval(() => {
    const currentSchedule = getBackupSchedule()
    if (!currentSchedule.enabled) {
      stopBackupSchedule()
      return
    }
    
    const now = new Date()
    const lastBackup = currentSchedule.lastBackupTime
    const intervalMs = currentSchedule.interval * 60 * 1000
    
    if (!lastBackup || (now.getTime() - lastBackup.getTime()) >= intervalMs) {
      executeBackup()
    }
  }, 60 * 1000) // 1分ごとにチェック
}

/**
 * バックアップスケジュールを停止
 */
export function stopBackupSchedule(): void {
  if (scheduleInterval) {
    clearInterval(scheduleInterval)
    scheduleInterval = null
  }
}

/**
 * バックアップを実行
 */
function executeBackup(): void {
  try {
    const metadata = createAutoBackup()
    const schedule = getBackupSchedule()
    
    // 最終バックアップ時刻を更新
    saveBackupSchedule({
      lastBackupTime: new Date(metadata.timestamp),
    })
    
    // 古いバックアップをクリーンアップ
    cleanupOldBackups(schedule.keepDays)
    
    console.log('Auto backup created:', metadata.id)
  } catch (error) {
    console.error('Failed to execute backup:', error)
  }
}

/**
 * バックアップスケジュールを初期化（アプリ起動時などに呼び出す）
 */
export function initializeBackupSchedule(): void {
  const schedule = getBackupSchedule()
  if (schedule.enabled) {
    startBackupSchedule()
  }
}


