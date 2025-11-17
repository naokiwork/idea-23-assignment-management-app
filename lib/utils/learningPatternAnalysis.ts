/**
 * 学習パターン分析
 */

import type { StudyLog, Task, Subject } from '../types'
import { getAllStudyLogs } from '../api/studyLogs'
import { getAllTasks } from '../api/tasks'
import { getAllSubjects } from '../api/subjects'
import { calculateStudyTime } from './studyTimeAggregation'

export interface LearningPattern {
  totalStudyTime: number // 総学習時間（分）
  averageStudyTime: number // 平均学習時間（分）
  studyDays: number // 学習日数
  studyFrequency: number // 学習頻度（日/週）
  subjectDistribution: Record<string, number> // 科目別学習時間
  taskTypeDistribution: Record<string, number> // タスク種別別学習時間
}

export interface TimeRange {
  start: Date
  end: Date
}

/**
 * 学習パターンを分析
 */
export function analyzeLearningPattern(timeRange?: TimeRange): LearningPattern {
  const logs = getAllStudyLogs()
  const tasks = getAllTasks()
  const subjects = getAllSubjects()
  
  const taskMap = new Map(tasks.map((t) => [t.id, t]))
  const subjectMap = new Map(subjects.map((s) => [s.id, s]))

  // 期間でフィルタリング
  let filteredLogs = logs
  if (timeRange) {
    filteredLogs = logs.filter((log) => {
      const logDate = new Date(log.date)
      return logDate >= timeRange.start && logDate <= timeRange.end
    })
  }

  // 学習時間の計算
  const totalStudyTime = calculateStudyTime(filteredLogs)
  
  // 学習日数の計算
  const uniqueDates = new Set(filteredLogs.map((log) => log.date))
  const studyDays = uniqueDates.size

  // 期間の日数を計算
  const daysInRange = timeRange
    ? Math.ceil((timeRange.end.getTime() - timeRange.start.getTime()) / (1000 * 60 * 60 * 24)) + 1
    : studyDays

  // 平均学習時間
  const averageStudyTime = studyDays > 0 ? totalStudyTime / studyDays : 0

  // 学習頻度（週あたりの学習日数）
  const weeksInRange = daysInRange / 7
  const studyFrequency = weeksInRange > 0 ? studyDays / weeksInRange : 0

  // 科目別学習時間
  const subjectDistribution: Record<string, number> = {}
  for (const log of filteredLogs) {
    const task = taskMap.get(log.taskId)
    if (task) {
      const subjectId = task.subjectId
      const subjectName = subjectMap.get(subjectId)?.name || subjectId
      const studyTime = calculateStudyTime([log])
      subjectDistribution[subjectName] = (subjectDistribution[subjectName] || 0) + studyTime
    }
  }

  // タスク種別別学習時間
  const taskTypeDistribution: Record<string, number> = {}
  for (const log of filteredLogs) {
    const task = taskMap.get(log.taskId)
    if (task) {
      const taskType = task.taskType
      const studyTime = calculateStudyTime([log])
      taskTypeDistribution[taskType] = (taskTypeDistribution[taskType] || 0) + studyTime
    }
  }

  return {
    totalStudyTime,
    averageStudyTime,
    studyDays,
    studyFrequency,
    subjectDistribution,
    taskTypeDistribution,
  }
}

/**
 * 学習効率を計算
 */
export function calculateLearningEfficiency(
  completedTasks: number,
  totalTasks: number,
  studyTime: number
): number {
  if (totalTasks === 0 || studyTime === 0) {
    return 0
  }
  
  const completionRate = completedTasks / totalTasks
  const timePerTask = studyTime / totalTasks
  
  // 完了率と時間効率のバランスを考慮
  // 完了率が高く、時間効率も良い場合に高いスコア
  return (completionRate * 100) / (1 + timePerTask / 60) // 時間を時間単位に変換
}

