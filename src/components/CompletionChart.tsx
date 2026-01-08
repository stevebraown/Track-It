import { DailyBreakdown } from '../utils/statistics'
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

  // For weekly/monthly views, show a bar chart
  // For daily view, this might be less useful, but we'll show it anyway
  const maxCompletion = Math.max(
    ...dailyBreakdown.map((d) => d.completionRate),
    100
  )

  return (
    <Card className={className}>
      <h3 className="text-h3 mb-4 font-semibold">Completion Trend</h3>
      <div className="flex items-end justify-between gap-1 h-32">
        {dailyBreakdown.map((day) => {
          const height = (day.completionRate / maxCompletion) * 100
          const isToday = new Date().toISOString().split('T')[0] === day.date

          return (
            <div
              key={day.date}
              className="flex-1 flex flex-col items-center gap-1 group"
            >
              <div className="relative w-full flex items-end justify-center">
                <div
                  className={`w-full rounded-t-4 transition-all duration-300 ${
                    day.completionRate === 100
                      ? 'bg-success'
                      : day.completionRate >= 50
                      ? 'bg-primary'
                      : 'bg-destructive'
                  } ${isToday ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                  style={{ height: `${height}%`, minHeight: '4px' }}
                  title={`${day.date}: ${day.completionRate}%`}
                />
              </div>
              {dailyBreakdown.length <= 7 && (
                <span className="text-small text-[var(--text-secondary)] transform -rotate-45 origin-top-left whitespace-nowrap text-xs">
                  {new Date(day.date).getDate()}
                </span>
              )}
            </div>
          )
        })}
      </div>
      {dailyBreakdown.length > 7 && (
        <p className="text-small text-[var(--text-secondary)] mt-2 text-center">
          {dailyBreakdown.length} days shown
        </p>
      )}
    </Card>
  )
}
