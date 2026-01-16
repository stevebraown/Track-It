import { DailyBreakdown } from '../utils/statistics'
import { useId } from 'react'
import Card from './Card'

interface CompletionChartProps {
  dailyBreakdown: DailyBreakdown[]
  className?: string
}

export default function CompletionChart({
  dailyBreakdown,
  className = '',
}: CompletionChartProps) {
  if (dailyBreakdown.length === 0) {
    return null
  }

  const gradientId = useId()
  const maxCompletion = Math.max(...dailyBreakdown.map((d) => d.completionRate), 100)
  const points = dailyBreakdown.map((day, index) => {
    const x = (index / Math.max(dailyBreakdown.length - 1, 1)) * 100
    const y = 40 - (day.completionRate / maxCompletion) * 32 - 4
    return { x, y, day }
  })

  const linePath = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ')
  const areaPath = `${linePath} L 100 40 L 0 40 Z`

  return (
    <Card className={className}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-h3 font-semibold">Completion Trend</h3>
        <span className="text-small text-[var(--text-secondary)]">
          {dailyBreakdown.length} days
        </span>
      </div>
      <div className="relative h-40">
        <svg viewBox="0 0 100 40" className="w-full h-full">
          <defs>
            <linearGradient id={`area-${gradientId}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="var(--accent-start)" stopOpacity="0.45" />
              <stop offset="100%" stopColor="var(--accent-end)" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id={`line-${gradientId}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--accent-start)" />
              <stop offset="100%" stopColor="var(--accent-end)" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill={`url(#area-${gradientId})`} />
          <path d={linePath} fill="none" stroke={`url(#line-${gradientId})`} strokeWidth="2" />
          {points.map(({ x, y, day }) => (
            <circle
              key={day.date}
              cx={x}
              cy={y}
              r="1.6"
              fill="var(--accent)"
            >
              <title>{`${day.date}: ${day.completionRate}%`}</title>
            </circle>
          ))}
        </svg>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-0 right-0 top-4 border-t border-[var(--border-color)] opacity-40" />
          <div className="absolute left-0 right-0 top-1/2 border-t border-[var(--border-color)] opacity-30" />
          <div className="absolute left-0 right-0 bottom-3 border-t border-[var(--border-color)] opacity-20" />
        </div>
      </div>
      {dailyBreakdown.length <= 7 && (
        <div className="flex justify-between text-xs text-[var(--text-secondary)] mt-2">
          {dailyBreakdown.map((day) => (
            <span key={day.date}>{new Date(day.date).getDate()}</span>
          ))}
        </div>
      )}
    </Card>
  )
}
