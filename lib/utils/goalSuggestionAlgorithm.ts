/**
 * 目標提案アルゴリズム
 * 
 * 注意: この実装は基本構造のみです。
 * 実際のAI目標提案機能を実装するには、外部AIサービス（OpenAI、Claudeなど）との統合が必要です。
 */

import type { LearningDataAnalysis } from './learningDataAnalysis'
import { analyzeLearningData } from './learningDataAnalysis'
import { getAllSubjects } from '../api/subjects'

export interface GoalSuggestion {
  id: string
  title: string
  description: string
  category: 'studyTime' | 'completionRate' | 'frequency' | 'subject' | 'consistency'
  priority: 'low' | 'medium' | 'high'
  targetValue?: number
  currentValue?: number
  unit?: string
  reason: string
  createdAt: string // ISO 8601形式の日付文字列
}

/**
 * ルールベースの目標提案を生成
 */
export function generateGoalSuggestions(
  timeRange?: { start: Date; end: Date }
): GoalSuggestion[] {
  const analysis = analyzeLearningData(timeRange)
  const subjects = getAllSubjects()
  const suggestions: GoalSuggestion[] = []

  // 学習時間の提案
  if (analysis.averageStudyTimePerDay < 60) {
    suggestions.push({
      id: `goal-${Date.now()}-1`,
      title: '1日の学習時間を増やす',
      description: `現在の1日平均学習時間は${Math.round(analysis.averageStudyTimePerDay)}分です。60分以上を目標にしましょう。`,
      category: 'studyTime',
      priority: 'high',
      targetValue: 60,
      currentValue: Math.round(analysis.averageStudyTimePerDay),
      unit: '分',
      reason: '学習時間が少ないため、学習時間の増加を提案します。',
      createdAt: new Date().toISOString(),
    })
  }

  // 学習頻度の提案
  if (analysis.studyFrequency < 3) {
    suggestions.push({
      id: `goal-${Date.now()}-2`,
      title: '学習頻度を増やす',
      description: `現在の学習頻度は週${analysis.studyFrequency.toFixed(1)}日です。週3日以上を目標にしましょう。`,
      category: 'frequency',
      priority: 'high',
      targetValue: 3,
      currentValue: analysis.studyFrequency,
      unit: '日/週',
      reason: '学習頻度が低いため、学習頻度の増加を提案します。',
      createdAt: new Date().toISOString(),
    })
  }

  // 完了率の提案
  if (analysis.completionRate < 70) {
    suggestions.push({
      id: `goal-${Date.now()}-3`,
      title: 'タスク完了率を向上させる',
      description: `現在のタスク完了率は${analysis.completionRate.toFixed(1)}%です。70%以上を目標にしましょう。`,
      category: 'completionRate',
      priority: 'medium',
      targetValue: 70,
      currentValue: analysis.completionRate,
      unit: '%',
      reason: 'タスク完了率が低いため、完了率の向上を提案します。',
      createdAt: new Date().toISOString(),
    })
  }

  // 連続学習の提案
  if (analysis.learningStreak < 3) {
    suggestions.push({
      id: `goal-${Date.now()}-4`,
      title: '連続学習日数を増やす',
      description: `現在の連続学習日数は${analysis.learningStreak}日です。3日以上続けると学習習慣が定着しやすくなります。`,
      category: 'consistency',
      priority: 'medium',
      targetValue: 3,
      currentValue: analysis.learningStreak,
      unit: '日',
      reason: '連続学習日数が少ないため、継続性の向上を提案します。',
      createdAt: new Date().toISOString(),
    })
  }

  // 科目別の提案
  const lowPerformanceSubjects = analysis.subjectPerformance.filter(
    (perf) => perf.taskCompletionRate < 50 || perf.averageStudyTime < 30
  )

  for (const subject of lowPerformanceSubjects.slice(0, 3)) {
    suggestions.push({
      id: `goal-${Date.now()}-${subject.subjectId}`,
      title: `${subject.subjectName}の学習を強化する`,
      description: `${subject.subjectName}の完了率は${subject.taskCompletionRate.toFixed(1)}%です。学習時間を増やして完了率を向上させましょう。`,
      category: 'subject',
      priority: 'medium',
      targetValue: 50,
      currentValue: subject.taskCompletionRate,
      unit: '%',
      reason: `${subject.subjectName}のパフォーマンスが低いため、学習の強化を提案します。`,
      createdAt: new Date().toISOString(),
    })
  }

  // 優先度でソート
  const priorityOrder = { high: 0, medium: 1, low: 2 }
  suggestions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])

  return suggestions
}

/**
 * AI目標提案を生成（将来の拡張用）
 * 
 * 現在はルールベースの提案のみを実装しています。
 * 実際のAI目標提案機能を実装するには、外部AIサービスとの統合が必要です。
 */
export async function generateGoalSuggestionsWithAI(
  timeRange?: { start: Date; end: Date }
): Promise<GoalSuggestion[]> {
  // 将来の実装: AIサービスとの統合
  // 例: const response = await openai.chat.completions.create({...})
  // 例: const response = await anthropic.messages.create({...})
  
  // 現在はルールベースの提案を返す
  return generateGoalSuggestions(timeRange)
}


