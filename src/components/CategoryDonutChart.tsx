import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts'
import { Habit, HabitEntry, HabitCategory } from '../types'
import { getCategorySummaries } from '../utils/statistics'
import { CATEGORY_COLORS, getCategoryLabel } from '../utils/categories'
import { getStartOfMonth, getEndOfMonth } from '../utils/date'

interface CategoryDonutChartProps {
  habits: Habit[]
  entries: HabitEntry[]
  className?: string
}

export default function CategoryDonutChart({
  habits,
  entries,
  className = '',
}: CategoryDonutChartProps) {
  const start = getStartOfMonth(new Date())
  const end = getEndOfMonth(new Date())
  const summaries = getCategorySummaries(habits, entries, start, end)
  const data = summaries.filter((summary) => summary.total > 0)

  const overallRate =
    summaries.reduce((acc, item) => acc + item.completed, 0) /
    Math.max(summaries.reduce((acc, item) => acc + item.total, 0), 1)

  return (
    <div className={`bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-16 p-5 shadow-[var(--card-shadow)] ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-h3 font-semibold">Category Distribution</h3>
        <span className="text-small text-[var(--text-secondary)]">This month</span>
      </div>
      <div className="h-56 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="completed"
              nameKey="category"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
            >
              {data.map((entry) => (
                <Cell key={entry.category} fill={CATEGORY_COLORS[entry.category]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [
                `${value} completions`,
                getCategoryLabel(name as HabitCategory),
              ]}
              contentStyle={{
                background: 'var(--bg-surface)',
                borderRadius: 12,
                border: '1px solid var(--border-color)',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-small text-[var(--text-secondary)]">Overall</p>
          <p className="text-h2 font-bold">{Math.round(overallRate * 100)}%</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 mt-4 text-xs text-[var(--text-secondary)]">
        {data.slice(0, 6).map((summary) => (
          <span key={summary.category} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[summary.category] }} />
            {getCategoryLabel(summary.category)} {summary.completionRate}%
          </span>
        ))}
      </div>
    </div>
  )
}
