/**
 * 目標提案管理
 */

import type { GoalSuggestion } from '../utils/goalSuggestionAlgorithm'

const GOAL_SUGGESTIONS_KEY = 'goal-suggestions'
const GOAL_SUGGESTIONS_HISTORY_KEY = 'goal-suggestions-history'

/**
 * 目標提案を取得
 */
export function getGoalSuggestions(): GoalSuggestion[] {
  if (typeof window === 'undefined') return []
  
  try {
    const stored = localStorage.getItem(GOAL_SUGGESTIONS_KEY)
    if (!stored) return []
    return JSON.parse(stored)
  } catch (error) {
    console.error('Failed to load goal suggestions:', error)
    return []
  }
}

/**
 * 目標提案を保存
 */
export function saveGoalSuggestions(suggestions: GoalSuggestion[]): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(GOAL_SUGGESTIONS_KEY, JSON.stringify(suggestions))
  } catch (error) {
    console.error('Failed to save goal suggestions:', error)
  }
}

/**
 * 目標提案を追加
 */
export function addGoalSuggestion(suggestion: GoalSuggestion): void {
  const suggestions = getGoalSuggestions()
  suggestions.push(suggestion)
  saveGoalSuggestions(suggestions)
}

/**
 * 目標提案を削除
 */
export function removeGoalSuggestion(id: string): void {
  const suggestions = getGoalSuggestions()
  const filtered = suggestions.filter((s) => s.id !== id)
  saveGoalSuggestions(filtered)
}

/**
 * 目標提案履歴を取得
 */
export function getGoalSuggestionsHistory(): Array<GoalSuggestion & { action: 'accepted' | 'rejected'; actionDate: string }> {
  if (typeof window === 'undefined') return []
  
  try {
    const stored = localStorage.getItem(GOAL_SUGGESTIONS_HISTORY_KEY)
    if (!stored) return []
    return JSON.parse(stored)
  } catch (error) {
    console.error('Failed to load goal suggestions history:', error)
    return []
  }
}

/**
 * 目標提案履歴を保存
 */
export function saveGoalSuggestionsHistory(history: Array<GoalSuggestion & { action: 'accepted' | 'rejected'; actionDate: string }>): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(GOAL_SUGGESTIONS_HISTORY_KEY, JSON.stringify(history))
  } catch (error) {
    console.error('Failed to save goal suggestions history:', error)
  }
}

/**
 * 目標提案を承認
 */
export function acceptGoalSuggestion(suggestion: GoalSuggestion): void {
  const history = getGoalSuggestionsHistory()
  history.push({
    ...suggestion,
    action: 'accepted',
    actionDate: new Date().toISOString(),
  })
  saveGoalSuggestionsHistory(history)
  removeGoalSuggestion(suggestion.id)
}

/**
 * 目標提案を却下
 */
export function rejectGoalSuggestion(suggestion: GoalSuggestion): void {
  const history = getGoalSuggestionsHistory()
  history.push({
    ...suggestion,
    action: 'rejected',
    actionDate: new Date().toISOString(),
  })
  saveGoalSuggestionsHistory(history)
  removeGoalSuggestion(suggestion.id)
}


