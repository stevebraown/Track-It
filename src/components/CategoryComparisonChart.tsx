import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts'
import { Habit, HabitEntry } from '../types'
import { getCategorySummaries } from '../utils/statistics'
import { CATEGORY_COLORS, getCategoryLabel } from '../utils/categories'
import { getStartOfMonth, getEndOfMonth } from '../utils/date'

interface CategoryComparisonChartProps {
  habits: Habit[]
  entries: HabitEntry[]
  className?: string
}

export default function CategoryComparisonChart({
  habits,
  entries,
  className = '',
}: CategoryComparisonChartProps) {
  const start = getStartOfMonth(new Date())
  const end = getEndOfMonth(new Date())
  const summaries = getCategorySummaries(habits, entries, start, end)
  const data = summaries.map((summary) => ({
    category: getCategoryLabel(summary.category),
    completionRate: summary.completionRate,
    color: CATEGORY_COLORS[summary.category],
  }))

  return (
    <div className={`bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-16 p-5 shadow-[var(--card-shadow)] ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-h3 font-semibold">Category Performance</h3>
        <span className="text-small text-[var(--text-secondary)]">This month</span>
      </div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical">
            <XAxis type="number" domain={[0, 100]} tickLine={false} axisLine={false} />
            <YAxis dataKey="category" type="category" tickLine={false} axisLine={false} width={90} />
            <Tooltip
              formatter={(value: number) => [`${value}%`, 'Completion']}
              contentStyle={{
                background: 'var(--bg-surface)',
                borderRadius: 12,
                border: '1px solid var(--border-color)',
              }}
            />
            <Bar dataKey="completionRate" radius={[8, 8, 8, 8]}>
              {data.map((entry) => (
                <Cell key={entry.category} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
