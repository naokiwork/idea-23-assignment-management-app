'use client'

import React from 'react'
import { Card, CardBody, CardHeader } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Lightbulb, AlertTriangle, TrendingUp, Award } from 'lucide-react'
import type { Insight } from '@/lib/utils/insightsGenerator'

interface InsightsPanelProps {
  insights: Insight[]
}

const typeIcons = {
  achievement: Award,
  warning: AlertTriangle,
  suggestion: Lightbulb,
  trend: TrendingUp,
}

const typeLabels = {
  achievement: '達成',
  warning: '警告',
  suggestion: '提案',
  trend: 'トレンド',
}

const priorityColors = {
  low: 'info',
  medium: 'warning',
  high: 'error',
}

export const InsightsPanel: React.FC<InsightsPanelProps> = ({ insights }) => {
  if (insights.length === 0) {
    return (
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">インサイト</h3>
        </CardHeader>
        <CardBody>
          <p className="text-gray-500 text-center py-4">現在、インサイトはありません。</p>
        </CardBody>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900">インサイト</h3>
      </CardHeader>
      <CardBody className="space-y-3">
        {insights.map((insight) => {
          const Icon = typeIcons[insight.type]
          return (
            <div
              key={insight.id}
              className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors"
            >
              <div className="flex items-start gap-3">
                <Icon className={`h-5 w-5 mt-0.5 ${
                  insight.type === 'achievement' ? 'text-green-500' :
                  insight.type === 'warning' ? 'text-red-500' :
                  insight.type === 'suggestion' ? 'text-yellow-500' :
                  'text-blue-500'
                }`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-base font-medium text-gray-900">{insight.title}</h4>
                    <div className="flex items-center gap-2">
                      <Badge variant={priorityColors[insight.priority] as any} size="sm">
                        {priorityColors[insight.priority] === 'error' ? '高' :
                         priorityColors[insight.priority] === 'warning' ? '中' : '低'}
                      </Badge>
                      <Badge variant="default" size="sm">
                        {typeLabels[insight.type]}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{insight.description}</p>
                  {insight.action && (
                    <p className="text-xs text-primary-600 mt-2">{insight.action}</p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </CardBody>
    </Card>
  )
}

