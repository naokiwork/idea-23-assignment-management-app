'use client'

import React, { useState, useMemo } from 'react'
import { Container } from '@/components'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { LearningPatternChart } from '@/components/analytics/LearningPatternChart'
import { ImprovementSuggestions } from '@/components/analytics/ImprovementSuggestions'
import { analyzeLearningPattern } from '@/lib/utils/learningPatternAnalysis'
import { analyzeLearningHabit } from '@/lib/utils/learningHabitAnalysis'
import { generateImprovementSuggestions } from '@/lib/utils/improvementSuggestions'
import { getThisWeekRange, getThisMonthRange, getLastMonthRange } from '@/lib/utils/dateUtils'

export default function LearningPatternsPage() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'lastMonth' | 'all'>('month')

  const range = useMemo(() => {
    switch (timeRange) {
      case 'week':
        return getThisWeekRange()
      case 'month':
        return getThisMonthRange()
      case 'lastMonth':
        return getLastMonthRange()
      default:
        return undefined
    }
  }, [timeRange])

  const pattern = useMemo(() => analyzeLearningPattern(range), [range])
  const habit = useMemo(() => analyzeLearningHabit(range), [range])
  const suggestions = useMemo(
    () => generateImprovementSuggestions(pattern, habit),
    [pattern, habit]
  )

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60)
    const mins = Math.round(minutes % 60)
    return `${hours}時間${mins}分`
  }

  return (
    <Container className="py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">学習パターン分析</h1>
        
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">期間:</label>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as typeof timeRange)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="week">今週</option>
            <option value="month">今月</option>
            <option value="lastMonth">先月</option>
            <option value="all">すべて</option>
          </select>
        </div>
      </div>

      <div className="space-y-6">
        {/* 統計サマリー */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardBody>
              <p className="text-sm text-gray-600 mb-1">総学習時間</p>
              <p className="text-2xl font-bold text-gray-900">{formatTime(pattern.totalStudyTime)}</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <p className="text-sm text-gray-600 mb-1">平均学習時間</p>
              <p className="text-2xl font-bold text-gray-900">{formatTime(pattern.averageStudyTime)}</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <p className="text-sm text-gray-600 mb-1">学習日数</p>
              <p className="text-2xl font-bold text-gray-900">{pattern.studyDays}日</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <p className="text-sm text-gray-600 mb-1">学習頻度</p>
              <p className="text-2xl font-bold text-gray-900">{pattern.studyFrequency.toFixed(1)}日/週</p>
            </CardBody>
          </Card>
        </div>

        {/* 学習習慣サマリー */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardBody>
              <p className="text-sm text-gray-600 mb-1">連続学習日数</p>
              <p className="text-2xl font-bold text-gray-900">{habit.studyStreak}日</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <p className="text-sm text-gray-600 mb-1">最長連続学習日数</p>
              <p className="text-2xl font-bold text-gray-900">{habit.longestStreak}日</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <p className="text-sm text-gray-600 mb-1">平均セッション時間</p>
              <p className="text-2xl font-bold text-gray-900">{formatTime(habit.averageSessionLength)}</p>
            </CardBody>
          </Card>
        </div>

        {/* グラフ */}
        <LearningPatternChart pattern={pattern} />

        {/* 改善提案 */}
        <ImprovementSuggestions suggestions={suggestions} />
      </div>
    </Container>
  )
}

