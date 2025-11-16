'use client'

import React, { useState } from 'react'
import { StudyLogCard } from './StudyLogCard'
import { formatStudyTime } from '@/lib/utils/studyTimeAggregation'
import { groupByDate, calculateStudyTime } from '@/lib/utils/studyTimeAggregation'
import { ChevronDown, ChevronUp, Calendar } from 'lucide-react'
import type { StudyLog, Task, Subject } from '@/lib/types'

export interface DateGroupedLogsProps {
  logs: StudyLog[]
  tasks: Task[]
  subjects: Subject[]
  onEdit?: (log: StudyLog) => void
  onDelete?: (logId: string) => void
}

export const DateGroupedLogs: React.FC<DateGroupedLogsProps> = ({
  logs,
  tasks,
  subjects,
  onEdit,
  onDelete,
}) => {
  const [collapsedDates, setCollapsedDates] = useState<Set<string>>(new Set())

  const groupedByDate = groupByDate(logs)
  const sortedDates = Object.keys(groupedByDate).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime()
  })

  const toggleDate = (date: string) => {
    setCollapsedDates((prev) => {
      const next = new Set(prev)
      if (next.has(date)) {
        next.delete(date)
      } else {
        next.add(date)
      }
      return next
    })
  }

  const getTask = (taskId: string): Task | undefined => {
    return tasks.find((t) => t.id === taskId)
  }

  const getSubject = (subjectId: string): Subject | undefined => {
    return subjects.find((s) => s.id === subjectId)
  }

  const getSubjectForTask = (task: Task): Subject | undefined => {
    return getSubject(task.subjectId)
  }

  if (sortedDates.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <p>学習ログがありません</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {sortedDates.map((date) => {
        const dateLogs = logs.filter((log) => log.date === date)
        const totalTime = calculateStudyTime(dateLogs)
        const isCollapsed = collapsedDates.has(date)

        return (
          <div key={date} className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleDate(date)}
              className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-600" />
                <div className="text-left">
                  <div className="font-medium text-gray-900">
                    {new Date(date).toLocaleDateString('ja-JP', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      weekday: 'short',
                    })}
                  </div>
                  <div className="text-sm text-gray-600">
                    {dateLogs.length}件のログ / 合計: {formatStudyTime(totalTime)}
                  </div>
                </div>
              </div>
              {isCollapsed ? (
                <ChevronDown className="h-5 w-5 text-gray-600" />
              ) : (
                <ChevronUp className="h-5 w-5 text-gray-600" />
              )}
            </button>

            {!isCollapsed && (
              <div className="p-4 space-y-3">
                {dateLogs.map((log) => {
                  const task = getTask(log.taskId)
                  const subject = task ? getSubjectForTask(task) : undefined

                  return (
                    <StudyLogCard
                      key={log.id}
                      log={log}
                      task={task}
                      subject={subject}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

