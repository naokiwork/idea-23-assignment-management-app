/**
 * 科目バリデーション関数
 */

import type { Subject } from '../types'

export interface ValidationError {
  field: string
  message: string
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
}

/**
 * 科目をバリデーション
 */
export function validateSubject(subject: Partial<Subject>): ValidationResult {
  const errors: ValidationError[] = []

  // 科目名の必須チェック
  if (!subject.name || subject.name.trim() === '') {
    errors.push({
      field: 'name',
      message: '科目名は必須です',
    })
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

