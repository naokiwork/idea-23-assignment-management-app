'use client'

import React from 'react'
import { Button } from '../ui/Button'
import { Plus, FileText } from 'lucide-react'
import { useRouter } from 'next/navigation'

export interface QuickActionsProps {
  onAddTask?: () => void
  onAddLog?: () => void
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onAddTask,
  onAddLog,
}) => {
  const router = useRouter()

  return (
    <div className="flex flex-wrap gap-3">
      <Button
        variant="primary"
        onClick={onAddTask || (() => router.push('/tasks'))}
      >
        <Plus className="h-5 w-5 mr-2" />
        新しいタスクを追加
      </Button>
      <Button
        variant="outline"
        onClick={onAddLog || (() => router.push('/logs'))}
      >
        <FileText className="h-5 w-5 mr-2" />
        学習ログを記録
      </Button>
    </div>
  )
}

