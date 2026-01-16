import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'
import { Habit, HabitEntry } from '../types'
import { getBestDayOfWeek } from '../utils/statistics'

interface DayOfWeekBarChartProps {
  habits: Habit[]
  entries: HabitEntry[]
  className?: string
}

export default function DayOfWeekBarChart({
  habits,
  entries,
  className = '',
}: DayOfWeekBarChartProps) {
  const data = getBestDayOfWeek(habits, entries)

  return (
    <div className={`bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-16 p-5 shadow-[var(--card-shadow)] ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-h3 font-semibold">Best Day of Week</h3>
        <span className="text-small text-[var(--text-secondary)]">Completion rate</span>
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="day" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} domain={[0, 100]} />
            <Tooltip
              formatter={(value: number) => [`${value}%`, 'Completion']}
              contentStyle={{
                background: 'var(--bg-surface)',
                borderRadius: 12,
                border: '1px solid var(--border-color)',
              }}
            />
            <Bar dataKey="completionRate" fill="url(#dayGradient)" radius={[6, 6, 0, 0]} />
            <defs>
              <linearGradient id="dayGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8B7FE8" />
                <stop offset="100%" stopColor="#6C5DD3" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
