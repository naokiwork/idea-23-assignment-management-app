'use client'

import React from 'react'
import { useOnlineStatus } from '@/lib/hooks/useOnlineStatus'
import { WifiOff } from 'lucide-react'

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus()

  if (isOnline) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-pulse">
      <WifiOff className="h-5 w-5" />
      <span className="text-sm font-medium">オフラインです</span>
    </div>
  )
}

