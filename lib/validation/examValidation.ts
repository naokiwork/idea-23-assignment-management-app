/**
 * テストバリデーション関数
 */

import type { Exam } from '../types'
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
 * テストをバリデーション
 */
export function validateExam(exam: Partial<Exam>): ValidationResult {
  const errors: ValidationError[] = []

  // テスト名の必須チェック
  if (!exam.name || exam.name.trim() === '') {
    errors.push({
      field: 'name',
      message: 'テスト名は必須です',
    })
  }

  // 実施日の必須チェック
  if (!exam.date) {
    errors.push({
      field: 'date',
      message: '実施日は必須です',
    })
  } else {
    // 日付形式のチェック
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(exam.date)) {
      errors.push({
        field: 'date',
        message: '実施日の形式が正しくありません（YYYY-MM-DD）',
      })
    } else {
      // 実施日が過去でないことのチェック（オプション - 警告のみ）
      const examDate = new Date(exam.date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      if (examDate < today) {
        // 警告として扱う（エラーにはしない）
        // 実際の実装では、警告として表示するか、エラーにするかは要件による
      }
    }
  }

  // 科目IDの存在チェック
  if (!exam.subjectId) {
    errors.push({
      field: 'subjectId',
      message: '科目は必須です',
    })
  } else {
    const data = loadData()
    if (data && !data.subjects.find((subject) => subject.id === exam.subjectId)) {
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

