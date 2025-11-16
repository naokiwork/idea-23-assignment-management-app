/**
 * 完了率計算関数
 */

import type { Task, Subtask } from '../types'

/**
 * タスクの完了率を計算
 * サブタスクの状態（未/進/完）に基づいて計算
 */
export function calculateTaskCompletionRate(
  task: Task,
  subtasks: Subtask[]
): number {
  const taskSubtasks = subtasks.filter((st) => st.parentTaskId === task.id)

  if (taskSubtasks.length === 0) {
    return 0 // サブタスクがない場合は0%
  }

  const completedCount = taskSubtasks.filter(
    (st) => st.status === 'completed'
  ).length
  const inProgressCount = taskSubtasks.filter(
    (st) => st.status === 'in_progress'
  ).length

  // 完了: 100%、進行中: 50%、未着手: 0%として計算
  const totalProgress =
    completedCount * 100 + inProgressCount * 50

  return Math.round(totalProgress / taskSubtasks.length)
}

