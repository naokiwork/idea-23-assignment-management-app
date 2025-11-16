/**
 * 通知許可管理
 */

const NOTIFICATION_PERMISSION_KEY = 'notification-permission-requested'

/**
 * 通知許可をリクエスト
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied'
  }

  if (Notification.permission === 'granted') {
    return 'granted'
  }

  if (Notification.permission === 'denied') {
    return 'denied'
  }

  // 許可をリクエスト
  const permission = await Notification.requestPermission()
  localStorage.setItem(NOTIFICATION_PERMISSION_KEY, 'true')
  return permission
}

/**
 * 通知許可状態を取得
 */
export function getNotificationPermission(): NotificationPermission {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied'
  }

  return Notification.permission
}

/**
 * 通知が許可されているかどうかを確認
 */
export function isNotificationGranted(): boolean {
  return getNotificationPermission() === 'granted'
}

/**
 * 通知許可がリクエスト済みかどうかを確認
 */
export function hasRequestedPermission(): boolean {
  if (typeof window === 'undefined') {
    return false
  }
  return localStorage.getItem(NOTIFICATION_PERMISSION_KEY) === 'true'
}

