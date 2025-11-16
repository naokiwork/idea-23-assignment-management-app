'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Container } from '@/components'
import { Button } from '@/components/ui'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { ExamForm } from '@/components/exams/ExamForm'
import { DaysRemaining } from '@/components/exams/DaysRemaining'
import { ExamProgress } from '@/components/exams/ExamProgress'
import { RequiredTasksList } from '@/components/exams/RequiredTasksList'
import { getExam, deleteExam } from '@/lib/api/exams'
import { loadData } from '@/lib/storage'
import { ToastProvider, useToast } from '@/components/ui/Toast'
import { Edit, Trash2, ArrowLeft, Calendar, BookOpen } from 'lucide-react'
import type { Exam, Subject, Task, Subtask } from '@/lib/types'
import { DateDisplay } from '@/components/ui/DateDisplay'

function ExamDetailPageContent() {
  const params = useParams()
  const router = useRouter()
  const { showToast } = useToast()
  const examId = params.id as string

  const [exam, setExam] = useState<Exam | null>(null)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [subtasks, setSubtasks] = useState<Subtask[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)

  useEffect(() => {
    loadAllData()
  }, [examId])

  const loadAllData = () => {
    const data = loadData()
    if (data) {
      setSubjects(data.subjects)
      setTasks(data.tasks)
      setSubtasks(data.subtasks)
    }

    const loadedExam = getExam(examId)
    if (!loadedExam) {
      showToast('テストが見つかりません', 'error')
      router.push('/exams')
      return
    }

    setExam(loadedExam)
  }

  const handleEdit = () => {
    setIsFormOpen(true)
  }

  const handleDelete = () => {
    if (confirm('このテストを削除しますか？')) {
      try {
        deleteExam(examId)
        showToast('テストを削除しました', 'success')
        router.push('/exams')
      } catch (error) {
        console.error('Failed to delete exam:', error)
        showToast('テストの削除に失敗しました', 'error')
      }
    }
  }

  const handleFormSuccess = () => {
    loadAllData()
    setIsFormOpen(false)
  }

  if (!exam) {
    return (
      <Container className="py-8">
        <p className="text-gray-500">読み込み中...</p>
      </Container>
    )
  }

  const subject = subjects.find((s) => s.id === exam.subjectId)

  return (
    <Container className="py-8">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => router.push('/exams')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          テスト一覧に戻る
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{exam.name}</h1>
            {subject && (
              <p className="text-gray-600">科目: {subject.name}</p>
            )}
            <div className="flex items-center gap-2 mt-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                実施日: <DateDisplay date={exam.date} />
              </span>
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
        {/* 残り日数 */}
        <DaysRemaining examDate={exam.date} />

        {/* テスト勉強進捗 */}
        <ExamProgress exam={exam} tasks={tasks} subtasks={subtasks} />

        {/* テスト範囲 */}
        {exam.testRange && (
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                テスト範囲
              </h2>
            </CardHeader>
            <CardBody>
              <p className="text-gray-700 whitespace-pre-wrap">{exam.testRange}</p>
            </CardBody>
          </Card>
        )}

        {/* 必要タスクリスト */}
        <RequiredTasksList
          exam={exam}
          tasks={tasks}
          subjects={subjects}
          subtasks={subtasks}
          onTaskClick={(task) => {
            router.push(`/tasks/${task.id}`)
          }}
        />
      </div>

      <ExamForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={handleFormSuccess}
        initialData={exam}
      />
    </Container>
  )
}

export default function ExamDetailPage() {
  return (
    <ToastProvider>
      <ExamDetailPageContent />
    </ToastProvider>
  )
}

