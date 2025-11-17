/**
 * サブタスクCRUD関数
 * ローカルストレージを使用してサブタスクの作成・更新・削除・取得を行う
 */

import { loadData, saveData } from '../storage'
import { createInitialData } from '../initialData'
import type { Subtask, BackupData } from '../types'
import { generateId as generateSafeId } from '../utils/idGenerator'

/**
 * IDを生成する
 */
function generateId(): string {
  return generateSafeId('st')
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
 * サブタスクを作成
 */
export function createSubtask(subtask: Omit<Subtask, 'id'>): Subtask {
  const newSubtask: Subtask = {
    ...subtask,
    id: generateId(),
  }

  updateData((data) => ({
    ...data,
    subtasks: [...data.subtasks, newSubtask],
  }))

  return newSubtask
}

/**
 * サブタスクを更新
 */
export function updateSubtask(id: string, subtask: Partial<Subtask>): Subtask {
  let updatedSubtask: Subtask | null = null

  updateData((data) => {
    const index = data.subtasks.findIndex((st) => st.id === id)
    if (index === -1) {
      throw new Error(`サブタスクが見つかりません: ${id}`)
    }

    updatedSubtask = {
      ...data.subtasks[index],
      ...subtask,
      id, // IDは変更不可
    }

    const newSubtasks = [...data.subtasks]
    newSubtasks[index] = updatedSubtask

    return {
      ...data,
      subtasks: newSubtasks,
    }
  })

  if (!updatedSubtask) {
    throw new Error('サブタスクの更新に失敗しました')
  }

  return updatedSubtask
}

/**
 * サブタスクを削除
 */
export function deleteSubtask(id: string): void {
  updateData((data) => ({
    ...data,
    subtasks: data.subtasks.filter((st) => st.id !== id),
  }))
}

/**
 * タスクに紐づくサブタスクを取得
 */
export function getSubtasksByTaskId(taskId: string): Subtask[] {
  const data = loadData()
  if (!data) return []

  return data.subtasks
    .filter((st) => st.parentTaskId === taskId)
    .sort((a, b) => a.name.localeCompare(b.name))
}

/**
 * 全サブタスクを取得
 */
export function getAllSubtasks(): Subtask[] {
  const data = loadData()
  if (!data) return []

  return [...data.subtasks]
}

