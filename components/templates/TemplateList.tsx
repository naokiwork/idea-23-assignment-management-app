'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardBody, CardHeader } from '../ui/Card'
import { Button, Input } from '../ui'
import { FileText, Search, X } from 'lucide-react'
import { getAllTemplates, deleteTemplate, searchTemplates } from '@/lib/api/studyLogTemplates'
import type { StudyLogTemplate } from '@/lib/types'
import { useToast } from '../ui/Toast'

interface TemplateListProps {
  onSelect?: (template: StudyLogTemplate) => void
  showActions?: boolean
}

export const TemplateList: React.FC<TemplateListProps> = ({
  onSelect,
  showActions = true,
}) => {
  const { showToast } = useToast()
  const [templates, setTemplates] = useState<StudyLogTemplate[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = () => {
    if (searchQuery.trim()) {
      setTemplates(searchTemplates(searchQuery))
    } else {
      setTemplates(getAllTemplates())
    }
  }

  useEffect(() => {
    loadTemplates()
  }, [searchQuery])

  const handleDelete = (id: string) => {
    if (confirm('このテンプレートを削除しますか？')) {
      try {
        deleteTemplate(id)
        loadTemplates()
        showToast('テンプレートを削除しました', 'success')
      } catch (error) {
        console.error('Failed to delete template:', error)
        showToast('テンプレートの削除に失敗しました', 'error')
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900">テンプレート一覧</h3>
      </CardHeader>
      <CardBody className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="テンプレートを検索..."
            className="pl-10"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {templates.length > 0 ? (
          <div className="space-y-2">
            {templates.map((template) => (
              <div
                key={template.id}
                className="border border-gray-200 rounded-lg p-3 hover:border-primary-300 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <h4 className="font-medium text-gray-900">{template.name}</h4>
                      {template.category && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {template.category}
                        </span>
                      )}
                    </div>
                    {template.description && (
                      <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                    )}
                    <p className="text-xs text-gray-500 line-clamp-2">{template.content}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    {onSelect && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onSelect(template)}
                      >
                        適用
                      </Button>
                    )}
                    {showActions && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(template.id)}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        削除
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">
            {searchQuery ? '検索結果が見つかりませんでした' : 'テンプレートがありません'}
          </p>
        )}
      </CardBody>
    </Card>
  )
}


