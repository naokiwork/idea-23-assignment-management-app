/**
 * 進捗率分析関数
 */

import { loadData } from '../storage'
import type { Task, Subtask } from '../types'

/**
 * タスクの完了率を計算（サブタスクの完了率から）
 */
function calculateTaskProgress(task: Task, subtasks: Subtask[]): number {
  const taskSubtasks = subtasks.filter((st) => st.parentTaskId === task.id)
  if (taskSubtasks.length === 0) {
    return 0
  }

  const completedCount = taskSubtasks.filter(
    (st) => st.status === 'completed'
  ).length

  return (completedCount / taskSubtasks.length) * 100
}

/**
 * 月別進捗率を計算
 */
export function calculateMonthlyProgressRate(month: Date): number {
  const data = loadData()
  if (!data) return 0

  const monthStart = new Date(month.getFullYear(), month.getMonth(), 1)
  const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0)

  // その月に締切があるタスクを取得
  const monthTasks = data.tasks.filter((task) => {
    const deadline = new Date(task.deadline)
    return deadline >= monthStart && deadline <= monthEnd
  })

  if (monthTasks.length === 0) return 0

  // 各タスクの進捗率を計算して平均を取る
  const totalProgress = monthTasks.reduce((sum, task) => {
    return sum + calculateTaskProgress(task, data.subtasks)
  }, 0)

  return totalProgress / monthTasks.length
}

/**
 * 月別進捗率の推移
 */
export function getProgressRateByMonth(
  startDate: Date,
  endDate: Date
): Record<string, number> {
  const result: Record<string, number> = {}

  const current = new Date(startDate)
  while (current <= endDate) {
    const monthKey = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`
    result[monthKey] = calculateMonthlyProgressRate(current)

    // 次の月へ
    current.setMonth(current.getMonth() + 1)
  }

  return result
}

