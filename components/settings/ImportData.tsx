'use client'

import React, { useState } from 'react'
import { Button, Input } from '../ui'
import { Modal } from '../ui'
import { Upload } from 'lucide-react'
import { importBackupFile, mergeBackupData } from '@/lib/api/backup'
import { validateBackupData } from '@/lib/validation/backupValidation'
import { useToast } from '../ui/Toast'
import { Select } from '../ui/Select'

export const ImportData: React.FC = () => {
  const { showToast } = useToast()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [mergeMode, setMergeMode] = useState<'replace' | 'merge'>('replace')
  const [file, setFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setIsModalOpen(true)
    }
  }

  const handleImport = async () => {
    if (!file) return

    try {
      const backupData = await importBackupFile(file)
      const validatedData = validateBackupData(backupData)

      if (!validatedData) {
        showToast('バックアップファイルの形式が正しくありません', 'error')
        return
      }

      mergeBackupData(validatedData, mergeMode)
      showToast('データをインポートしました', 'success')
      setIsModalOpen(false)
      setFile(null)
      
      // ページをリロードしてデータを反映
      window.location.reload()
    } catch (error) {
      console.error('Failed to import data:', error)
      showToast('データのインポートに失敗しました', 'error')
    }
  }

  return (
    <>
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">データのインポート</h3>
        <p className="text-sm text-gray-600 mb-4">
          JSON形式のバックアップファイルをインポートしてデータを復元します。
        </p>
        <div>
          <Input
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="mb-4"
          />
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setFile(null)
        }}
        title="データのインポート"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-700">
            インポートモードを選択してください。
          </p>

          <Select
            label="インポートモード"
            value={mergeMode}
            onChange={(e) => setMergeMode(e.target.value as 'replace' | 'merge')}
            options={[
              { value: 'replace', label: '既存データを上書き' },
              { value: 'merge', label: '既存データとマージ' },
            ]}
          />

          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
            <p className="text-sm text-yellow-800">
              {mergeMode === 'replace'
                ? '既存のデータはすべて削除され、インポートしたデータで置き換えられます。'
                : '既存のデータとインポートしたデータがマージされます。'}
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsModalOpen(false)
                setFile(null)
              }}
            >
              キャンセル
            </Button>
            <Button variant="primary" onClick={handleImport}>
              インポート
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}

