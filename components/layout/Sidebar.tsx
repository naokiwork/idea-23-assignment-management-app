'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BookOpen, CheckSquare, FileText, BarChart3, Settings, Calendar, GraduationCap } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SidebarProps {
  className?: string
}

const navigationItems = [
  { href: '/', label: 'ホーム', icon: Home },
  { href: '/subjects', label: '科目一覧', icon: BookOpen },
  { href: '/classes', label: '授業回', icon: GraduationCap },
  { href: '/tasks', label: 'タスク一覧', icon: CheckSquare },
  { href: '/exams', label: 'テスト管理', icon: Calendar },
  { href: '/logs', label: '学習ログ', icon: FileText },
  { href: '/analytics', label: 'グラフ分析', icon: BarChart3 },
  { href: '/settings', label: '設定', icon: Settings },
]

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        'w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 pt-16 overflow-y-auto',
        className
      )}
    >
      <nav className="p-4 space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

