'use client'

import React from 'react'
import { Select } from '../ui'
import type { TaskType } from '@/lib/types'
import { loadData } from '@/lib/storage'
import type { Subject } from '@/lib/types'

export type TaskFilter = 'all' | 'thisWeek' | 'incomplete' | 'overdue' | 'test'

export interface TaskFiltersProps {
  selectedFilter: TaskFilter
  selectedSubjectId?: string
  selectedTaskType?: TaskType
  onFilterChange: (filter: TaskFilter) => void
  onSubjectChange: (subjectId: string) => void
  onTaskTypeChange: (taskType: TaskType | '') => void
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  selectedFilter,
  selectedSubjectId,
  selectedTaskType,
  onFilterChange,
  onSubjectChange,
  onTaskTypeChange,
}) => {
  const data = loadData()
  const subjects = data?.subjects || []

  const filterOptions = [
    { value: 'all', label: 'すべて' },
    { value: 'thisWeek', label: '今週' },
    { value: 'incomplete', label: '未完了' },
    { value: 'overdue', label: '期限切れ' },
    { value: 'test', label: 'テスト用' },
  ]

  const subjectOptions = [
    { value: '', label: 'すべての科目' },
    ...subjects.map((s) => ({ value: s.id, label: s.name })),
  ]

  const taskTypeOptions = [
    { value: '', label: 'すべての種別' },
    { value: 'preparation', label: '予習' },
    { value: 'review', label: '復習' },
    { value: 'assignment', label: '課題' },
    { value: 'exam_study', label: 'テスト勉強' },
  ]

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select
          label="フィルタ"
          value={selectedFilter}
          onChange={(e) => onFilterChange(e.target.value as TaskFilter)}
          options={filterOptions}
        />

        <Select
          label="科目"
          value={selectedSubjectId || ''}
          onChange={(e) => onSubjectChange(e.target.value)}
          options={subjectOptions}
        />

        <Select
          label="タスク種別"
          value={selectedTaskType || ''}
          onChange={(e) => onTaskTypeChange(e.target.value as TaskType | '')}
          options={taskTypeOptions}
        />
      </div>
    </div>
  )
}

