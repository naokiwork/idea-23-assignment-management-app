/**
 * レポートデータ集計
 */

import { getAllTasks } from '../api/tasks'
import { getAllStudyLogs } from '../api/studyLogs'
import { getAllSubjects } from '../api/subjects'
import { calculateStudyTime } from './studyTimeAggregation'
import type { Task, StudyLog, Subject } from '../types'

export interface ReportData {
  period: { start: Date; end: Date }
  totalStudyTime: number // 分単位
  totalTasks: number
  completedTasks: number
  completionRate: number
  subjectStats: Array<{
    subjectId: string
    subjectName: string
    studyTime: number
    taskCount: number
    completedTaskCount: number
  }>
  dailyStats: Array<{
    date: string
    studyTime: number
    taskCount: number
    completedTaskCount: number
  }>
}

/**
 * レポートデータを集計
 */
export function aggregateReportData(startDate: Date, endDate: Date): ReportData {
  const tasks = getAllTasks()
  const logs = getAllStudyLogs()
  const subjects = getAllSubjects()
  
  const subjectMap = new Map(subjects.map((s) => [s.id, s]))

  // 期間でフィルタリング
  const filteredTasks = tasks.filter((task) => {
    const deadline = new Date(task.deadline)
    return deadline >= startDate && deadline <= endDate
  })

  const filteredLogs = logs.filter((log) => {
    const logDate = new Date(log.date)
    return logDate >= startDate && logDate <= endDate
  })

  // タスク完了状況
  const completedTasks = filteredTasks.filter((task) => {
    // 簡易的な完了判定（サブタスクがすべて完了しているか）
    // 実際の実装では、サブタスクの状態を確認する必要があります
    return false // 将来の拡張
  })

  const completionRate = filteredTasks.length > 0
    ? (completedTasks.length / filteredTasks.length) * 100
    : 0

  // 総学習時間
  const totalStudyTime = calculateStudyTime(filteredLogs)

  // 科目別統計
  const subjectStatsMap = new Map<string, {
    subjectId: string
    studyTime: number
    taskCount: number
    completedTaskCount: number
  }>()

  for (const task of filteredTasks) {
    const subjectId = task.subjectId
    if (!subjectStatsMap.has(subjectId)) {
      subjectStatsMap.set(subjectId, {
        subjectId,
        studyTime: 0,
        taskCount: 0,
        completedTaskCount: 0,
      })
    }
    const stats = subjectStatsMap.get(subjectId)!
    stats.taskCount++
    if (completedTasks.includes(task)) {
      stats.completedTaskCount++
    }
  }

  for (const log of filteredLogs) {
    const task = tasks.find((t) => t.id === log.taskId)
    if (task) {
      const subjectId = task.subjectId
      if (subjectStatsMap.has(subjectId)) {
        const stats = subjectStatsMap.get(subjectId)!
        stats.studyTime += calculateStudyTime([log])
      }
    }
  }

  const subjectStats = Array.from(subjectStatsMap.values()).map((stats) => ({
    ...stats,
    subjectName: subjectMap.get(stats.subjectId)?.name || stats.subjectId,
  }))

  // 日別統計
  const dailyStatsMap = new Map<string, {
    date: string
    studyTime: number
    taskCount: number
    completedTaskCount: number
  }>()

  for (const task of filteredTasks) {
    const date = task.deadline.split('T')[0]
    if (!dailyStatsMap.has(date)) {
      dailyStatsMap.set(date, {
        date,
        studyTime: 0,
        taskCount: 0,
        completedTaskCount: 0,
      })
    }
    const stats = dailyStatsMap.get(date)!
    stats.taskCount++
    if (completedTasks.includes(task)) {
      stats.completedTaskCount++
    }
  }

  for (const log of filteredLogs) {
    const date = log.date
    if (!dailyStatsMap.has(date)) {
      dailyStatsMap.set(date, {
        date,
        studyTime: 0,
        taskCount: 0,
        completedTaskCount: 0,
      })
    }
    const stats = dailyStatsMap.get(date)!
    stats.studyTime += calculateStudyTime([log])
  }

  const dailyStats = Array.from(dailyStatsMap.values()).sort((a, b) =>
    a.date.localeCompare(b.date)
  )

  return {
    period: { start: startDate, end: endDate },
    totalStudyTime,
    totalTasks: filteredTasks.length,
    completedTasks: completedTasks.length,
    completionRate,
    subjectStats,
    dailyStats,
  }
}

/**
 * 期間のラベルを取得
 */
export function getPeriodLabel(startDate: Date, endDate: Date): string {
  const start = startDate.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })
  const end = endDate.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })
  return `${start} 〜 ${end}`
}


