'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardBody, CardHeader } from '../ui/Card'
import { Button } from '../ui/Button'
import { RefreshCw, CheckCircle, XCircle, Clock, Wifi, WifiOff } from 'lucide-react'
import { syncNow } from '@/lib/sync/syncManager'
import { getSyncState, subscribeSyncState, type SyncStatusType } from '@/lib/sync/syncState'
import { useOnlineStatus } from '@/lib/hooks/useOnlineStatus'
import { useToast } from '../ui/Toast'

const statusConfig: Record<SyncStatusType, { icon: React.ComponentType<{ className?: string }>, color: string, label: string }> = {
  idle: { icon: Clock, color: 'text-gray-500', label: '待機中' },
  syncing: { icon: RefreshCw, color: 'text-blue-500', label: '同期中' },
  success: { icon: CheckCircle, color: 'text-green-500', label: '同期完了' },
  error: { icon: XCircle, color: 'text-red-500', label: '同期エラー' },
}

export const SyncStatus: React.FC = () => {
  const { showToast } = useToast()
  const isOnline = useOnlineStatus()
  const [syncState, setSyncState] = useState(getSyncState())
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const unsubscribe = subscribeSyncState((state) => {
      setSyncState(state)
    })
    return unsubscribe
  }, [])

  useEffect(() => {
    // オンライン状態を同期状態に反映
    if (typeof window !== 'undefined') {
      const handleOnline = () => {
        setSyncState((prev: typeof syncState) => ({ ...prev, isOnline: true }))
      }
      const handleOffline = () => {
        setSyncState((prev: typeof syncState) => ({ ...prev, isOnline: false }))
      }

      window.addEventListener('online', handleOnline)
      window.addEventListener('offline', handleOffline)

      return () => {
        window.removeEventListener('online', handleOnline)
        window.removeEventListener('offline', handleOffline)
      }
    }
  }, [])

  const handleSync = async () => {
    setIsLoading(true)
    try {
      await syncNow()
      showToast('同期が完了しました', 'success')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '同期に失敗しました'
      showToast(errorMessage, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const StatusIcon = statusConfig[syncState.status].icon
  const statusColor = statusConfig[syncState.status].color
  const statusLabel = statusConfig[syncState.status].label

  const formatLastSyncTime = (date: Date | null): string => {
    if (!date) return '未同期'
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days}日前`
    if (hours > 0) return `${hours}時間前`
    if (minutes > 0) return `${minutes}分前`
    return 'たった今'
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold text-gray-900">データ同期</h2>
      </CardHeader>
      <CardBody className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isOnline ? (
              <Wifi className="h-5 w-5 text-green-500" />
            ) : (
              <WifiOff className="h-5 w-5 text-gray-400" />
            )}
            <div>
              <p className="text-sm font-medium text-gray-900">
                {isOnline ? 'オンライン' : 'オフライン'}
              </p>
              <p className="text-xs text-gray-500">
                最終同期: {formatLastSyncTime(syncState.lastSyncTime)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusIcon className={`h-5 w-5 ${statusColor}`} />
            <span className={`text-sm font-medium ${statusColor}`}>{statusLabel}</span>
          </div>
        </div>

        {syncState.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-800">{syncState.error}</p>
          </div>
        )}

        <div className="pt-2">
          <Button
            onClick={handleSync}
            disabled={!isOnline || isLoading || syncState.status === 'syncing'}
            variant="primary"
            className="w-full"
          >
            {isLoading || syncState.status === 'syncing' ? (
              <>
                <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                同期中...
              </>
            ) : (
              <>
                <RefreshCw className="h-5 w-5 mr-2" />
                今すぐ同期
              </>
            )}
          </Button>
        </div>

        <p className="text-xs text-gray-500">
          注意: 現在はローカルストレージのみを使用しています。クラウド同期機能は将来の拡張として実装予定です。
        </p>
      </CardBody>
    </Card>
  )
}

