'use client'

import React, { useEffect, useRef } from 'react'
import { Modal } from '../ui/Modal'
import { Input } from '../ui/Input'
import { useSearch } from '@/lib/hooks/useSearch'
import { Search, X, FileText, BookOpen, Clock, GraduationCap, Calendar } from 'lucide-react'
import type { SearchResult } from '@/lib/utils/searchManager'

interface SearchDialogProps {
  isOpen: boolean
  onClose: () => void
}

const typeIcons = {
  task: FileText,
  subject: BookOpen,
  log: Clock,
  exam: GraduationCap,
  class: Calendar,
}

const typeLabels = {
  task: 'タスク',
  subject: '科目',
  log: '学習ログ',
  exam: 'テスト',
  class: '授業',
}

export const SearchDialog: React.FC<SearchDialogProps> = ({ isOpen, onClose }) => {
  const { query, results, handleSearch, handleSelectResult } = useSearch()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="検索">
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="タスク、科目、学習ログなどを検索..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-10"
          />
        </div>

        {query && (
          <div className="max-h-96 overflow-y-auto">
            {results.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>検索結果が見つかりませんでした</p>
              </div>
            ) : (
              <div className="space-y-2">
                {results.map((result) => {
                  const Icon = typeIcons[result.type]
                  return (
                    <button
                      key={`${result.type}-${result.id}`}
                      onClick={() => handleSelectResult(result)}
                      className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-primary-300 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <Icon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-gray-900 truncate">
                              {result.title}
                            </span>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                              {typeLabels[result.type]}
                            </span>
                          </div>
                          {result.description && (
                            <p className="text-xs text-gray-600 truncate">
                              {result.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {!query && (
          <div className="text-center py-8 text-gray-500">
            <p>検索キーワードを入力してください</p>
          </div>
        )}
      </div>
    </Modal>
  )
}

