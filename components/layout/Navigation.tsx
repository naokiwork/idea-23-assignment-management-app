'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  BookOpen,
  ClipboardList,
  GraduationCap,
  BarChart3,
  FileText,
  Settings,
} from 'lucide-react'

export interface NavItem {
  href: string
  label: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  { href: '/', label: 'ホーム', icon: <Home className="h-5 w-5" /> },
  { href: '/subjects', label: '科目一覧', icon: <BookOpen className="h-5 w-5" /> },
  { href: '/tasks', label: 'タスク一覧', icon: <ClipboardList className="h-5 w-5" /> },
  { href: '/exams', label: 'テスト管理', icon: <GraduationCap className="h-5 w-5" /> },
  { href: '/logs', label: '学習ログ', icon: <FileText className="h-5 w-5" /> },
  { href: '/analytics', label: 'グラフ分析', icon: <BarChart3 className="h-5 w-5" /> },
  { href: '/settings', label: '設定', icon: <Settings className="h-5 w-5" /> },
]

export interface NavigationProps {
  className?: string
}

export const Navigation: React.FC<NavigationProps> = ({ className = '' }) => {
  const pathname = usePathname()

  return (
    <nav className={`${className}`} aria-label="メインナビゲーション">
      <ul className="space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`
                  flex items-center gap-3
                  px-4 py-2
                  rounded-md
                  transition-colors
                  ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

