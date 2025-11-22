/**
 * 学習ログテンプレート管理API
 */

import { generateId } from '../utils/idGenerator'
import type { StudyLogTemplate } from '../types'

const TEMPLATES_KEY = 'study-log-templates'

function getTemplates(): StudyLogTemplate[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(TEMPLATES_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Failed to load templates:', error)
    return []
  }
}

function saveTemplates(templates: StudyLogTemplate[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates))
  } catch (error) {
    console.error('Failed to save templates:', error)
  }
}

/**
 * テンプレートを作成
 */
export function createTemplate(template: Omit<StudyLogTemplate, 'id' | 'createdAt'>): StudyLogTemplate {
  const templates = getTemplates()
  const newTemplate: StudyLogTemplate = {
    ...template,
    id: generateId('tpl'),
    createdAt: new Date().toISOString(),
  }
  templates.push(newTemplate)
  saveTemplates(templates)
  return newTemplate
}

/**
 * すべてのテンプレートを取得
 */
export function getAllTemplates(): StudyLogTemplate[] {
  return getTemplates()
}

/**
 * テンプレートを取得
 */
export function getTemplate(id: string): StudyLogTemplate | undefined {
  return getTemplates().find(t => t.id === id)
}

/**
 * テンプレートを更新
 */
export function updateTemplate(id: string, updates: Partial<StudyLogTemplate>): StudyLogTemplate {
  const templates = getTemplates()
  const index = templates.findIndex(t => t.id === id)
  
  if (index === -1) {
    throw new Error(`Template with ID ${id} not found.`)
  }
  
  const updatedTemplate: StudyLogTemplate = {
    ...templates[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  
  templates[index] = updatedTemplate
  saveTemplates(templates)
  return updatedTemplate
}

/**
 * テンプレートを削除
 */
export function deleteTemplate(id: string): void {
  const templates = getTemplates().filter(t => t.id !== id)
  saveTemplates(templates)
}

/**
 * カテゴリでテンプレートを検索
 */
export function getTemplatesByCategory(category: string): StudyLogTemplate[] {
  return getTemplates().filter(t => t.category === category)
}

/**
 * テンプレートを検索
 */
export function searchTemplates(query: string): StudyLogTemplate[] {
  const lowerQuery = query.toLowerCase()
  return getTemplates().filter(t =>
    t.name.toLowerCase().includes(lowerQuery) ||
    t.description?.toLowerCase().includes(lowerQuery) ||
    t.content.toLowerCase().includes(lowerQuery) ||
    t.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
  )
}


