'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Container } from '@/components'
import { Button, Input, Select } from '@/components/ui'
import { ClassForm } from '@/components/classes/ClassForm'
import { ClassCard } from '@/components/classes/ClassCard'
import { getAllClasses, deleteClass } from '@/lib/api/classes'
import { loadData } from '@/lib/storage'
import { ToastProvider, useToast } from '@/components/ui/Toast'
import { Plus, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { Class, Subject, Task } from '@/lib/types'

function ClassesPageContent() {
  const router = useRouter()
  const { showToast } = useToast()
  const [classes, setClasses] = useState<Class[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingClass, setEditingClass] = useState<Class | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
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
    setClasses(getAllClasses())
  }

  const filteredClasses = useMemo(() => {
    let result = [...classes]

    if (selectedSubjectId) {
      result = result.filter((c) => c.subjectId === selectedSubjectId)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter((c) =>
        c.title.toLowerCase().includes(query) ||
        subjects.find((s) => s.id === c.subjectId)?.name.toLowerCase().includes(query)
      )
    }

    return result
  }, [classes, selectedSubjectId, searchQuery, subjects])

  const handleCreate = () => {
    setEditingClass(null)
    setIsFormOpen(true)
  }

  const handleEdit = (classData: Class) => {
    setEditingClass(classData)
    setIsFormOpen(true)
  }

  const handleDelete = (classId: string) => {
    if (confirm('この授業回を削除しますか？')) {
      try {
        deleteClass(classId)
        showToast('授業回を削除しました', 'success')
        loadAllData()
      } catch (error) {
        console.error('Failed to delete class:', error)
        showToast('授業回の削除に失敗しました', 'error')
      }
    }
  }

  const handleFormSuccess = () => {
    loadAllData()
    setIsFormOpen(false)
    setEditingClass(null)
  }

  const getSubject = (subjectId: string): Subject | undefined => {
    return subjects.find((s) => s.id === subjectId)
  }

  const getRelatedTaskCount = (classId: string): number => {
    return tasks.filter((task) => task.relatedClassId === classId).length
  }

  const subjectOptions = [
    { value: '', label: 'すべての科目' },
    ...subjects.map((s) => ({ value: s.id, label: s.name })),
  ]

  return (
    <Container className="py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">授業回一覧</h1>
        <Button onClick={handleCreate} variant="primary">
          <Plus className="h-5 w-5 mr-2" />
          新しい授業回を登録
        </Button>
      </div>

      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="授業タイトルまたは科目名で検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select
          label="科目でフィルタ"
          value={selectedSubjectId}
          onChange={(e) => setSelectedSubjectId(e.target.value)}
          options={subjectOptions}
        />
      </div>

      {filteredClasses.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>{searchQuery || selectedSubjectId ? '検索結果がありません' : '授業回が登録されていません'}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredClasses.map((classData) => {
            const subject = getSubject(classData.subjectId)
            const taskCount = getRelatedTaskCount(classData.id)

            return (
              <ClassCard
                key={classData.id}
                classData={classData}
                subject={subject}
                onClick={() => {
                  router.push(`/classes/${classData.id}`)
                }}
              />
            )
          })}
        </div>
      )}

      <ClassForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setEditingClass(null)
        }}
        onSuccess={handleFormSuccess}
        initialData={editingClass || undefined}
      />
    </Container>
  )
}

export default function ClassesPage() {
  return (
    <ToastProvider>
      <ClassesPageContent />
    </ToastProvider>
  )
}

