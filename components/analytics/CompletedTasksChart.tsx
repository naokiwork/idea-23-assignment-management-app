'use client'

import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export interface CompletedTasksChartProps {
  data: Record<string, number>
  period: 'day' | 'week' | 'month'
}

export const CompletedTasksChart: React.FC<CompletedTasksChartProps> = ({
  data,
  period,
}) => {
  const chartData = Object.entries(data)
    .map(([date, count]) => ({
      date: formatDateLabel(date, period),
      count,
    }))
    .sort((a, b) => a.date.localeCompare(b.date))

  return (
    <div className="w-full h-64">
      <ResponsiveContainer>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#3b82f6"
            name="完了タスク数"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

function formatDateLabel(dateStr: string, period: 'day' | 'week' | 'month'): string {
  const date = new Date(dateStr)
  if (period === 'month') {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
  }
  return dateStr
}

