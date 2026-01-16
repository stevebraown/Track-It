import ProgressRing from './ProgressRing'
import { Habit, HabitEntry } from '../types'
import { getHabitWeeklyProgress } from '../utils/statistics'
import { CATEGORY_COLORS, getCategoryLabel } from '../utils/categories'

interface ProgressRingGridProps {
  habits: Habit[]
  entries: HabitEntry[]
  className?: string
}

export default function ProgressRingGrid({
  habits,
  entries,
  className = '',
}: ProgressRingGridProps) {
  const weeklyProgress = getHabitWeeklyProgress(
    habits.filter((habit) => habit.status !== 'archived'),
    entries
  )

  return (
    <div className={`bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-16 p-5 shadow-[var(--card-shadow)] ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-h3 font-semibold">Weekly Habit Progress</h3>
        <span className="text-small text-[var(--text-secondary)]">Active habits</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {weeklyProgress.map((item) => (
          <div key={item.habit.id} className="flex flex-col items-center text-center">
            <ProgressRing
              percentage={item.completionRate}
              size={90}
              strokeWidth={8}
              className="mb-2"
              color={CATEGORY_COLORS[item.habit.category]}
            />
            <p className="text-small font-semibold">{item.habit.name}</p>
            <span className="text-xs text-[var(--text-secondary)]">
              {getCategoryLabel(item.habit.category)}
            </span>
            <span
              className="mt-1 text-xs font-medium"
              style={{ color: CATEGORY_COLORS[item.habit.category] }}
            >
              {item.completed}/{item.total}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
