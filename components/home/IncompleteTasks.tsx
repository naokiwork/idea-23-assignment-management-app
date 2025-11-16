'use client'

import React from 'react'
import { Card, CardBody, CardHeader } from '../ui/Card'
import { TaskCard } from '../TaskCard'
import { AlertCircle } from 'lucide-react'
import type { Task, Subject } from '@/lib/types'
import { calculateTaskCompletionRate } from '@/lib/utils/completionRate'
import { getSubtasksByTaskId } from '@/lib/api/subtasks'

export interface IncompleteTasksProps {
  overdueTasks: Task[]
  thisWeekTasks: Task[]
  subjects: Subject[]
  onTaskClick?: (task: Task) => void
}

export const IncompleteTasks: React.FC<IncompleteTasksProps> = ({
  overdueTasks,
  thisWeekTasks,
  subjects,
  onTaskClick,
}) => {
  const getSubject = (subjectId: string): Subject | undefined => {
    return subjects.find((s) => s.id === subjectId)
  }

  const getTaskProgress = (task: Task): number => {
    const subtasks = getSubtasksByTaskId(task.id)
    return calculateTaskCompletionRate(task, subtasks)
  }

  return (
    <div className="space-y-6">
      {/* 期限切れタスク */}
      {overdueTasks.length > 0 && (
        <Card className="border-error-200">
          <CardHeader className="bg-error-50">
            <h2 className="text-xl font-semibold text-error-900 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              期限切れタスク ({overdueTasks.length}件)
            </h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {overdueTasks.map((task) => {
                const subject = getSubject(task.subjectId)
                const progress = getTaskProgress(task)
                return (
                  <TaskCard
                    key={task.id}
                    task={task}
                    subject={subject}
                    progress={progress}
                    onClick={() => onTaskClick?.(task)}
                  />
                )
              })}
            </div>
          </CardBody>
        </Card>
      )}

      {/* 今週中に締切のタスク */}
      {thisWeekTasks.length > 0 && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">
              今週中に締切のタスク ({thisWeekTasks.length}件)
            </h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {thisWeekTasks.map((task) => {
                const subject = getSubject(task.subjectId)
                const progress = getTaskProgress(task)
                return (
                  <TaskCard
                    key={task.id}
                    task={task}
                    subject={subject}
                    progress={progress}
                    onClick={() => onTaskClick?.(task)}
                  />
                )
              })}
            </div>
          </CardBody>
        </Card>
      )}

      {overdueTasks.length === 0 && thisWeekTasks.length === 0 && (
        <Card>
          <CardBody>
            <p className="text-center text-gray-500 py-8">
              未完了のタスクはありません
            </p>
          </CardBody>
        </Card>
      )}
    </div>
  )
}

