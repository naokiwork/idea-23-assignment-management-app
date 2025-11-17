'use client'

import React from 'react'
import { Card, CardBody, CardHeader } from '../ui/Card'
import { defaultShortcuts } from '@/lib/hooks/useKeyboardShortcuts'

export const KeyboardShortcuts: React.FC = () => {
  const formatKey = (shortcut: typeof defaultShortcuts[0]): string => {
    const parts: string[] = []
    if (shortcut.ctrl) parts.push('Ctrl')
    if (shortcut.shift) parts.push('Shift')
    if (shortcut.alt) parts.push('Alt')
    if (shortcut.meta) parts.push('Cmd')
    parts.push(shortcut.key.toUpperCase())
    return parts.join(' + ')
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold text-gray-900">キーボードショートカット</h2>
      </CardHeader>
      <CardBody>
        <div className="space-y-3">
          {defaultShortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
              <span className="text-sm text-gray-700">{shortcut.description}</span>
              <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-300 rounded">
                {formatKey(shortcut)}
              </kbd>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-4">
          注: 入力フィールドにフォーカスがある場合はショートカットは無効になります
        </p>
      </CardBody>
    </Card>
  )
}

