'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Container } from '@/components'
import { Button, Input } from '@/components/ui'
import { TaskForm } from '@/components/tasks/TaskForm'
import { TaskFilters, type TaskFilter } from '@/components/tasks/TaskFilters'
import { TaskCard } from '@/components'
import { getAllTasks, deleteTask } from '@/lib/api/tasks'
import { loadData } from '@/lib/storage'
import { ToastProvider, useToast } from '@/components/ui/Toast'
import {
  filterByWeek,
  filterIncomplete,
  filterOverdue,
  filterBySubject,
  filterByTaskType,
  filterTestTasks,
} from '@/lib/utils/taskFilters'
import { sortByDeadline } from '@/lib/utils/taskSort'
import { calculateTaskCompletionRate } from '@/lib/utils/completionRate'
import { getSubtasksByTaskId } from '@/lib/api/subtasks'
import { Plus, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { Task, Subject, TaskType } from '@/lib/types'

function TasksPageContent() {
  const router = useRouter()
  const { showToast } = useToast()
  const [tasks, setTasks] = useState<Task[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState<TaskFilter>('all')
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('')
  const [selectedTaskType, setSelectedTaskType] = useState<TaskType | undefined>(undefined)

  useEffect(() => {
    loadAllData()
  }, [])

  const loadAllData = () => {
    const data = loadData()
    if (data) {
      setSubjects(data.subjects)
    }
    setTasks(getAllTasks())
  }

  // フィルタリングとソート
  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks]

    // フィルタリング
    switch (selectedFilter) {
      case 'thisWeek':
        result = filterByWeek(result)
        break
      case 'incomplete':
        result = filterIncomplete(result)
        break
      case 'overdue':
        result = filterOverdue(result)
        break
      case 'test':
        result = filterTestTasks(result)
        break
    }

    if (selectedSubjectId) {
      result = filterBySubject(result, selectedSubjectId)
    }

    if (selectedTaskType) {
      result = filterByTaskType(result, selectedTaskType)
    }

    // 検索
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter((task) =>
        task.title.toLowerCase().includes(query)
      )
    }

    // ソート（締切日順）
    result = sortByDeadline(result, true)

    return result
  }, [tasks, selectedFilter, selectedSubjectId, selectedTaskType, searchQuery])

  const handleCreate = () => {
    setEditingTask(null)
    setIsFormOpen(true)
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setIsFormOpen(true)
  }

  const handleDelete = (taskId: string) => {
    if (confirm('このタスクを削除しますか？関連するサブタスクも削除されます。')) {
      try {
        deleteTask(taskId)
        showToast('タスクを削除しました', 'success')
        loadAllData()
      } catch (error) {
        console.error('Failed to delete task:', error)
        showToast('タスクの削除に失敗しました', 'error')
      }
    }
  }

  const handleFormSuccess = () => {
    loadAllData()
    setIsFormOpen(false)
    setEditingTask(null)
  }

  const getSubject = (subjectId: string): Subject | undefined => {
    return subjects.find((s) => s.id === subjectId)
  }

  const getTaskProgress = (task: Task): number => {
    const subtasks = getSubtasksByTaskId(task.id)
    return calculateTaskCompletionRate(task, subtasks)
  }

  return (
    <Container className="py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">タスク一覧</h1>
          <Button onClick={handleCreate} variant="primary">
            <Plus className="h-5 w-5 mr-2" />
            新しいタスクを登録
          </Button>
        </div>

        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="タスク名で検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <TaskFilters
            selectedFilter={selectedFilter}
            selectedSubjectId={selectedSubjectId}
            selectedTaskType={selectedTaskType}
            onFilterChange={setSelectedFilter}
            onSubjectChange={setSelectedSubjectId}
            onTaskTypeChange={(type) => setSelectedTaskType(type || undefined)}
          />
        </div>

        {filteredAndSortedTasks.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>{searchQuery ? '検索結果がありません' : 'タスクがありません'}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAndSortedTasks.map((task) => {
              const subject = getSubject(task.subjectId)
              const progress = getTaskProgress(task)

              return (
                <TaskCard
                  key={task.id}
                  task={task}
                  subject={subject}
                  progress={progress}
                  onClick={() => {
                    // タスク詳細ページへの遷移（後で実装）
                    console.log('Navigate to task detail:', task.id)
                  }}
                />
              )
            })}
          </div>
        )}

        <TaskForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false)
            setEditingTask(null)
          }}
          onSuccess={handleFormSuccess}
          initialData={editingTask || undefined}
        />
      </Container>
  )
}

export default function TasksPage() {
  return (
    <ToastProvider>
      <TasksPageContent />
    </ToastProvider>
  )
}

