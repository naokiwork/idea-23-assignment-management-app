/**
 * 学習ログバリデーション関数
 */

import type { StudyLog } from '../types'
import { calculateDuration } from '../utils/timeCalculation'
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
 * 学習ログをバリデーション
 */
export function validateStudyLog(log: Partial<StudyLog>): ValidationResult {
  const errors: ValidationError[] = []

  // 日付の必須チェック
  if (!log.date) {
    errors.push({
      field: 'date',
      message: '日付は必須です',
    })
  } else {
    // 日付形式のチェック
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(log.date)) {
      errors.push({
        field: 'date',
        message: '日付の形式が正しくありません（YYYY-MM-DD）',
      })
    }
  }

  // 開始時刻・終了時刻の必須チェック
  if (!log.startTime) {
    errors.push({
      field: 'startTime',
      message: '開始時刻は必須です',
    })
  } else {
    // 時刻形式のチェック
    const timeRegex = /^\d{2}:\d{2}$/
    if (!timeRegex.test(log.startTime)) {
      errors.push({
        field: 'startTime',
        message: '開始時刻の形式が正しくありません（HH:MM）',
      })
    }
  }

  if (!log.endTime) {
    errors.push({
      field: 'endTime',
      message: '終了時刻は必須です',
    })
  } else {
    // 時刻形式のチェック
    const timeRegex = /^\d{2}:\d{2}$/
    if (!timeRegex.test(log.endTime)) {
      errors.push({
        field: 'endTime',
        message: '終了時刻の形式が正しくありません（HH:MM）',
      })
    }
  }

  // 終了時刻が開始時刻より後であることのチェック
  if (log.startTime && log.endTime) {
    const duration = calculateDuration(log.startTime, log.endTime)
    if (duration <= 0 && duration !== (24 * 60 - calculateDuration(log.endTime, log.startTime))) {
      errors.push({
        field: 'endTime',
        message: '終了時刻は開始時刻より後である必要があります',
      })
    }
  }

  // 対象タスクIDの存在チェック
  if (!log.taskId) {
    errors.push({
      field: 'taskId',
      message: '対象タスクは必須です',
    })
  } else {
    const data = loadData()
    if (data && !data.tasks.find((task) => task.id === log.taskId)) {
      errors.push({
        field: 'taskId',
        message: '選択されたタスクが見つかりません',
      })
    }
  }

  // 実施内容のチェック（任意だが、空文字列は許可しない）
  if (log.content !== undefined && log.content.trim() === '') {
    errors.push({
      field: 'content',
      message: '実施内容を入力してください',
    })
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

