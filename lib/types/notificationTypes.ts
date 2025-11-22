/**
 * 通知関連の型定義
 */

import type { TaskType } from '../types'

/**
 * 通知ルール
 */
export interface NotificationRule {
  id: string
  name: string
  enabled: boolean
  priority: 'low' | 'medium' | 'high'
  conditions: NotificationCondition[]
  timing: NotificationTiming
  content: NotificationContent
  createdAt: string // ISO 8601形式の日付文字列
  updatedAt?: string // ISO 8601形式の日付文字列
}

/**
 * 通知条件
 */
export interface NotificationCondition {
  type: 'taskType' | 'subject' | 'deadline' | 'status' | 'tag'
  operator: 'equals' | 'notEquals' | 'contains' | 'before' | 'after'
  value: string | string[] | number
}

/**
 * 通知タイミング
 */
export interface NotificationTiming {
  type: 'beforeDeadline' | 'afterDeadline' | 'specificTime' | 'interval'
  daysBefore?: number // 期限の何日前（beforeDeadlineの場合）
  daysAfter?: number // 期限の何日後（afterDeadlineの場合）
  time?: string // 特定時刻（例: "09:00"）
  interval?: number // 間隔（分単位、intervalの場合）
  daysOfWeek?: number[] // 曜日（0=日曜日、6=土曜日）
}

/**
 * 通知内容
 */
export interface NotificationContent {
  title: string
  body: string
  icon?: string
  badge?: string
  tag?: string
}

/**
 * 通知履歴
 */
export interface NotificationHistory {
  id: string
  ruleId?: string
  title: string
  body: string
  timestamp: string // ISO 8601形式の日付文字列
  read: boolean
  taskId?: string
  priority: 'low' | 'medium' | 'high'
}

/**
 * 通知設定の拡張
 */
export interface ExtendedNotificationSettings {
  // 既存の設定
  enabled: boolean
  reminderDays: number[]
  checkInterval: number
  showOverdue: boolean
  
  // 拡張設定
  maxNotificationsPerDay?: number // 1日の最大通知数
  quietHours?: { start: string; end: string } // 通知を送らない時間帯（例: "22:00" - "08:00"）
  notificationSound?: boolean // 通知音の有効/無効
  notificationVibration?: boolean // 振動の有効/無効（モバイル）
  groupNotifications?: boolean // 通知のグループ化
}


