/**
 * テンプレートデータのバリデーション
 */

import type { SubjectTemplate, ValidationError, ValidationResult } from '../types/template'

/**
 * テンプレートデータをバリデーション
 */
export function validateTemplate(data: SubjectTemplate[]): ValidationResult {
  const errors: ValidationError[] = []

  data.forEach((template, index) => {
    const row = index + 1

    // 科目名の必須チェック
    if (!template.subjectName || template.subjectName.trim() === '') {
      errors.push({
        row,
        field: 'subjectName',
        message: '科目名は必須です',
      })
    }

    // 曜日の妥当性チェック
    const validDays: string[] = ['月', '火', '水', '木', '金', '土', '日']
    if (!validDays.includes(template.dayOfWeek)) {
      errors.push({
        row,
        field: 'dayOfWeek',
        message: `曜日は「${validDays.join('」「')}」のいずれかである必要があります`,
      })
    }

    // 時限の妥当性チェック
    if (!template.period || template.period < 1 || template.period > 8) {
      errors.push({
        row,
        field: 'period',
        message: '時限は1〜8の範囲である必要があります',
      })
    }
  })

  // 重複科目名のチェック
  const subjectNames = data.map((t) => t.subjectName)
  const duplicates = subjectNames.filter((name, index) => subjectNames.indexOf(name) !== index)
  if (duplicates.length > 0) {
    const uniqueDuplicates = [...new Set(duplicates)]
    uniqueDuplicates.forEach((name) => {
      errors.push({
        message: `科目名「${name}」が重複しています`,
      })
    })
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

