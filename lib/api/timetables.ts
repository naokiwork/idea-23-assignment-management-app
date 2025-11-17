/**
 * 時間割CRUD関数
 * ローカルストレージを使用して時間割の作成・更新・削除・取得を行う
 */

import { loadData, saveData } from '../storage'
import { createInitialData } from '../initialData'
import type { Timetable, BackupData } from '../types'
import { generateId as generateSafeId } from '../utils/idGenerator'

/**
 * IDを生成する
 */
function generateId(): string {
  return generateSafeId('tt')
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
 * 時間割を作成
 */
export function createTimetable(timetable: Omit<Timetable, 'id'>): Timetable {
  const newTimetable: Timetable = {
    ...timetable,
    id: generateId(),
  }

  updateData((data) => ({
    ...data,
    timetables: [...data.timetables, newTimetable],
  }))

  return newTimetable
}

/**
 * 時間割を更新
 */
export function updateTimetable(id: string, timetable: Partial<Timetable>): Timetable {
  let updatedTimetable: Timetable | null = null

  updateData((data) => {
    const index = data.timetables.findIndex((tt) => tt.id === id)
    if (index === -1) {
      throw new Error(`時間割が見つかりません: ${id}`)
    }

    updatedTimetable = {
      ...data.timetables[index],
      ...timetable,
      id, // IDは変更不可
    }

    const newTimetables = [...data.timetables]
    newTimetables[index] = updatedTimetable

    return {
      ...data,
      timetables: newTimetables,
    }
  })

  if (!updatedTimetable) {
    throw new Error('時間割の更新に失敗しました')
  }

  return updatedTimetable
}

/**
 * 時間割を削除
 */
export function deleteTimetable(id: string): void {
  updateData((data) => ({
    ...data,
    timetables: data.timetables.filter((tt) => tt.id !== id),
  }))
}

/**
 * 時間割を取得
 */
export function getTimetable(id: string): Timetable | null {
  const data = loadData()
  if (!data) return null

  return data.timetables.find((tt) => tt.id === id) || null
}

/**
 * 全時間割を取得
 */
export function getAllTimetables(): Timetable[] {
  const data = loadData()
  if (!data) return []

  return [...data.timetables]
}

/**
 * 科目ID別に時間割を取得
 */
export function getTimetablesBySubjectId(subjectId: string): Timetable[] {
  const allTimetables = getAllTimetables()
  return allTimetables.filter((tt) => tt.subjectId === subjectId)
}

