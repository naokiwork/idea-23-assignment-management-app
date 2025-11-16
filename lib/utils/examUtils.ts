/**
 * テストユーティリティ関数
 */

/**
 * テストまでの残り日数を計算
 */
export function calculateDaysUntilExam(examDate: Date | string): number {
  const exam = typeof examDate === 'string' ? new Date(examDate) : examDate
  const now = new Date()
  
  // 時刻を0時にリセットして日付のみで比較
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const examDateOnly = new Date(exam.getFullYear(), exam.getMonth(), exam.getDate())
  
  const diffTime = examDateOnly.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return diffDays
}

/**
 * 残り日数の表示フォーマット（"あと3日"など）
 */
export function formatDaysRemaining(days: number): string {
  if (days < 0) {
    return `${Math.abs(days)}日前に終了`
  } else if (days === 0) {
    return '今日'
  } else if (days === 1) {
    return 'あと1日'
  } else {
    return `あと${days}日`
  }
}

/**
 * 残り日数に基づいて緊急度を判定
 */
export type UrgencyLevel = 'low' | 'medium' | 'high' | 'overdue'

export function getUrgencyLevel(days: number): UrgencyLevel {
  if (days < 0) {
    return 'overdue'
  } else if (days <= 3) {
    return 'high'
  } else if (days <= 7) {
    return 'medium'
  } else {
    return 'low'
  }
}

