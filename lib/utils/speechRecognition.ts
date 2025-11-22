/**
 * 音声認識ユーティリティ
 * Web Speech APIを使用した音声認識機能
 */

/**
 * 音声認識がサポートされているかチェック
 */
export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false
  
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
}

/**
 * SpeechRecognitionインスタンスを取得
 */
export function createSpeechRecognition(): SpeechRecognition | null {
  if (typeof window === 'undefined') return null
  
  const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
  
  if (!SpeechRecognitionClass) {
    return null
  }
  
  const recognition = new SpeechRecognitionClass() as SpeechRecognition
  recognition.continuous = false // 連続認識を無効化
  recognition.interimResults = false // 中間結果を無効化
  recognition.lang = 'ja-JP' // デフォルト言語を日本語に設定
  
  return recognition
}

/**
 * 言語を設定
 */
export function setRecognitionLanguage(recognition: SpeechRecognition, lang: string): void {
  recognition.lang = lang
}

/**
 * エラーメッセージを取得
 */
export function getErrorMessage(error: string): string {
  const errorMessages: Record<string, string> = {
    'no-speech': '音声が検出されませんでした',
    'aborted': '音声認識が中断されました',
    'audio-capture': 'マイクへのアクセスができませんでした',
    'network': 'ネットワークエラーが発生しました',
    'not-allowed': 'マイクの使用が許可されていません',
    'service-not-allowed': '音声認識サービスが利用できません',
  }
  
  return errorMessages[error] || '音声認識でエラーが発生しました'
}

