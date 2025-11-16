/**
 * 期限リマインダー管理
 */

import type { Task } from '../types'
import { getAllTasks } from '../api/tasks'
import { getNotificationSettings } from '../storage/notificationSettings'
import { isNotificationGranted } from './notificationPermission'

export interface ReminderTask {
  task: Task
  daysUntilDeadline: number
  reminderType: 'upcoming' | 'overdue'
}

/**
 * 期限が近いタスクを検出
 */
export function findUpcomingTasks(tasks: Task[], reminderDays: number[]): ReminderTask[] {
  const now = new Date()
  const upcoming: ReminderTask[] = []

  for (const task of tasks) {
    if (!task.deadline) continue

    const deadline = new Date(task.deadline)
    const diffTime = deadline.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    // 期限が近いタスクを検出
    if (reminderDays.includes(diffDays) && diffDays > 0) {
      upcoming.push({
        task,
        daysUntilDeadline: diffDays,
        reminderType: 'upcoming',
      })
    }
  }

  return upcoming
}

/**
 * 期限切れタスクを検出
 */
export function findOverdueTasks(tasks: Task[]): ReminderTask[] {
  const now = new Date()
  const overdue: ReminderTask[] = []

  for (const task of tasks) {
    if (!task.deadline) continue

    const deadline = new Date(task.deadline)
    const diffTime = deadline.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    // 期限切れタスクを検出
    if (diffDays < 0) {
      overdue.push({
        task,
        daysUntilDeadline: Math.abs(diffDays),
        reminderType: 'overdue',
      })
    }
  }

  return overdue
}

/**
 * 通知を送信
 */
export function sendNotification(
  title: string,
  body: string,
  tag?: string,
  data?: any
): void {
  if (!isNotificationGranted()) {
    return
  }

  if (typeof window === 'undefined' || !('Notification' in window)) {
    return
  }

  try {
    const notification = new Notification(title, {
      body,
      tag,
      data,
      icon: '/icon-192x192.png', // アイコンがあれば
      badge: '/icon-192x192.png',
    })

    // 通知をクリックしたときの処理
    notification.onclick = () => {
      window.focus()
      if (data?.taskId) {
        window.location.href = `/tasks/${data.taskId}`
      }
      notification.close()
    }

    // 通知を自動的に閉じる（5秒後）
    setTimeout(() => {
      notification.close()
    }, 5000)
  } catch (error) {
    console.error('Failed to send notification:', error)
  }
}

/**
 * リマインダーをチェックして通知を送信
 */
export function checkAndSendReminders(): void {
  const settings = getNotificationSettings()
  if (!settings.enabled) {
    return
  }

  if (!isNotificationGranted()) {
    return
  }

  const tasks = getAllTasks()
  const upcoming = findUpcomingTasks(tasks, settings.reminderDays)
  const overdue = settings.showOverdue ? findOverdueTasks(tasks) : []

  // 期限が近いタスクの通知
  for (const reminder of upcoming) {
    const title = `タスク期限が近づいています`
    const body = `${reminder.task.title} の期限まであと${reminder.daysUntilDeadline}日です`
    sendNotification(title, body, `task-${reminder.task.id}`, {
      taskId: reminder.task.id,
    })
  }

  // 期限切れタスクの通知
  for (const reminder of overdue) {
    const title = `タスクの期限が過ぎています`
    const body = `${reminder.task.title} の期限が${reminder.daysUntilDeadline}日前に過ぎました`
    sendNotification(title, body, `task-overdue-${reminder.task.id}`, {
      taskId: reminder.task.id,
    })
  }
}

