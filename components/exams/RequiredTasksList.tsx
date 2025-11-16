'use client'

import React from 'react'
import { Card, CardBody, CardHeader } from '../ui/Card'
import { TaskCard } from '../TaskCard'
import { BookOpen } from 'lucide-react'
import type { Exam, Task, Subject, Subtask } from '@/lib/types'
import { getRequiredTasksForExam } from '@/lib/utils/examTasks'
import { calculateTaskCompletionRate } from '@/lib/utils/completionRate'
import { getSubtasksByTaskId } from '@/lib/api/subtasks'

export interface RequiredTasksListProps {
  exam: Exam
  tasks: Task[]
  subjects: Subject[]
  subtasks: Subtask[]
  onTaskClick?: (task: Task) => void
}

export const RequiredTasksList: React.FC<RequiredTasksListProps> = ({
  exam,
  tasks,
  subjects,
  subtasks,
  onTaskClick,
}) => {
  const examTasks = getRequiredTasksForExam(exam.id, tasks)

  const getSubject = (subjectId: string): Subject | undefined => {
    return subjects.find((s) => s.id === subjectId)
  }

  const getTaskProgress = (task: Task): number => {
    const taskSubtasks = getSubtasksByTaskId(task.id)
    return calculateTaskCompletionRate(task, taskSubtasks)
  }

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          必要タスクリスト ({examTasks.length}件)
        </h3>
      </CardHeader>
      <CardBody>
        {examTasks.length === 0 ? (
          <p className="text-gray-500 text-center py-4">関連するタスクがありません</p>
        ) : (
          <div className="space-y-3">
            {examTasks.map((task) => {
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
        )}
      </CardBody>
    </Card>
  )
}

