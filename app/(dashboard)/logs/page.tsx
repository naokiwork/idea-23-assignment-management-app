'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Container } from '@/components'
import { Button } from '@/components/ui'
import { StudyLogForm } from '@/components/studyLogs/StudyLogForm'
import { DateGroupedLogs } from '@/components/studyLogs/DateGroupedLogs'
import { StudyLogFilters, type PeriodFilter } from '@/components/studyLogs/StudyLogFilters'
import { getAllStudyLogs, deleteStudyLog, updateStudyLog } from '@/lib/api/studyLogs'
import { loadData } from '@/lib/storage'
import { ToastProvider, useToast } from '@/components/ui/Toast'
import { Plus } from 'lucide-react'
import type { StudyLog, Task, Subject } from '@/lib/types'

function LogsPageContent() {
  const { showToast } = useToast()
  const [logs, setLogs] = useState<StudyLog[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingLog, setEditingLog] = useState<StudyLog | null>(null)

  // フィルタ状態
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('')
  const [selectedTaskId, setSelectedTaskId] = useState<string>('')
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodFilter>('all')

  useEffect(() => {
    loadAllData()
  }, [])

  const loadAllData = () => {
    const data = loadData()
    if (data) {
      setTasks(data.tasks)
      setSubjects(data.subjects)
    }
    setLogs(getAllStudyLogs())
  }

  // フィルタリングされたログ
  const filteredLogs = useMemo(() => {
    let result = [...logs]

    // 期間フィルタ
    if (selectedPeriod !== 'all') {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

      result = result.filter((log) => {
        const logDate = new Date(log.date)
        switch (selectedPeriod) {
          case 'today':
            return logDate.getTime() === today.getTime()
          case 'thisWeek': {
            const weekStart = new Date(today)
            weekStart.setDate(today.getDate() - today.getDay())
            return logDate >= weekStart
          }
          case 'thisMonth':
            return (
              logDate.getMonth() === today.getMonth() &&
              logDate.getFullYear() === today.getFullYear()
            )
          default:
            return true
        }
      })
    }

    // 科目フィルタ
    if (selectedSubjectId) {
      const taskIds = tasks
        .filter((t) => t.subjectId === selectedSubjectId)
        .map((t) => t.id)
      result = result.filter((log) => taskIds.includes(log.taskId))
    }

    // タスクフィルタ
    if (selectedTaskId) {
      result = result.filter((log) => log.taskId === selectedTaskId)
    }

    return result
  }, [logs, selectedPeriod, selectedSubjectId, selectedTaskId, tasks])

  const handleCreate = () => {
    setEditingLog(null)
    setIsFormOpen(true)
  }

  const handleEdit = (log: StudyLog) => {
    setEditingLog(log)
    setIsFormOpen(true)
  }

  const handleDelete = (logId: string) => {
    try {
      deleteStudyLog(logId)
      showToast('学習ログを削除しました', 'success')
      loadAllData()
    } catch (error) {
      console.error('Failed to delete study log:', error)
      showToast('学習ログの削除に失敗しました', 'error')
    }
  }

  const handleFormSuccess = () => {
    loadAllData()
    setIsFormOpen(false)
    setEditingLog(null)
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setEditingLog(null)
  }

  return (
    <Container className="py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">学習ログ</h1>
          <Button onClick={handleCreate} variant="primary">
            <Plus className="h-5 w-5 mr-2" />
            新しいログを記録
          </Button>
        </div>

        <div className="mb-6">
          <StudyLogFilters
            subjects={subjects}
            tasks={tasks}
            selectedSubjectId={selectedSubjectId}
            selectedTaskId={selectedTaskId}
            selectedPeriod={selectedPeriod}
            onSubjectChange={setSelectedSubjectId}
            onTaskChange={setSelectedTaskId}
            onPeriodChange={setSelectedPeriod}
          />
        </div>

        <DateGroupedLogs
          logs={filteredLogs}
          tasks={tasks}
          subjects={subjects}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <StudyLogForm
          isOpen={isFormOpen}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
          initialData={editingLog || undefined}
        />
      </Container>
  )
}

export default function LogsPage() {
  return (
    <ToastProvider>
      <LogsPageContent />
    </ToastProvider>
  )
}

