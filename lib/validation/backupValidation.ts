/**
 * バックアップデータのバリデーション
 */

import type { BackupData } from '../types'

/**
 * バックアップデータの型ガード
 */
export function isValidBackupData(data: unknown): data is BackupData {
  if (!data || typeof data !== 'object') {
    return false
  }

  const obj = data as Record<string, unknown>

  // 必須フィールドのチェック
  if (!Array.isArray(obj.subjects)) return false
  if (!Array.isArray(obj.tasks)) return false
  if (!Array.isArray(obj.subtasks)) return false
  if (!Array.isArray(obj.studyLogs)) return false
  if (!Array.isArray(obj.exams)) return false
  if (!Array.isArray(obj.timetables)) return false
  if (!Array.isArray(obj.classes)) return false

  // バージョンのチェック
  if (typeof obj.version !== 'string') return false

  return true
}

/**
 * バックアップデータを安全にパース
 */
export function parseBackupData(jsonString: string): BackupData | null {
  try {
    const data = JSON.parse(jsonString)
    if (isValidBackupData(data)) {
      return data
    }
    return null
  } catch {
    return null
  }
}
