'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardBody, CardHeader } from '../ui/Card'
import { Select } from '../ui'
import { GoalSuggestionCard } from './GoalSuggestion'
import { getGoalSuggestions } from '@/lib/api/goalSuggestions'
import { generateGoalSuggestions } from '@/lib/utils/goalSuggestionAlgorithm'
import { getThisWeekRange, getThisMonthRange, getLastMonthRange } from '@/lib/utils/dateUtils'
import type { GoalSuggestion } from '@/lib/utils/goalSuggestionAlgorithm'

export const GoalSuggestionsList: React.FC = () => {
  const [suggestions, setSuggestions] = useState<GoalSuggestion[]>([])
  const [periodType, setPeriodType] = useState<'week' | 'month' | 'lastMonth' | 'all'>('month')

  useEffect(() => {
    loadSuggestions()
  }, [periodType])

  const loadSuggestions = () => {
    let timeRange: { start: Date; end: Date } | undefined
    
    switch (periodType) {
      case 'week':
        timeRange = getThisWeekRange()
        break
      case 'month':
        timeRange = getThisMonthRange()
        break
      case 'lastMonth':
        timeRange = getLastMonthRange()
        break
      default:
        timeRange = undefined
    }

    // 保存された提案を取得
    const saved = getGoalSuggestions()
    
    // 新しい提案を生成（保存されていない場合）
    if (saved.length === 0) {
      const newSuggestions = generateGoalSuggestions(timeRange)
      setSuggestions(newSuggestions)
    } else {
      setSuggestions(saved)
    }
  }

  const handleAction = () => {
    loadSuggestions()
  }

  if (suggestions.length === 0) {
    return (
      <Card>
        <CardBody>
          <p className="text-gray-500 text-center py-8">目標提案がありません</p>
        </CardBody>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">学習目標の提案</h2>
          <Select
            value={periodType}
            onChange={(e) => setPeriodType(e.target.value as typeof periodType)}
            options={[
              { value: 'week', label: '今週' },
              { value: 'month', label: '今月' },
              { value: 'lastMonth', label: '先月' },
              { value: 'all', label: 'すべて' },
            ]}
            className="w-32"
          />
        </div>
      </CardHeader>
      <CardBody>
        <div className="space-y-4">
          {suggestions.map((suggestion) => (
            <GoalSuggestionCard
              key={suggestion.id}
              suggestion={suggestion}
              onAction={handleAction}
            />
          ))}
        </div>
      </CardBody>
    </Card>
  )
}


