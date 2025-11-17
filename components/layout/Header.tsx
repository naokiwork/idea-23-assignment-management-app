'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Search } from 'lucide-react'
import { Sidebar } from './Sidebar'
import { SearchDialog } from '../search/SearchDialog'
import { Button } from '../ui/Button'
import { useKeyboardShortcuts } from '@/lib/hooks/useKeyboardShortcuts'
import { useTranslation } from '@/lib/hooks/useTranslation'
import { cn } from '@/lib/utils'

export interface HeaderProps {
  className?: string
}

export const Header: React.FC<HeaderProps> = ({ className }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { t } = useTranslation()

  // Ctrl+Kで検索ダイアログを開く
  useKeyboardShortcuts([
    {
      key: 'k',
      ctrl: true,
      action: () => {
        setIsSearchOpen(true)
      },
      description: t('common.button.search'),
    },
  ])

  return (
    <>
      <header className={cn('bg-white border-b border-gray-200 sticky top-0 z-50', className)}>
        <div className="px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-primary-700 transition-colors">
            {t('app.title')}
          </Link>
          <div className="flex items-center gap-2">
            <Button
              variant="text"
              size="sm"
              onClick={() => setIsSearchOpen(true)}
              className="hidden md:flex items-center gap-2"
              aria-label={t('common.button.search')}
            >
              <Search className="h-5 w-5" />
              <span className="text-sm text-gray-500">{t('common.button.search')} (Ctrl+K)</span>
            </Button>
            <button
              className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={t('nav.menu')}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>

      <SearchDialog isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* モバイルメニュー */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="bg-white w-64 h-full shadow-lg" onClick={(e) => e.stopPropagation()}>
            <Sidebar />
          </div>
        </div>
      )}

      {/* デスクトップサイドバー */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
    </>
  )
}

