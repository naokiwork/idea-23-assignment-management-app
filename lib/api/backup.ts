/**
 * バックアップ・復元機能
 * データのエクスポート・インポートを行う
 */

import { loadData, saveData } from '../storage'
import { createInitialData } from '../initialData'
import type { BackupData } from '../types'

/**
 * 全データをエクスポート形式に変換
 */
export function exportAllData(): BackupData {
  const data = loadData() || createInitialData()
  
  return {
    ...data,
    exportedAt: new Date().toISOString(),
  }
}

/**
 * JSONファイルとしてダウンロード
 */
export function downloadBackupFile(data: BackupData): void {
  const jsonString = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonString], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  
  const date = new Date().toISOString().split('T')[0]
  const filename = `study-app-backup-${date}.json`
  
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  URL.revokeObjectURL(url)
}

/**
 * JSONファイルを読み込み
 */
export async function importBackupFile(file: File): Promise<BackupData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string
        const data = JSON.parse(text) as BackupData
        resolve(data)
      } catch (error) {
        reject(new Error('JSONファイルの読み込みに失敗しました'))
      }
    }
    
    reader.onerror = () => {
      reject(new Error('ファイルの読み込みに失敗しました'))
    }
    
    reader.readAsText(file)
  })
}

/**
 * データのマージまたは上書き
 */
export function mergeBackupData(
  backupData: BackupData,
  mergeMode: 'replace' | 'merge'
): void {
  if (mergeMode === 'replace') {
    // 既存データを完全に置き換え
    saveData(backupData)
  } else {
    // マージモード：既存データとインポートデータをマージ
    const existingData = loadData() || createInitialData()
    
    // IDの重複を避けるため、インポートデータのIDを変更
    const mergedData: BackupData = {
      ...backupData,
      subjects: [...existingData.subjects, ...backupData.subjects],
      timetables: [...existingData.timetables, ...backupData.timetables],
      classes: [...existingData.classes, ...backupData.classes],
      tasks: [...existingData.tasks, ...backupData.tasks],
      subtasks: [...existingData.subtasks, ...backupData.subtasks],
      studyLogs: [...existingData.studyLogs, ...backupData.studyLogs],
      exams: [...existingData.exams, ...backupData.exams],
    }
    
    saveData(mergedData)
  }
}

