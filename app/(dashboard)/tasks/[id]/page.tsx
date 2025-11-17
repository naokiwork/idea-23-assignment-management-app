'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Container } from '@/components'
import { Button } from '@/components/ui'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { TaskForm } from '@/components/tasks/TaskForm'
import { getTask, deleteTask } from '@/lib/api/tasks'
import { getSubtasksByTaskId } from '@/lib/api/subtasks'
import { loadData } from '@/lib/storage'
import { ToastProvider, useToast } from '@/components/ui/Toast'
import { Edit, Trash2, ArrowLeft, CheckSquare } from 'lucide-react'
import type { Task, Subject, Subtask } from '@/lib/types'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { calculateTaskCompletionRate } from '@/lib/utils/completionRate'
import { DateDisplay } from '@/components/ui/DateDisplay'
import { ResourceRecommendation } from '@/components/recommendations/ResourceRecommendation'

function TaskDetailPageContent() {
  const params = useParams()
  const router = useRouter()
  const { showToast } = useToast()
  const taskId = params.id as string

  const [task, setTask] = useState<Task | null>(null)
  const [subtasks, setSubtasks] = useState<Subtask[]>([])
  const [subject, setSubject] = useState<Subject | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  useEffect(() => {
    loadAllData()
  }, [taskId])

  const loadAllData = () => {
    const data = loadData()
    if (data) {
      const loadedTask = getTask(taskId)
      if (!loadedTask) {
        showToast('タスクが見つかりません', 'error')
        router.push('/tasks')
        return
      }

      setTask(loadedTask)
      setSubtasks(getSubtasksByTaskId(taskId))
      setSubject(data.subjects.find((s) => s.id === loadedTask.subjectId) || null)
    }
  }

  const progress = task ? calculateTaskCompletionRate(task, subtasks) : 0

  const handleEdit = () => {
    setIsFormOpen(true)
  }

  const handleDelete = () => {
    if (confirm('このタスクを削除しますか？関連するサブタスクも削除されます。')) {
      try {
        deleteTask(taskId)
        showToast('タスクを削除しました', 'success')
        router.push('/tasks')
      } catch (error) {
        console.error('Failed to delete task:', error)
        showToast('タスクの削除に失敗しました', 'error')
      }
    }
  }

  const handleFormSuccess = () => {
    loadAllData()
    setIsFormOpen(false)
  }

  const taskTypeLabels: Record<string, string> = {
    preparation: '予習',
    review: '復習',
    assignment: '課題',
    exam_study: 'テスト勉強',
  }

  const subtaskStatusLabels: Record<string, string> = {
    not_started: '未着手',
    in_progress: '進行中',
    completed: '完了',
  }

  if (!task) {
    return (
      <Container className="py-8">
        <p className="text-gray-500">読み込み中...</p>
      </Container>
    )
  }

  return (
    <Container className="py-8">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => router.push('/tasks')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          タスク一覧に戻る
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{task.title}</h1>
            {subject && (
              <p className="text-gray-600">科目: {subject.name}</p>
            )}
            <div className="flex items-center gap-2 mt-2">
              <StatusBadge status={progress === 100 ? 'completed' : progress > 0 ? 'in_progress' : 'not_started'} />
              <span className="text-sm text-gray-600">{taskTypeLabels[task.taskType]}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              編集
            </Button>
            <Button variant="outline" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              削除
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* 進捗情報 */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <CheckSquare className="h-5 w-5" />
              進捗状況
            </h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">完了率</span>
                  <span className="text-sm text-gray-600">{progress}%</span>
                </div>
                <ProgressBar value={progress} showLabel size="md" />
              </div>
              <div className="text-sm text-gray-600">
                <p>締切日: <DateDisplay date={task.deadline} /></p>
                {task.requiredStudyAmount && (
                  <p>必要学習量: {task.requiredStudyAmount}</p>
                )}
              </div>
            </div>
          </CardBody>
        </Card>

        {/* サブタスク */}
        {subtasks.length > 0 && (
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900">
                サブタスク ({subtasks.length}件)
              </h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-2">
                {subtasks.map((subtask) => (
                  <div
                    key={subtask.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <StatusBadge
                      status={subtask.status === 'completed' ? 'completed' : subtask.status === 'in_progress' ? 'in_progress' : 'not_started'}
                    />
                    <span className="flex-1 text-gray-900">{subtask.name}</span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        )}

        {subtasks.length === 0 && (
          <Card>
            <CardBody>
              <p className="text-gray-500 text-center py-4">サブタスクがありません</p>
            </CardBody>
          </Card>
        )}

        {/* 推奨学習リソース */}
        <ResourceRecommendation taskId={task.id} />
      </div>

      <TaskForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={handleFormSuccess}
        initialData={task}
      />
    </Container>
  )
}

export default function TaskDetailPage() {
  return (
    <ToastProvider>
      <TaskDetailPageContent />
    </ToastProvider>
  )
}

