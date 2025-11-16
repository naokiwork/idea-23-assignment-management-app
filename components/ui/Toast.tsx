'use client'

import React, { useEffect, useState } from 'react'
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number
}

export interface ToastProps {
  toast: Toast
  onClose: (id: string) => void
}

const typeStyles: Record<ToastType, { bg: string; text: string; icon: React.ReactNode }> = {
  success: {
    bg: 'bg-success-50 border-success-200',
    text: 'text-success-800',
    icon: <CheckCircle2 className="h-5 w-5 text-success-600" />,
  },
  error: {
    bg: 'bg-error-50 border-error-200',
    text: 'text-error-800',
    icon: <AlertCircle className="h-5 w-5 text-error-600" />,
  },
  warning: {
    bg: 'bg-warning-50 border-warning-200',
    text: 'text-warning-800',
    icon: <AlertTriangle className="h-5 w-5 text-warning-600" />,
  },
  info: {
    bg: 'bg-info-50 border-info-200',
    text: 'text-info-800',
    icon: <Info className="h-5 w-5 text-info-600" />,
  },
}

export const ToastItem: React.FC<ToastProps> = ({ toast, onClose }) => {
  const [isVisible, setIsVisible] = useState(true)
  const styles = typeStyles[toast.type]

  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(() => onClose(toast.id), 300) // アニメーション後に削除
      }, toast.duration)

      return () => clearTimeout(timer)
    }
  }, [toast.duration, toast.id, onClose])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => onClose(toast.id), 300)
  }

  return (
    <div
      className={`
        ${styles.bg} ${styles.text}
        border rounded-lg shadow-lg
        p-4 mb-2
        flex items-start gap-3
        min-w-[300px] max-w-md
        transition-all duration-300
        ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}
      `}
      role="alert"
      aria-live="polite"
    >
      <div className="flex-shrink-0 mt-0.5">
        {styles.icon}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium">{toast.message}</p>
      </div>
      <button
        onClick={handleClose}
        className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="閉じる"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

// Toast管理用のコンテキストとフック
interface ToastContextType {
  showToast: (message: string, type: ToastType, duration?: number) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = (message: string, type: ToastType, duration = 5000) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast: Toast = { id, message, type, duration }
    setToasts((prev) => [...prev, newToast])
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col items-end">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

