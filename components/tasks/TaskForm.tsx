'use client'

import React, { useState, useEffect } from 'react'
import { Button, Input, Select, Textarea } from '../ui'
import { Modal } from '../ui'
import { createTask, updateTask } from '@/lib/api/tasks'
import { validateTask } from '@/lib/validation/taskValidation'
import { loadData } from '@/lib/storage'
import type { Task, Subject } from '@/lib/types'
import { useToast } from '../ui/Toast'

export interface TaskFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  initialData?: Partial<Task>
}

const taskTypeOptions = [
  { value: 'preparation', label: '予習' },
  { value: 'review', label: '復習' },
  { value: 'assignment', label: '課題' },
  { value: 'exam_study', label: 'テスト勉強' },
]

export const TaskForm: React.FC<TaskFormProps> = ({
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
    taskType: initialData?.taskType || 'assignment',
    deadline: initialData?.deadline || '',
    requiredStudyAmount: initialData?.requiredStudyAmount || '',
    relatedClassId: initialData?.relatedClassId || '',
    relatedExamId: initialData?.relatedExamId || '',
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
        taskType: initialData.taskType || 'assignment',
        deadline: initialData.deadline || '',
        requiredStudyAmount: initialData.requiredStudyAmount || '',
        relatedClassId: initialData.relatedClassId || '',
        relatedExamId: initialData.relatedExamId || '',
      })
    }
  }, [initialData])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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

    const validation = validateTask(formData)
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
        await updateTask(initialData.id, {
          title: formData.title,
          subjectId: formData.subjectId,
          taskType: formData.taskType as Task['taskType'],
          deadline: formData.deadline,
          requiredStudyAmount: formData.requiredStudyAmount || undefined,
          relatedClassId: formData.relatedClassId || undefined,
          relatedExamId: formData.relatedExamId || undefined,
        })
        showToast('タスクを更新しました', 'success')
      } else {
        await createTask({
          title: formData.title,
          subjectId: formData.subjectId,
          taskType: formData.taskType as Task['taskType'],
          deadline: formData.deadline,
          requiredStudyAmount: formData.requiredStudyAmount || undefined,
          relatedClassId: formData.relatedClassId || undefined,
          relatedExamId: formData.relatedExamId || undefined,
        })
        showToast('タスクを登録しました', 'success')
      }

      onSuccess?.()
      onClose()
      setFormData({
        title: '',
        subjectId: '',
        taskType: 'assignment',
        deadline: '',
        requiredStudyAmount: '',
        relatedClassId: '',
        relatedExamId: '',
      })
      setErrors({})
    } catch (error) {
      console.error('Failed to save task:', error)
      showToast(
        initialData?.id ? 'タスクの更新に失敗しました' : 'タスクの登録に失敗しました',
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
      title={initialData?.id ? 'タスクを編集' : 'タスクを登録'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="タスクタイトル"
          name="title"
          value={formData.title}
          onChange={handleChange}
          error={errors.title}
          required
          placeholder="例: 数学の宿題"
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

        <Select
          label="タスク種別"
          name="taskType"
          value={formData.taskType}
          onChange={handleChange}
          options={taskTypeOptions}
          error={errors.taskType}
          required
        />

        <Input
          label="締切日"
          type="date"
          name="deadline"
          value={formData.deadline}
          onChange={handleChange}
          error={errors.deadline}
          required
        />

        <Input
          label="必要学習量（任意）"
          name="requiredStudyAmount"
          value={formData.requiredStudyAmount}
          onChange={handleChange}
          error={errors.requiredStudyAmount}
          placeholder="例: 2時間"
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

