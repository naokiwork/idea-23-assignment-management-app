/**
 * 科目CSVエクスポート
 */

import type { Subject, Timetable } from '../types'
import { convertToCSV, downloadCSV } from './csvExporter'
import { getAllSubjects } from '../api/subjects'
import { getAllTimetables } from '../api/timetables'

export interface SubjectExportOptions {
  includeTimetables?: boolean
}

/**
 * 科目データをCSV形式に変換
 */
export function exportSubjectsToCSV(options: SubjectExportOptions = {}): void {
  const subjects = getAllSubjects()
  const timetables = getAllTimetables()

  const timetableMap = new Map<string, Timetable[]>()
  for (const tt of timetables) {
    if (!timetableMap.has(tt.subjectId)) {
      timetableMap.set(tt.subjectId, [])
    }
    timetableMap.get(tt.subjectId)!.push(tt)
  }

  // CSVデータの準備
  const csvData = subjects.map((subject) => {
    const row: Record<string, string> = {
      id: subject.id,
      name: subject.name,
      teacher: subject.teacher || '',
      year: subject.year || '',
      semester: subject.semester || '',
    }

    if (options.includeTimetables) {
      const subjectTimetables = timetableMap.get(subject.id) || []
      const timetableStr = subjectTimetables
        .map((tt) => `${tt.dayOfWeek}曜${tt.period}限`)
        .join('; ')
      row.timetables = timetableStr
    }

    return row
  })

  const headers = [
    'id',
    'name',
    'teacher',
    'year',
    'semester',
    ...(options.includeTimetables ? ['timetables'] : []),
  ]

  const csv = convertToCSV(csvData, headers)
  const filename = `subjects_${new Date().toISOString().split('T')[0]}.csv`
  downloadCSV(csv, filename)
}

