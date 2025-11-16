'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Container } from '@/components'
import { ThisWeekSummary } from '@/components/home/ThisWeekSummary'
import { IncompleteTasks } from '@/components/home/IncompleteTasks'
import { QuickActions } from '@/components/home/QuickActions'
import { getAllTasks } from '@/lib/api/tasks'
import { getAllStudyLogs } from '@/lib/api/studyLogs'
import { filterByWeek, filterOverdue, filterIncomplete } from '@/lib/utils/taskFilters'
import { getThisWeekRange, isThisWeek } from '@/lib/utils/dateUtils'
import { calculateStudyTime } from '@/lib/utils/studyTimeAggregation'
import { loadData } from '@/lib/storage'
import { ToastProvider } from '@/components/ui/Toast'
import type { Task, Subject } from '@/lib/types'

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container className="py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-900 mb-2">エラーが発生しました</h2>
            <p className="text-red-700 mb-2">{this.state.error?.message || '不明なエラー'}</p>
            <pre className="text-xs text-red-600 bg-red-100 p-2 rounded mt-2 overflow-auto">
              {this.state.error?.stack}
            </pre>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null })
                window.location.reload()
              }}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              ページを再読み込み
            </button>
          </div>
        </Container>
      )
    }

    return this.props.children
  }
}

function HomePageContent() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log('HomePageContent: useEffect started')
    try {
      console.log('HomePageContent: calling loadAllData')
      loadAllData()
      console.log('HomePageContent: loadAllData completed')
      setIsLoading(false)
    } catch (err) {
      console.error('Error loading data:', err)
      setError(err instanceof Error ? err : new Error('データの読み込みに失敗しました'))
      setIsLoading(false)
    }
  }, [])

  const loadAllData = () => {
    try {
      console.log('loadAllData: loading data')
      const data = loadData()
      console.log('loadAllData: data loaded', data)
      if (data) {
        setSubjects(data.subjects || [])
        console.log('loadAllData: subjects set', data.subjects?.length || 0)
      }
      const tasks = getAllTasks()
      console.log('loadAllData: tasks loaded', tasks.length)
      setTasks(tasks)
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

  // 完了タスク数（簡易版：サブタスクがすべて完了しているタスク）
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
          <p className="text-red-700 mb-2">{error.message}</p>
          <pre className="text-xs text-red-600 bg-red-100 p-2 rounded mt-2 overflow-auto">
            {error.stack}
          </pre>
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

  try {
    return (
      <Container className="py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">ホーム</h1>

        <div className="space-y-6">
          {/* クイックアクション */}
          <QuickActions />

          {/* 今週の状況 */}
          <ThisWeekSummary
            totalTasks={thisWeekTasks.length}
            completedTasks={completedTasks}
            studyTime={thisWeekStudyTime}
            subjectTaskCounts={subjectTaskCounts}
            subjectNames={subjectNames}
          />

          {/* 未完了タスク */}
          <IncompleteTasks
            overdueTasks={overdueTasks}
            thisWeekTasks={incompleteThisWeekTasks}
            subjects={subjects}
            onTaskClick={(task) => {
              // タスク詳細ページへの遷移（後で実装）
              console.log('Navigate to task detail:', task.id)
            }}
          />
        </div>
      </Container>
    )
  } catch (renderError) {
    console.error('Render error:', renderError)
    return (
      <Container className="py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-900 mb-2">レンダリングエラー</h2>
          <p className="text-red-700">
            {renderError instanceof Error ? renderError.message : '不明なエラー'}
          </p>
        </div>
      </Container>
    )
  }
}

export default function HomePage() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <HomePageContent />
      </ToastProvider>
    </ErrorBoundary>
  )
}

