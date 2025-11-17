'use client'

import React, { useMemo } from 'react'
import { Card, CardBody, CardHeader } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { ExternalLink, Book, Video, FileText, Globe, Star } from 'lucide-react'
import { recommendResources } from '@/lib/utils/recommendationAlgorithm'
import type { Recommendation } from '@/lib/utils/recommendationAlgorithm'

interface ResourceRecommendationProps {
  taskId: string
}

const typeIcons = {
  book: Book,
  video: Video,
  article: FileText,
  website: Globe,
  other: FileText,
}

const typeLabels = {
  book: '書籍',
  video: '動画',
  article: '記事',
  website: 'ウェブサイト',
  other: 'その他',
}

export const ResourceRecommendation: React.FC<ResourceRecommendationProps> = ({ taskId }) => {
  const recommendations = useMemo(() => recommendResources(taskId, 5), [taskId])

  if (recommendations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">推奨学習リソース</h3>
        </CardHeader>
        <CardBody>
          <p className="text-sm text-gray-500">現在、推奨リソースはありません。</p>
        </CardBody>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900">推奨学習リソース</h3>
      </CardHeader>
      <CardBody>
        <div className="space-y-3">
          {recommendations.map((rec: Recommendation) => {
            const resourceType = rec.resource.type as keyof typeof typeIcons
            const Icon = typeIcons[resourceType] || typeIcons.other

            return (
              <div
                key={rec.resource.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start gap-3 flex-1">
                    <Icon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base font-medium text-gray-900 mb-1">
                        {rec.resource.title}
                      </h4>
                      {rec.resource.description && (
                        <p className="text-sm text-gray-600 mb-2">{rec.resource.description}</p>
                      )}
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="default" size="sm">
                          {typeLabels[resourceType]}
                        </Badge>
                        {rec.resource.rating && (
                          <Badge variant="success" size="sm">
                            <Star className="h-3 w-3 mr-1" />
                            {rec.resource.rating}/5
                          </Badge>
                        )}
                        <span className="text-xs text-gray-500">推薦度: {rec.score}点</span>
                      </div>
                      {rec.reason && (
                        <p className="text-xs text-gray-500 mt-2">{rec.reason}</p>
                      )}
                    </div>
                  </div>
                  {rec.resource.url && (
                    <a
                      href={rec.resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      aria-label="リソースを開く"
                    >
                      <ExternalLink className="h-5 w-5" />
                    </a>
                  )}
                </div>
              </div>
            )
          })}
        </div>
        <p className="text-xs text-gray-500 mt-4">
          注意: 現在はルールベースの推薦のみを実装しています。AI推薦機能は将来の拡張として実装予定です。
        </p>
      </CardBody>
    </Card>
  )
}

