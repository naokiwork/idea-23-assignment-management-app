'use client'

import React, { useState, useEffect } from 'react'
import { Button, Input, Textarea, Select } from '../ui'
import { Modal } from '../ui'
import { createExam, updateExam } from '@/lib/api/exams'
import { validateExam } from '@/lib/validation/examValidation'
import { loadData } from '@/lib/storage'
import type { Exam, Subject } from '@/lib/types'
import { useToast } from '../ui/Toast'
import { logger } from '@/lib/utils/logger'

export interface ExamFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  initialData?: Partial<Exam>
}

export const ExamForm: React.FC<ExamFormProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}) => {
  const { showToast } = useToast()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    subjectId: initialData?.subjectId || '',
    date: initialData?.date || '',
    testRange: initialData?.testRange || '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // モーダルが開かれたときにデータを再読み込み
    if (isOpen) {
      const data = loadData()
      if (data) {
        setSubjects(data.subjects || [])
      }
    }
  }, [isOpen])

  useEffect(() => {
    // initialDataが変更されたときにフォームを更新
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        subjectId: initialData.subjectId || '',
        date: initialData.date || '',
        testRange: initialData.testRange || '',
      })
    }
  }, [initialData])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // エラーをクリア
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
    const validation = validateExam(formData)
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
        // 編集モード
        await updateExam(initialData.id, {
          name: formData.name,
          subjectId: formData.subjectId,
          date: formData.date,
          testRange: formData.testRange || undefined,
        })
        showToast('テストを更新しました', 'success')
      } else {
        // 新規作成モード
        await createExam({
          name: formData.name,
          subjectId: formData.subjectId,
          date: formData.date,
          testRange: formData.testRange || undefined,
        })
        showToast('テストを登録しました', 'success')
      }

      onSuccess?.()
      onClose()

      // フォームをリセット
      setFormData({
        name: '',
        subjectId: '',
        date: '',
        testRange: '',
      })
      setErrors({})
    } catch (error) {
      logger.error('Failed to save exam:', error)
      showToast(
        initialData?.id ? 'テストの更新に失敗しました' : 'テストの登録に失敗しました',
        'error'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const subjectOptions = subjects.length > 0
    ? subjects.map((subject) => ({
        value: subject.id,
        label: subject.name,
      }))
    : [{ value: '', label: '科目が登録されていません', disabled: true }]

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData?.id ? 'テストを編集' : 'テストを登録'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="テスト名"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required
          placeholder="例: 中間テスト"
        />

        <Select
          label="科目"
          name="subjectId"
          value={formData.subjectId}
          onChange={handleChange}
          options={subjectOptions}
          placeholder={subjects.length === 0 ? '科目が登録されていません' : '科目を選択'}
          error={errors.subjectId}
          required
          disabled={subjects.length === 0}
        />

        <Input
          label="実施日"
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          error={errors.date}
          required
        />

        <Textarea
          label="テスト範囲（任意）"
          name="testRange"
          value={formData.testRange}
          onChange={handleChange}
          error={errors.testRange}
          rows={3}
          placeholder="例: 第1章〜第3章"
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
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

