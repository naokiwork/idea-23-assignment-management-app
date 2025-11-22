/**
 * リアルタイム統計
 */

import { getAllStudyLogs } from '../api/studyLogs'
import { getAllTasks } from '../api/tasks'
import { calculateStudyTime } from './studyTimeAggregation'
import { getThisWeekRange, getThisMonthRange, getLastMonthRange } from './dateUtils'

export interface RealtimeStatistics {
  todayStudyTime: number // 今日の学習時間（分）
  weekStudyTime: number // 今週の学習時間（分）
  monthStudyTime: number // 今月の学習時間（分）
  completedTasksToday: number // 今日完了したタスク数
  completedTasksWeek: number // 今週完了したタスク数
  completedTasksMonth: number // 今月完了したタスク数
  totalTasks: number // 総タスク数
  pendingTasks: number // 未完了タスク数
  overdueTasks: number // 期限切れタスク数
  weekTrend: number // 今週の学習時間の前週比（%）
  monthTrend: number // 今月の学習時間の前月比（%）
}

/**
 * リアルタイム統計を計算
 */
export function calculateRealtimeStatistics(): RealtimeStatistics {
  const allStudyLogs = getAllStudyLogs()
  const allTasks = getAllTasks()
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  // 今週の範囲
  const thisWeekRange = getThisWeekRange()
  // 今月の範囲
  const thisMonthRange = getThisMonthRange()
  // 先月の範囲
  const lastMonthRange = getLastMonthRange()

  // 今日の学習ログ
  const todayLogs = allStudyLogs.filter(log => {
    const logDate = new Date(log.date)
    return logDate.getTime() === today.getTime()
  })

  // 今週の学習ログ
  const weekLogs = allStudyLogs.filter(log => {
    const logDate = new Date(log.date)
    return logDate >= thisWeekRange.start && logDate <= thisWeekRange.end
  })

  // 今月の学習ログ
  const monthLogs = allStudyLogs.filter(log => {
    const logDate = new Date(log.date)
    return logDate >= thisMonthRange.start && logDate <= thisMonthRange.end
  })

  // 先月の学習ログ
  const lastMonthLogs = allStudyLogs.filter(log => {
    const logDate = new Date(log.date)
    return logDate >= lastMonthRange.start && logDate <= lastMonthRange.end
  })

  // 学習時間の計算
  const todayStudyTime = calculateStudyTime(todayLogs)
  const weekStudyTime = calculateStudyTime(weekLogs)
  const monthStudyTime = calculateStudyTime(monthLogs)
  const lastMonthStudyTime = calculateStudyTime(lastMonthLogs)

  // タスクの集計（Task型にstatusがないため、完了タスクは学習ログから推定）
  const completedTaskIds = new Set(
    allStudyLogs
      .filter(log => {
        const logDate = new Date(log.date)
        return logDate.getTime() === today.getTime()
      })
      .map(log => log.taskId)
  )
  const completedTasksToday = completedTaskIds.size

  const weekCompletedTaskIds = new Set(
    weekLogs.map(log => log.taskId)
  )
  const completedTasksWeek = weekCompletedTaskIds.size

  const monthCompletedTaskIds = new Set(
    monthLogs.map(log => log.taskId)
  )
  const completedTasksMonth = monthCompletedTaskIds.size

  const totalTasks = allTasks.length
  const allTaskIds = new Set(allTasks.map(t => t.id))
  const loggedTaskIds = new Set(allStudyLogs.map(log => log.taskId))
  const pendingTasks = allTasks.filter(task => !loggedTaskIds.has(task.id)).length
  const overdueTasks = allTasks.filter(task => {
    const deadline = new Date(task.deadline)
    return deadline < today && !loggedTaskIds.has(task.id)
  }).length

  // トレンドの計算
  const lastWeekStudyTime = calculateStudyTime(
    allStudyLogs.filter(log => {
      const logDate = new Date(log.date)
      const lastWeekStart = new Date(thisWeekRange.start)
      lastWeekStart.setDate(lastWeekStart.getDate() - 7)
      const lastWeekEnd = new Date(thisWeekRange.end)
      lastWeekEnd.setDate(lastWeekEnd.getDate() - 7)
      return logDate >= lastWeekStart && logDate <= lastWeekEnd
    })
  )

  const weekTrend = lastWeekStudyTime > 0
    ? ((weekStudyTime - lastWeekStudyTime) / lastWeekStudyTime) * 100
    : 0

  const monthTrend = lastMonthStudyTime > 0
    ? ((monthStudyTime - lastMonthStudyTime) / lastMonthStudyTime) * 100
    : 0

  return {
    todayStudyTime,
    weekStudyTime,
    monthStudyTime,
    completedTasksToday,
    completedTasksWeek,
    completedTasksMonth,
    totalTasks,
    pendingTasks,
    overdueTasks,
    weekTrend,
    monthTrend,
  }
}

