'use client'

import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { loadData } from '@/lib/storage'
import { formatStudyTime } from '@/lib/utils/studyTimeAggregation'

export interface SubjectTimeChartProps {
  data: Record<string, number>
}

export const SubjectTimeChart: React.FC<SubjectTimeChartProps> = ({ data }) => {
  const appData = loadData()
  const chartData = Object.entries(data)
    .map(([subjectId, minutes]) => {
      const subject = appData?.subjects.find((s) => s.id === subjectId)
      return {
        subject: subject?.name || subjectId,
        time: Math.round(minutes / 60 * 10) / 10, // 時間に変換（小数点第1位まで）
        minutes,
      }
    })
    .sort((a, b) => b.minutes - a.minutes)

  return (
    <div className="w-full h-64">
      <ResponsiveContainer>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="subject" />
          <YAxis />
          <Tooltip formatter={(value: number) => `${value}時間`} />
          <Legend />
          <Bar dataKey="time" fill="#22c55e" name="学習時間（時間）" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

