/**
 * タスクバリデーション関数
 */

import type { Task } from '../types'
import { loadData } from '../storage'

export interface ValidationError {
  field: string
  message: string
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
}

/**
 * タスクをバリデーション
 */
export function validateTask(task: Partial<Task>): ValidationResult {
  const errors: ValidationError[] = []

  // タスクタイトルの必須チェック
  if (!task.title || task.title.trim() === '') {
    errors.push({
      field: 'title',
      message: 'タスクタイトルは必須です',
    })
  }

  // 締切日の必須チェック
  if (!task.deadline) {
    errors.push({
      field: 'deadline',
      message: '締切日は必須です',
    })
  } else {
    // 日付形式のチェック
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(task.deadline)) {
      errors.push({
        field: 'deadline',
        message: '締切日の形式が正しくありません（YYYY-MM-DD）',
      })
    }
  }

  // 科目IDの存在チェック
  if (!task.subjectId) {
    errors.push({
      field: 'subjectId',
      message: '科目は必須です',
    })
  } else {
    const data = loadData()
    if (data && !data.subjects.find((subject) => subject.id === task.subjectId)) {
      errors.push({
        field: 'subjectId',
        message: '選択された科目が見つかりません',
      })
    }
  }

  // タスク種別の必須チェック
  if (!task.taskType) {
    errors.push({
      field: 'taskType',
      message: 'タスク種別は必須です',
    })
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

