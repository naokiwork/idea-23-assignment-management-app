'use client'

import React from 'react'
import { Card, CardBody } from '../ui/Card'
import { ProgressBar } from '../ui/ProgressBar'
import { DaysRemaining } from './DaysRemaining'
import { GraduationCap, BookOpen } from 'lucide-react'
import type { Exam, Subject } from '@/lib/types'
import { getTotalTaskCount } from '@/lib/utils/examProgress'

export interface ExamCardProps {
  exam: Exam
  subject?: Subject
  progress?: number // 0-100
  onClick?: () => void
  className?: string
}

export const ExamCard: React.FC<ExamCardProps> = ({
  exam,
  subject,
  progress = 0,
  onClick,
  className = '',
}) => {
  return (
    <Card onClick={onClick} hover={!!onClick} className={className}>
      <CardBody>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <GraduationCap className="h-5 w-5 text-primary-600" />
              <h3 className="text-lg font-semibold text-gray-900">{exam.name}</h3>
            </div>

            {subject && (
              <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
                <BookOpen className="h-4 w-4" />
                <span>{subject.name}</span>
              </div>
            )}

            <div className="mb-3">
              <DaysRemaining examDate={exam.date} />
            </div>

            {exam.testRange && (
              <p className="text-sm text-gray-600 mb-3">範囲: {exam.testRange}</p>
            )}

            {progress > 0 && (
              <div className="mt-3">
                <ProgressBar value={progress} showLabel size="sm" />
              </div>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

