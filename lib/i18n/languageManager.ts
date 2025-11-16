/**
 * 言語設定管理
 */

export type SupportedLanguage = 'en' | 'ja' | 'zh' | 'hi'

export interface Language {
  code: SupportedLanguage
  name: string
  nativeName: string
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
]

const DEFAULT_LANGUAGE: SupportedLanguage = 'ja'
const LANGUAGE_STORAGE_KEY = 'app-language'

/**
 * 現在の言語を取得
 */
export function getCurrentLanguage(): SupportedLanguage {
  if (typeof window === 'undefined') {
    return DEFAULT_LANGUAGE
  }

  const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY)
  if (stored && isValidLanguage(stored)) {
    return stored as SupportedLanguage
  }

  return detectBrowserLanguage()
}

/**
 * 言語を設定
 */
export function setLanguage(lang: SupportedLanguage): void {
  if (typeof window === 'undefined') {
    return
  }

  localStorage.setItem(LANGUAGE_STORAGE_KEY, lang)
}

/**
 * サポート言語一覧を取得
 */
export function getSupportedLanguages(): Language[] {
  return SUPPORTED_LANGUAGES
}

/**
 * ブラウザ言語を検出
 */
export function detectBrowserLanguage(): SupportedLanguage {
  if (typeof window === 'undefined') {
    return DEFAULT_LANGUAGE
  }

  const browserLang = navigator.language || (navigator as any).userLanguage || ''
  const langCode = browserLang.split('-')[0].toLowerCase()

  if (isValidLanguage(langCode)) {
    return langCode as SupportedLanguage
  }

  return DEFAULT_LANGUAGE
}

/**
 * 有効な言語コードかどうかを判定
 */
function isValidLanguage(lang: string): boolean {
  return SUPPORTED_LANGUAGES.some((l) => l.code === lang)
}

/**
 * 言語コードから言語情報を取得
 */
export function getLanguageByCode(code: string): Language | undefined {
  return SUPPORTED_LANGUAGES.find((l) => l.code === code)
}

