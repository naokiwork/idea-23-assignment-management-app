/**
 * テンプレートファイルの型定義
 */

export type DayOfWeekJP = '月' | '火' | '水' | '木' | '金' | '土' | '日'
export type Period = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

export interface SubjectTemplate {
  subjectName: string
  dayOfWeek: DayOfWeekJP
  period: Period
  preparationTemplate?: string
  reviewTemplate?: string
  assignmentTemplate?: string
}

export interface TemplateFile {
  subjects: SubjectTemplate[]
}

export interface ValidationError {
  row?: number
  field?: string
  message: string
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
}

export interface ImportResult {
  success: boolean
  subjects?: any[]
  timetables?: any[]
  tasks?: any[]
  errors?: ValidationError[]
}

