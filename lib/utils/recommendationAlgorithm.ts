/**
 * 推薦アルゴリズム
 * 
 * 注意: この実装は基本構造のみです。
 * 実際のAI推薦機能を実装するには、外部AIサービス（OpenAI、Claudeなど）との統合が必要です。
 */

import type { LearningResource, Task, Subject } from '../types'
import { getAllLearningResources } from '../api/learningResources'
import { getAllTasks } from '../api/tasks'
import { getAllSubjects } from '../api/subjects'

export interface Recommendation {
  resource: LearningResource
  score: number
  reason: string
}

/**
 * ルールベースの推薦を生成
 */
export function recommendResources(
  taskId: string,
  limit: number = 5
): Recommendation[] {
  const task = getAllTasks().find((t) => t.id === taskId)
  if (!task) {
    return []
  }

  const allResources = getAllLearningResources()
  const subjects = getAllSubjects()
  const subjectMap = new Map(subjects.map((s) => [s.id, s]))

  // 推薦スコアを計算
  const recommendations: Recommendation[] = allResources.map((resource) => {
    let score = 0
    const reasons: string[] = []

    // 科目マッチング
    if (resource.subjectIds?.includes(task.subjectId)) {
      score += 50
      const subjectName = subjectMap.get(task.subjectId)?.name || ''
      reasons.push(`${subjectName}に関連するリソース`)
    }

    // タスク種別マッチング
    if (resource.taskTypeIds?.includes(task.taskType)) {
      score += 30
      const taskTypeLabel = getTaskTypeLabel(task.taskType)
      reasons.push(`${taskTypeLabel}に適したリソース`)
    }

    // 評価による加点
    if (resource.rating) {
      score += resource.rating * 4 // 5段階評価を20点満点に変換
      reasons.push(`評価: ${resource.rating}/5`)
    }

    // 新しさによる加点（作成から30日以内）
    const createdAt = new Date(resource.createdAt)
    const daysSinceCreation = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
    if (daysSinceCreation <= 30) {
      score += 10
      reasons.push('新しいリソース')
    }

    return {
      resource,
      score,
      reason: reasons.join('、'),
    }
  })

  // スコアでソートして上位を返す
  return recommendations
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

/**
 * タスク種別のラベルを取得
 */
function getTaskTypeLabel(taskType: string): string {
  const labels: Record<string, string> = {
    preparation: '予習',
    review: '復習',
    assignment: '課題',
    exam_study: 'テスト勉強',
  }
  return labels[taskType] || taskType
}

/**
 * AI推薦を生成（将来の拡張用）
 * 
 * 現在はルールベースの推薦のみを実装しています。
 * 実際のAI推薦機能を実装するには、外部AIサービスとの統合が必要です。
 */
export async function recommendResourcesWithAI(
  taskId: string,
  limit: number = 5
): Promise<Recommendation[]> {
  // 将来の実装: AIサービスとの統合
  // 例: const response = await openai.chat.completions.create({...})
  // 例: const response = await anthropic.messages.create({...})
  
  // 現在はルールベースの推薦を返す
  return recommendResources(taskId, limit)
}

