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
import { VoiceInput } from '../voice/VoiceInput'
import { getAutoCompleteEngine } from '@/lib/utils/autoCompleteEngine'
import { AutoCompleteSuggestions } from '../autocomplete/AutoCompleteSuggestions'
import { TemplateList } from '../templates/TemplateList'
import { applyTemplate, generateTemplateVariables } from '@/lib/utils/templateApplier'

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
  const [contentSuggestions, setContentSuggestions] = useState<Array<{ value: string; frequency: number }>>([])
  const [showContentSuggestions, setShowContentSuggestions] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const engine = getAutoCompleteEngine()

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
    // 実施内容の自動補完
    if (name === 'content' && value) {
      const suggestions = engine.getMemoCompletions(value)
      setContentSuggestions(suggestions)
      setShowContentSuggestions(suggestions.length > 0)
    } else if (name === 'content' && !value) {
      setShowContentSuggestions(false)
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
          <div>
            <Input
              label="開始時刻"
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              error={errors.startTime}
              required
            />
            {formData.startTime && (
              <AutoCompleteSuggestions
                suggestions={engine.getTimeCompletions(formData.startTime)}
                onSelect={(value) => {
                  setFormData({ ...formData, startTime: value })
                }}
                visible={formData.startTime.length > 0}
              />
            )}
          </div>
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

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">対象タスク</label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowTemplates(!showTemplates)}
            >
              {showTemplates ? 'テンプレートを隠す' : 'テンプレートから選択'}
            </Button>
          </div>
          <Select
            name="taskId"
            value={formData.taskId}
            onChange={handleChange}
            options={taskOptions}
            placeholder="タスクを選択"
            error={errors.taskId}
            required
          />
          {showTemplates && (
            <div className="mt-4">
              <TemplateList
                onSelect={(template) => {
                  const variables = generateTemplateVariables(formData.taskId, formData.date)
                  const applied = applyTemplate(template, variables)
                  setFormData((prev) => ({
                    ...prev,
                    content: applied.content || prev.content,
                    startTime: applied.startTime || prev.startTime,
                    endTime: applied.endTime || prev.endTime,
                  }))
                  setShowTemplates(false)
                }}
                showActions={false}
              />
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">実施内容</label>
            <VoiceInput
              onTranscript={(text) => {
                setFormData({ ...formData, content: formData.content + (formData.content ? ' ' : '') + text })
              }}
            />
          </div>
          <Textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            error={errors.content}
            rows={4}
            placeholder="学習した内容を記録してください（音声入力も利用可能）"
            required
          />
          <AutoCompleteSuggestions
            suggestions={contentSuggestions}
            onSelect={(value) => {
              setFormData({ ...formData, content: value })
              setShowContentSuggestions(false)
            }}
            visible={showContentSuggestions}
          />
        </div>

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

