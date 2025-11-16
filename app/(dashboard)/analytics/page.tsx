'use client'

import React, { useState, useMemo } from 'react'
import { Container } from '@/components'
import { Select } from '@/components/ui'
import { CompletedTasksChart } from '@/components/analytics/CompletedTasksChart'
import { SubjectTimeChart } from '@/components/analytics/SubjectTimeChart'
import { MonthlyProgressChart } from '@/components/analytics/MonthlyProgressChart'
import { EarlyCompletionStats } from '@/components/analytics/EarlyCompletionStats'
import { StatsSummary } from '@/components/analytics/StatsSummary'
import { getCompletedTasksByDateRange, getCompletedTasksByWeek, getCompletedTasksByMonth } from '@/lib/utils/taskAnalytics'
import { getStudyTimeBySubject } from '@/lib/utils/studyTimeAnalytics'
import { getProgressRateByMonth } from '@/lib/utils/progressAnalytics'
import { getEarlyCompletionStats } from '@/lib/utils/efficiencyAnalytics'
import { loadData } from '@/lib/storage'
import type { Task } from '@/lib/types'

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('month')
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>(() => {
    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth() - 2, 1)
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    return { start, end }
  })

  const data = loadData()
  const tasks = data?.tasks || []

  // 完了タスク数推移データ
  const completedTasksData = useMemo(() => {
    if (period === 'day') {
      return getCompletedTasksByDateRange(dateRange.start, dateRange.end)
    } else if (period === 'week') {
      return getCompletedTasksByWeek(dateRange.start, dateRange.end)
    } else {
      return getCompletedTasksByMonth(dateRange.start, dateRange.end)
    }
  }, [period, dateRange])

  // 科目別学習時間データ
  const subjectTimeData = useMemo(() => {
    return getStudyTimeBySubject(dateRange.start, dateRange.end)
  }, [dateRange])

  // 月別進捗率データ
  const monthlyProgressData = useMemo(() => {
    return getProgressRateByMonth(dateRange.start, dateRange.end)
  }, [dateRange])

  // 早期完了統計
  const earlyCompletionStats = useMemo(() => {
    return getEarlyCompletionStats(tasks)
  }, [tasks])

  return (
    <Container className="py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">グラフ・分析</h1>

        <div className="mb-6">
          <Select
            label="期間"
            value={period}
            onChange={(e) => setPeriod(e.target.value as 'day' | 'week' | 'month')}
            options={[
              { value: 'day', label: '日別' },
              { value: 'week', label: '週別' },
              { value: 'month', label: '月別' },
            ]}
          />
        </div>

        <div className="space-y-8">
          {/* 統計サマリー */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              統計サマリー
            </h2>
            <StatsSummary startDate={dateRange.start} endDate={dateRange.end} />
          </section>

          {/* 早期完了統計 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              早期完了統計
            </h2>
            <EarlyCompletionStats {...earlyCompletionStats} />
          </section>

          {/* 完了タスク数推移 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              完了タスク数推移
            </h2>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <CompletedTasksChart data={completedTasksData} period={period} />
            </div>
          </section>

          {/* 科目別学習時間 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              科目別学習時間
            </h2>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <SubjectTimeChart data={subjectTimeData} />
            </div>
          </section>

          {/* 月別進捗率 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              月別進捗率
            </h2>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <MonthlyProgressChart data={monthlyProgressData} />
            </div>
          </section>
        </div>
      </Container>
  )
}

