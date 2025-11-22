/**
 * バックアップ管理
 */

import { getBackupMetadataList, getBackupData, deleteBackup, createAutoBackup } from '../utils/autoBackup'
import { importBackupFile, mergeBackupData } from './backup'
import type { BackupData } from '../types'
import type { BackupMetadata } from '../utils/autoBackup'

/**
 * バックアップ一覧を取得
 */
export function getAllBackups(): BackupMetadata[] {
  return getBackupMetadataList()
}

/**
 * バックアップを取得
 */
export function getBackup(id: string): BackupData | null {
  return getBackupData(id)
}

/**
 * バックアップを削除
 */
export function removeBackup(id: string): void {
  deleteBackup(id)
}

/**
 * バックアップを復元
 */
export function restoreBackup(id: string, mergeMode: 'replace' | 'merge' = 'replace'): void {
  const backupData = getBackupData(id)
  if (!backupData) {
    throw new Error(`バックアップが見つかりません: ${id}`)
  }
  
  mergeBackupData(backupData, mergeMode)
}

/**
 * 手動バックアップを作成
 */
export function createManualBackup(): BackupMetadata {
  return createAutoBackup()
}


