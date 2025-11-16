'use client'

import React from 'react'

export interface DateDisplayProps {
  date: Date | string
  format?: 'relative' | 'absolute' | 'both'
  className?: string
}

const formatDate = (date: Date | string): Date => {
  return typeof date === 'string' ? new Date(date) : date
}

const getRelativeTime = (date: Date): string => {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffSec < 60) {
    return 'たった今'
  } else if (diffMin < 60) {
    return `${diffMin}分前`
  } else if (diffHour < 24) {
    return `${diffHour}時間前`
  } else if (diffDay === 1) {
    return '昨日'
  } else if (diffDay < 7) {
    return `${diffDay}日前`
  } else if (diffDay < 30) {
    const weeks = Math.floor(diffDay / 7)
    return `${weeks}週間前`
  } else if (diffDay < 365) {
    const months = Math.floor(diffDay / 30)
    return `${months}ヶ月前`
  } else {
    const years = Math.floor(diffDay / 365)
    return `${years}年前`
  }
}

const formatAbsoluteDate = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}年${month}月${day}日`
}

const formatAbsoluteDateTime = (date: Date): string => {
  const dateStr = formatAbsoluteDate(date)
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${dateStr} ${hours}:${minutes}`
}

export const DateDisplay: React.FC<DateDisplayProps> = ({
  date,
  format = 'relative',
  className = '',
}) => {
  const dateObj = formatDate(date)

  if (isNaN(dateObj.getTime())) {
    return <span className={className}>無効な日付</span>
  }

  const relative = getRelativeTime(dateObj)
  const absolute = formatAbsoluteDate(dateObj)
  const absoluteWithTime = formatAbsoluteDateTime(dateObj)

  let displayText: string
  let title: string

  switch (format) {
    case 'relative':
      displayText = relative
      title = absoluteWithTime
      break
    case 'absolute':
      displayText = absolute
      title = relative
      break
    case 'both':
      displayText = `${absolute} (${relative})`
      title = absoluteWithTime
      break
    default:
      displayText = relative
      title = absoluteWithTime
  }

  return (
    <time
      dateTime={dateObj.toISOString()}
      title={title}
      className={`text-gray-700 ${className}`}
    >
      {displayText}
    </time>
  )
}

