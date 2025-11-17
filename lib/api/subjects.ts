/**
 * 科目CRUD関数
 * ローカルストレージを使用して科目の作成・更新・削除・取得を行う
 */

import { loadData, saveData } from '../storage'
import { createInitialData } from '../initialData'
import type { Subject, BackupData } from '../types'
import { generateId as generateSafeId } from '../utils/idGenerator'

/**
 * IDを生成する
 */
function generateId(): string {
  return generateSafeId('subj')
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
 * 科目を作成
 */
export function createSubject(subject: Omit<Subject, 'id'>): Subject {
  const newSubject: Subject = {
    ...subject,
    id: generateId(),
  }

  updateData((data) => ({
    ...data,
    subjects: [...data.subjects, newSubject],
  }))

  return newSubject
}

/**
 * 科目を更新
 */
export function updateSubject(id: string, subject: Partial<Subject>): Subject {
  let updatedSubject: Subject | null = null

  updateData((data) => {
    const index = data.subjects.findIndex((s) => s.id === id)
    if (index === -1) {
      throw new Error(`科目が見つかりません: ${id}`)
    }

    updatedSubject = {
      ...data.subjects[index],
      ...subject,
      id, // IDは変更不可
    }

    const newSubjects = [...data.subjects]
    newSubjects[index] = updatedSubject

    return {
      ...data,
      subjects: newSubjects,
    }
  })

  if (!updatedSubject) {
    throw new Error('科目の更新に失敗しました')
  }

  return updatedSubject
}

/**
 * 科目を削除
 */
export function deleteSubject(id: string): void {
  updateData((data) => ({
    ...data,
    subjects: data.subjects.filter((s) => s.id !== id),
    // 関連する時間割も削除
    timetables: data.timetables.filter((tt) => tt.subjectId !== id),
  }))
}

/**
 * 科目を取得
 */
export function getSubject(id: string): Subject | null {
  const data = loadData()
  if (!data) return null

  return data.subjects.find((s) => s.id === id) || null
}

/**
 * 全科目を取得
 */
export function getAllSubjects(): Subject[] {
  const data = loadData()
  if (!data) return []

  return [...data.subjects].sort((a, b) => a.name.localeCompare(b.name))
}

