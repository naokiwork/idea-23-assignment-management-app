/**
 * CSV変換関数
 */

/**
 * データをCSV形式に変換
 */
export function convertToCSV(data: any[], headers: string[]): string {
  if (data.length === 0) {
    return headers.join(',')
  }

  const rows: string[] = []

  // ヘッダー行
  rows.push(headers.map(escapeCSV).join(','))

  // データ行
  for (const row of data) {
    const values = headers.map((header) => {
      const value = row[header]
      if (value === null || value === undefined) {
        return ''
      }
      return String(value)
    })
    rows.push(values.map(escapeCSV).join(','))
  }

  return rows.join('\n')
}

/**
 * CSVの値をエスケープ
 */
function escapeCSV(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

/**
 * CSVデータをBlobとしてダウンロード
 */
export function downloadCSV(csv: string, filename: string): void {
  // BOM付きUTF-8でエンコード（Excelでの文字化けを防ぐ）
  const BOM = '\uFEFF'
  const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

