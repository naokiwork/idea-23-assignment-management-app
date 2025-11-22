/**
 * 通知ルール管理
 */

import type { Task } from '../types'
import type { NotificationRule, NotificationCondition } from '../types/notificationTypes'
import { getAllTasks } from '../api/tasks'
import { isOverdue } from './dateUtils'

const NOTIFICATION_RULES_KEY = 'notification-rules'

/**
 * 通知ルールを取得
 */
export function getNotificationRules(): NotificationRule[] {
  if (typeof window === 'undefined') return []
  
  try {
    const stored = localStorage.getItem(NOTIFICATION_RULES_KEY)
    if (!stored) return []
    return JSON.parse(stored)
  } catch (error) {
    console.error('Failed to load notification rules:', error)
    return []
  }
}

/**
 * 通知ルールを保存
 */
export function saveNotificationRules(rules: NotificationRule[]): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(NOTIFICATION_RULES_KEY, JSON.stringify(rules))
  } catch (error) {
    console.error('Failed to save notification rules:', error)
  }
}

/**
 * 通知ルールを作成
 */
export function createNotificationRule(rule: Omit<NotificationRule, 'id' | 'createdAt'>): NotificationRule {
  const newRule: NotificationRule = {
    ...rule,
    id: `rule-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
  }
  
  const rules = getNotificationRules()
  rules.push(newRule)
  saveNotificationRules(rules)
  
  return newRule
}

/**
 * 通知ルールを更新
 */
export function updateNotificationRule(id: string, updates: Partial<NotificationRule>): NotificationRule {
  const rules = getNotificationRules()
  const index = rules.findIndex((r) => r.id === id)
  
  if (index === -1) {
    throw new Error(`通知ルールが見つかりません: ${id}`)
  }
  
  rules[index] = {
    ...rules[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  
  saveNotificationRules(rules)
  return rules[index]
}

/**
 * 通知ルールを削除
 */
export function deleteNotificationRule(id: string): void {
  const rules = getNotificationRules()
  const filtered = rules.filter((r) => r.id !== id)
  saveNotificationRules(filtered)
}

/**
 * 条件を評価
 */
export function evaluateCondition(condition: NotificationCondition, task: Task): boolean {
  switch (condition.type) {
    case 'taskType':
      return condition.operator === 'equals'
        ? task.taskType === condition.value
        : task.taskType !== condition.value
    
    case 'subject':
      if (Array.isArray(condition.value)) {
        return condition.operator === 'equals'
          ? condition.value.includes(task.subjectId)
          : !condition.value.includes(task.subjectId)
      }
      return condition.operator === 'equals'
        ? task.subjectId === condition.value
        : task.subjectId !== condition.value
    
    case 'deadline':
      const deadline = new Date(task.deadline)
      const now = new Date()
      const daysDiff = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      
      if (condition.operator === 'before') {
        return daysDiff <= (condition.value as number) && daysDiff >= 0
      } else if (condition.operator === 'after') {
        return daysDiff < 0 && Math.abs(daysDiff) <= (condition.value as number)
      }
      return false
    
    case 'status':
      // ステータスは将来的に実装
      return false
    
    case 'tag':
      // タグは将来的に実装
      return false
    
    default:
      return false
  }
}

/**
 * ルールの条件をすべて評価
 */
export function evaluateRule(rule: NotificationRule, task: Task): boolean {
  if (!rule.enabled) return false
  
  // すべての条件が満たされているかチェック（AND条件）
  return rule.conditions.every((condition) => evaluateCondition(condition, task))
}

/**
 * タスクに適用可能なルールを取得
 */
export function getApplicableRules(task: Task): NotificationRule[] {
  const rules = getNotificationRules()
  return rules.filter((rule) => evaluateRule(rule, task))
}

