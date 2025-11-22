/**
 * 通知スケジューラー
 * 
 * 注意: この実装は基本構造のみです。
 * 実際の通知スケジューリング機能を実装するには、Service Workerとの統合が必要です。
 */

import type { Task } from '../types'
import type { NotificationRule, NotificationTiming } from '../types/notificationTypes'
import { getAllTasks } from '../api/tasks'
import { getApplicableRules } from './notificationRules'
import { isOverdue } from './dateUtils'

/**
 * 通知スケジュール
 */
export interface NotificationSchedule {
  id: string
  taskId: string
  ruleId?: string
  scheduledTime: Date
  title: string
  body: string
  priority: 'low' | 'medium' | 'high'
  sent: boolean
}

let scheduledNotifications: NotificationSchedule[] = []

/**
 * 通知タイミングを計算
 */
export function calculateNotificationTime(
  task: Task,
  timing: NotificationTiming
): Date | null {
  const deadline = new Date(task.deadline)
  const now = new Date()
  
  switch (timing.type) {
    case 'beforeDeadline':
      if (timing.daysBefore !== undefined) {
        const notificationTime = new Date(deadline)
        notificationTime.setDate(deadline.getDate() - timing.daysBefore)
        
        // 特定時刻が指定されている場合は時刻を設定
        if (timing.time) {
          const [hours, minutes] = timing.time.split(':').map(Number)
          notificationTime.setHours(hours, minutes, 0, 0)
        } else {
          // デフォルトは9時
          notificationTime.setHours(9, 0, 0, 0)
        }
        
        // 過去の場合はnullを返す
        if (notificationTime < now) {
          return null
        }
        
        return notificationTime
      }
      break
    
    case 'afterDeadline':
      if (timing.daysAfter !== undefined) {
        const notificationTime = new Date(deadline)
        notificationTime.setDate(deadline.getDate() + timing.daysAfter)
        
        if (timing.time) {
          const [hours, minutes] = timing.time.split(':').map(Number)
          notificationTime.setHours(hours, minutes, 0, 0)
        } else {
          notificationTime.setHours(9, 0, 0, 0)
        }
        
        if (notificationTime < now) {
          return null
        }
        
        return notificationTime
      }
      break
    
    case 'specificTime':
      if (timing.time) {
        const [hours, minutes] = timing.time.split(':').map(Number)
        const notificationTime = new Date(now)
        notificationTime.setHours(hours, minutes, 0, 0)
        
        // 今日の時刻が過ぎている場合は明日に設定
        if (notificationTime < now) {
          notificationTime.setDate(notificationTime.getDate() + 1)
        }
        
        return notificationTime
      }
      break
    
    case 'interval':
      if (timing.interval !== undefined) {
        const notificationTime = new Date(now)
        notificationTime.setMinutes(notificationTime.getMinutes() + timing.interval)
        return notificationTime
      }
      break
  }
  
  return null
}

/**
 * 通知をスケジュール
 */
export function scheduleNotification(
  task: Task,
  rule: NotificationRule
): NotificationSchedule | null {
  const scheduledTime = calculateNotificationTime(task, rule.timing)
  
  if (!scheduledTime) {
    return null
  }
  
  const schedule: NotificationSchedule = {
    id: `schedule-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    taskId: task.id,
    ruleId: rule.id,
    scheduledTime,
    title: rule.content.title.replace('{{taskTitle}}', task.title),
    body: rule.content.body.replace('{{taskTitle}}', task.title).replace('{{deadline}}', task.deadline),
    priority: rule.priority,
    sent: false,
  }
  
  scheduledNotifications.push(schedule)
  return schedule
}

/**
 * すべてのタスクに対して通知をスケジュール
 */
export function scheduleAllNotifications(): void {
  scheduledNotifications = []
  const tasks = getAllTasks()
  const now = new Date()
  
  for (const task of tasks) {
    const rules = getApplicableRules(task)
    
    for (const rule of rules) {
      const schedule = scheduleNotification(task, rule)
      if (schedule) {
        // 既に送信済みの通知はスキップ
        if (schedule.scheduledTime < now) {
          continue
        }
      }
    }
  }
  
  // スケジュールを時刻順にソート
  scheduledNotifications.sort((a, b) => a.scheduledTime.getTime() - b.scheduledTime.getTime())
}

/**
 * 期限が近い通知を取得
 */
export function getUpcomingNotifications(limit: number = 10): NotificationSchedule[] {
  const now = new Date()
  return scheduledNotifications
    .filter((schedule) => !schedule.sent && schedule.scheduledTime >= now)
    .slice(0, limit)
}

/**
 * 通知を送信（将来の拡張用）
 * 
 * 実際の通知送信は、Service WorkerまたはブラウザのNotification APIを使用します。
 */
export async function sendNotification(schedule: NotificationSchedule): Promise<void> {
  // 将来の実装: 実際の通知送信
  // if ('Notification' in window && Notification.permission === 'granted') {
  //   new Notification(schedule.title, {
  //     body: schedule.body,
  //     icon: schedule.icon,
  //     badge: schedule.badge,
  //     tag: schedule.tag,
  //   })
  // }
  
  // 現在は基本構造のみのため、送信済みとしてマーク
  const index = scheduledNotifications.findIndex((s) => s.id === schedule.id)
  if (index !== -1) {
    scheduledNotifications[index].sent = true
  }
}

/**
 * 期限切れの通知をクリーンアップ
 */
export function cleanupExpiredNotifications(): void {
  const now = new Date()
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  
  scheduledNotifications = scheduledNotifications.filter(
    (schedule) => schedule.scheduledTime > oneDayAgo || !schedule.sent
  )
}


