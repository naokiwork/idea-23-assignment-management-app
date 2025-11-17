/**
 * 学習ログCSVエクスポート
 */

import type { StudyLog, Task, Subject } from '../types'
import { convertToCSV, downloadCSV } from './csvExporter'
import { getAllStudyLogs } from '../api/studyLogs'
import { getAllTasks } from '../api/tasks'
import { getAllSubjects } from '../api/subjects'

export interface StudyLogExportOptions {
  dateRange?: {
    start: Date
    end: Date
  }
}

/**
 * 学習ログデータをCSV形式に変換
 */
export function exportStudyLogsToCSV(options: StudyLogExportOptions = {}): void {
  let logs = getAllStudyLogs()
  const tasks = getAllTasks()
  const subjects = getAllSubjects()

  const taskMap = new Map(tasks.map((t) => [t.id, t]))
  const subjectMap = new Map(subjects.map((s) => [s.id, s.name]))

  // 日付範囲でフィルタリング
  if (options.dateRange) {
    logs = logs.filter((log) => {
      const logDate = new Date(log.date)
      return (
        logDate >= options.dateRange!.start && logDate <= options.dateRange!.end
      )
    })
  }

  // CSVデータの準備
  const csvData = logs.map((log) => {
    const task = taskMap.get(log.taskId)
    const subjectName = task ? subjectMap.get(task.subjectId) || '' : ''

    // 学習時間の計算
    let studyTime = ''
    if (log.startTime && log.endTime) {
      const start = parseTime(log.startTime)
      const end = parseTime(log.endTime)
      if (start && end) {
        const diffMs = end.getTime() - start.getTime()
        const minutes = diffMs / (1000 * 60)
        const hours = Math.floor(minutes / 60)
        const mins = Math.floor(minutes % 60)
        studyTime = `${hours}:${mins.toString().padStart(2, '0')}`
      }
    }

    return {
      id: log.id,
      date: log.date,
      startTime: log.startTime || '',
      endTime: log.endTime || '',
      studyTime,
      taskTitle: task?.title || '',
      subject: subjectName,
      content: log.content,
      progressAmount: log.progressAmount || '',
    }
  })

  const headers = [
    'id',
    'date',
    'startTime',
    'endTime',
    'studyTime',
    'taskTitle',
    'subject',
    'content',
    'progressAmount',
  ]

  const csv = convertToCSV(csvData, headers)
  const filename = `study_logs_${new Date().toISOString().split('T')[0]}.csv`
  downloadCSV(csv, filename)
}

/**
 * 時刻文字列（HH:mm）をDateオブジェクトに変換（今日の日付を使用）
 */
function parseTime(timeStr: string): Date | null {
  const [hours, minutes] = timeStr.split(':').map(Number)
  if (isNaN(hours) || isNaN(minutes)) {
    return null
  }
  const date = new Date()
  date.setHours(hours, minutes, 0, 0)
  return date
}

