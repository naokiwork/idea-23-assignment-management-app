'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Container } from '@/components'
import { Button } from '@/components/ui'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { ClassForm } from '@/components/classes/ClassForm'
import { TaskCard } from '@/components'
import { getClass, deleteClass } from '@/lib/api/classes'
import { loadData } from '@/lib/storage'
import { ToastProvider, useToast } from '@/components/ui/Toast'
import { Edit, Trash2, ArrowLeft, BookOpen, Calendar, Clock } from 'lucide-react'
import type { Class, Subject, Task, Subtask } from '@/lib/types'
import { DateDisplay } from '@/components/ui/DateDisplay'
import { calculateTaskCompletionRate } from '@/lib/utils/completionRate'
import { getSubtasksByTaskId } from '@/lib/api/subtasks'

function ClassDetailPageContent() {
  const params = useParams()
  const router = useRouter()
  const { showToast } = useToast()
  const classId = params.id as string

  const [classData, setClassData] = useState<Class | null>(null)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [subtasks, setSubtasks] = useState<Subtask[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)

  useEffect(() => {
    loadAllData()
  }, [classId])

  const loadAllData = () => {
    const data = loadData()
    if (data) {
      setSubjects(data.subjects)
      setTasks(data.tasks)
      setSubtasks(data.subtasks)
    }

    const loadedClass = getClass(classId)
    if (!loadedClass) {
      showToast('授業回が見つかりません', 'error')
      router.push('/classes')
      return
    }

    setClassData(loadedClass)
  }

  const relatedTasks = tasks.filter((task) => task.relatedClassId === classId)

  const handleEdit = () => {
    setIsFormOpen(true)
  }

  const handleDelete = () => {
    if (confirm('この授業回を削除しますか？')) {
      try {
        deleteClass(classId)
        showToast('授業回を削除しました', 'success')
        router.push('/classes')
      } catch (error) {
        console.error('Failed to delete class:', error)
        showToast('授業回の削除に失敗しました', 'error')
      }
    }
  }

  const handleFormSuccess = () => {
    loadAllData()
    setIsFormOpen(false)
  }

  const getSubject = (subjectId: string): Subject | undefined => {
    return subjects.find((s) => s.id === subjectId)
  }

  const getTaskProgress = (task: Task): number => {
    const taskSubtasks = getSubtasksByTaskId(task.id)
    return calculateTaskCompletionRate(task, taskSubtasks)
  }

  if (!classData) {
    return (
      <Container className="py-8">
        <p className="text-gray-500">読み込み中...</p>
      </Container>
    )
  }

  const subject = getSubject(classData.subjectId)

  return (
    <Container className="py-8">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => router.push('/classes')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          授業回一覧に戻る
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{classData.title}</h1>
            {subject && (
              <p className="text-gray-600">科目: {subject.name}</p>
            )}
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <DateDisplay date={classData.date} />
              </div>
              {classData.time && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{classData.time}</span>
                </div>
              )}
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
        {/* 関連タスク */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              関連タスク ({relatedTasks.length}件)
            </h2>
          </CardHeader>
          <CardBody>
            {relatedTasks.length === 0 ? (
              <p className="text-gray-500">関連タスクがありません</p>
            ) : (
              <div className="space-y-3">
                {relatedTasks.map((task) => {
                  const taskSubject = getSubject(task.subjectId)
                  const progress = getTaskProgress(task)
                  return (
                    <TaskCard
                      key={task.id}
                      task={task}
                      subject={taskSubject}
                      progress={progress}
                      onClick={() => {
                        router.push(`/tasks/${task.id}`)
                      }}
                    />
                  )
                })}
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      <ClassForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={handleFormSuccess}
        initialData={classData}
      />
    </Container>
  )
}

export default function ClassDetailPage() {
  return (
    <ToastProvider>
      <ClassDetailPageContent />
    </ToastProvider>
  )
}

