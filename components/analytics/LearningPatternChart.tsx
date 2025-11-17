'use client'

import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import type { LearningPattern } from '@/lib/utils/learningPatternAnalysis'

interface LearningPatternChartProps {
  pattern: LearningPattern
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

export const LearningPatternChart: React.FC<LearningPatternChartProps> = ({ pattern }) => {
  // 科目別学習時間のデータ
  const subjectData = Object.entries(pattern.subjectDistribution)
    .map(([name, time]) => ({
      name,
      time: Math.round(time / 60 * 10) / 10, // 時間単位に変換
    }))
    .sort((a, b) => b.time - a.time)
    .slice(0, 10) // 上位10科目

  // タスク種別別学習時間のデータ
  const taskTypeData = Object.entries(pattern.taskTypeDistribution).map(([type, time]) => ({
    type: type === 'preparation' ? '予習' : type === 'review' ? '復習' : type === 'assignment' ? '課題' : 'テスト勉強',
    time: Math.round(time / 60 * 10) / 10,
  }))

  return (
    <div className="space-y-6">
      {/* 科目別学習時間 */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">科目別学習時間</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={subjectData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
            <YAxis label={{ value: '時間', angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={(value: number) => `${value}時間`} />
            <Legend />
            <Bar dataKey="time" fill="#3b82f6" name="学習時間（時間）" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* タスク種別別学習時間 */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">タスク種別別学習時間</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={taskTypeData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry: any) => {
                const data = entry as { type: string; percent: number }
                return `${data.type} ${(data.percent * 100).toFixed(0)}%`
              }}
              outerRadius={80}
              fill="#8884d8"
              dataKey="time"
            >
              {taskTypeData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => `${value}時間`} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

