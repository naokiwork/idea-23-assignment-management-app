/**
 * ID生成ユーティリティ
 * より安全で衝突しにくいIDを生成
 */

let counter = 0

/**
 * より安全なIDを生成
 * Date.now() + カウンター + ランダム文字列の組み合わせ
 */
export function generateId(prefix: string): string {
  counter = (counter + 1) % 10000
  const timestamp = Date.now()
  const random = Math.random().toString(36).slice(2, 11)
  return `${prefix}-${timestamp}-${counter.toString(36)}-${random}`
}

