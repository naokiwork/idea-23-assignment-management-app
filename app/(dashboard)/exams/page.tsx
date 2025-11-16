'use client'

import React, { useState, useEffect } from 'react'
import { Container } from '@/components'
import { Button } from '@/components/ui'
import { ExamForm } from '@/components/exams/ExamForm'
import { ExamCard } from '@/components/exams/ExamCard'
import { Select } from '@/components/ui'
import { getAllExams, deleteExam } from '@/lib/api/exams'
import { loadData } from '@/lib/storage'
import { ToastProvider, useToast } from '@/components/ui/Toast'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { Exam, Subject, Task } from '@/lib/types'
import { getRequiredTasksForExam } from '@/lib/utils/examTasks'
import { calculateTaskCompletionRate } from '@/lib/utils/completionRate'

function ExamsPageContent() {
  const router = useRouter()
  const { showToast } = useToast()
  const [exams, setExams] = useState<Exam[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingExam, setEditingExam] = useState<Exam | null>(null)
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('')

  useEffect(() => {
    loadAllData()
  }, [])

  const loadAllData = () => {
    const data = loadData()
    if (data) {
      setSubjects(data.subjects)
      setTasks(data.tasks)
    }
    setExams(getAllExams())
  }

  // フィルタリングされたテスト
  const filteredExams = selectedSubjectId
    ? exams.filter((exam) => exam.subjectId === selectedSubjectId)
    : exams

  const handleCreate = () => {
    setEditingExam(null)
    setIsFormOpen(true)
  }

  const handleEdit = (exam: Exam) => {
    setEditingExam(exam)
    setIsFormOpen(true)
  }

  const handleDelete = (examId: string) => {
    if (confirm('このテストを削除しますか？')) {
      try {
        deleteExam(examId)
        showToast('テストを削除しました', 'success')
        loadAllData()
      } catch (error) {
        console.error('Failed to delete exam:', error)
        showToast('テストの削除に失敗しました', 'error')
      }
    }
  }

  const handleFormSuccess = () => {
    loadAllData()
    setIsFormOpen(false)
    setEditingExam(null)
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setEditingExam(null)
  }

  // テストの進捗率を計算
  const getExamProgress = (exam: Exam): number => {
    const data = loadData()
    const allSubtasks = data?.subtasks || []
    const examTasks = getRequiredTasksForExam(exam.id, tasks)
    if (examTasks.length === 0) return 0
    
    // 各タスクの完了率を計算
    const taskProgresses = examTasks.map((task) => {
      const taskSubtasks = allSubtasks.filter((st) => st.parentTaskId === task.id)
      return calculateTaskCompletionRate(task, taskSubtasks)
    })

    // 全体の進捗率を計算（平均）
    return Math.round(
      taskProgresses.reduce((sum, progress) => sum + progress, 0) / taskProgresses.length
    )
  }

  const subjectOptions = [
    { value: '', label: 'すべての科目' },
    ...subjects.map((s) => ({ value: s.id, label: s.name })),
  ]

  return (
    <Container className="py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">テスト管理</h1>
          <Button onClick={handleCreate} variant="primary">
            <Plus className="h-5 w-5 mr-2" />
            新しいテストを登録
          </Button>
        </div>

        <div className="mb-6">
          <Select
            label="科目でフィルタ"
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            options={subjectOptions}
          />
        </div>

        {filteredExams.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>テストが登録されていません</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredExams.map((exam) => {
              const subject = subjects.find((s) => s.id === exam.subjectId)
              const progress = getExamProgress(exam)

              return (
                <ExamCard
                  key={exam.id}
                  exam={exam}
                  subject={subject}
                  progress={progress}
                  onClick={() => {
                    router.push(`/exams/${exam.id}`)
                  }}
                />
              )
            })}
          </div>
        )}

        <ExamForm
          isOpen={isFormOpen}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
          initialData={editingExam || undefined}
        />
      </Container>
  )
}

export default function ExamsPage() {
  return (
    <ToastProvider>
      <ExamsPageContent />
    </ToastProvider>
  )
}

