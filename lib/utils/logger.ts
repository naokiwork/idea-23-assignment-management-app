/**
 * ロガーユーティリティ
 * 本番環境ではconsole.logを無効化
 */

/**
 * 開発環境かどうかを判定
 */
function isDevelopment(): boolean {
  if (typeof window === 'undefined') {
    // サーバーサイド
    return process.env.NODE_ENV === 'development'
  }
  // クライアントサイド
  return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
}

export const logger = {
  log: (...args: unknown[]) => {
    if (isDevelopment()) {
      console.log(...args)
    }
  },
  error: (...args: unknown[]) => {
    // エラーは常に記録
    console.error(...args)
  },
  warn: (...args: unknown[]) => {
    if (isDevelopment()) {
      console.warn(...args)
    }
  },
  info: (...args: unknown[]) => {
    if (isDevelopment()) {
      console.info(...args)
    }
  },
}

