'use client'

import React from 'react'
import { Card, CardBody, CardFooter } from './ui/Card'
import { StatusBadge, TaskStatus } from './ui/StatusBadge'
import { ProgressBar } from './ui/ProgressBar'
import { DateDisplay } from './ui/DateDisplay'
import { Calendar, Clock, BookOpen } from 'lucide-react'
import type { Task, Subject } from '@/lib/types'

export interface TaskCardProps {
  task: Task
  subject?: Subject
  progress?: number // 0-100
  onClick?: () => void
  className?: string
}

const taskTypeLabels: Record<Task['taskType'], string> = {
  preparation: '予習',
  review: '復習',
  assignment: '課題',
  exam_study: 'テスト勉強',
}

const getTaskStatus = (task: Task): TaskStatus => {
  const now = new Date()
  const deadline = new Date(task.deadline)

  // 期限切れチェック（簡易版 - 実際には進捗も考慮する必要がある）
  if (deadline < now) {
    return 'overdue'
  }

  // ここでは簡易的に未着手として扱う
  // 実際の実装では、サブタスクの完了状況などから判定
  return 'not_started'
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  subject,
  progress = 0,
  onClick,
  className = '',
}) => {
  const status = getTaskStatus(task)
  const deadline = new Date(task.deadline)
  const isOverdue = deadline < new Date() && status !== 'completed'

  return (
    <Card
      onClick={onClick}
      hover={!!onClick}
      className={className}
    >
      <CardBody>
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {task.title}
            </h3>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                {taskTypeLabels[task.taskType]}
              </span>
              {subject && (
                <span className="text-sm text-gray-600 flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  {subject.name}
                </span>
              )}
            </div>
          </div>
          <StatusBadge status={status} />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>締切:</span>
            <DateDisplay date={deadline} format="absolute" />
            {isOverdue && (
              <span className="text-error-600 font-medium">（期限切れ）</span>
            )}
          </div>

          {task.requiredStudyAmount && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>必要時間: {task.requiredStudyAmount}</span>
            </div>
          )}

          {progress > 0 && (
            <div className="mt-3">
              <ProgressBar value={progress} showLabel size="sm" />
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  )
}

