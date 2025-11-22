'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import {
  isSpeechRecognitionSupported,
  createSpeechRecognition,
  setRecognitionLanguage,
  getErrorMessage,
} from '../utils/speechRecognition'

export interface UseSpeechRecognitionOptions {
  lang?: string
  onResult?: (text: string) => void
  onError?: (error: string) => void
}

export interface UseSpeechRecognitionReturn {
  isSupported: boolean
  isListening: boolean
  transcript: string
  error: string | null
  startListening: () => void
  stopListening: () => void
  reset: () => void
}

/**
 * 音声認識フック
 */
export function useSpeechRecognition(
  options: UseSpeechRecognitionOptions = {}
): UseSpeechRecognitionReturn {
  const { lang = 'ja-JP', onResult, onError } = options
  
  const [isSupported, setIsSupported] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  useEffect(() => {
    setIsSupported(isSpeechRecognitionSupported())
    
    if (isSpeechRecognitionSupported()) {
      const recognition = createSpeechRecognition()
      if (recognition) {
        setRecognitionLanguage(recognition, lang)
        
        recognition.onresult = (event: SpeechRecognitionEvent) => {
          const result = event.results[event.results.length - 1]
          const text = result[0].transcript
          setTranscript(text)
          onResult?.(text)
        }
        
        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          const errorMessage = getErrorMessage(event.error)
          setError(errorMessage)
          setIsListening(false)
          onError?.(errorMessage)
        }
        
        recognition.onend = () => {
          setIsListening(false)
        }
        
        recognitionRef.current = recognition
      }
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
    }
  }, [lang, onResult, onError])

  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      setError('音声認識がサポートされていません')
      return
    }
    
    try {
      setError(null)
      setTranscript('')
      setIsListening(true)
      recognitionRef.current.start()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '音声認識の開始に失敗しました'
      setError(errorMessage)
      setIsListening(false)
      onError?.(errorMessage)
    }
  }, [onError])

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }, [isListening])

  const reset = useCallback(() => {
    setTranscript('')
    setError(null)
    setIsListening(false)
  }, [])

  return {
    isSupported,
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    reset,
  }
}

