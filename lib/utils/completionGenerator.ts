/**
 * 補完候補生成
 */

import { getAllStudyLogs } from '../api/studyLogs'
import { getAllTasks } from '../api/tasks'
import { getAllSubjects } from '../api/subjects'
import type { StudyLog, Task, Subject } from '../types'

export interface CompletionCandidate {
  value: string
  frequency: number
  lastUsed?: string
}

/**
 * メモの補完候補を生成
 */
export function generateMemoCompletions(limit: number = 5): CompletionCandidate[] {
  const studyLogs = getAllStudyLogs()
  const memoFrequency: Record<string, { count: number; lastUsed?: string }> = {}

  studyLogs.forEach(log => {
    if (log.content && log.content.trim()) {
      const content = log.content.trim()
      if (!memoFrequency[content]) {
        memoFrequency[content] = { count: 0 }
      }
      memoFrequency[content].count++
      if (log.date) {
        const currentLastUsed = memoFrequency[content].lastUsed
        if (!currentLastUsed || log.date > currentLastUsed) {
          memoFrequency[content].lastUsed = log.date
        }
      }
    }
  })

  return Object.entries(memoFrequency)
    .map(([value, data]) => ({
      value,
      frequency: data.count,
      lastUsed: data.lastUsed,
    }))
    .sort((a, b) => {
      // 頻度でソート、同じ頻度の場合は最近使用されたものを優先
      if (b.frequency !== a.frequency) {
        return b.frequency - a.frequency
      }
      if (a.lastUsed && b.lastUsed) {
        return b.lastUsed.localeCompare(a.lastUsed)
      }
      return 0
    })
    .slice(0, limit)
}

/**
 * 科目の補完候補を生成（最近使用された科目）
 */
export function generateSubjectCompletions(limit: number = 5): CompletionCandidate[] {
  const studyLogs = getAllStudyLogs()
  const tasks = getAllTasks()
  const subjects = getAllSubjects()
  const subjectMap = new Map<string, Subject>()
  subjects.forEach(s => subjectMap.set(s.id, s))

  const taskSubjectMap = new Map<string, string>()
  tasks.forEach(t => taskSubjectMap.set(t.id, t.subjectId))

  const subjectFrequency: Record<string, { count: number; lastUsed?: string }> = {}

  studyLogs.forEach(log => {
    const subjectId = taskSubjectMap.get(log.taskId)
    if (subjectId) {
      const subject = subjectMap.get(subjectId)
      if (subject) {
        const subjectName = subject.name
        if (!subjectFrequency[subjectName]) {
          subjectFrequency[subjectName] = { count: 0 }
        }
        subjectFrequency[subjectName].count++
        if (log.date) {
          const currentLastUsed = subjectFrequency[subjectName].lastUsed
          if (!currentLastUsed || log.date > currentLastUsed) {
            subjectFrequency[subjectName].lastUsed = log.date
          }
        }
      }
    }
  })

  return Object.entries(subjectFrequency)
    .map(([value, data]) => ({
      value,
      frequency: data.count,
      lastUsed: data.lastUsed,
    }))
    .sort((a, b) => {
      if (b.frequency !== a.frequency) {
        return b.frequency - a.frequency
      }
      if (a.lastUsed && b.lastUsed) {
        return b.lastUsed.localeCompare(a.lastUsed)
      }
      return 0
    })
    .slice(0, limit)
}

/**
 * 時間帯の補完候補を生成（よく使う時間帯）
 */
export function generateTimeCompletions(limit: number = 5): CompletionCandidate[] {
  const studyLogs = getAllStudyLogs()
  const timeFrequency: Record<string, { count: number; lastUsed?: string }> = {}

  studyLogs.forEach(log => {
    if (log.startTime) {
      const hour = log.startTime.split(':')[0]
      const timeSlot = `${hour}:00`
      if (!timeFrequency[timeSlot]) {
        timeFrequency[timeSlot] = { count: 0 }
      }
      timeFrequency[timeSlot].count++
      if (log.date) {
        const currentLastUsed = timeFrequency[timeSlot].lastUsed
        if (!currentLastUsed || log.date > currentLastUsed) {
          timeFrequency[timeSlot].lastUsed = log.date
        }
      }
    }
  })

  return Object.entries(timeFrequency)
    .map(([value, data]) => ({
      value,
      frequency: data.count,
      lastUsed: data.lastUsed,
    }))
    .sort((a, b) => {
      if (b.frequency !== a.frequency) {
        return b.frequency - a.frequency
      }
      if (a.lastUsed && b.lastUsed) {
        return b.lastUsed.localeCompare(a.lastUsed)
      }
      return 0
    })
    .slice(0, limit)
}

/**
 * 入力テキストに基づいてメモの補完候補をフィルタリング
 */
export function filterMemoCompletions(
  input: string,
  completions: CompletionCandidate[],
  limit: number = 5
): CompletionCandidate[] {
  if (!input.trim()) {
    return completions.slice(0, limit)
  }

  const lowerInput = input.toLowerCase()
  return completions
    .filter(c => c.value.toLowerCase().includes(lowerInput))
    .slice(0, limit)
}


