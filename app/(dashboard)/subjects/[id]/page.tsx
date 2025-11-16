'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Container } from '@/components'
import { Button } from '@/components/ui'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { SubjectForm } from '@/components/subjects/SubjectForm'
import { TaskCard } from '@/components'
import { getSubject, deleteSubject, getAllSubjects } from '@/lib/api/subjects'
import { getTimetablesBySubjectId } from '@/lib/api/timetables'
import { loadData } from '@/lib/storage'
import { ToastProvider, useToast } from '@/components/ui/Toast'
import { Edit, Trash2, ArrowLeft, BookOpen, Calendar } from 'lucide-react'
import type { Subject, Timetable, Task } from '@/lib/types'
import { Badge } from '@/components/ui/Badge'

function SubjectDetailPageContent() {
  const params = useParams()
  const router = useRouter()
  const { showToast } = useToast()
  const subjectId = params.id as string

  const [subject, setSubject] = useState<Subject | null>(null)
  const [timetables, setTimetables] = useState<Timetable[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)

  useEffect(() => {
    loadAllData()
  }, [subjectId])

  const loadAllData = () => {
    const data = loadData()
    if (data) {
      setTasks(data.tasks)
    }

    const loadedSubject = getSubject(subjectId)
    if (!loadedSubject) {
      showToast('科目が見つかりません', 'error')
      router.push('/subjects')
      return
    }

    setSubject(loadedSubject)
    setTimetables(getTimetablesBySubjectId(subjectId))
  }

  const relatedTasks = tasks.filter((task) => task.subjectId === subjectId)

  const handleEdit = () => {
    setIsFormOpen(true)
  }

  const handleDelete = () => {
    if (confirm('この科目を削除しますか？関連する時間割も削除されます。')) {
      try {
        deleteSubject(subjectId)
        showToast('科目を削除しました', 'success')
        router.push('/subjects')
      } catch (error) {
        console.error('Failed to delete subject:', error)
        showToast('科目の削除に失敗しました', 'error')
      }
    }
  }

  const handleFormSuccess = () => {
    loadAllData()
    setIsFormOpen(false)
  }

  const dayOfWeekLabels: Record<string, string> = {
    monday: '月',
    tuesday: '火',
    wednesday: '水',
    thursday: '木',
    friday: '金',
    saturday: '土',
    sunday: '日',
  }

  if (!subject) {
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
            onClick={() => router.push('/subjects')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            科目一覧に戻る
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{subject.name}</h1>
              {subject.teacher && (
                <p className="text-gray-600">担当: {subject.teacher}</p>
              )}
              {(subject.year || subject.semester) && (
                <p className="text-gray-600">
                  {subject.year && subject.semester
                    ? `${subject.year} ${subject.semester}`
                    : subject.year || subject.semester}
                </p>
              )}
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
          {/* 時間割情報 */}
          {timetables.length > 0 && (
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  時間割
                </h2>
              </CardHeader>
              <CardBody>
                <div className="flex flex-wrap gap-2">
                  {timetables.map((tt) => (
                    <Badge key={tt.id} variant="info" size="md">
                      {dayOfWeekLabels[tt.dayOfWeek]} {tt.period}限
                    </Badge>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}

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
                    const taskSubject = subject // 既に同じ科目なので、subjectを使用
                    return (
                      <TaskCard
                        key={task.id}
                        task={task}
                        subject={taskSubject}
                        onClick={() => {
                          // タスク詳細ページへの遷移（後で実装）
                          console.log('Navigate to task detail:', task.id)
                        }}
                      />
                    )
                  })}
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        <SubjectForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSuccess={handleFormSuccess}
          initialData={subject}
        />
      </Container>
  )
}

export default function SubjectDetailPage() {
  return (
    <ToastProvider>
      <SubjectDetailPageContent />
    </ToastProvider>
  )
}

