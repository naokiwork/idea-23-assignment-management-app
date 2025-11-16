'use client'

import React, { useState, useEffect } from 'react'
import { Button, Input, Select } from '../ui'
import { Modal } from '../ui'
import { createSubject, updateSubject } from '@/lib/api/subjects'
import { validateSubject } from '@/lib/validation/subjectValidation'
import type { Subject } from '@/lib/types'
import { useToast } from '../ui/Toast'

export interface SubjectFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  initialData?: Partial<Subject>
}

export const SubjectForm: React.FC<SubjectFormProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}) => {
  const { showToast } = useToast()
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    teacher: initialData?.teacher || '',
    year: initialData?.year || '',
    semester: initialData?.semester || '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        teacher: initialData.teacher || '',
        year: initialData.year || '',
        semester: initialData.semester || '',
      })
    }
  }, [initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

    const validation = validateSubject(formData)
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
        await updateSubject(initialData.id, {
          name: formData.name,
          teacher: formData.teacher || undefined,
          year: formData.year || undefined,
          semester: formData.semester || undefined,
        })
        showToast('科目を更新しました', 'success')
      } else {
        await createSubject({
          name: formData.name,
          teacher: formData.teacher || undefined,
          year: formData.year || undefined,
          semester: formData.semester || undefined,
        })
        showToast('科目を登録しました', 'success')
      }

      onSuccess?.()
      onClose()
      setFormData({ name: '', teacher: '', year: '', semester: '' })
      setErrors({})
    } catch (error) {
      console.error('Failed to save subject:', error)
      showToast(
        initialData?.id ? '科目の更新に失敗しました' : '科目の登録に失敗しました',
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
      title={initialData?.id ? '科目を編集' : '科目を登録'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="科目名"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required
          placeholder="例: 数学"
        />

        <Input
          label="担当教員（任意）"
          name="teacher"
          value={formData.teacher}
          onChange={handleChange}
          error={errors.teacher}
          placeholder="例: 山田先生"
        />

        <Input
          label="年度（任意）"
          name="year"
          value={formData.year}
          onChange={handleChange}
          error={errors.year}
          placeholder="例: 2024"
        />

        <Input
          label="学期（任意）"
          name="semester"
          value={formData.semester}
          onChange={handleChange}
          error={errors.semester}
          placeholder="例: 前期"
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

