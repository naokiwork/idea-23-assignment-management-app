/**
 * 自動バックアップ
 */

import { exportAllData } from '../api/backup'
import type { BackupData } from '../types'

export interface BackupMetadata {
  id: string
  timestamp: string // ISO 8601形式の日付文字列
  size: number // バックアップファイルのサイズ（バイト）
  version: string
}

const BACKUP_STORAGE_KEY = 'auto-backups'
const MAX_BACKUPS = 10 // 最大保持バックアップ数

/**
 * バックアップメタデータを取得
 */
export function getBackupMetadataList(): BackupMetadata[] {
  if (typeof window === 'undefined') return []
  
  try {
    const stored = localStorage.getItem(BACKUP_STORAGE_KEY)
    if (!stored) return []
    return JSON.parse(stored)
  } catch (error) {
    console.error('Failed to load backup metadata:', error)
    return []
  }
}

/**
 * バックアップメタデータを保存
 */
function saveBackupMetadataList(metadataList: BackupMetadata[]): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(BACKUP_STORAGE_KEY, JSON.stringify(metadataList))
  } catch (error) {
    console.error('Failed to save backup metadata:', error)
  }
}

/**
 * バックアップを実行
 */
export function createAutoBackup(): BackupMetadata {
  const data = exportAllData()
  const backupId = `backup-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  const timestamp = new Date().toISOString()
  
  // バックアップデータを保存
  const backupKey = `${BACKUP_STORAGE_KEY}-${backupId}`
  const backupJson = JSON.stringify(data)
  localStorage.setItem(backupKey, backupJson)
  
  // メタデータを作成
  const metadata: BackupMetadata = {
    id: backupId,
    timestamp,
    size: new Blob([backupJson]).size,
    version: data.version || '0.1.0',
  }
  
  // メタデータリストを更新
  const metadataList = getBackupMetadataList()
  metadataList.unshift(metadata) // 新しいバックアップを先頭に追加
  
  // 最大保持数を超えた場合は古いバックアップを削除
  if (metadataList.length > MAX_BACKUPS) {
    const toRemove = metadataList.slice(MAX_BACKUPS)
    for (const oldMetadata of toRemove) {
      const oldBackupKey = `${BACKUP_STORAGE_KEY}-${oldMetadata.id}`
      localStorage.removeItem(oldBackupKey)
    }
    metadataList.splice(MAX_BACKUPS)
  }
  
  saveBackupMetadataList(metadataList)
  
  return metadata
}

/**
 * バックアップデータを取得
 */
export function getBackupData(backupId: string): BackupData | null {
  if (typeof window === 'undefined') return null
  
  try {
    const backupKey = `${BACKUP_STORAGE_KEY}-${backupId}`
    const stored = localStorage.getItem(backupKey)
    if (!stored) return null
    return JSON.parse(stored)
  } catch (error) {
    console.error('Failed to load backup data:', error)
    return null
  }
}

/**
 * バックアップを削除
 */
export function deleteBackup(backupId: string): void {
  if (typeof window === 'undefined') return
  
  // バックアップデータを削除
  const backupKey = `${BACKUP_STORAGE_KEY}-${backupId}`
  localStorage.removeItem(backupKey)
  
  // メタデータから削除
  const metadataList = getBackupMetadataList()
  const filtered = metadataList.filter((m) => m.id !== backupId)
  saveBackupMetadataList(filtered)
}

/**
 * 古いバックアップをクリーンアップ（保持期間を超えたバックアップを削除）
 */
export function cleanupOldBackups(keepDays: number = 30): void {
  if (typeof window === 'undefined') return
  
  const now = new Date()
  const metadataList = getBackupMetadataList()
  const toKeep: BackupMetadata[] = []
  const toRemove: BackupMetadata[] = []
  
  for (const metadata of metadataList) {
    const backupDate = new Date(metadata.timestamp)
    const daysDiff = (now.getTime() - backupDate.getTime()) / (1000 * 60 * 60 * 24)
    
    if (daysDiff <= keepDays) {
      toKeep.push(metadata)
    } else {
      toRemove.push(metadata)
    }
  }
  
  // 削除対象のバックアップデータを削除
  for (const metadata of toRemove) {
    const backupKey = `${BACKUP_STORAGE_KEY}-${metadata.id}`
    localStorage.removeItem(backupKey)
  }
  
  // メタデータリストを更新
  saveBackupMetadataList(toKeep)
}


