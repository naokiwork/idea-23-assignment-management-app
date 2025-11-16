'use client'

import { useState, useEffect, useCallback } from 'react'
import { getCurrentLanguage, setLanguage, type SupportedLanguage } from '../i18n/languageManager'

type TranslationKey = string
type TranslationParams = Record<string, string | number>

let translations: Record<string, any> = {}
let currentLang: SupportedLanguage = 'ja'

/**
 * 翻訳を読み込む
 */
async function loadTranslations(lang: SupportedLanguage): Promise<void> {
  try {
    const translationModule = await import(`@/messages/${lang}.json`)
    translations = translationModule.default || translationModule
    currentLang = lang
  } catch (error) {
    console.error(`Failed to load translations for ${lang}:`, error)
    // フォールバック: 日本語を読み込む
    if (lang !== 'ja') {
      try {
        const fallbackModule = await import('@/messages/ja.json')
        translations = fallbackModule.default || fallbackModule
        currentLang = 'ja'
      } catch (fallbackError) {
        console.error('Failed to load fallback translations:', fallbackError)
      }
    }
  }
}

/**
 * 翻訳キーから値を取得
 */
function getTranslation(key: TranslationKey, params?: TranslationParams): string {
  const keys = key.split('.')
  let value: any = translations

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k]
    } else {
      // 翻訳が見つからない場合はキーを返す
      return key
    }
  }

  if (typeof value !== 'string') {
    return key
  }

  // パラメータの置換
  if (params) {
    return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
      return params[paramKey]?.toString() || match
    })
  }

  return value
}

/**
 * 翻訳フック
 */
export function useTranslation() {
  const [lang, setLangState] = useState<SupportedLanguage>(getCurrentLanguage())
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadTranslations(lang).then(() => {
      setIsLoading(false)
    })
  }, [lang])

  const changeLanguage = useCallback((newLang: SupportedLanguage) => {
    setLanguage(newLang)
    setIsLoading(true)
    loadTranslations(newLang).then(() => {
      setLangState(newLang)
      setIsLoading(false)
    })
  }, [])

  const t = useCallback(
    (key: TranslationKey, params?: TranslationParams): string => {
      return getTranslation(key, params)
    },
    []
  )

  return {
    t,
    currentLanguage: lang,
    changeLanguage,
    isLoading,
  }
}

