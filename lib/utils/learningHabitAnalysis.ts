/**
 * 学習習慣分析
 */

import type { StudyLog } from '../types'
import { getAllStudyLogs } from '../api/studyLogs'
import { calculateStudyTime } from './studyTimeAggregation'

export interface LearningHabit {
  timeOfDayDistribution: Record<string, number> // 時間帯別学習時間
  dayOfWeekDistribution: Record<string, number> // 曜日別学習時間
  studyStreak: number // 連続学習日数
  longestStreak: number // 最長連続学習日数
  averageSessionLength: number // 平均セッション時間（分）
}

/**
 * 時間帯を取得（0-23時）
 */
function getHourOfDay(timeStr: string): number | null {
  if (!timeStr) return null
  const [hours] = timeStr.split(':').map(Number)
  return isNaN(hours) ? null : hours
}

/**
 * 曜日を取得（0=日曜日, 6=土曜日）
 */
function getDayOfWeek(dateStr: string): number {
  const date = new Date(dateStr)
  return date.getDay()
}

/**
 * 時間帯のラベルを取得
 */
function getTimeOfDayLabel(hour: number): string {
  if (hour >= 5 && hour < 12) return '朝（5-12時）'
  if (hour >= 12 && hour < 17) return '昼（12-17時）'
  if (hour >= 17 && hour < 22) return '夕方（17-22時）'
  return '夜（22-5時）'
}

/**
 * 曜日のラベルを取得
 */
function getDayOfWeekLabel(day: number): string {
  const days = ['日', '月', '火', '水', '木', '金', '土']
  return days[day]
}

/**
 * 学習習慣を分析
 */
export function analyzeLearningHabit(timeRange?: { start: Date; end: Date }): LearningHabit {
  let logs = getAllStudyLogs()

  // 期間でフィルタリング
  if (timeRange) {
    logs = logs.filter((log) => {
      const logDate = new Date(log.date)
      return logDate >= timeRange.start && logDate <= timeRange.end
    })
  }

  // 時間帯別学習時間
  const timeOfDayDistribution: Record<string, number> = {
    '朝（5-12時）': 0,
    '昼（12-17時）': 0,
    '夕方（17-22時）': 0,
    '夜（22-5時）': 0,
  }

  for (const log of logs) {
    if (log.startTime) {
      const hour = getHourOfDay(log.startTime)
      if (hour !== null) {
        const label = getTimeOfDayLabel(hour)
        const studyTime = calculateStudyTime([log])
        timeOfDayDistribution[label] = (timeOfDayDistribution[label] || 0) + studyTime
      }
    }
  }

  // 曜日別学習時間
  const dayOfWeekDistribution: Record<string, number> = {
    日: 0,
    月: 0,
    火: 0,
    水: 0,
    木: 0,
    金: 0,
    土: 0,
  }

  for (const log of logs) {
    const day = getDayOfWeek(log.date)
    const label = getDayOfWeekLabel(day)
    const studyTime = calculateStudyTime([log])
    dayOfWeekDistribution[label] = (dayOfWeekDistribution[label] || 0) + studyTime
  }

  // 連続学習日数の計算
  const sortedDates = Array.from(new Set(logs.map((log) => log.date)))
    .map((date) => new Date(date))
    .sort((a, b) => a.getTime() - b.getTime())

  let currentStreak = 0
  let longestStreak = 0
  let lastDate: Date | null = null

  for (const date of sortedDates) {
    if (lastDate) {
      const daysDiff = Math.floor((date.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
      if (daysDiff === 1) {
        currentStreak++
      } else {
        longestStreak = Math.max(longestStreak, currentStreak)
        currentStreak = 1
      }
    } else {
      currentStreak = 1
    }
    lastDate = date
  }
  longestStreak = Math.max(longestStreak, currentStreak)

  // 現在の連続学習日数（最新の日付から）
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  let studyStreak = 0
  if (sortedDates.length > 0) {
    const latestDate = sortedDates[sortedDates.length - 1]
    latestDate.setHours(0, 0, 0, 0)
    const daysSinceLatest = Math.floor((today.getTime() - latestDate.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysSinceLatest <= 1) {
      // 最新の学習日から逆算して連続日数を計算
      let checkDate = new Date(latestDate)
      let consecutive = 0
      while (sortedDates.some((d) => {
        const dCopy = new Date(d)
        dCopy.setHours(0, 0, 0, 0)
        return dCopy.getTime() === checkDate.getTime()
      })) {
        consecutive++
        checkDate.setDate(checkDate.getDate() - 1)
      }
      studyStreak = consecutive
    }
  }

  // 平均セッション時間
  const totalSessions = logs.length
  const totalStudyTime = calculateStudyTime(logs)
  const averageSessionLength = totalSessions > 0 ? totalStudyTime / totalSessions : 0

  return {
    timeOfDayDistribution,
    dayOfWeekDistribution,
    studyStreak,
    longestStreak,
    averageSessionLength,
  }
}


