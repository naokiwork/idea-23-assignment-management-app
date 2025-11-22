/**
 * 学習リソースCRUD関数
 * ローカルストレージを使用して学習リソースの作成・更新・削除・取得を行う
 */

import { loadData, saveData } from '../storage'
import { createInitialData } from '../initialData'
import type { LearningResource, BackupData } from '../types'

/**
 * IDを生成する（簡易版）
 */
function generateId(): string {
  return `lr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * データを取得・更新するヘルパー関数
 */
function updateData(updater: (data: BackupData) => BackupData): void {
  const data = loadData() || createInitialData()
  const updatedData = updater(data)
  saveData(updatedData)
}

/**
 * 学習リソースを作成
 */
export function createLearningResource(resource: Omit<LearningResource, 'id' | 'createdAt'>): LearningResource {
  const newResource: LearningResource = {
    ...resource,
    id: generateId(),
    createdAt: new Date().toISOString(),
  }

  updateData((data) => ({
    ...data,
    learningResources: [...(data.learningResources || []), newResource],
  }))

  return newResource
}

/**
 * 学習リソースを更新
 */
export function updateLearningResource(id: string, resource: Partial<LearningResource>): LearningResource {
  let updatedResource: LearningResource | null = null

  updateData((data) => {
    const resources = data.learningResources || []
    const index = resources.findIndex((lr) => lr.id === id)
    if (index === -1) {
      throw new Error(`学習リソースが見つかりません: ${id}`)
    }

    updatedResource = {
      ...resources[index],
      ...resource,
      id, // IDは変更不可
      updatedAt: new Date().toISOString(),
    }

    const newResources = [...resources]
    newResources[index] = updatedResource

    return {
      ...data,
      learningResources: newResources,
    }
  })

  if (!updatedResource) {
    throw new Error('学習リソースの更新に失敗しました')
  }

  return updatedResource
}

/**
 * 学習リソースを削除
 */
export function deleteLearningResource(id: string): void {
  updateData((data) => ({
    ...data,
    learningResources: (data.learningResources || []).filter((lr) => lr.id !== id),
  }))
}

/**
 * 学習リソースを取得
 */
export function getLearningResource(id: string): LearningResource | null {
  const data = loadData()
  if (!data) return null

  return (data.learningResources || []).find((lr) => lr.id === id) || null
}

/**
 * 全学習リソースを取得
 */
export function getAllLearningResources(): LearningResource[] {
  const data = loadData()
  if (!data) return []

  return [...(data.learningResources || [])].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime()
    const dateB = new Date(b.createdAt).getTime()
    return dateB - dateA // 新しい順
  })
}

/**
 * 科目IDで学習リソースを取得
 */
export function getLearningResourcesBySubjectId(subjectId: string): LearningResource[] {
  const allResources = getAllLearningResources()
  return allResources.filter((lr) => lr.subjectIds?.includes(subjectId))
}

/**
 * タスク種別で学習リソースを取得
 */
export function getLearningResourcesByTaskType(taskType: string): LearningResource[] {
  const allResources = getAllLearningResources()
  return allResources.filter((lr) => lr.taskTypeIds?.includes(taskType as any))
}


