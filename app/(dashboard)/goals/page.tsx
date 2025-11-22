'use client'

import React from 'react'
import { Container } from '@/components'
import { GoalSuggestionsList } from '@/components/goals/GoalSuggestionsList'
import { ToastProvider } from '@/components/ui/Toast'

function GoalsPageContent() {
  return (
    <Container className="py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">学習目標</h1>
      
      <div className="space-y-6">
        <GoalSuggestionsList />
      </div>
    </Container>
  )
}

export default function GoalsPage() {
  return (
    <ToastProvider>
      <GoalsPageContent />
    </ToastProvider>
  )
}


