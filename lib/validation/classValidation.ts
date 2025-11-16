/**
 * 授業回バリデーション関数
 */

import type { Class } from '../types'
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
 * 授業回をバリデーション
 */
export function validateClass(classData: Partial<Class>): ValidationResult {
  const errors: ValidationError[] = []

  // タイトルの必須チェック
  if (!classData.title || classData.title.trim() === '') {
    errors.push({
      field: 'title',
      message: '授業タイトルは必須です',
    })
  }

  // 日付の必須チェック
  if (!classData.date) {
    errors.push({
      field: 'date',
      message: '日付は必須です',
    })
  } else {
    // 日付形式のチェック
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(classData.date)) {
      errors.push({
        field: 'date',
        message: '日付の形式が正しくありません（YYYY-MM-DD）',
      })
    }
  }

  // 科目IDの存在チェック
  if (!classData.subjectId) {
    errors.push({
      field: 'subjectId',
      message: '科目は必須です',
    })
  } else {
    const data = loadData()
    if (data && !data.subjects.find((subject) => subject.id === classData.subjectId)) {
      errors.push({
        field: 'subjectId',
        message: '選択された科目が見つかりません',
      })
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

