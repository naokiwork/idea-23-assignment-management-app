'use client'

import React from 'react'
import type { CompletionCandidate } from '@/lib/utils/completionGenerator'

interface AutoCompleteSuggestionsProps {
  suggestions: CompletionCandidate[]
  onSelect: (value: string) => void
  visible: boolean
}

export const AutoCompleteSuggestions: React.FC<AutoCompleteSuggestionsProps> = ({
  suggestions,
  onSelect,
  visible,
}) => {
  if (!visible || suggestions.length === 0) {
    return null
  }

  return (
    <div className="mt-1 border border-gray-200 rounded-lg shadow-lg bg-white max-h-60 overflow-y-auto">
      {suggestions.map((suggestion, index) => (
        <div
          key={`${suggestion.value}-${index}`}
          className="px-4 py-2 cursor-pointer hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
          onClick={() => onSelect(suggestion.value)}
        >
          <div className="text-sm text-gray-900">{suggestion.value}</div>
          {suggestion.frequency > 1 && (
            <div className="text-xs text-gray-500">
              使用回数: {suggestion.frequency}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}


