'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardBody, CardHeader } from '../ui/Card'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { Modal } from '../ui/Modal'
import { Input, Select } from '../ui'
import { Plus, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react'
import {
  getNotificationRules,
  createNotificationRule,
  updateNotificationRule,
  deleteNotificationRule,
} from '@/lib/utils/notificationRules'
import type { NotificationRule, NotificationCondition, NotificationTiming } from '@/lib/types/notificationTypes'
import { useToast } from '../ui/Toast'

export const NotificationRules: React.FC = () => {
  const { showToast } = useToast()
  const [rules, setRules] = useState<NotificationRule[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRule, setEditingRule] = useState<NotificationRule | null>(null)
  const [formData, setFormData] = useState<Partial<NotificationRule>>({
    name: '',
    enabled: true,
    priority: 'medium',
    conditions: [],
    timing: { type: 'beforeDeadline', daysBefore: 1 },
    content: { title: '', body: '' },
  })

  useEffect(() => {
    loadRules()
  }, [])

  const loadRules = () => {
    setRules(getNotificationRules())
  }

  const handleCreate = () => {
    setEditingRule(null)
    setFormData({
      name: '',
      enabled: true,
      priority: 'medium',
      conditions: [],
      timing: { type: 'beforeDeadline', daysBefore: 1 },
      content: { title: '', body: '' },
    })
    setIsModalOpen(true)
  }

  const handleEdit = (rule: NotificationRule) => {
    setEditingRule(rule)
    setFormData(rule)
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('この通知ルールを削除しますか？')) {
      deleteNotificationRule(id)
      loadRules()
      showToast('通知ルールを削除しました', 'success')
    }
  }

  const handleSave = () => {
    if (!formData.name || !formData.content?.title || !formData.content?.body) {
      showToast('必須項目を入力してください', 'error')
      return
    }

    try {
      if (editingRule) {
        updateNotificationRule(editingRule.id, formData as Partial<NotificationRule>)
        showToast('通知ルールを更新しました', 'success')
      } else {
        createNotificationRule(formData as Omit<NotificationRule, 'id' | 'createdAt'>)
        showToast('通知ルールを作成しました', 'success')
      }
      loadRules()
      setIsModalOpen(false)
    } catch (error) {
      showToast('通知ルールの保存に失敗しました', 'error')
    }
  }

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

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">通知ルール</h2>
            <Button variant="primary" size="sm" onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              新規作成
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          {rules.length === 0 ? (
            <p className="text-gray-500 text-center py-8">通知ルールがありません</p>
          ) : (
            <div className="space-y-3">
              {rules.map((rule) => (
                <div
                  key={rule.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-base font-medium text-gray-900">{rule.name}</h3>
                        {rule.enabled ? (
                          <Badge variant="success" size="sm">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            有効
                          </Badge>
                        ) : (
                          <Badge variant="default" size="sm">
                            <XCircle className="h-3 w-3 mr-1" />
                            無効
                          </Badge>
                        )}
                        <Badge variant={priorityColors[rule.priority]} size="sm">
                          {priorityLabels[rule.priority]}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {rule.content.title}: {rule.content.body}
                      </p>
                      <p className="text-xs text-gray-500">
                        条件: {rule.conditions.length}件 | タイミング: {rule.timing.type}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(rule)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(rule.id)}>
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

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRule ? '通知ルールを編集' : '通知ルールを作成'}
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ルール名</label>
            <Input
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="例: 課題のリマインダー"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">優先度</label>
            <Select
              value={formData.priority || 'medium'}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })}
              options={[
                { value: 'low', label: '低' },
                { value: 'medium', label: '中' },
                { value: 'high', label: '高' },
              ]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">通知タイトル</label>
            <Input
              value={formData.content?.title || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  content: { ...formData.content, title: e.target.value, body: formData.content?.body || '' },
                })
              }
              placeholder="例: タスクのリマインダー"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">通知本文</label>
            <Input
              value={formData.content?.body || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  content: { ...formData.content, title: formData.content?.title || '', body: e.target.value },
                })
              }
              placeholder="例: {{taskTitle}}の期限が{{deadline}}です"
            />
            <p className="text-xs text-gray-500 mt-1">
              使用可能な変数: {'{{taskTitle}}'}, {'{{deadline}}'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">タイミング</label>
            <Select
              value={formData.timing?.type || 'beforeDeadline'}
              onChange={(e) => {
                const timingType = e.target.value as NotificationTiming['type']
                setFormData({
                  ...formData,
                  timing: { ...formData.timing, type: timingType } as NotificationTiming,
                })
              }}
              options={[
                { value: 'beforeDeadline', label: '期限の前' },
                { value: 'afterDeadline', label: '期限の後' },
                { value: 'specificTime', label: '特定時刻' },
                { value: 'interval', label: '間隔' },
              ]}
            />
            {formData.timing?.type === 'beforeDeadline' && (
              <div className="mt-2">
                <Input
                  type="number"
                  value={formData.timing.daysBefore || 1}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      timing: { ...formData.timing, daysBefore: parseInt(e.target.value, 10) } as NotificationTiming,
                    })
                  }
                  placeholder="日数"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              キャンセル
            </Button>
            <Button variant="primary" onClick={handleSave}>
              保存
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}


