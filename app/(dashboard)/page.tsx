'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Container } from '@/components'
import { QuickActions } from '@/components/home/QuickActions'
import { getAllTasks } from '@/lib/api/tasks'
import { getAllStudyLogs } from '@/lib/api/studyLogs'
import { filterByWeek, filterOverdue, filterIncomplete } from '@/lib/utils/taskFilters'
import { getThisWeekRange, isThisWeek } from '@/lib/utils/dateUtils'
import { calculateStudyTime } from '@/lib/utils/studyTimeAggregation'
import { loadData } from '@/lib/storage'
import { ToastProvider } from '@/components/ui/Toast'
import type { Task, Subject } from '@/lib/types'

function HomePageContent() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      loadAllData()
      setIsLoading(false)
    } catch (err) {
      console.error('Error loading data:', err)
      setError(err instanceof Error ? err : new Error('データの読み込みに失敗しました'))
      setIsLoading(false)
    }
  }, [])

  const loadAllData = () => {
    try {
      const data = loadData()
      if (data) {
        setSubjects(data.subjects || [])
      }
      setTasks(getAllTasks())
    } catch (err) {
      console.error('Error in loadAllData:', err)
      throw err
    }
  }

  const weekRange = useMemo(() => getThisWeekRange(), [])
  const { start: weekStart, end: weekEnd } = weekRange

  // 今週のタスク
  const thisWeekTasks = useMemo(() => {
    return filterByWeek(tasks)
  }, [tasks])

  // 期限切れタスク
  const overdueTasks = useMemo(() => {
    return filterOverdue(tasks)
  }, [tasks])

  // 未完了タスク（今週中に締切）
  const incompleteThisWeekTasks = useMemo(() => {
    const incomplete = filterIncomplete(thisWeekTasks)
    return incomplete.filter((task) => {
      const deadline = new Date(task.deadline)
      return isThisWeek(deadline)
    })
  }, [thisWeekTasks])

  // 今週の学習時間
  const thisWeekStudyTime = useMemo(() => {
    try {
      const allLogs = getAllStudyLogs()
      const weekLogs = allLogs.filter((log) => {
        const logDate = new Date(log.date)
        return logDate >= weekStart && logDate <= weekEnd
      })
      return calculateStudyTime(weekLogs)
    } catch (err) {
      console.error('Error calculating study time:', err)
      return 0
    }
  }, [weekStart, weekEnd])

  // 科目別タスク数
  const subjectTaskCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    thisWeekTasks.forEach((task) => {
      counts[task.subjectId] = (counts[task.subjectId] || 0) + 1
    })
    return counts
  }, [thisWeekTasks])

  const subjectNames: Record<string, string> = useMemo(() => {
    const names: Record<string, string> = {}
    subjects.forEach((subject) => {
      names[subject.id] = subject.name
    })
    return names
  }, [subjects])

  // 完了タスク数
  const completedTasks = useMemo(() => {
    try {
      const data = loadData()
      if (!data) return 0
      return thisWeekTasks.filter((task) => {
        const subtasks = (data.subtasks || []).filter((st) => st.parentTaskId === task.id)
        if (subtasks.length === 0) return false
        return subtasks.every((st) => st.status === 'completed')
      }).length
    } catch (err) {
      console.error('Error calculating completed tasks:', err)
      return 0
    }
  }, [thisWeekTasks])

  if (isLoading) {
    return (
      <Container className="py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">読み込み中...</p>
          </div>
        </div>
      </Container>
    )
  }

  if (error) {
    return (
      <Container className="py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-900 mb-2">エラーが発生しました</h2>
          <p className="text-red-700">{error.message}</p>
          <button
            onClick={() => {
              setError(null)
              setIsLoading(true)
              try {
                loadAllData()
                setIsLoading(false)
              } catch (err) {
                setError(err instanceof Error ? err : new Error('データの読み込みに失敗しました'))
                setIsLoading(false)
              }
            }}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            再試行
          </button>
        </div>
      </Container>
    )
  }

  return (
    <Container className="py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">ホーム</h1>

      <div className="space-y-6">
        {/* クイックアクション */}
        <QuickActions />

        {/* 基本情報表示 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">今週の状況</h2>
          <div className="space-y-2">
            <p className="text-gray-700">
              <span className="font-medium">今週のタスク:</span> {thisWeekTasks.length}件
            </p>
            <p className="text-gray-700">
              <span className="font-medium">期限切れタスク:</span> {overdueTasks.length}件
            </p>
            <p className="text-gray-700">
              <span className="font-medium">今週の学習時間:</span> {Math.round(thisWeekStudyTime / 60)}時間{thisWeekStudyTime % 60}分
            </p>
          </div>
        </div>
      </div>
    </Container>
  )
}

export default function HomePage() {
  return (
    <ToastProvider>
      <HomePageContent />
    </ToastProvider>
  )
}

