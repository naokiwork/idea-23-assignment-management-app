'use client'

import React from 'react'
import { Card, CardBody, CardHeader } from '../ui/Card'
import { ProgressBar } from '../ui/ProgressBar'
import { CheckCircle2, Clock } from 'lucide-react'
import type { Exam, Task, Subtask } from '@/lib/types'
import { calculateTaskCompletionRate } from '@/lib/utils/completionRate'
import { getSubtasksByTaskId } from '@/lib/api/subtasks'
import { getRequiredTasksForExam } from '@/lib/utils/examTasks'

export interface ExamProgressProps {
  exam: Exam
  tasks: Task[]
  subtasks: Subtask[]
}

export const ExamProgress: React.FC<ExamProgressProps> = ({
  exam,
  tasks,
  subtasks,
}) => {
  const examTasks = getRequiredTasksForExam(exam.id, tasks)

  if (examTasks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">テスト勉強進捗</h3>
        </CardHeader>
        <CardBody>
          <p className="text-gray-500">関連するタスクがありません</p>
        </CardBody>
      </Card>
    )
  }

  // 各タスクの完了率を計算
  const taskProgresses = examTasks.map((task) => {
    const taskSubtasks = getSubtasksByTaskId(task.id)
    return calculateTaskCompletionRate(task, taskSubtasks)
  })

  // 全体の進捗率を計算（平均）
  const overallProgress = Math.round(
    taskProgresses.reduce((sum, progress) => sum + progress, 0) / taskProgresses.length
  )

  // 完了タスク数（進捗率100%のタスク）
  const completedTasks = taskProgresses.filter((progress) => progress === 100).length

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900">テスト勉強進捗</h3>
      </CardHeader>
      <CardBody>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">全体進捗率</span>
              <span className="text-sm text-gray-600">{overallProgress}%</span>
            </div>
            <ProgressBar value={overallProgress} showLabel size="md" />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-success-600" />
              <span className="text-sm text-gray-700">
                完了: <span className="font-medium">{completedTasks}件</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary-600" />
              <span className="text-sm text-gray-700">
                総タスク数: <span className="font-medium">{examTasks.length}件</span>
              </span>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

