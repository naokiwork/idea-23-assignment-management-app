/**
 * テンプレートインポートの統合関数
 */

import { parseCSVTemplate, parseJSONTemplate } from './templateParser'
import { validateTemplate } from './templateValidator'
import { convertToSubjects, convertToTimetables, generateTasksFromTemplate } from './templateConverter'
import type { ImportResult } from '../types/template'
import type { Subject, Timetable, Task } from '../types'

/**
 * テンプレートファイルをインポート
 */
export async function importTemplate(file: File): Promise<ImportResult> {
  const isCSV = file.name.endsWith('.csv')
  const isJSON = file.name.endsWith('.json')

  if (!isCSV && !isJSON) {
    return {
      success: false,
      errors: [
        {
          message: 'CSVまたはJSON形式のファイルを選択してください',
        },
      ],
    }
  }

  // パース
  const parseResult = isCSV
    ? await parseCSVTemplate(file)
    : await parseJSONTemplate(file)

  if (parseResult.errors.length > 0) {
    return {
      success: false,
      errors: parseResult.errors,
    }
  }

  // バリデーション
  const validation = validateTemplate(parseResult.data)
  if (!validation.isValid) {
    return {
      success: false,
      errors: validation.errors,
    }
  }

  // データ変換
  const subjects = convertToSubjects(parseResult.data)
  const subjectMap = new Map<string, string>()
  subjects.forEach((subject) => {
    subjectMap.set(subject.name, subject.id)
  })

  const timetables = convertToTimetables(parseResult.data, subjectMap)

  // タスク生成（簡易版：現在の日付を締切日として使用）
  const tasks: Task[] = []
  const now = new Date()
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

  parseResult.data.forEach((template) => {
    const subjectId = subjectMap.get(template.subjectName)
    if (subjectId) {
      const generatedTasks = generateTasksFromTemplate(template, subjectId, nextWeek)
      tasks.push(...generatedTasks)
    }
  })

  return {
    success: true,
    subjects,
    timetables,
    tasks,
  }
}

