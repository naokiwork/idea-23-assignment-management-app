'use client'

import React from 'react'
import { Badge } from '../ui/Badge'
import { calculateDaysUntilExam, formatDaysRemaining, getUrgencyLevel } from '@/lib/utils/examUtils'
import { Calendar, AlertCircle } from 'lucide-react'

export interface DaysRemainingProps {
  examDate: Date | string
  className?: string
}

export const DaysRemaining: React.FC<DaysRemainingProps> = ({
  examDate,
  className = '',
}) => {
  const days = calculateDaysUntilExam(examDate)
  const urgency = getUrgencyLevel(days)
  const formatted = formatDaysRemaining(days)

  const variantMap: Record<ReturnType<typeof getUrgencyLevel>, 'success' | 'warning' | 'error' | 'default'> = {
    low: 'success',
    medium: 'warning',
    high: 'error',
    overdue: 'error',
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Calendar className="h-4 w-4 text-gray-500" />
      <Badge variant={variantMap[urgency]} size="md">
        {urgency === 'overdue' && <AlertCircle className="h-3 w-3 mr-1" />}
        {formatted}
      </Badge>
    </div>
  )
}

