'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import type { CompletionCandidate } from '@/lib/utils/completionGenerator'
import { getAutoCompleteEngine } from '@/lib/utils/autoCompleteEngine'

interface AutoCompleteInputProps {
  value: string
  onChange: (value: string) => void
  onSelect?: (value: string) => void
  type?: 'memo' | 'subject' | 'time'
  placeholder?: string
  className?: string
  disabled?: boolean
  maxSuggestions?: number
}

export const AutoCompleteInput: React.FC<AutoCompleteInputProps> = ({
  value,
  onChange,
  onSelect,
  type = 'memo',
  placeholder,
  className = '',
  disabled = false,
  maxSuggestions = 5,
}) => {
  const [suggestions, setSuggestions] = useState<CompletionCandidate[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const engine = getAutoCompleteEngine()

  useEffect(() => {
    if (disabled || !value) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    let newSuggestions: CompletionCandidate[] = []
    switch (type) {
      case 'memo':
        newSuggestions = engine.getMemoCompletions(value)
        break
      case 'subject':
        newSuggestions = engine.getSubjectCompletions(value)
        break
      case 'time':
        newSuggestions = engine.getTimeCompletions(value)
        break
    }

    setSuggestions(newSuggestions)
    setShowSuggestions(newSuggestions.length > 0)
    setSelectedIndex(-1)
  }, [value, type, disabled, engine])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }

  const handleSelect = useCallback((suggestion: CompletionCandidate) => {
    onChange(suggestion.value)
    setShowSuggestions(false)
    onSelect?.(suggestion.value)
    inputRef.current?.focus()
  }, [onChange, onSelect])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) {
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev))
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1))
        break
      case 'Enter':
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          e.preventDefault()
          handleSelect(suggestions[selectedIndex])
        }
        break
      case 'Escape':
        setShowSuggestions(false)
        setSelectedIndex(-1)
        break
    }
  }

  // クリックアウトサイドでサジェストを閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    if (showSuggestions) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [showSuggestions])

  return (
    <div className="relative">
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type="text"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (suggestions.length > 0) {
            setShowSuggestions(true)
          }
        }}
        placeholder={placeholder}
        className={className}
        disabled={disabled}
      />
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={`${suggestion.value}-${index}`}
              className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                index === selectedIndex ? 'bg-gray-100' : ''
              }`}
              onClick={() => handleSelect(suggestion)}
              onMouseEnter={() => setSelectedIndex(index)}
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
      )}
    </div>
  )
}


