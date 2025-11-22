/**
 * 共有メッセージ生成
 */

import type { StudyLog, Task } from '../types'
import { getAllStudyLogs } from '../api/studyLogs'
import { getAllTasks } from '../api/tasks'
import { calculateStudyTime } from './studyTimeAggregation'
import { formatDuration } from './timeCalculation'

/**
 * 学習記録から共有メッセージを生成
 */
export function generateStudyLogShareMessage(log: StudyLog, task?: Task): string {
  const studyTime = log.startTime && log.endTime
    ? formatDuration(calculateStudyTime([log]))
    : '記録なし'
  
  const taskTitle = task?.title || 'タスク'
  
  return `📚 学習記録\n\n${taskTitle}\n学習時間: ${studyTime}\n${log.content || ''}\n\n#学習記録 #StudyLog`
}

/**
 * 統計情報から共有メッセージを生成
 */
export function generateStatsShareMessage(
  totalStudyTime: number,
  completedTasks: number,
  totalTasks: number
): string {
  const studyTime = formatDuration(totalStudyTime)
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
  
  return `📊 学習統計\n\n総学習時間: ${studyTime}\n完了タスク: ${completedTasks}/${totalTasks} (${completionRate}%)\n\n#学習統計 #StudyStats`
}

/**
 * 週次レポートの共有メッセージを生成
 */
export function generateWeeklyReportShareMessage(
  weekStart: Date,
  weekEnd: Date,
  totalStudyTime: number,
  completedTasks: number
): string {
  const studyTime = formatDuration(totalStudyTime)
  const startDate = weekStart.toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' })
  const endDate = weekEnd.toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' })
  
  return `📅 週次レポート (${startDate} - ${endDate})\n\n総学習時間: ${studyTime}\n完了タスク: ${completedTasks}件\n\n#週次レポート #WeeklyReport`
}

/**
 * 月次レポートの共有メッセージを生成
 */
export function generateMonthlyReportShareMessage(
  month: Date,
  totalStudyTime: number,
  completedTasks: number
): string {
  const studyTime = formatDuration(totalStudyTime)
  const monthLabel = month.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' })
  
  return `📅 月次レポート (${monthLabel})\n\n総学習時間: ${studyTime}\n完了タスク: ${completedTasks}件\n\n#月次レポート #MonthlyReport`
}


