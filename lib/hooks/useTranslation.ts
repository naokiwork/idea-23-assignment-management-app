'use client'

import React, { useState, useEffect, useCallback, createContext, useContext } from 'react'
import { getCurrentLanguage, setLanguage, type SupportedLanguage } from '../i18n/languageManager'
import { logger } from '../utils/logger'

type TranslationKey = string
type TranslationParams = Record<string, string | number>

interface TranslationContextType {
  t: (key: TranslationKey, params?: TranslationParams) => string
  currentLanguage: SupportedLanguage
  changeLanguage: (lang: SupportedLanguage) => void
  isLoading: boolean
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

/**
 * 翻訳を読み込む
 */
async function loadTranslations(lang: SupportedLanguage): Promise<Record<string, any>> {
  try {
    const translationModule = await import(`@/messages/${lang}.json`)
    return translationModule.default || translationModule
  } catch (error) {
    logger.error(`Failed to load translations for ${lang}:`, error)
    // フォールバック: 日本語を読み込む
    if (lang !== 'ja') {
      try {
        const fallbackModule = await import('@/messages/ja.json')
        return fallbackModule.default || fallbackModule
      } catch (fallbackError) {
        logger.error('Failed to load fallback translations:', fallbackError)
        return {}
      }
    }
    return {}
  }
}

/**
 * 翻訳キーから値を取得
 */
function getTranslation(translations: Record<string, any>, key: TranslationKey, params?: TranslationParams): string {
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
 * 翻訳プロバイダー
 */
export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<SupportedLanguage>(getCurrentLanguage())
  const [translations, setTranslations] = useState<Record<string, any>>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadTranslations(lang).then((loadedTranslations) => {
      setTranslations(loadedTranslations)
      setIsLoading(false)
    })
  }, [lang])

  const changeLanguage = useCallback((newLang: SupportedLanguage) => {
    setLanguage(newLang)
    setIsLoading(true)
    loadTranslations(newLang).then((loadedTranslations) => {
      setTranslations(loadedTranslations)
      setLangState(newLang)
      setIsLoading(false)
      // 言語変更を通知するためにイベントを発火
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: newLang }))
      }
    })
  }, [])

  const t = useCallback(
    (key: TranslationKey, params?: TranslationParams): string => {
      return getTranslation(translations, key, params)
    },
    [translations]
  )

  const contextValue: TranslationContextType = {
    t,
    currentLanguage: lang,
    changeLanguage,
    isLoading,
  }

  return React.createElement(TranslationContext.Provider, { value: contextValue }, children)
}

/**
 * 翻訳フック
 */
export function useTranslation() {
  const context = useContext(TranslationContext)
  if (!context) {
    // フォールバック: コンテキストがない場合は基本的な実装を返す
    const fallbackT = (key: TranslationKey) => key
    return {
      t: fallbackT,
      currentLanguage: 'ja' as SupportedLanguage,
      changeLanguage: () => {},
      isLoading: false,
    }
  }
  return context
}
