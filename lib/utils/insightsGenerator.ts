/**
 * インサイト生成
 */

import { calculateRealtimeStatistics, type RealtimeStatistics } from './realtimeStatistics'
import { analyzeLearningData } from './learningDataAnalysis'
import { generateImprovementSuggestions } from './improvementSuggestions'
import { analyzeLearningPattern } from './learningPatternAnalysis'
import { analyzeLearningHabit } from './learningHabitAnalysis'
import { formatDuration } from './timeCalculation'

export interface Insight {
  id: string
  type: 'achievement' | 'warning' | 'suggestion' | 'trend'
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
  action?: string
}

/**
 * インサイトを生成
 */
export function generateInsights(): Insight[] {
  const stats = calculateRealtimeStatistics()
  const learningData = analyzeLearningData()
  const pattern = analyzeLearningPattern()
  const habit = analyzeLearningHabit()
  const suggestions = generateImprovementSuggestions(pattern, habit)

  const insights: Insight[] = []
  let insightIdCounter = 1

  // 1. 達成インサイト
  if (stats.todayStudyTime > 60) {
    insights.push({
      id: `insight-${insightIdCounter++}`,
      type: 'achievement',
      title: '今日はよく学習しました！',
      description: `今日は${formatDuration(stats.todayStudyTime)}の学習を記録しました。素晴らしい努力です！`,
      priority: 'low',
    })
  }

  if (stats.completedTasksToday > 0) {
    insights.push({
      id: `insight-${insightIdCounter++}`,
      type: 'achievement',
      title: 'タスクを完了しました',
      description: `今日は${stats.completedTasksToday}件のタスクを完了しました。`,
      priority: 'low',
    })
  }

  // 2. 警告インサイト
  if (stats.overdueTasks > 0) {
    insights.push({
      id: `insight-${insightIdCounter++}`,
      type: 'warning',
      title: '期限切れタスクがあります',
      description: `${stats.overdueTasks}件のタスクが期限を過ぎています。早めに対応しましょう。`,
      priority: 'high',
      action: '期限切れタスクを確認',
    })
  }

  if (stats.pendingTasks > 10) {
    insights.push({
      id: `insight-${insightIdCounter++}`,
      type: 'warning',
      title: '未完了タスクが多めです',
      description: `現在${stats.pendingTasks}件の未完了タスクがあります。優先順位をつけて進めましょう。`,
      priority: 'medium',
    })
  }

  // 3. トレンドインサイト
  if (stats.weekTrend > 10) {
    insights.push({
      id: `insight-${insightIdCounter++}`,
      type: 'trend',
      title: '学習時間が増加しています',
      description: `今週の学習時間は前週より${stats.weekTrend.toFixed(1)}%増加しています。`,
      priority: 'low',
    })
  } else if (stats.weekTrend < -10) {
    insights.push({
      id: `insight-${insightIdCounter++}`,
      type: 'warning',
      title: '学習時間が減少しています',
      description: `今週の学習時間は前週より${Math.abs(stats.weekTrend).toFixed(1)}%減少しています。`,
      priority: 'medium',
    })
  }

  if (stats.monthTrend > 10) {
    insights.push({
      id: `insight-${insightIdCounter++}`,
      type: 'trend',
      title: '今月の学習時間が増加しています',
      description: `今月の学習時間は先月より${stats.monthTrend.toFixed(1)}%増加しています。`,
      priority: 'low',
    })
  }

  // 4. 改善提案インサイト（上位3件）
  const topSuggestions = suggestions.slice(0, 3)
  topSuggestions.forEach(suggestion => {
    insights.push({
      id: `insight-${insightIdCounter++}`,
      type: 'suggestion',
      title: suggestion.title,
      description: suggestion.description,
      priority: suggestion.priority,
    })
  })

  // 5. 学習習慣インサイト
  if (habit.studyStreak >= 7) {
    insights.push({
      id: `insight-${insightIdCounter++}`,
      type: 'achievement',
      title: '連続学習記録を更新中！',
      description: `${habit.studyStreak}日連続で学習しています。素晴らしい継続力です！`,
      priority: 'low',
    })
  }

  if (learningData.completionRate > 80) {
    insights.push({
      id: `insight-${insightIdCounter++}`,
      type: 'achievement',
      title: '高い完了率を維持しています',
      description: `タスク完了率が${learningData.completionRate.toFixed(1)}%です。`,
      priority: 'low',
    })
  }

  return insights.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    return priorityOrder[b.priority] - priorityOrder[a.priority]
  })
}

