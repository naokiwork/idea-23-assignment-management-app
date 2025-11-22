/**
 * テンプレート適用
 */

import type { StudyLogTemplate } from '../types'
import { getTask } from '../api/tasks'
import { getSubject } from '../api/subjects'

export interface TemplateVariables {
  date?: string
  subject?: string
  task?: string
  [key: string]: string | undefined
}

/**
 * テンプレートの変数を置換
 */
export function applyTemplate(
  template: StudyLogTemplate,
  variables: TemplateVariables = {}
): Partial<{
  content: string
  startTime: string
  endTime: string
}> {
  let content = template.content

  // 変数の置換
  Object.entries(variables).forEach(([key, value]) => {
    if (value) {
      content = content.replace(new RegExp(`\\{${key}\\}`, 'g'), value)
    }
  })

  // デフォルト変数の置換
  if (!variables.date) {
    const today = new Date().toISOString().split('T')[0]
    content = content.replace(/\{date\}/g, today)
  }

  return {
    content,
    startTime: template.startTime || variables.startTime,
    endTime: template.endTime || variables.endTime,
  }
}

/**
 * タスクIDからテンプレート変数を生成
 */
export function generateTemplateVariables(
  taskId?: string,
  date?: string
): TemplateVariables {
  const variables: TemplateVariables = {}

  if (date) {
    variables.date = date
  }

  if (taskId) {
    const task = getTask(taskId)
    if (task) {
      variables.task = task.title
      const subject = getSubject(task.subjectId)
      if (subject) {
        variables.subject = subject.name
      }
    }
  }

  return variables
}


