'use client'

import React from 'react'
import { Card, CardBody, CardHeader } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Lightbulb, AlertCircle, Info } from 'lucide-react'
import type { ImprovementSuggestion } from '@/lib/utils/improvementSuggestions'

interface ImprovementSuggestionsProps {
  suggestions: ImprovementSuggestion[]
}

const priorityConfig = {
  high: { color: 'red', icon: AlertCircle, label: '高' },
  medium: { color: 'yellow', icon: Info, label: '中' },
  low: { color: 'blue', icon: Info, label: '低' },
}

const categoryLabels = {
  time: '学習時間',
  frequency: '学習頻度',
  consistency: '継続性',
  balance: 'バランス',
  efficiency: '効率',
}

export const ImprovementSuggestions: React.FC<ImprovementSuggestionsProps> = ({
  suggestions,
}) => {
  if (suggestions.length === 0) {
    return (
      <Card>
        <CardBody>
          <div className="text-center py-8 text-gray-500">
            <Lightbulb className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>現在、改善提案はありません。良好な学習習慣を維持しています！</p>
          </div>
        </CardBody>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          改善提案
        </h2>
      </CardHeader>
      <CardBody>
        <div className="space-y-4">
          {suggestions.map((suggestion) => {
            const PriorityIcon = priorityConfig[suggestion.priority].icon
            const priorityColor = priorityConfig[suggestion.priority].color

            return (
              <div
                key={suggestion.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-base font-medium text-gray-900 flex items-center gap-2">
                    <PriorityIcon className={`h-5 w-5 ${priorityColor === 'red' ? 'text-red-500' : priorityColor === 'yellow' ? 'text-yellow-500' : 'text-blue-500'}`} />
                    {suggestion.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Badge variant={suggestion.priority === 'high' ? 'error' : suggestion.priority === 'medium' ? 'warning' : 'info'}>
                      {priorityConfig[suggestion.priority].label}
                    </Badge>
                    <Badge variant="default">
                      {categoryLabels[suggestion.category]}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-600 ml-7">{suggestion.description}</p>
              </div>
            )
          })}
        </div>
      </CardBody>
    </Card>
  )
}

