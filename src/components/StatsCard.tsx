import { ReactNode } from 'react'
import Card from './Card'

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: 'up' | 'down' | 'neutral'
  showProgress?: boolean
  progressValue?: number
  className?: string
  icon?: ReactNode
}

export default function StatsCard({
  title,
  value,
  subtitle,
  trend,
  showProgress = false,
  progressValue,
  className = '',
  icon,
}: StatsCardProps) {
  return (
    <Card className={`hover:shadow-lg transition-shadow ${className}`}>
      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <p className="text-small text-[var(--text-secondary)] font-medium uppercase tracking-wide">
            {title}
          </p>
          {icon && <div className="text-[var(--text-secondary)]">{icon}</div>}
        </div>
        <div className="flex items-baseline gap-2 mb-2">
          <p className="text-h1 font-bold">{value}</p>
          {trend && (
            <span
              className={`text-small font-semibold ${
                trend === 'up'
                  ? 'text-success'
                  : trend === 'down'
                  ? 'text-destructive'
                  : 'text-[var(--text-secondary)]'
              }`}
            >
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-small text-[var(--text-secondary)] mb-3">{subtitle}</p>
        )}
        {showProgress && progressValue !== undefined && (
          <div className="mt-2">
            <div className="w-full h-2 bg-[var(--bg-primary)] rounded-full overflow-hidden">
              <div
                className="h-full bg-success transition-all duration-500 ease-out"
                style={{ width: `${progressValue}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
