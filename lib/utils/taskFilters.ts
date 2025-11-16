/**
 * タスクフィルタリング関数
 */

import type { Task, TaskType } from '../types'
import { loadData } from '../storage'

/**
 * 今週のタスク（締切が今週内）
 */
export function filterByWeek(tasks: Task[]): Task[] {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() - today.getDay())
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 6)

  return tasks.filter((task) => {
    const deadline = new Date(task.deadline)
    return deadline >= weekStart && deadline <= weekEnd
  })
}

/**
 * 未完了タスク（サブタスクがすべて完了していない）
 */
export function filterIncomplete(tasks: Task[]): Task[] {
  const data = loadData()
  if (!data) return []

  return tasks.filter((task) => {
    const subtasks = data.subtasks.filter((st) => st.parentTaskId === task.id)
    if (subtasks.length === 0) return true // サブタスクがない場合は未完了とみなす
    return !subtasks.every((st) => st.status === 'completed')
  })
}

/**
 * 期限切れタスク
 */
export function filterOverdue(tasks: Task[]): Task[] {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return tasks.filter((task) => {
    const deadline = new Date(task.deadline)
    deadline.setHours(0, 0, 0, 0)
    return deadline < today
  })
}

/**
 * 科目別フィルタ
 */
export function filterBySubject(tasks: Task[], subjectId: string): Task[] {
  return tasks.filter((task) => task.subjectId === subjectId)
}

/**
 * タスク種別フィルタ
 */
export function filterByTaskType(tasks: Task[], taskType: TaskType): Task[] {
  return tasks.filter((task) => task.taskType === taskType)
}

/**
 * テスト用タスク（タスク種別が「テスト勉強」）
 */
export function filterTestTasks(tasks: Task[]): Task[] {
  return tasks.filter((task) => task.taskType === 'exam_study')
}

