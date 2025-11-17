/**
 * 改善提案生成
 */

import type { LearningPattern } from './learningPatternAnalysis'
import type { LearningHabit } from './learningHabitAnalysis'

export interface ImprovementSuggestion {
  id: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  category: 'time' | 'frequency' | 'consistency' | 'balance' | 'efficiency'
}

/**
 * 改善提案を生成
 */
export function generateImprovementSuggestions(
  pattern: LearningPattern,
  habit: LearningHabit
): ImprovementSuggestion[] {
  const suggestions: ImprovementSuggestion[] = []

  // 学習頻度の提案
  if (pattern.studyFrequency < 3) {
    suggestions.push({
      id: 'freq-1',
      title: '学習頻度を増やす',
      description: `現在の学習頻度は週${pattern.studyFrequency.toFixed(1)}日です。週3日以上を目標にすると学習効果が向上します。`,
      priority: 'high',
      category: 'frequency',
    })
  }

  // 学習時間の提案
  if (pattern.averageStudyTime < 30) {
    suggestions.push({
      id: 'time-1',
      title: '1日の学習時間を増やす',
      description: `現在の1日平均学習時間は${Math.round(pattern.averageStudyTime)}分です。30分以上を目標にしましょう。`,
      priority: 'medium',
      category: 'time',
    })
  }

  // 連続学習の提案
  if (habit.studyStreak < 3) {
    suggestions.push({
      id: 'consistency-1',
      title: '連続学習日数を増やす',
      description: `現在の連続学習日数は${habit.studyStreak}日です。3日以上続けると学習習慣が定着しやすくなります。`,
      priority: 'high',
      category: 'consistency',
    })
  }

  // 科目バランスの提案
  const subjectEntries = Object.entries(pattern.subjectDistribution)
  if (subjectEntries.length > 0) {
    const totalTime = Object.values(pattern.subjectDistribution).reduce((a, b) => a + b, 0)
    const averageTime = totalTime / subjectEntries.length
    const unbalancedSubjects = subjectEntries.filter(
      ([, time]) => time < averageTime * 0.5
    )

    if (unbalancedSubjects.length > 0) {
      suggestions.push({
        id: 'balance-1',
        title: '科目の学習時間のバランスを改善',
        description: `${unbalancedSubjects.map(([name]) => name).join('、')}の学習時間が少ないです。バランスよく学習しましょう。`,
        priority: 'medium',
        category: 'balance',
      })
    }
  }

  // 時間帯の提案
  const timeEntries = Object.entries(habit.timeOfDayDistribution)
  if (timeEntries.length > 0) {
    const maxTimeEntry = timeEntries.reduce((a, b) => (a[1] > b[1] ? a : b))
    const totalTime = Object.values(habit.timeOfDayDistribution).reduce((a, b) => a + b, 0)
    
    if (totalTime > 0 && maxTimeEntry[1] / totalTime > 0.7) {
      suggestions.push({
        id: 'time-2',
        title: '学習時間帯を分散する',
        description: `学習時間が${maxTimeEntry[0]}に集中しています。他の時間帯にも学習を分散すると効率的です。`,
        priority: 'low',
        category: 'time',
      })
    }
  }

  // セッション時間の提案
  if (habit.averageSessionLength < 20) {
    suggestions.push({
      id: 'efficiency-1',
      title: '1セッションの学習時間を延ばす',
      description: `現在の平均セッション時間は${Math.round(habit.averageSessionLength)}分です。20分以上続けると集中力が向上します。`,
      priority: 'medium',
      category: 'efficiency',
    })
  } else if (habit.averageSessionLength > 120) {
    suggestions.push({
      id: 'efficiency-2',
      title: '適度な休憩を取る',
      description: `現在の平均セッション時間は${Math.round(habit.averageSessionLength)}分です。長時間の学習は疲労を招くため、適度な休憩を取りましょう。`,
      priority: 'low',
      category: 'efficiency',
    })
  }

  // 優先度でソート
  const priorityOrder = { high: 0, medium: 1, low: 2 }
  suggestions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])

  return suggestions
}

