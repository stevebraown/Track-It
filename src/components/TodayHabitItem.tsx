import { Habit, HabitEntry } from '../types'
import { calculateStreak } from '../utils/statistics'
import Card from './Card'
import StreakBadge from './StreakBadge'
import { Clock, Play, Pause } from 'lucide-react'
import { CATEGORY_COLORS, getCategoryIcon, getCategoryLabel } from '../utils/categories'

interface TodayHabitItemProps {
  habit: Habit
  completed: boolean
  entries: HabitEntry[]
  onToggle: (habitId: string, completed: boolean) => void
}

export default function TodayHabitItem({
  habit,
  completed,
  entries,
  onToggle,
}: TodayHabitItemProps) {
  const handleToggle = () => {
    onToggle(habit.id, !completed)
  }

  // Calculate streak for this habit
  const currentStreak = calculateStreak(habit, entries)
  const durationLabel = `${habit.duration.value} ${habit.duration.unit}`
  const categoryColor = CATEGORY_COLORS[habit.category]

  return (
    <Card
      className={`transition-all duration-300 ${
        completed
          ? 'opacity-70 bg-[var(--bg-surface)]'
          : 'hover:shadow-[var(--card-shadow-hover)]'
      }`}
    >
      <div className="flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-white"
          style={{ backgroundColor: categoryColor }}
        >
          <span className="text-sm font-semibold">{getCategoryIcon(habit.category)}</span>
        </div>

        {/* Habit info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h3
                className={`text-h3 font-semibold truncate transition-all ${
                  completed
                    ? 'line-through text-[var(--text-secondary)]'
                    : 'text-[var(--text-primary)]'
                }`}
              >
                {habit.name}
              </h3>
              <div className="flex items-center gap-3 mt-1 text-small text-[var(--text-secondary)]">
                <span className="uppercase tracking-[0.15em]">
                  {getCategoryLabel(habit.category)}
                </span>
                <span className="uppercase tracking-[0.15em]">
                  {habit.cadence === 'daily' ? 'Daily' : 'Weekly'}
                </span>
                {habit.reminderTime && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {habit.reminderTime}
                  </span>
                )}
                {currentStreak > 0 && <StreakBadge currentStreak={currentStreak} size="small" />}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-body font-semibold">{durationLabel}</p>
                <p className="text-small text-[var(--text-secondary)]">
                  {completed ? 'Done' : 'Planned'}
                </p>
              </div>
              <button
                onClick={handleToggle}
                className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${
                  completed
                    ? 'bg-success border-success text-white'
                    : 'bg-[var(--bg-primary)] border-[var(--border-color)] text-[var(--accent)] hover:border-[var(--accent)]'
                }`}
                aria-label={completed ? 'Mark as incomplete' : 'Mark as complete'}
              >
                {completed ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
            </div>
          </div>
          {habit.description && (
            <p className="text-small text-[var(--text-secondary)] mt-3">
              {habit.description}
            </p>
          )}
        </div>
      </div>
    </Card>
  )
}
