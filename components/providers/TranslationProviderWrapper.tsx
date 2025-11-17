'use client'

import { TranslationProvider } from '@/lib/hooks/useTranslation'

export function TranslationProviderWrapper({ children }: { children: React.ReactNode }) {
  return <TranslationProvider>{children}</TranslationProvider>
}

