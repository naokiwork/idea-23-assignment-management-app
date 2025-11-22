'use client'

import React, { useState } from 'react'
import { Card, CardBody, CardHeader } from '../ui/Card'
import { Button } from '../ui/Button'
import { Select, Input } from '../ui'
import { FileDown, Calendar } from 'lucide-react'
import { aggregateReportData } from '@/lib/utils/reportDataAggregation'
import { generatePDF } from '@/lib/utils/pdfGenerator'
import { getThisWeekRange, getThisMonthRange, getLastMonthRange } from '@/lib/utils/dateUtils'
import { useToast } from '../ui/Toast'

export const ReportGenerator: React.FC = () => {
  const { showToast } = useToast()
  const [periodType, setPeriodType] = useState<'week' | 'month' | 'lastMonth' | 'custom'>('month')
  const [customStartDate, setCustomStartDate] = useState<string>('')
  const [customEndDate, setCustomEndDate] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)

  const getDateRange = () => {
    switch (periodType) {
      case 'week':
        return getThisWeekRange()
      case 'month':
        return getThisMonthRange()
      case 'lastMonth':
        return getLastMonthRange()
      case 'custom':
        if (customStartDate && customEndDate) {
          return {
            start: new Date(customStartDate),
            end: new Date(customEndDate),
          }
        }
        return getThisMonthRange()
      default:
        return getThisMonthRange()
    }
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      const range = getDateRange()
      const reportData = aggregateReportData(range.start, range.end)
      
      // PDF生成（将来の拡張）
      const pdfBlob = await generatePDF(reportData)
      
      // ダウンロード
      const url = URL.createObjectURL(pdfBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `学習レポート-${range.start.toISOString().split('T')[0]}-${range.end.toISOString().split('T')[0]}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      showToast('レポートを生成しました', 'success')
    } catch (error) {
      console.error('Failed to generate report:', error)
      showToast('レポートの生成に失敗しました', 'error')
    } finally {
      setIsGenerating(false)
    }
  }

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60)
    const mins = Math.round(minutes % 60)
    if (hours > 0 && mins > 0) {
      return `${hours}時間${mins}分`
    } else if (hours > 0) {
      return `${hours}時間`
    } else {
      return `${mins}分`
    }
  }

  const previewData = () => {
    const range = getDateRange()
    const reportData = aggregateReportData(range.start, range.end)
    return reportData
  }

  const preview = previewData()

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          レポート生成
        </h2>
      </CardHeader>
      <CardBody className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">期間</label>
          <Select
            value={periodType}
            onChange={(e) => setPeriodType(e.target.value as typeof periodType)}
            options={[
              { value: 'week', label: '今週' },
              { value: 'month', label: '今月' },
              { value: 'lastMonth', label: '先月' },
              { value: 'custom', label: 'カスタム' },
            ]}
          />
        </div>

        {periodType === 'custom' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">開始日</label>
              <Input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">終了日</label>
              <Input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* プレビュー */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <h3 className="text-sm font-medium text-gray-900">プレビュー</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p>総学習時間: {formatTime(preview.totalStudyTime)}</p>
            <p>総タスク数: {preview.totalTasks}件</p>
            <p>完了タスク数: {preview.completedTasks}件</p>
            <p>完了率: {preview.completionRate.toFixed(1)}%</p>
            <p>科目数: {preview.subjectStats.length}科目</p>
          </div>
        </div>

        <div className="pt-4">
          <Button
            variant="primary"
            onClick={handleGenerate}
            disabled={isGenerating || (periodType === 'custom' && (!customStartDate || !customEndDate))}
            className="w-full"
          >
            {isGenerating ? (
              '生成中...'
            ) : (
              <>
                <FileDown className="h-5 w-5 mr-2" />
                PDFレポートを生成
              </>
            )}
          </Button>
        </div>

        <p className="text-xs text-gray-500">
          注意: 現在は基本構造のみを実装しています。実際のPDF生成機能は将来の拡張として実装予定です。
        </p>
      </CardBody>
    </Card>
  )
}


