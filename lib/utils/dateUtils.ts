/**
 * 日付計算ユーティリティ
 * タイムゾーンを考慮した日付処理
 */

/**
 * ローカルタイムゾーンで日付を正規化（時刻を00:00:00に設定）
 */
function normalizeDate(date: Date): Date {
  const normalized = new Date(date)
  normalized.setHours(0, 0, 0, 0)
  return normalized
}

/**
 * 今週の開始日と終了日を取得（ローカルタイムゾーン）
 */
export function getThisWeekRange(): { start: Date; end: Date } {
  const now = new Date()
  const today = normalizeDate(now)
  const weekStart = new Date(today)
  // 日曜日を週の始まりとする（0 = 日曜日）
  const dayOfWeek = today.getDay()
  weekStart.setDate(today.getDate() - dayOfWeek)
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
  const normalizedDate = normalizeDate(date)
  return normalizedDate >= start && normalizedDate <= end
}

/**
 * 期限切れかどうかを判定
 */
export function isOverdue(deadline: Date): boolean {
  const today = normalizeDate(new Date())
  const deadlineDate = normalizeDate(deadline)
  return deadlineDate < today
}

/**
 * 今月の範囲を取得
 */
export function getThisMonthRange(): { start: Date; end: Date } {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), 1)
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  end.setHours(23, 59, 59, 999)
  return { start, end }
}

/**
 * 先月の範囲を取得
 */
export function getLastMonthRange(): { start: Date; end: Date } {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const end = new Date(now.getFullYear(), now.getMonth(), 0)
  end.setHours(23, 59, 59, 999)
  return { start, end }
}


