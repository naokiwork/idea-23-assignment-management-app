/**
 * テストに紐づく必要タスク取得関数
 */

import type { Task } from '../types'

/**
 * テストに紐づく必要タスクを取得
 * タスク種別が「テスト勉強」で、関連テストIDが一致するタスクをフィルタ
 */
export function getRequiredTasksForExam(examId: string, tasks: Task[]): Task[] {
  return tasks.filter(
    (task) =>
      task.taskType === 'exam_study' &&
      task.relatedExamId === examId
  )
}

