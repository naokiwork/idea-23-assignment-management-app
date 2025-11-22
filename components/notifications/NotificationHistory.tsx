'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardBody, CardHeader } from '../ui/Card'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { Trash2, Filter } from 'lucide-react'
import type { NotificationHistory as NotificationHistoryType } from '@/lib/types/notificationTypes'

const NOTIFICATION_HISTORY_KEY = 'notification-history'

/**
 * 通知履歴を取得
 */
function getNotificationHistory(): NotificationHistoryType[] {
  if (typeof window === 'undefined') return []
  
  try {
    const stored = localStorage.getItem(NOTIFICATION_HISTORY_KEY)
    if (!stored) return []
    return JSON.parse(stored)
  } catch (error) {
    console.error('Failed to load notification history:', error)
    return []
  }
}

/**
 * 通知履歴を保存
 */
function saveNotificationHistory(history: NotificationHistoryType[]): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(NOTIFICATION_HISTORY_KEY, JSON.stringify(history))
  } catch (error) {
    console.error('Failed to save notification history:', error)
  }
}

/**
 * 通知履歴を追加
 */
export function addNotificationHistory(notification: Omit<NotificationHistoryType, 'id' | 'read'>): void {
  const history = getNotificationHistory()
  const newNotification: NotificationHistoryType = {
    ...notification,
    id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    read: false,
  }
  
  history.unshift(newNotification)
  
  // 最大100件まで保持
  if (history.length > 100) {
    history.splice(100)
  }
  
  saveNotificationHistory(history)
}

/**
 * 通知履歴を削除
 */
function deleteNotificationHistory(id: string): void {
  const history = getNotificationHistory()
  const filtered = history.filter((n) => n.id !== id)
  saveNotificationHistory(filtered)
}

/**
 * 通知履歴を既読にする
 */
function markAsRead(id: string): void {
  const history = getNotificationHistory()
  const index = history.findIndex((n) => n.id === id)
  if (index !== -1) {
    history[index].read = true
    saveNotificationHistory(history)
  }
}

export const NotificationHistory: React.FC = () => {
  const [history, setHistory] = useState<NotificationHistoryType[]>([])
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = () => {
    setHistory(getNotificationHistory())
  }

  const handleDelete = (id: string) => {
    deleteNotificationHistory(id)
    loadHistory()
  }

  const handleMarkAsRead = (id: string) => {
    markAsRead(id)
    loadHistory()
  }

  const filteredHistory = history.filter((n) => {
    if (filter === 'unread') return !n.read
    if (filter === 'read') return n.read
    return true
  })

  const priorityColors = {
    low: 'info',
    medium: 'warning',
    high: 'error',
  } as const

  const priorityLabels = {
    low: '低',
    medium: '中',
    high: '高',
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days}日前`
    if (hours > 0) return `${hours}時間前`
    if (minutes > 0) return `${minutes}分前`
    return 'たった今'
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">通知履歴</h2>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as typeof filter)}
              className="px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">すべて</option>
              <option value="unread">未読</option>
              <option value="read">既読</option>
            </select>
          </div>
        </div>
      </CardHeader>
      <CardBody>
        {filteredHistory.length === 0 ? (
          <p className="text-gray-500 text-center py-8">通知履歴がありません</p>
        ) : (
          <div className="space-y-3">
            {filteredHistory.map((notification) => (
              <div
                key={notification.id}
                className={`border rounded-lg p-4 transition-colors ${
                  notification.read
                    ? 'border-gray-200 bg-gray-50'
                    : 'border-primary-300 bg-primary-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-base font-medium text-gray-900">{notification.title}</h3>
                      <Badge variant={priorityColors[notification.priority]} size="sm">
                        {priorityLabels[notification.priority]}
                      </Badge>
                      {!notification.read && (
                        <Badge variant="info" size="sm">
                          未読
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{notification.body}</p>
                    <p className="text-xs text-gray-500">{formatDate(notification.timestamp)}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    {!notification.read && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        既読
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={() => handleDelete(notification.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  )
}

