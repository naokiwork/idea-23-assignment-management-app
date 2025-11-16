'use client'

import React, { useState, useEffect } from 'react'
import { Button, Input, Textarea, Select } from '../ui'
import { Modal } from '../ui'
import { createStudyLog, updateStudyLog } from '@/lib/api/studyLogs'
import { validateStudyLog } from '@/lib/validation/studyLogValidation'
import { calculateDuration, formatDuration } from '@/lib/utils/timeCalculation'
import { loadData } from '@/lib/storage'
import type { StudyLog, Task } from '@/lib/types'
import { useToast } from '../ui/Toast'

export interface StudyLogFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  initialData?: Partial<StudyLog>
}

export const StudyLogForm: React.FC<StudyLogFormProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}) => {
  const { showToast } = useToast()
  const [tasks, setTasks] = useState<Task[]>([])
  const [formData, setFormData] = useState({
    date: initialData?.date || new Date().toISOString().split('T')[0],
    startTime: initialData?.startTime || '',
    endTime: initialData?.endTime || '',
    taskId: initialData?.taskId || '',
    content: initialData?.content || '',
    progressAmount: initialData?.progressAmount || '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // タスク一覧を読み込む
    const data = loadData()
    if (data) {
      setTasks(data.tasks)
    }
  }, [])

  // 学習時間の自動計算
  const calculatedDuration = React.useMemo(() => {
    if (formData.startTime && formData.endTime) {
      try {
        const duration = calculateDuration(formData.startTime, formData.endTime)
        return formatDuration(duration)
      } catch {
        return ''
      }
    }
    return ''
  }, [formData.startTime, formData.endTime])

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
    const validation = validateStudyLog(formData)
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
        await updateStudyLog(initialData.id, {
          date: formData.date,
          startTime: formData.startTime,
          endTime: formData.endTime,
          taskId: formData.taskId,
          content: formData.content,
          progressAmount: formData.progressAmount || undefined,
        })
        showToast('学習ログを更新しました', 'success')
      } else {
        // 新規作成モード
        await createStudyLog({
          date: formData.date,
          startTime: formData.startTime,
          endTime: formData.endTime,
          taskId: formData.taskId,
          content: formData.content,
          progressAmount: formData.progressAmount || undefined,
        })
        showToast('学習ログを記録しました', 'success')
      }

      onSuccess?.()
      onClose()

      // フォームをリセット
      setFormData({
        date: new Date().toISOString().split('T')[0],
        startTime: '',
        endTime: '',
        taskId: '',
        content: '',
        progressAmount: '',
      })
      setErrors({})
    } catch (error) {
      console.error('Failed to save study log:', error)
      showToast(
        initialData?.id
          ? '学習ログの更新に失敗しました'
          : '学習ログの記録に失敗しました',
        'error'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const taskOptions = tasks.map((task) => ({
    value: task.id,
    label: `${task.title} (${task.taskType})`,
  }))

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData?.id ? '学習ログを編集' : '学習ログを記録'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="日付"
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          error={errors.date}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="開始時刻"
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            error={errors.startTime}
            required
          />
          <Input
            label="終了時刻"
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            error={errors.endTime}
            required
          />
        </div>

        {calculatedDuration && (
          <div className="bg-primary-50 border border-primary-200 rounded-md p-3">
            <p className="text-sm text-primary-700">
              <span className="font-medium">学習時間:</span> {calculatedDuration}
            </p>
          </div>
        )}

        <Select
          label="対象タスク"
          name="taskId"
          value={formData.taskId}
          onChange={handleChange}
          options={taskOptions}
          placeholder="タスクを選択"
          error={errors.taskId}
          required
        />

        <Textarea
          label="実施内容"
          name="content"
          value={formData.content}
          onChange={handleChange}
          error={errors.content}
          rows={4}
          placeholder="学習した内容を記録してください"
          required
        />

        <Input
          label="進捗量（任意）"
          name="progressAmount"
          value={formData.progressAmount}
          onChange={handleChange}
          error={errors.progressAmount}
          placeholder="例: 50%, 第3章まで"
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
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
          >
            記録
          </Button>
        </div>
      </form>
    </Modal>
  )
}

