/**
 * 検索管理機能
 */

import type { Task, Subject, StudyLog, Exam, Class } from '../types'
import { getAllTasks } from '../api/tasks'
import { getAllSubjects } from '../api/subjects'
import { getAllStudyLogs } from '../api/studyLogs'
import { getAllExams } from '../api/exams'
import { getAllClasses } from '../api/classes'

export type SearchResultType = 'task' | 'subject' | 'log' | 'exam' | 'class'

export interface SearchResult {
  type: SearchResultType
  id: string
  title: string
  description?: string
  url: string
  metadata?: Record<string, any>
}

export interface SearchOptions {
  query: string
  types?: SearchResultType[]
  limit?: number
}

/**
 * 全文検索を実行
 */
export function searchAll(options: SearchOptions): SearchResult[] {
  const { query, types, limit = 50 } = options
  const normalizedQuery = query.toLowerCase().trim()

  if (!normalizedQuery) {
    return []
  }

  const results: SearchResult[] = []

  // タスクの検索
  if (!types || types.includes('task')) {
    const tasks = getAllTasks()
    const subjects = getAllSubjects()
    const subjectMap = new Map(subjects.map((s) => [s.id, s.name]))

    for (const task of tasks) {
      const subjectName = subjectMap.get(task.subjectId) || ''
      const searchableText = [
        task.title,
        task.taskType,
        subjectName,
        task.requiredStudyAmount || '',
      ]
        .join(' ')
        .toLowerCase()

      if (searchableText.includes(normalizedQuery)) {
        results.push({
          type: 'task',
          id: task.id,
          title: task.title,
          description: `${subjectName} - ${task.taskType}`,
          url: `/tasks/${task.id}`,
          metadata: {
            deadline: task.deadline,
            subjectId: task.subjectId,
          },
        })
      }
    }
  }

  // 科目の検索
  if (!types || types.includes('subject')) {
    const subjects = getAllSubjects()
    for (const subject of subjects) {
      const searchableText = [
        subject.name,
        subject.teacher || '',
        subject.year || '',
        subject.semester || '',
      ]
        .join(' ')
        .toLowerCase()

      if (searchableText.includes(normalizedQuery)) {
        results.push({
          type: 'subject',
          id: subject.id,
          title: subject.name,
          description: subject.teacher || '',
          url: `/subjects/${subject.id}`,
          metadata: {
            year: subject.year,
            semester: subject.semester,
          },
        })
      }
    }
  }

  // 学習ログの検索
  if (!types || types.includes('log')) {
    const logs = getAllStudyLogs()
    const tasks = getAllTasks()
    const taskMap = new Map(tasks.map((t) => [t.id, t]))

    for (const log of logs) {
      const task = taskMap.get(log.taskId)
      const searchableText = [
        log.content || '',
        task?.title || '',
        log.date,
      ]
        .join(' ')
        .toLowerCase()

      if (searchableText.includes(normalizedQuery)) {
        results.push({
          type: 'log',
          id: log.id,
          title: task?.title || '学習ログ',
          description: log.content || log.date,
          url: `/logs`,
          metadata: {
            date: log.date,
            taskId: log.taskId,
          },
        })
      }
    }
  }

  // テストの検索
  if (!types || types.includes('exam')) {
    const exams = getAllExams()
    const subjects = getAllSubjects()
    const subjectMap = new Map(subjects.map((s) => [s.id, s.name]))

    for (const exam of exams) {
      const subjectName = subjectMap.get(exam.subjectId) || ''
      const searchableText = [exam.name, subjectName, exam.date].join(' ').toLowerCase()

      if (searchableText.includes(normalizedQuery)) {
        results.push({
          type: 'exam',
          id: exam.id,
          title: exam.name,
          description: `${subjectName} - ${exam.date}`,
          url: `/exams/${exam.id}`,
          metadata: {
            date: exam.date,
            subjectId: exam.subjectId,
          },
        })
      }
    }
  }

  // 授業回の検索
  if (!types || types.includes('class')) {
    const classes = getAllClasses()
    const subjects = getAllSubjects()
    const subjectMap = new Map(subjects.map((s) => [s.id, s.name]))

    for (const classItem of classes) {
      const subjectName = subjectMap.get(classItem.subjectId) || ''
      const searchableText = [
        classItem.title || '',
        subjectName,
        classItem.date,
      ]
        .join(' ')
        .toLowerCase()

      if (searchableText.includes(normalizedQuery)) {
        results.push({
          type: 'class',
          id: classItem.id,
          title: classItem.title || '授業',
          description: `${subjectName} - ${classItem.date}`,
          url: `/classes/${classItem.id}`,
          metadata: {
            date: classItem.date,
            subjectId: classItem.subjectId,
          },
        })
      }
    }
  }

  // 関連度でソート（タイトルに含まれるものを優先）
  results.sort((a, b) => {
    const aTitleMatch = a.title.toLowerCase().includes(normalizedQuery)
    const bTitleMatch = b.title.toLowerCase().includes(normalizedQuery)
    if (aTitleMatch && !bTitleMatch) return -1
    if (!aTitleMatch && bTitleMatch) return 1
    return 0
  })

  return results.slice(0, limit)
}

/**
 * 検索結果をカテゴリ別にグループ化
 */
export function groupSearchResults(results: SearchResult[]): Record<SearchResultType, SearchResult[]> {
  const grouped: Record<SearchResultType, SearchResult[]> = {
    task: [],
    subject: [],
    log: [],
    exam: [],
    class: [],
  }

  for (const result of results) {
    grouped[result.type].push(result)
  }

  return grouped
}

