'use client'

import React from 'react'
import { Card, CardBody } from '../ui/Card'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { CheckCircle, XCircle, Target } from 'lucide-react'
import type { GoalSuggestion } from '@/lib/utils/goalSuggestionAlgorithm'
import { acceptGoalSuggestion, rejectGoalSuggestion } from '@/lib/api/goalSuggestions'
import { useToast } from '../ui/Toast'

interface GoalSuggestionProps {
  suggestion: GoalSuggestion
  onAction?: () => void
}

const priorityColors = {
  high: 'error',
  medium: 'warning',
  low: 'info',
} as const

const priorityLabels = {
  high: '高',
  medium: '中',
  low: '低',
}

const categoryLabels = {
  studyTime: '学習時間',
  completionRate: '完了率',
  frequency: '学習頻度',
  subject: '科目',
  consistency: '継続性',
}

export const GoalSuggestionCard: React.FC<GoalSuggestionProps> = ({ suggestion, onAction }) => {
  const { showToast } = useToast()

  const handleAccept = () => {
    acceptGoalSuggestion(suggestion)
    showToast('目標提案を承認しました', 'success')
    onAction?.()
  }

  const handleReject = () => {
    rejectGoalSuggestion(suggestion)
    showToast('目標提案を却下しました', 'success')
    onAction?.()
  }

  return (
    <Card>
      <CardBody>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3 flex-1">
            <Target className="h-5 w-5 text-primary-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-base font-medium text-gray-900 mb-1">{suggestion.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{suggestion.description}</p>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant={priorityColors[suggestion.priority]} size="sm">
                  {priorityLabels[suggestion.priority]}
                </Badge>
                <Badge variant="default" size="sm">
                  {categoryLabels[suggestion.category]}
                </Badge>
                {suggestion.currentValue !== undefined && suggestion.targetValue !== undefined && (
                  <span className="text-xs text-gray-500">
                    現在: {suggestion.currentValue}{suggestion.unit} → 目標: {suggestion.targetValue}{suggestion.unit}
                  </span>
                )}
              </div>
              {suggestion.reason && (
                <p className="text-xs text-gray-500 mt-2">{suggestion.reason}</p>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2 pt-3 border-t border-gray-200">
          <Button variant="primary" size="sm" onClick={handleAccept}>
            <CheckCircle className="h-4 w-4 mr-2" />
            承認
          </Button>
          <Button variant="outline" size="sm" onClick={handleReject}>
            <XCircle className="h-4 w-4 mr-2" />
            却下
          </Button>
        </div>
      </CardBody>
    </Card>
  )
}


