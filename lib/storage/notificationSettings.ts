/**
 * 通知設定の保存・読み込み
 */

export interface NotificationSettings {
  enabled: boolean
  reminderDays: number[] // 通知を送信する日数（例: [1, 3, 7] = 1日前、3日前、7日前）
  checkInterval: number // チェック間隔（分）
  showOverdue: boolean // 期限切れタスクを通知するか
}

const NOTIFICATION_SETTINGS_KEY = 'notification-settings'
const DEFAULT_SETTINGS: NotificationSettings = {
  enabled: false,
  reminderDays: [1, 3, 7],
  checkInterval: 60, // 60分
  showOverdue: true,
}

/**
 * 通知設定を取得
 */
export function getNotificationSettings(): NotificationSettings {
  if (typeof window === 'undefined') {
    return DEFAULT_SETTINGS
  }

  try {
    const stored = localStorage.getItem(NOTIFICATION_SETTINGS_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return { ...DEFAULT_SETTINGS, ...parsed }
    }
  } catch (error) {
    console.error('Failed to load notification settings:', error)
  }

  return DEFAULT_SETTINGS
}

/**
 * 通知設定を保存
 */
export function saveNotificationSettings(settings: Partial<NotificationSettings>): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    const current = getNotificationSettings()
    const updated = { ...current, ...settings }
    localStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(updated))
  } catch (error) {
    console.error('Failed to save notification settings:', error)
  }
}

/**
 * 通知設定をリセット
 */
export function resetNotificationSettings(): void {
  if (typeof window === 'undefined') {
    return
  }

  localStorage.removeItem(NOTIFICATION_SETTINGS_KEY)
}

