import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '学習タスク管理アプリ',
  description: '学校の予習・復習・課題・テスト勉強を一元管理するアプリ',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}

