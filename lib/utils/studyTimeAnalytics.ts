/**
 * 学習時間分析関数
 */

import { groupBySubject, formatStudyTime } from './studyTimeAggregation'
import { getAllStudyLogs } from '../api/studyLogs'
import { loadData } from '../storage'
import type { StudyLog } from '../types'

/**
 * 科目別学習時間
 */
export function getStudyTimeBySubject(
  startDate: Date,
  endDate: Date
): Record<string, number> {
  const allLogs = getAllStudyLogs()
  const data = loadData()
  if (!data) return {}

  // 期間でフィルタ
  const filteredLogs = allLogs.filter((log) => {
    const logDate = new Date(log.date)
    return logDate >= startDate && logDate <= endDate
  })

  // タスクIDから科目IDへのマッピングを作成
  const taskSubjectMap = new Map<string, string>()
  data.tasks.forEach((task) => {
    taskSubjectMap.set(task.id, task.subjectId)
  })

  return groupBySubject(filteredLogs, taskSubjectMap)
}

/**
 * 科目×月別学習時間
 */
export function getStudyTimeBySubjectAndMonth(
  startDate: Date,
  endDate: Date
): Record<string, Record<string, number>> {
  const allLogs = getAllStudyLogs()
  const data = loadData()
  if (!data) return {}

  // 期間でフィルタ
  const filteredLogs = allLogs.filter((log) => {
    const logDate = new Date(log.date)
    return logDate >= startDate && logDate <= endDate
  })

  // タスクIDから科目IDへのマッピングを作成
  const taskSubjectMap = new Map<string, string>()
  data.tasks.forEach((task) => {
    taskSubjectMap.set(task.id, task.subjectId)
  })

  const result: Record<string, Record<string, number>> = {}

  filteredLogs.forEach((log) => {
    const subjectId = taskSubjectMap.get(log.taskId)
    if (!subjectId) return

    const logDate = new Date(log.date)
    const monthKey = `${logDate.getFullYear()}-${String(logDate.getMonth() + 1).padStart(2, '0')}`

    if (!result[subjectId]) {
      result[subjectId] = {}
    }
    if (!result[subjectId][monthKey]) {
      result[subjectId][monthKey] = 0
    }

    // 学習時間を計算（簡易版）
    if (log.startTime && log.endTime) {
      const [startHour, startMin] = log.startTime.split(':').map(Number)
      const [endHour, endMin] = log.endTime.split(':').map(Number)
      const startMinutes = startHour * 60 + startMin
      const endMinutes = endHour * 60 + endMin
      const duration = endMinutes > startMinutes ? endMinutes - startMinutes : (24 * 60 - startMinutes) + endMinutes
      result[subjectId][monthKey] += duration
    }
  })

  return result
}

