import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, ReferenceLine } from 'recharts'
import { Habit, HabitEntry, HabitCategory } from '../types'
import { getWeeklyCategoryCompletion } from '../utils/statistics'
import { CATEGORY_COLORS, HABIT_CATEGORIES } from '../utils/categories'

interface WeeklyCompletionChartProps {
  habits: Habit[]
  entries: HabitEntry[]
  className?: string
}

export default function WeeklyCompletionChart({
  habits,
  entries,
  className = '',
}: WeeklyCompletionChartProps) {
  const weeklyData = getWeeklyCategoryCompletion(habits, entries)
  const maxTotal = Math.max(...weeklyData.map((d) => d.totalCompleted), 0)
  const dailyGoal = Math.max(1, Math.ceil(maxTotal * 0.75))

  const chartData = weeklyData.map((day) => {
    const categoryValues: Record<string, number> = {}
    HABIT_CATEGORIES.forEach((category) => {
      categoryValues[category.value] = day.categories[category.value as HabitCategory] || 0
    })
    return {
      name: day.label,
      total: day.totalCompleted,
      ...categoryValues,
    }
  })

  return (
    <div className={`bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-16 p-5 shadow-[var(--card-shadow)] ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-h3 font-semibold">Weekly Completions</h3>
        <span className="text-small text-[var(--text-secondary)]">Mon - Sun</span>
      </div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="name" tickLine={false} axisLine={false} />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
            <Tooltip
              cursor={{ fill: 'rgba(108, 93, 211, 0.08)' }}
              contentStyle={{
                background: 'var(--bg-surface)',
                borderRadius: 12,
                border: '1px solid var(--border-color)',
              }}
            />
            <ReferenceLine y={dailyGoal} stroke="var(--accent)" strokeDasharray="4 4" />
            {HABIT_CATEGORIES.map((category) => (
              <Bar
                key={category.value}
                dataKey={category.value}
                stackId="weekly"
                fill={CATEGORY_COLORS[category.value]}
                radius={[6, 6, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap gap-3 mt-4 text-xs text-[var(--text-secondary)]">
        {HABIT_CATEGORIES.slice(0, 6).map((category) => (
          <span key={category.value} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[category.value] }} />
            {category.label}
          </span>
        ))}
      </div>
    </div>
  )
}
