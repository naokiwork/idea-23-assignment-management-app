/**
 * 学習データ分析
 */

import { getAllTasks } from '../api/tasks'
import { getAllStudyLogs } from '../api/studyLogs'
import { getAllSubjects } from '../api/subjects'
import { calculateStudyTime } from './studyTimeAggregation'
import type { Task, StudyLog, Subject } from '../types'

export interface LearningDataAnalysis {
  averageStudyTimePerDay: number // 1日平均学習時間（分）
  averageStudyTimePerTask: number // 1タスク平均学習時間（分）
  studyFrequency: number // 学習頻度（週あたりの学習日数）
  completionRate: number // タスク完了率
  subjectPerformance: Array<{
    subjectId: string
    subjectName: string
    averageStudyTime: number
    taskCompletionRate: number
    studyFrequency: number
  }>
  taskTypePerformance: Record<string, {
    averageStudyTime: number
    completionRate: number
    count: number
  }>
  learningStreak: number // 連続学習日数
  preferredStudyTime: string | null // 好ましい学習時間帯
}

/**
 * 学習データを分析
 */
export function analyzeLearningData(timeRange?: { start: Date; end: Date }): LearningDataAnalysis {
  const tasks = getAllTasks()
  const logs = getAllStudyLogs()
  const subjects = getAllSubjects()
  
  const subjectMap = new Map(subjects.map((s) => [s.id, s]))

  // 期間でフィルタリング
  let filteredTasks = tasks
  let filteredLogs = logs
  
  if (timeRange) {
    filteredTasks = tasks.filter((task) => {
      const deadline = new Date(task.deadline)
      return deadline >= timeRange.start && deadline <= timeRange.end
    })
    
    filteredLogs = logs.filter((log) => {
      const logDate = new Date(log.date)
      return logDate >= timeRange.start && logDate <= timeRange.end
    })
  }

  // 総学習時間
  const totalStudyTime = calculateStudyTime(filteredLogs)
  
  // 学習日数
  const uniqueDates = new Set(filteredLogs.map((log) => log.date))
  const studyDays = uniqueDates.size
  
  // 1日平均学習時間
  const averageStudyTimePerDay = studyDays > 0 ? totalStudyTime / studyDays : 0
  
  // 1タスク平均学習時間
  const taskStudyTimeMap = new Map<string, number>()
  for (const log of filteredLogs) {
    const current = taskStudyTimeMap.get(log.taskId) || 0
    taskStudyTimeMap.set(log.taskId, current + calculateStudyTime([log]))
  }
  const totalTaskStudyTime = Array.from(taskStudyTimeMap.values()).reduce((a, b) => a + b, 0)
  const averageStudyTimePerTask = taskStudyTimeMap.size > 0 ? totalTaskStudyTime / taskStudyTimeMap.size : 0

  // 学習頻度（週あたりの学習日数）
  const daysInRange = timeRange
    ? Math.ceil((timeRange.end.getTime() - timeRange.start.getTime()) / (1000 * 60 * 60 * 24)) + 1
    : studyDays
  const weeksInRange = daysInRange / 7
  const studyFrequency = weeksInRange > 0 ? studyDays / weeksInRange : 0

  // タスク完了率（簡易版）
  // 実際の実装では、サブタスクの状態を確認する必要があります
  const completedTasks = filteredTasks.filter((task) => {
    // 将来の拡張: サブタスクの完了状態を確認
    return false
  })
  const completionRate = filteredTasks.length > 0
    ? (completedTasks.length / filteredTasks.length) * 100
    : 0

  // 科目別パフォーマンス
  const subjectPerformanceMap = new Map<string, {
    studyTime: number
    taskCount: number
    completedTaskCount: number
    studyDays: Set<string>
  }>()

  for (const task of filteredTasks) {
    const subjectId = task.subjectId
    if (!subjectPerformanceMap.has(subjectId)) {
      subjectPerformanceMap.set(subjectId, {
        studyTime: 0,
        taskCount: 0,
        completedTaskCount: 0,
        studyDays: new Set(),
      })
    }
    const perf = subjectPerformanceMap.get(subjectId)!
    perf.taskCount++
    if (completedTasks.includes(task)) {
      perf.completedTaskCount++
    }
  }

  for (const log of filteredLogs) {
    const task = tasks.find((t) => t.id === log.taskId)
    if (task) {
      const subjectId = task.subjectId
      if (subjectPerformanceMap.has(subjectId)) {
        const perf = subjectPerformanceMap.get(subjectId)!
        perf.studyTime += calculateStudyTime([log])
        perf.studyDays.add(log.date)
      }
    }
  }

  const subjectPerformance = Array.from(subjectPerformanceMap.entries()).map(([subjectId, perf]) => ({
    subjectId,
    subjectName: subjectMap.get(subjectId)?.name || subjectId,
    averageStudyTime: perf.studyDays.size > 0 ? perf.studyTime / perf.studyDays.size : 0,
    taskCompletionRate: perf.taskCount > 0 ? (perf.completedTaskCount / perf.taskCount) * 100 : 0,
    studyFrequency: perf.studyDays.size,
  }))

  // タスク種別別パフォーマンス
  const taskTypePerformance: Record<string, {
    studyTime: number
    taskCount: number
    completedTaskCount: number
  }> = {}

  for (const task of filteredTasks) {
    const taskType = task.taskType
    if (!taskTypePerformance[taskType]) {
      taskTypePerformance[taskType] = {
        studyTime: 0,
        taskCount: 0,
        completedTaskCount: 0,
      }
    }
    taskTypePerformance[taskType].taskCount++
    if (completedTasks.includes(task)) {
      taskTypePerformance[taskType].completedTaskCount++
    }
  }

  for (const log of filteredLogs) {
    const task = tasks.find((t) => t.id === log.taskId)
    if (task) {
      const taskType = task.taskType
      if (taskTypePerformance[taskType]) {
        taskTypePerformance[taskType].studyTime += calculateStudyTime([log])
      }
    }
  }

  const taskTypePerformanceResult: Record<string, {
    averageStudyTime: number
    completionRate: number
    count: number
  }> = {}

  for (const [taskType, perf] of Object.entries(taskTypePerformance)) {
    taskTypePerformanceResult[taskType] = {
      averageStudyTime: perf.taskCount > 0 ? perf.studyTime / perf.taskCount : 0,
      completionRate: perf.taskCount > 0 ? (perf.completedTaskCount / perf.taskCount) * 100 : 0,
      count: perf.taskCount,
    }
  }

  // 連続学習日数
  const sortedDates = Array.from(uniqueDates)
    .map((date) => new Date(date))
    .sort((a, b) => a.getTime() - b.getTime())
  
  let learningStreak = 0
  if (sortedDates.length > 0) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const latestDate = sortedDates[sortedDates.length - 1]
    latestDate.setHours(0, 0, 0, 0)
    const daysSinceLatest = Math.floor((today.getTime() - latestDate.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysSinceLatest <= 1) {
      let checkDate = new Date(latestDate)
      let consecutive = 0
      while (sortedDates.some((d) => {
        const dCopy = new Date(d)
        dCopy.setHours(0, 0, 0, 0)
        return dCopy.getTime() === checkDate.getTime()
      })) {
        consecutive++
        checkDate.setDate(checkDate.getDate() - 1)
      }
      learningStreak = consecutive
    }
  }

  // 好ましい学習時間帯
  const timeOfDayCounts: Record<string, number> = {}
  for (const log of filteredLogs) {
    if (log.startTime) {
      const [hours] = log.startTime.split(':').map(Number)
      const timeSlot = hours >= 5 && hours < 12 ? 'morning'
        : hours >= 12 && hours < 17 ? 'afternoon'
        : hours >= 17 && hours < 22 ? 'evening'
        : 'night'
      timeOfDayCounts[timeSlot] = (timeOfDayCounts[timeSlot] || 0) + 1
    }
  }
  
  const preferredStudyTime = Object.keys(timeOfDayCounts).length > 0
    ? Object.entries(timeOfDayCounts).reduce((a, b) => (a[1] > b[1] ? a : b))[0]
    : null

  return {
    averageStudyTimePerDay,
    averageStudyTimePerTask,
    studyFrequency,
    completionRate,
    subjectPerformance,
    taskTypePerformance: taskTypePerformanceResult,
    learningStreak,
    preferredStudyTime: preferredStudyTime === 'morning' ? '朝'
      : preferredStudyTime === 'afternoon' ? '昼'
      : preferredStudyTime === 'evening' ? '夕方'
      : preferredStudyTime === 'night' ? '夜'
      : null,
  }
}


