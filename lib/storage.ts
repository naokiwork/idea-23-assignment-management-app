/**
 * データ永続化層
 * ローカルストレージを使用してデータを保存/読み込み
 */

import type { BackupData } from './types'
import { logger } from './utils/logger'
import { parseBackupData } from './validation/backupValidation'

const STORAGE_KEY = 'study-app-data';

/**
 * 全データをローカルストレージに保存
 * @param data 保存するデータ
 */
export function saveData(data: BackupData): void {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, jsonString);
    }
  } catch (error) {
    logger.error('Failed to save data to localStorage:', error)
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      throw new Error('ストレージの容量が不足しています。データを削除してから再度お試しください。')
    }
    throw new Error('データの保存に失敗しました')
  }
}

/**
 * ローカルストレージから全データを読み込み
 * @returns 読み込んだデータ、または null（データが存在しない場合）
 */
export function loadData(): BackupData | null {
  try {
    if (typeof window === 'undefined') {
      return null;
    }

    const jsonString = localStorage.getItem(STORAGE_KEY)
    if (!jsonString) {
      return null
    }

    const data = parseBackupData(jsonString)
    if (!data) {
      logger.warn('Invalid data format in localStorage')
      return null
    }

    return data
  } catch (error) {
    logger.error('Failed to load data from localStorage:', error)
    // JSON パースエラーの場合、データをクリアして null を返す
    if (error instanceof SyntaxError) {
      clearData()
    }
    return null
  }
}

/**
 * ローカルストレージのデータをクリア
 */
export function clearData(): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch (error) {
    logger.error('Failed to clear data from localStorage:', error)
    throw new Error('データのクリアに失敗しました')
  }
}

/**
 * データが存在するかチェック
 * @returns データが存在する場合 true
 */
export function hasData(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  return localStorage.getItem(STORAGE_KEY) !== null;
}

