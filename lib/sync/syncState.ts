/**
 * 同期状態管理
 */

export type SyncStatusType = 'idle' | 'syncing' | 'success' | 'error'

export interface SyncState {
  status: SyncStatusType
  lastSyncTime: Date | null
  error: string | null
  isOnline: boolean
}

let syncState: SyncState = {
  status: 'idle',
  lastSyncTime: null,
  error: null,
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
}

const listeners: Set<(state: SyncState) => void> = new Set()

/**
 * 同期状態を取得
 */
export function getSyncState(): SyncState {
  return { ...syncState }
}

/**
 * 同期状態を更新
 */
export function setSyncState(updates: Partial<SyncState>): void {
  syncState = { ...syncState, ...updates }
  listeners.forEach((listener) => listener(syncState))
}

/**
 * 同期状態の変更を監視
 */
export function subscribeSyncState(listener: (state: SyncState) => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/**
 * オンライン状態を更新
 */
export function updateOnlineStatus(isOnline: boolean): void {
  setSyncState({ isOnline })
}

