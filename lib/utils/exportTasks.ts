/**
 * タスクCSVエクスポート
 */

import type { Task, Subtask, Subject } from '../types'
import { convertToCSV, downloadCSV } from './csvExporter'
import { getAllTasks } from '../api/tasks'
import { getAllSubtasks } from '../api/subtasks'
import { getAllSubjects } from '../api/subjects'

export interface TaskExportOptions {
  includeSubtasks?: boolean
  dateRange?: {
    start: Date
    end: Date
  }
}

/**
 * タスクデータをCSV形式に変換
 */
export function exportTasksToCSV(options: TaskExportOptions = {}): void {
  const tasks = getAllTasks()
  const subjects = getAllSubjects()
  const subjectMap = new Map(subjects.map((s) => [s.id, s.name]))

  // 日付範囲でフィルタリング
  let filteredTasks = tasks
  if (options.dateRange) {
    filteredTasks = tasks.filter((task) => {
      const deadline = new Date(task.deadline)
      return (
        deadline >= options.dateRange!.start && deadline <= options.dateRange!.end
      )
    })
  }

  // CSVデータの準備
  const csvData = filteredTasks.map((task) => {
    const subjectName = subjectMap.get(task.subjectId) || ''
    const row: Record<string, string> = {
      id: task.id,
      title: task.title,
      subject: subjectName,
      taskType: task.taskType,
      deadline: task.deadline,
      relatedClassId: task.relatedClassId || '',
      relatedExamId: task.relatedExamId || '',
      requiredStudyAmount: task.requiredStudyAmount || '',
    }

    if (options.includeSubtasks) {
      const subtasks = getAllSubtasks().filter((st) => st.parentTaskId === task.id)
      row.subtasks = subtasks.map((st) => `${st.name}(${st.status})`).join('; ')
    }

    return row
  })

  const headers = [
    'id',
    'title',
    'subject',
    'taskType',
    'deadline',
    'relatedClassId',
    'relatedExamId',
    'requiredStudyAmount',
    ...(options.includeSubtasks ? ['subtasks'] : []),
  ]

  const csv = convertToCSV(csvData, headers)
  const filename = `tasks_${new Date().toISOString().split('T')[0]}.csv`
  downloadCSV(csv, filename)
}

