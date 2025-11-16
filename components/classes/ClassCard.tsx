'use client'

import React from 'react'
import { Card, CardBody } from '../ui/Card'
import { Calendar, Clock, BookOpen } from 'lucide-react'
import type { Class, Subject } from '@/lib/types'
import { DateDisplay } from '../ui/DateDisplay'

export interface ClassCardProps {
  classData: Class
  subject?: Subject
  onClick?: () => void
  className?: string
}

export const ClassCard: React.FC<ClassCardProps> = ({
  classData,
  subject,
  onClick,
  className = '',
}) => {
  return (
    <Card onClick={onClick} hover={!!onClick} className={className}>
      <CardBody>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{classData.title}</h3>

            {subject && (
              <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
                <BookOpen className="h-4 w-4" />
                <span>{subject.name}</span>
              </div>
            )}

            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <DateDisplay date={classData.date} />
              </div>
              {classData.time && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{classData.time}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

