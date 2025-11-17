'use client'

import { useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

// routerはuseKeyboardShortcuts内で使用しないため、削除

export interface KeyboardShortcut {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  meta?: boolean
  action: () => void
  description: string
}

/**
 * キーボードショートカットフック
 */
export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // 入力フィールドにフォーカスがある場合は無視
      const target = event.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return
      }

      for (const shortcut of shortcuts) {
        const keyMatches = event.key.toLowerCase() === shortcut.key.toLowerCase()
        const ctrlMatches = shortcut.ctrl ? event.ctrlKey : !event.ctrlKey
        const shiftMatches = shortcut.shift ? event.shiftKey : !event.shiftKey
        const altMatches = shortcut.alt ? event.altKey : !event.altKey
        const metaMatches = shortcut.meta ? event.metaKey : !event.metaKey

        if (keyMatches && ctrlMatches && shiftMatches && altMatches && metaMatches) {
          event.preventDefault()
          shortcut.action()
          break
        }
      }
    },
    [shortcuts]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])
}

/**
 * デフォルトのショートカットキー定義
 */
/**
 * デフォルトのショートカットキー定義を作成
 * routerを使用するため、関数として定義
 */
export function createDefaultShortcuts(router: ReturnType<typeof useRouter>): KeyboardShortcut[] {
  return [
    {
      key: 'h',
      ctrl: true,
      action: () => router.push('/'),
      description: 'ホームに移動 (Ctrl+H)',
    },
    {
      key: 's',
      ctrl: true,
      action: () => router.push('/subjects'),
      description: '科目一覧に移動 (Ctrl+S)',
    },
    {
      key: 't',
      ctrl: true,
      action: () => router.push('/tasks'),
      description: 'タスク一覧に移動 (Ctrl+T)',
    },
    {
      key: 'e',
      ctrl: true,
      action: () => router.push('/exams'),
      description: 'テスト管理に移動 (Ctrl+E)',
    },
    {
      key: 'l',
      ctrl: true,
      action: () => router.push('/logs'),
      description: '学習ログに移動 (Ctrl+L)',
    },
    {
      key: 'a',
      ctrl: true,
      action: () => router.push('/analytics'),
      description: 'グラフ分析に移動 (Ctrl+A)',
    },
    {
      key: ',',
      ctrl: true,
      action: () => router.push('/settings'),
      description: '設定に移動 (Ctrl+,)',
    },
  ]
}

// 後方互換性のため、デフォルトショートカットをエクスポート（使用時はcreateDefaultShortcutsを使用推奨）
export const defaultShortcuts: KeyboardShortcut[] = []

