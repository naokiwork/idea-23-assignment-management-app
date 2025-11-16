'use client'

import React from 'react'
import { Select } from '../ui'
import { useTranslation } from '@/lib/hooks/useTranslation'
import { getSupportedLanguages } from '@/lib/i18n/languageManager'

export interface LanguageSelectorProps {
  className?: string
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ className }) => {
  const { t, currentLanguage, changeLanguage } = useTranslation()
  const languages = getSupportedLanguages()

  const options = languages.map((lang) => ({
    value: lang.code,
    label: `${lang.nativeName} (${lang.name})`,
  }))

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value as 'en' | 'ja' | 'zh' | 'hi'
    changeLanguage(newLang)
  }

  return (
    <div className={className}>
      <Select
        label={t('settings.selectLanguage')}
        value={currentLanguage}
        onChange={handleChange}
        options={options}
      />
    </div>
  )
}

