/**
 * 学習時間集計関数
 */

import type { StudyLog } from '../types'
import { calculateDuration, formatDuration } from './timeCalculation'

/**
 * 総学習時間を計算（分単位）
 */
export function calculateStudyTime(logs: StudyLog[]): number {
  return logs.reduce((total, log) => {
    if (log.startTime && log.endTime) {
      return total + calculateDuration(log.startTime, log.endTime)
    }
    return total
  }, 0)
}

/**
 * 科目別に集計
 * @returns 科目IDをキー、学習時間（分）を値とするオブジェクト
 */
export function groupBySubject(
  logs: StudyLog[],
  taskSubjectMap: Map<string, string>
): Record<string, number> {
  const result: Record<string, number> = {}

  logs.forEach((log) => {
    const subjectId = taskSubjectMap.get(log.taskId)
    if (!subjectId) return

    const duration = log.startTime && log.endTime
      ? calculateDuration(log.startTime, log.endTime)
      : 0

    result[subjectId] = (result[subjectId] || 0) + duration
  })

  return result
}

/**
 * 日付別に集計
 * @returns 日付文字列（YYYY-MM-DD）をキー、学習時間（分）を値とするオブジェクト
 */
export function groupByDate(logs: StudyLog[]): Record<string, number> {
  const result: Record<string, number> = {}

  logs.forEach((log) => {
    const duration = log.startTime && log.endTime
      ? calculateDuration(log.startTime, log.endTime)
      : 0

    result[log.date] = (result[log.date] || 0) + duration
  })

  return result
}

/**
 * タスク別に集計
 * @returns タスクIDをキー、学習時間（分）を値とするオブジェクト
 */
export function groupByTask(logs: StudyLog[]): Record<string, number> {
  const result: Record<string, number> = {}

  logs.forEach((log) => {
    const duration = log.startTime && log.endTime
      ? calculateDuration(log.startTime, log.endTime)
      : 0

    result[log.taskId] = (result[log.taskId] || 0) + duration
  })

  return result
}

/**
 * 時間表示フォーマット（"2時間30分"など）
 */
export function formatStudyTime(minutes: number): string {
  return formatDuration(minutes)
}

