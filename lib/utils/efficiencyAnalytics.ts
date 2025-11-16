/**
 * 効率性分析関数
 */

import type { Task, Subtask } from '../types'
import { loadData } from '../storage'

/**
 * タスクが完了しているか判定（簡易版）
 */
function isTaskCompleted(task: Task, subtasks: Subtask[]): boolean {
  const taskSubtasks = subtasks.filter((st) => st.parentTaskId === task.id)
  if (taskSubtasks.length === 0) return false
  return taskSubtasks.every((st) => st.status === 'completed')
}

/**
 * タスクの早期完了日数を計算
 * 簡易版：締切日と完了日（サブタスクがすべて完了した日）の差を計算
 */
export function calculateEarlyCompletionDays(task: Task): number | null {
  const data = loadData()
  if (!data) return null

  // タスクが完了しているか確認
  if (!isTaskCompleted(task, data.subtasks)) {
    return null
  }

  // 簡易版：サブタスクがすべて完了した日を完了日とする
  // 実際の実装では、タスクの完了日を記録する必要がある
  const deadline = new Date(task.deadline)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  deadline.setHours(0, 0, 0, 0)

  const diffTime = deadline.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  // 早期完了の場合のみ正の値を返す
  return diffDays > 0 ? diffDays : null
}

/**
 * 平均早期完了日数
 */
export function getAverageEarlyCompletionDays(tasks: Task[]): number {
  const earlyDays = tasks
    .map((task) => calculateEarlyCompletionDays(task))
    .filter((days): days is number => days !== null)

  if (earlyDays.length === 0) return 0

  const sum = earlyDays.reduce((acc, days) => acc + days, 0)
  return sum / earlyDays.length
}

/**
 * 早期完了統計
 */
export function getEarlyCompletionStats(tasks: Task[]): {
  average: number
  max: number
  min: number
  count: number
} {
  const earlyDays = tasks
    .map((task) => calculateEarlyCompletionDays(task))
    .filter((days): days is number => days !== null)

  if (earlyDays.length === 0) {
    return {
      average: 0,
      max: 0,
      min: 0,
      count: 0,
    }
  }

  return {
    average: getAverageEarlyCompletionDays(tasks),
    max: Math.max(...earlyDays),
    min: Math.min(...earlyDays),
    count: earlyDays.length,
  }
}

