'use client'

import React from 'react'
import { Card, CardBody, CardHeader } from '../ui/Card'
import { ProgressBar } from '../ui/ProgressBar'
import { formatStudyTime } from '@/lib/utils/studyTimeAggregation'
import { Calendar, Clock, CheckCircle2 } from 'lucide-react'

export interface ThisWeekSummaryProps {
  totalTasks: number
  completedTasks: number
  studyTime: number // 分単位
  subjectTaskCounts: Record<string, number>
  subjectNames: Record<string, string>
}

export const ThisWeekSummary: React.FC<ThisWeekSummaryProps> = ({
  totalTasks,
  completedTasks,
  studyTime,
  subjectTaskCounts,
  subjectNames,
}) => {
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          今週の状況
        </h2>
      </CardHeader>
      <CardBody>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">タスク進捗</span>
              <span className="text-sm text-gray-600">
                {completedTasks} / {totalTasks} 完了
              </span>
            </div>
            <ProgressBar value={completionRate} showLabel size="md" />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-success-600" />
              <span className="text-sm text-gray-700">
                完了: <span className="font-medium">{completedTasks}件</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary-600" />
              <span className="text-sm text-gray-700">
                学習時間: <span className="font-medium">{formatStudyTime(studyTime)}</span>
              </span>
            </div>
          </div>

          {Object.keys(subjectTaskCounts).length > 0 && (
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-2">科目別タスク数</h3>
              <div className="space-y-1">
                {Object.entries(subjectTaskCounts).map(([subjectId, count]) => (
                  <div key={subjectId} className="flex justify-between text-sm">
                    <span className="text-gray-600">{subjectNames[subjectId] || subjectId}</span>
                    <span className="font-medium text-gray-900">{count}件</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  )
}

