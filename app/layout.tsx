import type { Metadata } from 'next'
import './globals.css'
import { TranslationProviderWrapper } from '@/components/providers/TranslationProviderWrapper'

export const metadata: Metadata = {
  title: '学習タスク管理アプリ',
  description: '学校の予習・復習・課題・テスト勉強を一元管理するアプリ',
  themeColor: '#3b82f6',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '学習タスク管理アプリ',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className="antialiased">
        <TranslationProviderWrapper>
          {children}
        </TranslationProviderWrapper>
      </body>
    </html>
  )
}

