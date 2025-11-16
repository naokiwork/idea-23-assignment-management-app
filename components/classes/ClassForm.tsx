'use client'

import React, { useState, useEffect } from 'react'
import { Button, Input, Select } from '../ui'
import { Modal } from '../ui'
import { createClass, updateClass } from '@/lib/api/classes'
import { validateClass } from '@/lib/validation/classValidation'
import { loadData } from '@/lib/storage'
import type { Class, Subject } from '@/lib/types'
import { useToast } from '../ui/Toast'

export interface ClassFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  initialData?: Partial<Class>
}

export const ClassForm: React.FC<ClassFormProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}) => {
  const { showToast } = useToast()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    subjectId: initialData?.subjectId || '',
    date: initialData?.date || '',
    time: initialData?.time || '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const data = loadData()
    if (data) {
      setSubjects(data.subjects)
    }
  }, [])

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        subjectId: initialData.subjectId || '',
        date: initialData.date || '',
        time: initialData.time || '',
      })
    }
  }, [initialData])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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

    const validation = validateClass(formData)
    if (!validation.isValid) {
      const errorMap: Record<string, string> = {}
      validation.errors.forEach((error) => {
        errorMap[error.field] = error.message
      })
      setErrors(errorMap)
      setIsSubmitting(false)
      return
    }

    try {
      if (initialData?.id) {
        await updateClass(initialData.id, {
          title: formData.title,
          subjectId: formData.subjectId,
          date: formData.date,
          time: formData.time || undefined,
        })
        showToast('授業回を更新しました', 'success')
      } else {
        await createClass({
          title: formData.title,
          subjectId: formData.subjectId,
          date: formData.date,
          time: formData.time || undefined,
        })
        showToast('授業回を登録しました', 'success')
      }

      onSuccess?.()
      onClose()
      setFormData({ title: '', subjectId: '', date: '', time: '' })
      setErrors({})
    } catch (error) {
      console.error('Failed to save class:', error)
      showToast(
        initialData?.id ? '授業回の更新に失敗しました' : '授業回の登録に失敗しました',
        'error'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const subjectOptions = subjects.map((subject) => ({
    value: subject.id,
    label: subject.name,
  }))

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData?.id ? '授業回を編集' : '授業回を登録'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="授業タイトル"
          name="title"
          value={formData.title}
          onChange={handleChange}
          error={errors.title}
          required
          placeholder="例: 第1回 微分積分"
        />

        <Select
          label="科目"
          name="subjectId"
          value={formData.subjectId}
          onChange={handleChange}
          options={subjectOptions}
          placeholder="科目を選択"
          error={errors.subjectId}
          required
        />

        <Input
          label="日付"
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          error={errors.date}
          required
        />

        <Input
          label="時刻（任意）"
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          error={errors.time}
          placeholder="例: 14:00"
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            キャンセル
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {initialData?.id ? '更新' : '登録'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

