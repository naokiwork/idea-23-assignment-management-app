/**
 * バックアップデータ検証関数
 */

import type { BackupData } from '../types'

/**
 * バックアップデータの検証
 */
export function validateBackupData(data: unknown): BackupData | null {
  if (!data || typeof data !== 'object') {
    return null
  }

  const backup = data as Partial<BackupData>

  // 必須フィールドのチェック
  if (
    !backup.version ||
    !backup.exportedAt ||
    !Array.isArray(backup.subjects) ||
    !Array.isArray(backup.timetables) ||
    !Array.isArray(backup.classes) ||
    !Array.isArray(backup.tasks) ||
    !Array.isArray(backup.subtasks) ||
    !Array.isArray(backup.studyLogs) ||
    !Array.isArray(backup.exams)
  ) {
    return null
  }

  // バージョン互換性のチェック（簡易版）
  // 実際の実装では、バージョン番号に基づいて互換性を判定する
  const version = backup.version
  if (!version || !version.match(/^\d+\.\d+\.\d+$/)) {
    return null
  }

  return backup as BackupData
}

