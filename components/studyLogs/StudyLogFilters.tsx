'use client'

import React from 'react'
import { Select } from '../ui'
import type { Subject, Task } from '@/lib/types'

export type PeriodFilter = 'today' | 'thisWeek' | 'thisMonth' | 'all' | 'custom'

export interface StudyLogFiltersProps {
  subjects: Subject[]
  tasks: Task[]
  selectedSubjectId?: string
  selectedTaskId?: string
  selectedPeriod: PeriodFilter
  onSubjectChange: (subjectId: string) => void
  onTaskChange: (taskId: string) => void
  onPeriodChange: (period: PeriodFilter) => void
}

export const StudyLogFilters: React.FC<StudyLogFiltersProps> = ({
  subjects,
  tasks,
  selectedSubjectId,
  selectedTaskId,
  selectedPeriod,
  onSubjectChange,
  onTaskChange,
  onPeriodChange,
}) => {
  const periodOptions = [
    { value: 'today', label: '今日' },
    { value: 'thisWeek', label: '今週' },
    { value: 'thisMonth', label: '今月' },
    { value: 'all', label: 'すべて' },
  ]

  const subjectOptions = [
    { value: '', label: 'すべての科目' },
    ...subjects.map((s) => ({ value: s.id, label: s.name })),
  ]

  const taskOptions = [
    { value: '', label: 'すべてのタスク' },
    ...tasks
      .filter((t) => !selectedSubjectId || t.subjectId === selectedSubjectId)
      .map((t) => ({ value: t.id, label: t.title })),
  ]

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select
          label="期間"
          value={selectedPeriod}
          onChange={(e) => onPeriodChange(e.target.value as PeriodFilter)}
          options={periodOptions}
        />

        <Select
          label="科目"
          value={selectedSubjectId || ''}
          onChange={(e) => onSubjectChange(e.target.value)}
          options={subjectOptions}
        />

        <Select
          label="タスク"
          value={selectedTaskId || ''}
          onChange={(e) => onTaskChange(e.target.value)}
          options={taskOptions}
        />
      </div>
    </div>
  )
}

