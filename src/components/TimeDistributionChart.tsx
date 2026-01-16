import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'
import { HabitEntry } from '../types'
import { getTimeOfDayDistribution } from '../utils/statistics'

interface TimeDistributionChartProps {
  entries: HabitEntry[]
  className?: string
}

export default function TimeDistributionChart({
  entries,
  className = '',
}: TimeDistributionChartProps) {
  const data = getTimeOfDayDistribution(entries).map((bucket) => ({
    hour: `${bucket.hour}:00`,
    count: bucket.count,
  }))

  return (
    <div className={`bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-16 p-5 shadow-[var(--card-shadow)] ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-h3 font-semibold">Time Distribution</h3>
        <span className="text-small text-[var(--text-secondary)]">Completions by hour</span>
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="hour" tickLine={false} axisLine={false} hide />
            <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip
              formatter={(value: number) => [`${value} completions`, '']}
              contentStyle={{
                background: 'var(--bg-surface)',
                borderRadius: 12,
                border: '1px solid var(--border-color)',
              }}
            />
            <Bar dataKey="count" fill="var(--accent)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
