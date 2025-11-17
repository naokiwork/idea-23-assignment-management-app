/**
 * テンプレートデータから実際のデータモデルへの変換
 */

import type { SubjectTemplate } from '../types/template'
import type { Subject, Timetable, Task, DayOfWeek } from '../types'

const dayOfWeekMap: Record<string, DayOfWeek> = {
  月: 'monday',
  火: 'tuesday',
  水: 'wednesday',
  木: 'thursday',
  金: 'friday',
  土: 'saturday',
  日: 'sunday',
}

/**
 * IDを生成する（簡易版）
 */
function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
}

/**
 * Subjectエンティティに変換
 */
export function convertToSubjects(templates: SubjectTemplate[]): Subject[] {
  const subjects: Subject[] = []
  const seenNames = new Set<string>()

  templates.forEach((template) => {
    if (!seenNames.has(template.subjectName)) {
      subjects.push({
        id: generateId('subj'),
        name: template.subjectName,
      })
      seenNames.add(template.subjectName)
    }
  })

  return subjects
}

/**
 * Timetableエンティティに変換
 */
export function convertToTimetables(
  templates: SubjectTemplate[],
  subjectMap: Map<string, string>
): Timetable[] {
  const timetables: Timetable[] = []

  templates.forEach((template) => {
    const subjectId = subjectMap.get(template.subjectName)
    if (!subjectId) return

    const dayOfWeek = dayOfWeekMap[template.dayOfWeek]
    if (!dayOfWeek) return

    timetables.push({
      id: generateId('tt'),
      subjectId,
      dayOfWeek,
      period: template.period,
    })
  })

  return timetables
}

/**
 * テンプレートからタスクを生成（簡易版）
 * 実際の実装では、授業日付に基づいてタスクを生成する必要がある
 */
export function generateTasksFromTemplate(
  template: SubjectTemplate,
  subjectId: string,
  deadline: Date
): Task[] {
  const tasks: Task[] = []

  if (template.preparationTemplate) {
    tasks.push({
      id: generateId('task'),
      title: template.preparationTemplate,
      subjectId,
      taskType: 'preparation',
      deadline: deadline.toISOString().split('T')[0],
    })
  }

  if (template.reviewTemplate) {
    tasks.push({
      id: generateId('task'),
      title: template.reviewTemplate,
      subjectId,
      taskType: 'review',
      deadline: deadline.toISOString().split('T')[0],
    })
  }

  if (template.assignmentTemplate) {
    tasks.push({
      id: generateId('task'),
      title: template.assignmentTemplate,
      subjectId,
      taskType: 'assignment',
      deadline: deadline.toISOString().split('T')[0],
    })
  }

  return tasks
}

