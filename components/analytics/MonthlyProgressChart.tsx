'use client'

import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts'

export interface MonthlyProgressChartProps {
  data: Record<string, number>
}

export const MonthlyProgressChart: React.FC<MonthlyProgressChartProps> = ({ data }) => {
  const chartData = Object.entries(data)
    .map(([month, progress]) => ({
      month: formatMonthLabel(month),
      progress: Math.round(progress * 10) / 10, // 小数点第1位まで
    }))
    .sort((a, b) => a.month.localeCompare(b.month))

  return (
    <div className="w-full h-64">
      <ResponsiveContainer>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis domain={[0, 100]} />
          <Tooltip formatter={(value: number) => `${value}%`} />
          <Legend />
          <ReferenceLine y={100} stroke="#ef4444" strokeDasharray="3 3" label="目標" />
          <Bar dataKey="progress" fill="#3b82f6" name="進捗率（%）" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

function formatMonthLabel(monthStr: string): string {
  const [year, month] = monthStr.split('-')
  return `${year}年${parseInt(month)}月`
}

