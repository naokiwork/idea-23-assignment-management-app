/**
 * 自動補完エンジン
 */

import {
  generateMemoCompletions,
  generateSubjectCompletions,
  generateTimeCompletions,
  filterMemoCompletions,
  type CompletionCandidate,
} from './completionGenerator'

export interface AutoCompleteOptions {
  enabled: boolean
  maxSuggestions: number
  minInputLength: number
}

const DEFAULT_OPTIONS: AutoCompleteOptions = {
  enabled: true,
  maxSuggestions: 5,
  minInputLength: 0,
}

/**
 * 自動補完エンジン
 */
export class AutoCompleteEngine {
  private options: AutoCompleteOptions
  private memoCompletions: CompletionCandidate[] = []
  private subjectCompletions: CompletionCandidate[] = []
  private timeCompletions: CompletionCandidate[] = []

  constructor(options: Partial<AutoCompleteOptions> = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options }
    this.refreshCompletions()
  }

  /**
   * 補完候補を更新
   */
  refreshCompletions(): void {
    if (!this.options.enabled) {
      return
    }

    this.memoCompletions = generateMemoCompletions(this.options.maxSuggestions * 2)
    this.subjectCompletions = generateSubjectCompletions(this.options.maxSuggestions * 2)
    this.timeCompletions = generateTimeCompletions(this.options.maxSuggestions * 2)
  }

  /**
   * メモの補完候補を取得
   */
  getMemoCompletions(input: string = ''): CompletionCandidate[] {
    if (!this.options.enabled) {
      return []
    }

    if (input.length < this.options.minInputLength) {
      return this.memoCompletions.slice(0, this.options.maxSuggestions)
    }

    return filterMemoCompletions(input, this.memoCompletions, this.options.maxSuggestions)
  }

  /**
   * 科目の補完候補を取得
   */
  getSubjectCompletions(input: string = ''): CompletionCandidate[] {
    if (!this.options.enabled) {
      return []
    }

    if (!input.trim()) {
      return this.subjectCompletions.slice(0, this.options.maxSuggestions)
    }

    const lowerInput = input.toLowerCase()
    return this.subjectCompletions
      .filter(c => c.value.toLowerCase().includes(lowerInput))
      .slice(0, this.options.maxSuggestions)
  }

  /**
   * 時間帯の補完候補を取得
   */
  getTimeCompletions(input: string = ''): CompletionCandidate[] {
    if (!this.options.enabled) {
      return []
    }

    if (!input.trim()) {
      return this.timeCompletions.slice(0, this.options.maxSuggestions)
    }

    const lowerInput = input.toLowerCase()
    return this.timeCompletions
      .filter(c => c.value.toLowerCase().includes(lowerInput))
      .slice(0, this.options.maxSuggestions)
  }

  /**
   * オプションを更新
   */
  updateOptions(options: Partial<AutoCompleteOptions>): void {
    this.options = { ...this.options, ...options }
    if (options.enabled !== undefined || options.maxSuggestions !== undefined) {
      this.refreshCompletions()
    }
  }

  /**
   * 現在のオプションを取得
   */
  getOptions(): AutoCompleteOptions {
    return { ...this.options }
  }
}

/**
 * グローバルな自動補完エンジンインスタンス
 */
let globalEngine: AutoCompleteEngine | null = null

/**
 * グローバルな自動補完エンジンを取得
 */
export function getAutoCompleteEngine(): AutoCompleteEngine {
  if (!globalEngine) {
    globalEngine = new AutoCompleteEngine()
  }
  return globalEngine
}

/**
 * グローバルな自動補完エンジンをリセット
 */
export function resetAutoCompleteEngine(): void {
  globalEngine = null
}


