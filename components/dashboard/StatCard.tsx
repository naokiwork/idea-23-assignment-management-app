'use client'

import React from 'react'
import { Card, CardBody } from '../ui/Card'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  trend?: number
  icon?: React.ReactNode
  subtitle?: string
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  trend,
  icon,
  subtitle,
}) => {
  const getTrendIcon = () => {
    if (trend === undefined) return null
    if (trend > 0) {
      return <TrendingUp className="h-4 w-4 text-green-500" />
    } else if (trend < 0) {
      return <TrendingDown className="h-4 w-4 text-red-500" />
    } else {
      return <Minus className="h-4 w-4 text-gray-400" />
    }
  }

  const getTrendColor = () => {
    if (trend === undefined) return 'text-gray-500'
    if (trend > 0) return 'text-green-600'
    if (trend < 0) return 'text-red-600'
    return 'text-gray-500'
  }

  return (
    <Card>
      <CardBody>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              {trend !== undefined && (
                <div className={`flex items-center gap-1 text-sm ${getTrendColor()}`}>
                  {getTrendIcon()}
                  <span>{trend > 0 ? '+' : ''}{trend.toFixed(1)}%</span>
                </div>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
          {icon && (
            <div className="text-gray-400">
              {icon}
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  )
}

