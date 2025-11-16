'use client'

import React from 'react'
import { Card, CardBody, CardFooter } from './ui/Card'
import { Badge } from './ui/Badge'
import { GraduationCap, User, Calendar } from 'lucide-react'
import type { Subject, Timetable } from '@/lib/types'

export interface SubjectCardProps {
  subject: Subject
  timetables?: Timetable[]
  taskCount?: number
  onClick?: () => void
  className?: string
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

export const SubjectCard: React.FC<SubjectCardProps> = ({
  subject,
  timetables = [],
  taskCount,
  onClick,
  className = '',
}) => {
  return (
    <Card
      onClick={onClick}
      hover={!!onClick}
      className={className}
    >
      <CardBody>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              {subject.name}
            </h3>
          </div>
        </div>

        <div className="space-y-2">
          {subject.teacher && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>{subject.teacher}</span>
            </div>
          )}

          {(subject.year || subject.semester) && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>
                {subject.year && subject.semester
                  ? `${subject.year} ${subject.semester}`
                  : subject.year || subject.semester}
              </span>
            </div>
          )}

          {timetables.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {timetables.map((tt) => (
                <Badge key={tt.id} variant="info" size="sm">
                  {dayOfWeekLabels[tt.dayOfWeek]} {tt.period}限
                </Badge>
              ))}
            </div>
          )}

          {taskCount !== undefined && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <span className="text-sm text-gray-600">
                タスク数: <span className="font-medium text-gray-900">{taskCount}</span>
              </span>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  )
}

