'use client'

import React from 'react'
import { Card, CardBody } from '../ui/Card'
import { Clock, CheckCircle2, TrendingUp, Award } from 'lucide-react'
import { formatStudyTime } from '@/lib/utils/studyTimeAggregation'
import { getAllStudyLogs } from '@/lib/api/studyLogs'
import { calculateStudyTime } from '@/lib/utils/studyTimeAggregation'
import { loadData } from '@/lib/storage'
import { getEarlyCompletionStats } from '@/lib/utils/efficiencyAnalytics'
import { getProgressRateByMonth } from '@/lib/utils/progressAnalytics'

export interface StatsSummaryProps {
  startDate: Date
  endDate: Date
}

export const StatsSummary: React.FC<StatsSummaryProps> = ({
  startDate,
  endDate,
}) => {
  const data = loadData()
  const tasks = data?.tasks || []
  const allLogs = getAllStudyLogs()

  // 期間でフィルタされたログ
  const filteredLogs = allLogs.filter((log) => {
    const logDate = new Date(log.date)
    return logDate >= startDate && logDate <= endDate
  })

  // 総学習時間
  const totalStudyTime = calculateStudyTime(filteredLogs)

  // 完了タスク数（簡易版：サブタスクがすべて完了しているタスク）
  const completedTasks = tasks.filter((task) => {
    const subtasks = data?.subtasks.filter((st) => st.parentTaskId === task.id) || []
    if (subtasks.length === 0) return false
    return subtasks.every((st) => st.status === 'completed')
  }).length

  // 平均進捗率
  const monthlyProgress = getProgressRateByMonth(startDate, endDate)
  const progressValues = Object.values(monthlyProgress)
  const averageProgress = progressValues.length > 0
    ? progressValues.reduce((sum, val) => sum + val, 0) / progressValues.length
    : 0

  // 早期完了タスク数
  const earlyCompletionStats = getEarlyCompletionStats(tasks)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardBody>
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-5 w-5 text-primary-600" />
            <h3 className="text-sm font-medium text-gray-700">総学習時間</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {formatStudyTime(totalStudyTime)}
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="h-5 w-5 text-success-600" />
            <h3 className="text-sm font-medium text-gray-700">完了タスク数</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">{completedTasks}件</p>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-info-600" />
            <h3 className="text-sm font-medium text-gray-700">平均進捗率</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {Math.round(averageProgress)}%
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <div className="flex items-center gap-2 mb-2">
            <Award className="h-5 w-5 text-warning-600" />
            <h3 className="text-sm font-medium text-gray-700">早期完了タスク数</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">{earlyCompletionStats.count}件</p>
        </CardBody>
      </Card>
    </div>
  )
}

