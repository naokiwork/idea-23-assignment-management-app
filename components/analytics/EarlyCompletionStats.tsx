'use client'

import React from 'react'
import { Card, CardBody } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { TrendingUp, Award } from 'lucide-react'

export interface EarlyCompletionStatsProps {
  average: number
  max: number
  min: number
  count: number
}

export const EarlyCompletionStats: React.FC<EarlyCompletionStatsProps> = ({
  average,
  max,
  min,
  count,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardBody>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-primary-600" />
            <h3 className="text-sm font-medium text-gray-700">平均早期完了日数</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {average.toFixed(1)}日
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <div className="flex items-center gap-2 mb-2">
            <Award className="h-5 w-5 text-success-600" />
            <h3 className="text-sm font-medium text-gray-700">最大早期完了日数</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">{max}日</p>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-sm font-medium text-gray-700">最小早期完了日数</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">{min}日</p>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-sm font-medium text-gray-700">早期完了タスク数</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">{count}件</p>
        </CardBody>
      </Card>
    </div>
  )
}

