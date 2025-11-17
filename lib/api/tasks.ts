/**
 * タスクCRUD関数
 * ローカルストレージを使用してタスクの作成・更新・削除・取得を行う
 */

import { loadData, saveData } from '../storage'
import { createInitialData } from '../initialData'
import type { Task, BackupData } from '../types'
import { generateId as generateSafeId } from '../utils/idGenerator'

/**
 * IDを生成する
 */
function generateId(): string {
  return generateSafeId('task')
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
 * タスクを作成
 */
export function createTask(task: Omit<Task, 'id'>): Task {
  const newTask: Task = {
    ...task,
    id: generateId(),
  }

  updateData((data) => ({
    ...data,
    tasks: [...data.tasks, newTask],
  }))

  return newTask
}

/**
 * タスクを更新
 */
export function updateTask(id: string, task: Partial<Task>): Task {
  let updatedTask: Task | null = null

  updateData((data) => {
    const index = data.tasks.findIndex((t) => t.id === id)
    if (index === -1) {
      throw new Error(`タスクが見つかりません: ${id}`)
    }

    updatedTask = {
      ...data.tasks[index],
      ...task,
      id, // IDは変更不可
    }

    const newTasks = [...data.tasks]
    newTasks[index] = updatedTask

    return {
      ...data,
      tasks: newTasks,
    }
  })

  if (!updatedTask) {
    throw new Error('タスクの更新に失敗しました')
  }

  return updatedTask
}

/**
 * タスクを削除
 */
export function deleteTask(id: string): void {
  updateData((data) => ({
    ...data,
    tasks: data.tasks.filter((t) => t.id !== id),
    // 関連するサブタスクも削除
    subtasks: data.subtasks.filter((st) => st.parentTaskId !== id),
  }))
}

/**
 * タスクを取得
 */
export function getTask(id: string): Task | null {
  const data = loadData()
  if (!data) return null

  return data.tasks.find((t) => t.id === id) || null
}

/**
 * 全タスクを取得
 */
export function getAllTasks(): Task[] {
  const data = loadData()
  if (!data) return []

  return [...data.tasks]
}

