/**
 * タスクソート関数
 */

import type { Task } from '../types'

/**
 * 締切日でソート（近い順）
 */
export function sortByDeadline(tasks: Task[], ascending = true): Task[] {
  const sorted = [...tasks].sort((a, b) => {
    const dateA = new Date(a.deadline).getTime()
    const dateB = new Date(b.deadline).getTime()
    return ascending ? dateA - dateB : dateB - dateA
  })
  return sorted
}

/**
 * 作成日でソート（新しい順）
 */
export function sortByCreatedDate(tasks: Task[], ascending = false): Task[] {
  // タスクに作成日がないため、IDから推測（簡易版）
  // 実際の実装では、タスクにcreatedAtフィールドを追加する必要がある
  const sorted = [...tasks].sort((a, b) => {
    const idA = parseInt(a.id.split('-')[1] || '0')
    const idB = parseInt(b.id.split('-')[1] || '0')
    return ascending ? idA - idB : idB - idA
  })
  return sorted
}

