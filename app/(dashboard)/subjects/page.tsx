'use client'

import React, { useState, useEffect } from 'react'
import { Container } from '@/components'
import { Button, Input } from '@/components/ui'
import { SubjectForm } from '@/components/subjects/SubjectForm'
import { SubjectCard } from '@/components'
import { getAllSubjects, deleteSubject } from '@/lib/api/subjects'
import { getTimetablesBySubjectId } from '@/lib/api/timetables'
import { loadData } from '@/lib/storage'
import { ToastProvider, useToast } from '@/components/ui/Toast'
import { Plus, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { Subject, Timetable, Task } from '@/lib/types'

function SubjectsPageContent() {
  const router = useRouter()
  const { showToast } = useToast()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [timetables, setTimetables] = useState<Timetable[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadAllData()
  }, [])

  const loadAllData = () => {
    const data = loadData()
    if (data) {
      setTimetables(data.timetables)
      setTasks(data.tasks)
    }
    setSubjects(getAllSubjects())
  }

  const filteredSubjects = subjects.filter((subject) =>
    subject.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreate = () => {
    setEditingSubject(null)
    setIsFormOpen(true)
  }

  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject)
    setIsFormOpen(true)
  }

  const handleDelete = (subjectId: string) => {
    if (confirm('この科目を削除しますか？関連する時間割も削除されます。')) {
      try {
        deleteSubject(subjectId)
        showToast('科目を削除しました', 'success')
        loadAllData()
      } catch (error) {
        console.error('Failed to delete subject:', error)
        showToast('科目の削除に失敗しました', 'error')
      }
    }
  }

  const handleFormSuccess = () => {
    loadAllData()
    setIsFormOpen(false)
    setEditingSubject(null)
  }

  const getSubjectTimetables = (subjectId: string): Timetable[] => {
    return getTimetablesBySubjectId(subjectId)
  }

  const getSubjectTaskCount = (subjectId: string): number => {
    return tasks.filter((task) => task.subjectId === subjectId).length
  }

  return (
    <Container className="py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">科目一覧</h1>
          <Button onClick={handleCreate} variant="primary">
            <Plus className="h-5 w-5 mr-2" />
            新しい科目を登録
          </Button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="科目名で検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {filteredSubjects.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>{searchQuery ? '検索結果がありません' : '科目が登録されていません'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSubjects.map((subject) => {
              const subjectTimetables = getSubjectTimetables(subject.id)
              const taskCount = getSubjectTaskCount(subject.id)

              return (
                <SubjectCard
                  key={subject.id}
                  subject={subject}
                  timetables={subjectTimetables}
                  taskCount={taskCount}
                  onClick={() => {
                    router.push(`/subjects/${subject.id}`)
                  }}
                />
              )
            })}
          </div>
        )}

        <SubjectForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false)
            setEditingSubject(null)
          }}
          onSuccess={handleFormSuccess}
          initialData={editingSubject || undefined}
        />
      </Container>
  )
}

export default function SubjectsPage() {
  return (
    <ToastProvider>
      <SubjectsPageContent />
    </ToastProvider>
  )
}

