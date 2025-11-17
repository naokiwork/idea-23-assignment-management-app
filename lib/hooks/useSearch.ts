'use client'

import { useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { searchAll, type SearchResult, type SearchResultType } from '../utils/searchManager'

export interface UseSearchOptions {
  types?: SearchResultType[]
  limit?: number
}

export function useSearch(options: UseSearchOptions = {}) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const results = useMemo(() => {
    if (!query.trim()) {
      return []
    }
    return searchAll({
      query,
      types: options.types,
      limit: options.limit,
    })
  }, [query, options.types, options.limit])

  const handleSearch = useCallback((newQuery: string) => {
    setQuery(newQuery)
  }, [])

  const handleSelectResult = useCallback(
    (result: SearchResult) => {
      router.push(result.url)
      setIsOpen(false)
      setQuery('')
    },
    [router]
  )

  const openSearch = useCallback(() => {
    setIsOpen(true)
  }, [])

  const closeSearch = useCallback(() => {
    setIsOpen(false)
    setQuery('')
  }, [])

  return {
    query,
    results,
    isOpen,
    handleSearch,
    handleSelectResult,
    openSearch,
    closeSearch,
  }
}

