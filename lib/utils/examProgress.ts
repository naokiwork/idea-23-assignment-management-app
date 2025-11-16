/**
 * テスト勉強進捗率計算関数
 */

import type { Exam, Task, Subtask } from '../types'
import { calculateTaskCompletionRate } from './completionRate'
import { getSubtasksByTaskId } from '../api/subtasks'

/**
 * テスト勉強進捗率を計算
 * テストに紐づくタスク（タスク種別が「テスト勉強」）の完了率を集計
 */
export function calculateExamStudyProgress(
  exam: Exam,
  tasks: Task[],
  subtasks: Subtask[]
): number {
  // テストに紐づくタスクを取得
  const examTasks = tasks.filter(
    (task) =>
      task.taskType === 'exam_study' &&
      task.relatedExamId === exam.id
  )

  if (examTasks.length === 0) {
    return 0
  }

  // 各タスクの完了率を計算
  const taskProgresses = examTasks.map((task) => {
    const taskSubtasks = subtasks.filter((st) => st.parentTaskId === task.id)
    return calculateTaskCompletionRate(task, taskSubtasks)
  })

  // 全体の進捗率を計算（平均）
  return Math.round(
    taskProgresses.reduce((sum, progress) => sum + progress, 0) / taskProgresses.length
  )
}

/**
 * テストに紐づくタスクの完了数を取得
 */
export function getCompletedTaskCount(
  exam: Exam,
  tasks: Task[],
  subtasks: Subtask[]
): number {
  const examTasks = tasks.filter(
    (task) =>
      task.taskType === 'exam_study' &&
      task.relatedExamId === exam.id
  )

  return examTasks.filter((task) => {
    const taskSubtasks = subtasks.filter((st) => st.parentTaskId === task.id)
    if (taskSubtasks.length === 0) return false
    return taskSubtasks.every((st) => st.status === 'completed')
  }).length
}

/**
 * テストに紐づくタスクの総数を取得
 */
export function getTotalTaskCount(exam: Exam, tasks: Task[]): number {
  return tasks.filter(
    (task) =>
      task.taskType === 'exam_study' &&
      task.relatedExamId === exam.id
  ).length
}

