/**
 * 学習ログCRUD関数
 * ローカルストレージを使用して学習ログの作成・更新・削除・取得を行う
 */

import { loadData, saveData } from '../storage'
import { createInitialData } from '../initialData'
import type { StudyLog, BackupData } from '../types'
import { generateId as generateSafeId } from '../utils/idGenerator'

/**
 * IDを生成する
 */
function generateId(): string {
  return generateSafeId('log')
}

/**
 * データを取得・更新するヘルパー関数
 */
function updateData(updater: (data: BackupData) => BackupData): void {
  const data = loadData() || createInitialData()
  const updatedData = updater(data)
  saveData(updatedData)
}

/**
 * 学習ログを作成
 */
export function createStudyLog(log: Omit<StudyLog, 'id'>): StudyLog {
  const newLog: StudyLog = {
    ...log,
    id: generateId(),
  }

  updateData((data) => ({
    ...data,
    studyLogs: [...data.studyLogs, newLog],
  }))

  return newLog
}

/**
 * 学習ログを更新
 */
export function updateStudyLog(id: string, log: Partial<StudyLog>): StudyLog {
  let updatedLog: StudyLog | null = null

  updateData((data) => {
    const index = data.studyLogs.findIndex((l) => l.id === id)
    if (index === -1) {
      throw new Error(`学習ログが見つかりません: ${id}`)
    }

    updatedLog = {
      ...data.studyLogs[index],
      ...log,
      id, // IDは変更不可
    }

    const newLogs = [...data.studyLogs]
    newLogs[index] = updatedLog

    return {
      ...data,
      studyLogs: newLogs,
    }
  })

  if (!updatedLog) {
    throw new Error('学習ログの更新に失敗しました')
  }

  return updatedLog
}

/**
 * 学習ログを削除
 */
export function deleteStudyLog(id: string): void {
  updateData((data) => ({
    ...data,
    studyLogs: data.studyLogs.filter((l) => l.id !== id),
  }))
}

/**
 * 学習ログを取得
 */
export function getStudyLog(id: string): StudyLog | null {
  const data = loadData()
  if (!data) return null

  return data.studyLogs.find((l) => l.id === id) || null
}

/**
 * 全学習ログを取得
 */
export function getAllStudyLogs(): StudyLog[] {
  const data = loadData()
  if (!data) return []

  return [...data.studyLogs].sort((a, b) => {
    // 日付と時刻でソート（新しい順）
    const dateA = new Date(`${a.date}T${a.startTime || '00:00'}`)
    const dateB = new Date(`${b.date}T${b.startTime || '00:00'}`)
    return dateB.getTime() - dateA.getTime()
  })
}

/**
 * 日付別に学習ログを取得
 */
export function getStudyLogsByDate(date: Date): StudyLog[] {
  const dateStr = date.toISOString().split('T')[0]
  const allLogs = getAllStudyLogs()

  return allLogs.filter((log) => log.date === dateStr)
}

/**
 * タスクID別に学習ログを取得
 */
export function getStudyLogsByTaskId(taskId: string): StudyLog[] {
  const allLogs = getAllStudyLogs()
  return allLogs.filter((log) => log.taskId === taskId)
}

/**
 * 科目ID別に学習ログを取得
 */
export function getStudyLogsBySubjectId(subjectId: string): StudyLog[] {
  const data = loadData()
  if (!data) return []

  // タスクから科目IDを取得する必要がある
  const taskIds = data.tasks
    .filter((task) => task.subjectId === subjectId)
    .map((task) => task.id)

  const allLogs = getAllStudyLogs()
  return allLogs.filter((log) => taskIds.includes(log.taskId))
}

