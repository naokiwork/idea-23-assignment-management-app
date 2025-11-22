'use client'

import React from 'react'
import { Button } from '../ui/Button'
import { Mic, MicOff, Loader2 } from 'lucide-react'
import { useSpeechRecognition } from '@/lib/hooks/useSpeechRecognition'
import { useToast } from '../ui/Toast'

interface VoiceInputProps {
  onTranscript: (text: string) => void
  lang?: string
  disabled?: boolean
}

export const VoiceInput: React.FC<VoiceInputProps> = ({
  onTranscript,
  lang = 'ja-JP',
  disabled = false,
}) => {
  const { showToast } = useToast()
  const {
    isSupported,
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    reset,
  } = useSpeechRecognition({
    lang,
    onResult: (text) => {
      onTranscript(text)
    },
    onError: (errorMessage) => {
      showToast(errorMessage, 'error')
    },
  })

  React.useEffect(() => {
    if (transcript) {
      onTranscript(transcript)
      reset()
    }
  }, [transcript, onTranscript, reset])

  React.useEffect(() => {
    if (error) {
      showToast(error, 'error')
    }
  }, [error, showToast])

  if (!isSupported) {
    return (
      <div className="text-sm text-gray-500">
        音声認識はお使いのブラウザでサポートされていません
      </div>
    )
  }

  const handleToggle = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  return (
    <Button
      type="button"
      variant={isListening ? 'primary' : 'outline'}
      size="sm"
      onClick={handleToggle}
      disabled={disabled}
      className="flex items-center gap-2"
    >
      {isListening ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          音声認識中...
        </>
      ) : (
        <>
          <Mic className="h-4 w-4" />
          音声入力
        </>
      )}
    </Button>
  )
}


