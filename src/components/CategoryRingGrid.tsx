import ProgressRing from './ProgressRing'
import { Habit, HabitEntry } from '../types'
import { getCategorySummaries } from '../utils/statistics'
import { CATEGORY_COLORS, getCategoryLabel } from '../utils/categories'
import { getStartOfMonth, getEndOfMonth } from '../utils/date'

interface CategoryRingGridProps {
  habits: Habit[]
  entries: HabitEntry[]
  className?: string
}

export default function CategoryRingGrid({
  habits,
  entries,
  className = '',
}: CategoryRingGridProps) {
  const start = getStartOfMonth(new Date())
  const end = getEndOfMonth(new Date())
  const summaries = getCategorySummaries(habits, entries, start, end)

  return (
    <div className={`bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-16 p-5 shadow-[var(--card-shadow)] ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-h3 font-semibold">Category Completion</h3>
        <span className="text-small text-[var(--text-secondary)]">This month</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {summaries.map((summary) => (
          <div key={summary.category} className="flex flex-col items-center text-center">
            <ProgressRing
              percentage={summary.completionRate}
              size={80}
              strokeWidth={8}
              color={CATEGORY_COLORS[summary.category]}
            />
            <p className="text-small font-semibold mt-2">{getCategoryLabel(summary.category)}</p>
            <span className="text-xs text-[var(--text-secondary)]">
              {summary.completed}/{summary.total}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
