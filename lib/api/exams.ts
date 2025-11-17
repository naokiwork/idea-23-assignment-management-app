/**
 * テストCRUD関数
 * ローカルストレージを使用してテストの作成・更新・削除・取得を行う
 */

import { loadData, saveData } from '../storage'
import { createInitialData } from '../initialData'
import type { Exam, BackupData } from '../types'
import { generateId as generateSafeId } from '../utils/idGenerator'

/**
 * IDを生成する
 */
function generateId(): string {
  return generateSafeId('exam')
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
 * テストを作成
 */
export function createExam(exam: Omit<Exam, 'id'>): Exam {
  const newExam: Exam = {
    ...exam,
    id: generateId(),
  }

  updateData((data) => ({
    ...data,
    exams: [...data.exams, newExam],
  }))

  return newExam
}

/**
 * テストを更新
 */
export function updateExam(id: string, exam: Partial<Exam>): Exam {
  let updatedExam: Exam | null = null

  updateData((data) => {
    const index = data.exams.findIndex((e) => e.id === id)
    if (index === -1) {
      throw new Error(`テストが見つかりません: ${id}`)
    }

    updatedExam = {
      ...data.exams[index],
      ...exam,
      id, // IDは変更不可
    }

    const newExams = [...data.exams]
    newExams[index] = updatedExam

    return {
      ...data,
      exams: newExams,
    }
  })

  if (!updatedExam) {
    throw new Error('テストの更新に失敗しました')
  }

  return updatedExam
}

/**
 * テストを削除
 */
export function deleteExam(id: string): void {
  updateData((data) => ({
    ...data,
    exams: data.exams.filter((e) => e.id !== id),
  }))
}

/**
 * テストを取得
 */
export function getExam(id: string): Exam | null {
  const data = loadData()
  if (!data) return null

  return data.exams.find((e) => e.id === id) || null
}

/**
 * 全テストを取得
 */
export function getAllExams(): Exam[] {
  const data = loadData()
  if (!data) return []

  return [...data.exams].sort((a, b) => {
    // 実施日でソート（近い順）
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)
    return dateA.getTime() - dateB.getTime()
  })
}

/**
 * 科目ID別にテストを取得
 */
export function getExamsBySubjectId(subjectId: string): Exam[] {
  const allExams = getAllExams()
  return allExams.filter((exam) => exam.subjectId === subjectId)
}

