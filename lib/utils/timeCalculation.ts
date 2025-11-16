/**
 * 学習時間計算ユーティリティ
 */

/**
 * 開始時刻と終了時刻から学習時間を計算（分単位）
 */
export function calculateDuration(startTime: string, endTime: string): number {
  const [startHour, startMin] = startTime.split(':').map(Number)
  const [endHour, endMin] = endTime.split(':').map(Number)

  const startMinutes = startHour * 60 + startMin
  const endMinutes = endHour * 60 + endMin

  // 終了時刻が開始時刻より前の場合は、翌日とみなす
  if (endMinutes < startMinutes) {
    return (24 * 60 - startMinutes) + endMinutes
  }

  return endMinutes - startMinutes
}

/**
 * 分を時間表示に変換（"2時間30分"など）
 */
export function formatDuration(minutes: number): string {
  if (minutes < 0) {
    return '0分'
  }

  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  if (hours === 0) {
    return `${mins}分`
  } else if (mins === 0) {
    return `${hours}時間`
  } else {
    return `${hours}時間${mins}分`
  }
}

/**
 * 日付文字列と時刻文字列からDateオブジェクトを作成
 */
export function createDateTime(dateStr: string, timeStr?: string): Date {
  if (timeStr) {
    return new Date(`${dateStr}T${timeStr}`)
  }
  return new Date(dateStr)
}

