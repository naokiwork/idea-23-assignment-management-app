/**
 * 共有機能
 * Web Share APIを使用した共有機能
 */

/**
 * Web Share APIがサポートされているかチェック
 */
export function isWebShareSupported(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false
  }
  
  return 'share' in navigator
}

/**
 * Web Share APIを使用して共有
 */
export async function shareViaWebShare(data: ShareData): Promise<boolean> {
  if (!isWebShareSupported()) {
    return false
  }
  
  try {
    await navigator.share(data)
    return true
  } catch (error) {
    // ユーザーが共有をキャンセルした場合など
    if (error instanceof Error && error.name === 'AbortError') {
      return false
    }
    console.error('Failed to share:', error)
    throw error
  }
}

/**
 * Twitterで共有
 */
export function shareViaTwitter(text: string, url?: string): void {
  const twitterUrl = new URL('https://twitter.com/intent/tweet')
  twitterUrl.searchParams.set('text', text)
  if (url) {
    twitterUrl.searchParams.set('url', url)
  }
  
  window.open(twitterUrl.toString(), '_blank', 'width=550,height=420')
}

/**
 * Facebookで共有
 */
export function shareViaFacebook(url: string): void {
  const facebookUrl = new URL('https://www.facebook.com/sharer/sharer.php')
  facebookUrl.searchParams.set('u', url)
  
  window.open(facebookUrl.toString(), '_blank', 'width=550,height=420')
}

/**
 * URLをクリップボードにコピー
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.clipboard) {
    // フォールバック: 古い方法
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.opacity = '0'
    document.body.appendChild(textArea)
    textArea.select()
    
    try {
      document.execCommand('copy')
      document.body.removeChild(textArea)
      return true
    } catch (error) {
      document.body.removeChild(textArea)
      return false
    }
  }
  
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    return false
  }
}

/**
 * 共有を実行（Web Share APIを優先、フォールバックとしてURLコピー）
 */
export async function shareContent(
  text: string,
  url?: string,
  title?: string
): Promise<boolean> {
  // Web Share APIを試す
  if (isWebShareSupported()) {
    try {
      const shareData: ShareData = {
        title: title || '学習記録',
        text,
        url: url || window.location.href,
      }
      return await shareViaWebShare(shareData)
    } catch (error) {
      // Web Share APIが失敗した場合はフォールバック
    }
  }
  
  // フォールバック: URLをクリップボードにコピー
  const shareText = url ? `${text}\n${url}` : text
  return await copyToClipboard(shareText)
}


