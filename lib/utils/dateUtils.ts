/**
 * 日付計算ユーティリティ
 */

/**
 * 今週の開始日と終了日を取得
 */
export function getThisWeekRange(): { start: Date; end: Date } {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() - today.getDay())
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 6)
  weekEnd.setHours(23, 59, 59, 999)

  return { start: weekStart, end: weekEnd }
}

/**
 * 指定日が今週かどうかを判定
 */
export function isThisWeek(date: Date): boolean {
  const { start, end } = getThisWeekRange()
  return date >= start && date <= end
}

/**
 * 期限切れかどうかを判定
 */
export function isOverdue(deadline: Date): boolean {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const deadlineDate = new Date(deadline)
  deadlineDate.setHours(0, 0, 0, 0)
  return deadlineDate < today
}

