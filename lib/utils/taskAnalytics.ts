/**
 * タスク分析関数
 */

import type { Task, Subtask } from '../types'
import { loadData } from '../storage'

/**
 * タスクが完了しているか判定（簡易版：サブタスクの完了率から判定）
 */
function isTaskCompleted(task: Task, subtasks: Subtask[]): boolean {
  const taskSubtasks = subtasks.filter((st) => st.parentTaskId === task.id)
  if (taskSubtasks.length === 0) {
    // サブタスクがない場合は未完了とみなす
    return false
  }
  // すべてのサブタスクが完了している場合、タスクも完了とみなす
  return taskSubtasks.every((st) => st.status === 'completed')
}

/**
 * 日付別完了タスク数
 */
export function getCompletedTasksByDateRange(
  startDate: Date,
  endDate: Date
): Record<string, number> {
  const data = loadData()
  if (!data) return {}

  const result: Record<string, number> = {}
  const completedTasks = data.tasks.filter((task) =>
    isTaskCompleted(task, data.subtasks)
  )

  completedTasks.forEach((task) => {
    // タスクの完了日を取得（簡易版：締切日を使用）
    // 実際の実装では、タスクの完了日を記録する必要がある
    const taskDate = new Date(task.deadline)
    if (taskDate >= startDate && taskDate <= endDate) {
      const dateStr = taskDate.toISOString().split('T')[0]
      result[dateStr] = (result[dateStr] || 0) + 1
    }
  })

  return result
}

/**
 * 週別完了タスク数
 */
export function getCompletedTasksByWeek(
  startDate: Date,
  endDate: Date
): Record<string, number> {
  const dailyData = getCompletedTasksByDateRange(startDate, endDate)
  const result: Record<string, number> = {}

  Object.keys(dailyData).forEach((dateStr) => {
    const date = new Date(dateStr)
    const weekStart = new Date(date)
    weekStart.setDate(date.getDate() - date.getDay())
    const weekKey = weekStart.toISOString().split('T')[0]

    result[weekKey] = (result[weekKey] || 0) + dailyData[dateStr]
  })

  return result
}

/**
 * 月別完了タスク数
 */
export function getCompletedTasksByMonth(
  startDate: Date,
  endDate: Date
): Record<string, number> {
  const dailyData = getCompletedTasksByDateRange(startDate, endDate)
  const result: Record<string, number> = {}

  Object.keys(dailyData).forEach((dateStr) => {
    const date = new Date(dateStr)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

    result[monthKey] = (result[monthKey] || 0) + dailyData[dateStr]
  })

  return result
}

