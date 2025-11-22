'use client'

import React, { useState } from 'react'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { Textarea } from '../ui'
import { Share2, Twitter, Facebook, Copy, Check } from 'lucide-react'
import { shareViaWebShare, shareViaTwitter, shareViaFacebook, copyToClipboard, isWebShareSupported } from '@/lib/utils/share'
import { useToast } from '../ui/Toast'

interface ShareButtonProps {
  text: string
  url?: string
  title?: string
  onShare?: () => void
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  text,
  url,
  title,
  onShare,
}) => {
  const { showToast } = useToast()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [customText, setCustomText] = useState(text)
  const [copied, setCopied] = useState(false)

  const handleWebShare = async () => {
    try {
      const shareData: ShareData = {
        title: title || '学習記録',
        text: customText,
        url: url || window.location.href,
      }
      
      const success = await shareViaWebShare(shareData)
      if (success) {
        showToast('共有しました', 'success')
        setIsModalOpen(false)
        onShare?.()
      }
    } catch (error) {
      console.error('Failed to share:', error)
      showToast('共有に失敗しました', 'error')
    }
  }

  const handleTwitterShare = () => {
    shareViaTwitter(customText, url)
    setIsModalOpen(false)
    onShare?.()
  }

  const handleFacebookShare = () => {
    if (url) {
      shareViaFacebook(url)
      setIsModalOpen(false)
      onShare?.()
    } else {
      showToast('URLが必要です', 'error')
    }
  }

  const handleCopy = async () => {
    const shareText = url ? `${customText}\n${url}` : customText
    const success = await copyToClipboard(shareText)
    
    if (success) {
      setCopied(true)
      showToast('クリップボードにコピーしました', 'success')
      setTimeout(() => {
        setCopied(false)
        setIsModalOpen(false)
      }, 1000)
      onShare?.()
    } else {
      showToast('コピーに失敗しました', 'error')
    }
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2"
      >
        <Share2 className="h-4 w-4" />
        共有
      </Button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="共有"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              共有メッセージ
            </label>
            <Textarea
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              rows={4}
              placeholder="共有メッセージを入力してください"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {isWebShareSupported() && (
              <Button variant="primary" onClick={handleWebShare} className="flex-1">
                <Share2 className="h-4 w-4 mr-2" />
                共有
              </Button>
            )}
            
            <Button variant="outline" onClick={handleTwitterShare} className="flex-1">
              <Twitter className="h-4 w-4 mr-2" />
              Twitter
            </Button>
            
            {url && (
              <Button variant="outline" onClick={handleFacebookShare} className="flex-1">
                <Facebook className="h-4 w-4 mr-2" />
                Facebook
              </Button>
            )}
            
            <Button variant="outline" onClick={handleCopy} className="flex-1">
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  コピー済み
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  コピー
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}


