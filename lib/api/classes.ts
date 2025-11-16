/**
 * 授業回CRUD関数
 * ローカルストレージを使用して授業回の作成・更新・削除・取得を行う
 */

import { loadData, saveData } from '../storage'
import { createInitialData } from '../initialData'
import type { Class, BackupData } from '../types'

/**
 * IDを生成する（簡易版）
 */
function generateId(): string {
  return `class-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
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
 * 授業回を作成
 */
export function createClass(classData: Omit<Class, 'id'>): Class {
  const newClass: Class = {
    ...classData,
    id: generateId(),
  }

  updateData((data) => ({
    ...data,
    classes: [...data.classes, newClass],
  }))

  return newClass
}

/**
 * 授業回を更新
 */
export function updateClass(id: string, classData: Partial<Class>): Class {
  let updatedClass: Class | null = null

  updateData((data) => {
    const index = data.classes.findIndex((c) => c.id === id)
    if (index === -1) {
      throw new Error(`授業回が見つかりません: ${id}`)
    }

    updatedClass = {
      ...data.classes[index],
      ...classData,
      id, // IDは変更不可
    }

    const newClasses = [...data.classes]
    newClasses[index] = updatedClass

    return {
      ...data,
      classes: newClasses,
    }
  })

  if (!updatedClass) {
    throw new Error('授業回の更新に失敗しました')
  }

  return updatedClass
}

/**
 * 授業回を削除
 */
export function deleteClass(id: string): void {
  updateData((data) => ({
    ...data,
    classes: data.classes.filter((c) => c.id !== id),
  }))
}

/**
 * 授業回を取得
 */
export function getClass(id: string): Class | null {
  const data = loadData()
  if (!data) return null

  return data.classes.find((c) => c.id === id) || null
}

/**
 * 全授業回を取得
 */
export function getAllClasses(): Class[] {
  const data = loadData()
  if (!data) return []

  return [...data.classes].sort((a, b) => {
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)
    return dateB.getTime() - dateA.getTime() // 新しい順
  })
}

/**
 * 科目ID別に授業回を取得
 */
export function getClassesBySubjectId(subjectId: string): Class[] {
  const allClasses = getAllClasses()
  return allClasses.filter((c) => c.subjectId === subjectId)
}

