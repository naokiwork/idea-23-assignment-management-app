'use client'

import React, { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button, Input, Textarea } from '../ui'
import { createTemplate, updateTemplate } from '@/lib/api/studyLogTemplates'
import type { StudyLogTemplate } from '@/lib/types'
import { useToast } from '../ui/Toast'

interface TemplateFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  initialData?: StudyLogTemplate
}

export const TemplateForm: React.FC<TemplateFormProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}) => {
  const { showToast } = useToast()
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    category: initialData?.category || '',
    content: initialData?.content || '',
    startTime: initialData?.startTime || '',
    endTime: initialData?.endTime || '',
    tags: initialData?.tags?.join(', ') || '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // バリデーション
    if (!formData.name.trim()) {
      setErrors({ name: 'テンプレート名は必須です' })
      setIsSubmitting(false)
      return
    }
    if (!formData.content.trim()) {
      setErrors({ content: 'テンプレート内容は必須です' })
      setIsSubmitting(false)
      return
    }

    try {
      const tags = formData.tags
        ? formData.tags.split(',').map(t => t.trim()).filter(t => t)
        : undefined

      if (initialData?.id) {
        await updateTemplate(initialData.id, {
          name: formData.name,
          description: formData.description || undefined,
          category: formData.category || undefined,
          content: formData.content,
          startTime: formData.startTime || undefined,
          endTime: formData.endTime || undefined,
          tags,
        })
        showToast('テンプレートを更新しました', 'success')
      } else {
        await createTemplate({
          name: formData.name,
          description: formData.description || undefined,
          category: formData.category || undefined,
          content: formData.content,
          startTime: formData.startTime || undefined,
          endTime: formData.endTime || undefined,
          tags,
        })
        showToast('テンプレートを作成しました', 'success')
      }

      onSuccess?.()
      onClose()

      // フォームをリセット
      if (!initialData) {
        setFormData({
          name: '',
          description: '',
          category: '',
          content: '',
          startTime: '',
          endTime: '',
          tags: '',
        })
      }
      setErrors({})
    } catch (error) {
      console.error('Failed to save template:', error)
      showToast(
        initialData?.id
          ? 'テンプレートの更新に失敗しました'
          : 'テンプレートの作成に失敗しました',
        'error'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData?.id ? 'テンプレートを編集' : 'テンプレートを作成'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="テンプレート名"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required
        />

        <Input
          label="説明（任意）"
          name="description"
          value={formData.description}
          onChange={handleChange}
          error={errors.description}
        />

        <Input
          label="カテゴリ（任意）"
          name="category"
          value={formData.category}
          onChange={handleChange}
          error={errors.category}
        />

        <Textarea
          label="テンプレート内容"
          name="content"
          value={formData.content}
          onChange={handleChange}
          error={errors.content}
          rows={4}
          placeholder="例: {subject}の{task}を実施。{date}に{content}を学習しました。"
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="デフォルト開始時刻（任意）"
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            error={errors.startTime}
          />
          <Input
            label="デフォルト終了時刻（任意）"
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            error={errors.endTime}
          />
        </div>

        <Input
          label="タグ（カンマ区切り、任意）"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          error={errors.tags}
          placeholder="例: 予習, 復習"
        />

        <div className="text-xs text-gray-500">
          <p>変数: {'{date}'}, {'{subject}'}, {'{task}'} などが使用できます</p>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            キャンセル
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
          >
            {initialData?.id ? '更新' : '作成'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}


