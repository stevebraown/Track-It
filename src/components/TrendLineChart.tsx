import { useMemo, useState } from 'react'
import { Area, Line, ResponsiveContainer, LineChart, XAxis, YAxis, Tooltip } from 'recharts'
import { Habit, HabitEntry } from '../types'
import { calculateMovingAverage, getCompletionTrend } from '../utils/statistics'

type RangeOption = 7 | 30 | 90 | 365

interface TrendLineChartProps {
  habits: Habit[]
  entries: HabitEntry[]
  className?: string
}

export default function TrendLineChart({
  habits,
  entries,
  className = '',
}: TrendLineChartProps) {
  const [range, setRange] = useState<RangeOption>(30)

  const chartData = useMemo(() => {
    const trend = getCompletionTrend(habits, entries, range)
    const movingAverage = calculateMovingAverage(trend, Math.min(7, trend.length))
    return trend.map((point, index) => ({
      date: point.date,
      completionRate: point.completionRate,
      movingAverage: movingAverage[index]?.completionRate ?? point.completionRate,
    }))
  }, [habits, entries, range])

  return (
    <div className={`bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-16 p-5 shadow-[var(--card-shadow)] ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h3 className="text-h3 font-semibold">Trend Over Time</h3>
        <div className="flex gap-2">
          {[7, 30, 90, 365].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setRange(option as RangeOption)}
              className={`px-3 py-2 rounded-full text-xs font-medium ${
                range === option ? 'bg-[var(--accent-gradient)] text-white' : 'bg-[var(--bg-primary)] text-[var(--text-secondary)]'
              }`}
            >
              {option === 365 ? '1Y' : `${option}D`}
            </button>
          ))}
        </div>
      </div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis dataKey="date" tickLine={false} axisLine={false} hide />
            <YAxis tickLine={false} axisLine={false} domain={[0, 100]} />
            <Tooltip
              formatter={(value: number) => [`${value}%`, 'Completion']}
              contentStyle={{
                background: 'var(--bg-surface)',
                borderRadius: 12,
                border: '1px solid var(--border-color)',
              }}
            />
            <Area
              type="monotone"
              dataKey="completionRate"
              stroke="var(--accent)"
              fill="url(#trendGradient)"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="movingAverage"
              stroke="#F59E0B"
              strokeDasharray="4 4"
              dot={false}
            />
            <defs>
              <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.4" />
                <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.05" />
              </linearGradient>
            </defs>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
