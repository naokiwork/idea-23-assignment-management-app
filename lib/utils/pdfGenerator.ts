/**
 * PDF生成
 * 
 * 注意: この実装は基本構造のみです。
 * 実際のPDF生成機能を実装するには、jsPDFライブラリの詳細な設定が必要です。
 */

import type { ReportData } from './reportDataAggregation'

/**
 * PDFを生成（将来の拡張用）
 * 
 * 現在は基本構造のみを実装しています。
 * 実際のPDF生成機能を実装するには、jsPDFライブラリとの統合が必要です。
 */
export async function generatePDF(reportData: ReportData): Promise<Blob> {
  // 将来の実装: jsPDFを使用したPDF生成
  // import jsPDF from 'jspdf'
  // const doc = new jsPDF()
  // 
  // // タイトル
  // doc.setFontSize(20)
  // doc.text('学習レポート', 20, 20)
  // 
  // // 期間
  // doc.setFontSize(12)
  // doc.text(`期間: ${getPeriodLabel(reportData.period.start, reportData.period.end)}`, 20, 40)
  // 
  // // 統計情報
  // doc.text(`総学習時間: ${formatTime(reportData.totalStudyTime)}`, 20, 60)
  // doc.text(`総タスク数: ${reportData.totalTasks}`, 20, 70)
  // doc.text(`完了タスク数: ${reportData.completedTasks}`, 20, 80)
  // doc.text(`完了率: ${reportData.completionRate.toFixed(1)}%`, 20, 90)
  // 
  // // 科目別統計
  // let y = 110
  // doc.text('科目別統計:', 20, y)
  // y += 10
  // for (const stat of reportData.subjectStats) {
  //   doc.text(`${stat.subjectName}: ${formatTime(stat.studyTime)}`, 20, y)
  //   y += 10
  // }
  // 
  // // PDFをBlobに変換
  // const pdfBlob = doc.output('blob')
  // return pdfBlob
  
  // 現在は基本構造のみのため、空のBlobを返す
  return new Blob(['PDF generation not yet implemented'], { type: 'application/pdf' })
}

/**
 * 時間をフォーマット（"2時間30分"など）
 */
function formatTime(minutes: number): string {
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

/**
 * 期間のラベルを取得
 */
function getPeriodLabel(startDate: Date, endDate: Date): string {
  const start = startDate.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })
  const end = endDate.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })
  return `${start} 〜 ${end}`
}


