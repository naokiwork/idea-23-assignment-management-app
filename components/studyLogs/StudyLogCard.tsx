'use client'

import React from 'react'
import { Card, CardBody } from '../ui/Card'
import { Button } from '../ui/Button'
import { DateDisplay } from '../ui/DateDisplay'
import { calculateDuration, formatDuration } from '@/lib/utils/timeCalculation'
import { Clock, Edit, Trash2, BookOpen } from 'lucide-react'
import type { StudyLog, Task, Subject } from '@/lib/types'

export interface StudyLogCardProps {
  log: StudyLog
  task?: Task
  subject?: Subject
  onEdit?: (log: StudyLog) => void
  onDelete?: (logId: string) => void
  className?: string
}

export const StudyLogCard: React.FC<StudyLogCardProps> = ({
  log,
  task,
  subject,
  onEdit,
  onDelete,
  className = '',
}) => {
  const duration = log.startTime && log.endTime
    ? formatDuration(calculateDuration(log.startTime, log.endTime))
    : null

  const handleEdit = () => {
    onEdit?.(log)
  }

  const handleDelete = () => {
    if (confirm('この学習ログを削除しますか？')) {
      onDelete?.(log.id)
    }
  }

  return (
    <Card className={className}>
      <CardBody>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <DateDisplay date={log.date} format="absolute" />
              {log.startTime && log.endTime && (
                <span className="text-sm text-gray-600">
                  {log.startTime} - {log.endTime}
                </span>
              )}
            </div>

            {duration && (
              <div className="mb-2">
                <span className="text-sm font-medium text-primary-700 bg-primary-50 px-2 py-1 rounded">
                  学習時間: {duration}
                </span>
              </div>
            )}

            {task && (
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-900">{task.title}</span>
                {subject && (
                  <span className="text-sm text-gray-600">({subject.name})</span>
                )}
              </div>
            )}

            {log.content && (
              <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">
                {log.content}
              </p>
            )}

            {log.progressAmount && (
              <p className="text-sm text-gray-600 mt-2">
                進捗: {log.progressAmount}
              </p>
            )}
          </div>

          {(onEdit || onDelete) && (
            <div className="flex gap-2 ml-4">
              {onEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEdit}
                  aria-label="編集"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDelete}
                  aria-label="削除"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  )
}

