'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardBody, CardHeader } from '../ui/Card'
import { Button } from '../ui/Button'
import { Trash2, Download, RotateCcw } from 'lucide-react'
import { getAllBackups, removeBackup, restoreBackup } from '@/lib/api/backups'
import type { BackupMetadata } from '@/lib/utils/autoBackup'
import { useToast } from '../ui/Toast'

export const BackupList: React.FC = () => {
  const { showToast } = useToast()
  const [backups, setBackups] = useState<BackupMetadata[]>([])
  const [restoringId, setRestoringId] = useState<string | null>(null)

  useEffect(() => {
    loadBackups()
  }, [])

  const loadBackups = () => {
    setBackups(getAllBackups())
  }

  const handleDelete = (id: string) => {
    if (confirm('このバックアップを削除しますか？')) {
      removeBackup(id)
      loadBackups()
      showToast('バックアップを削除しました', 'success')
    }
  }

  const handleRestore = async (id: string) => {
    if (!confirm('このバックアップからデータを復元しますか？現在のデータは上書きされます。')) {
      return
    }
    
    setRestoringId(id)
    try {
      restoreBackup(id, 'replace')
      showToast('バックアップからデータを復元しました', 'success')
      // ページをリロードしてデータを反映
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (error) {
      console.error('Failed to restore backup:', error)
      showToast('バックアップの復元に失敗しました', 'error')
    } finally {
      setRestoringId(null)
    }
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  if (backups.length === 0) {
    return (
      <Card>
        <CardBody>
          <p className="text-gray-500 text-center py-8">バックアップがありません</p>
        </CardBody>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold text-gray-900">バックアップ一覧</h2>
      </CardHeader>
      <CardBody>
        <div className="space-y-3">
          {backups.map((backup) => (
            <div
              key={backup.id}
              className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-base font-medium text-gray-900">
                      {formatDate(backup.timestamp)}
                    </h3>
                    <span className="text-xs text-gray-500">v{backup.version}</span>
                  </div>
                  <p className="text-sm text-gray-600">サイズ: {formatSize(backup.size)}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRestore(backup.id)}
                    disabled={restoringId === backup.id}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    {restoringId === backup.id ? '復元中...' : '復元'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(backup.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  )
}


