'use client'

import React from 'react'
import { Badge, BadgeProps } from './Badge'
import { CheckCircle2, Clock, AlertCircle, XCircle } from 'lucide-react'

export type TaskStatus = 'completed' | 'in_progress' | 'not_started' | 'overdue'

export interface StatusBadgeProps extends Omit<BadgeProps, 'variant' | 'children'> {
  status: TaskStatus
  showIcon?: boolean
}

const statusConfig: Record<
  TaskStatus,
  { variant: BadgeProps['variant']; label: string; icon: React.ReactNode }
> = {
  completed: {
    variant: 'success',
    label: '完了',
    icon: <CheckCircle2 className="h-3 w-3" />,
  },
  in_progress: {
    variant: 'info',
    label: '進行中',
    icon: <Clock className="h-3 w-3" />,
  },
  not_started: {
    variant: 'default',
    label: '未着手',
    icon: <Clock className="h-3 w-3" />,
  },
  overdue: {
    variant: 'error',
    label: '期限切れ',
    icon: <AlertCircle className="h-3 w-3" />,
  },
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  showIcon = true,
  className = '',
  ...props
}) => {
  const config = statusConfig[status]

  return (
    <Badge variant={config.variant} className={className} {...props}>
      <span className="flex items-center gap-1">
        {showIcon && config.icon}
        {config.label}
      </span>
    </Badge>
  )
}

