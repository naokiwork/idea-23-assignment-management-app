/**
 * テンプレートファイルのパーサー
 */

import type { SubjectTemplate, ValidationError } from '../types/template'

/**
 * CSVファイルをパース
 */
export async function parseCSVTemplate(file: File): Promise<{
  data: SubjectTemplate[]
  errors: ValidationError[]
}> {
  const text = await file.text()
  const lines = text.split('\n').filter((line) => line.trim() !== '')
  const errors: ValidationError[] = []

  if (lines.length < 2) {
    errors.push({
      message: 'CSVファイルにはヘッダー行と少なくとも1行のデータが必要です',
    })
    return { data: [], errors }
  }

  const headers = lines[0].split(',').map((h) => h.trim())
  const data: SubjectTemplate[] = []

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]
    const values = parseCSVLine(line)
    
    if (values.length !== headers.length) {
      errors.push({
        row: i + 1,
        message: `列数が一致しません（期待: ${headers.length}, 実際: ${values.length}）`,
      })
      continue
    }

    const row: Record<string, string> = {}
    headers.forEach((header, index) => {
      row[header] = values[index]?.trim() || ''
    })

    const template: SubjectTemplate = {
      subjectName: row['科目名'] || row['subjectName'] || '',
      dayOfWeek: (row['曜日'] || row['dayOfWeek'] || '') as any,
      period: parseInt(row['時限'] || row['period'] || '0', 10) as any,
      preparationTemplate: row['予習テンプレート'] || row['preparationTemplate'] || undefined,
      reviewTemplate: row['復習テンプレート'] || row['reviewTemplate'] || undefined,
      assignmentTemplate: row['課題テンプレート'] || row['assignmentTemplate'] || undefined,
    }

    if (!template.subjectName) {
      errors.push({
        row: i + 1,
        field: '科目名',
        message: '科目名は必須です',
      })
      continue
    }

    data.push(template)
  }

  return { data, errors }
}

/**
 * CSV行をパース（カンマとクォートを考慮）
 */
function parseCSVLine(line: string): string[] {
  const values: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      values.push(current)
      current = ''
    } else {
      current += char
    }
  }

  values.push(current)
  return values
}

/**
 * JSONファイルをパース
 */
export async function parseJSONTemplate(file: File): Promise<{
  data: SubjectTemplate[]
  errors: ValidationError[]
}> {
  const errors: ValidationError[] = []

  try {
    const text = await file.text()
    const json = JSON.parse(text)

    if (!json.subjects || !Array.isArray(json.subjects)) {
      errors.push({
        message: 'JSONファイルには"subjects"配列が必要です',
      })
      return { data: [], errors }
    }

    const data: SubjectTemplate[] = json.subjects.map((item: any, index: number) => {
      if (!item.subjectName) {
        errors.push({
          row: index + 1,
          field: 'subjectName',
          message: '科目名は必須です',
        })
      }

      return {
        subjectName: item.subjectName || '',
        dayOfWeek: item.dayOfWeek || '',
        period: parseInt(item.period || '0', 10),
        preparationTemplate: item.preparationTemplate,
        reviewTemplate: item.reviewTemplate,
        assignmentTemplate: item.assignmentTemplate,
      }
    })

    return { data, errors }
  } catch (error) {
    errors.push({
      message: `JSONのパースに失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`,
    })
    return { data: [], errors }
  }
}

