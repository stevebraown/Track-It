import { Habit, Priority, HabitEntry } from '../types'
import { calculateStreak } from '../utils/statistics'
import Card from './Card'
import StreakBadge from './StreakBadge'
import { Clock } from 'lucide-react'

interface TodayHabitItemProps {
  habit: Habit
  completed: boolean
  entries: HabitEntry[]
  onToggle: (habitId: string, completed: boolean) => void
}

const PRIORITY_COLORS: Record<Priority, string> = {
  low: 'border-l-gray-400',
  medium: 'border-l-primary',
  high: 'border-l-destructive',
}

const PRIORITY_BG: Record<Priority, string> = {
  low: 'bg-gray-100 dark:bg-gray-800',
  medium: 'bg-primary-light',
  high: 'bg-destructive-light',
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

  return (
    <Card
      className={`border-l-4 ${PRIORITY_COLORS[habit.priority]} transition-all duration-200 ${
        completed
          ? 'opacity-60 bg-[var(--bg-surface)]'
          : `hover:shadow-md ${PRIORITY_BG[habit.priority]}`
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Larger, more tappable checkbox */}
        <button
          onClick={handleToggle}
          className={`mt-0.5 flex-shrink-0 w-7 h-7 rounded-8 border-2 flex items-center justify-center transition-all duration-200 transform active:scale-95 ${
            completed
              ? 'bg-success border-success shadow-sm'
              : 'border-[var(--border-color)] hover:border-primary hover:bg-primary-light'
          }`}
          aria-label={completed ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {completed && (
            <svg
              className="w-5 h-5 text-white animate-checkmark"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </button>

        {/* Habit info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <h3
                className={`text-h3 font-semibold break-words transition-all ${
                  completed
                    ? 'line-through text-[var(--text-secondary)]'
                    : 'text-[var(--text-primary)]'
                }`}
              >
                {habit.name}
              </h3>
              {habit.description && (
                <p className="text-small text-[var(--text-secondary)] mt-1.5 break-words">
                  {habit.description}
                </p>
              )}
            </div>

            {/* Streak badge - only show if streak > 0 */}
            {currentStreak > 0 && (
              <div className="flex-shrink-0">
                <StreakBadge currentStreak={currentStreak} size="small" />
              </div>
            )}
          </div>

          {/* Priority and cadence info */}
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`px-2 py-1 rounded-4 text-small font-medium flex-shrink-0 ${
                completed
                  ? 'bg-gray-400 text-white'
                  : habit.priority === 'high'
                  ? 'bg-destructive text-white'
                  : habit.priority === 'medium'
                  ? 'bg-primary text-white'
                  : 'bg-gray-500 text-white'
              }`}
            >
              {habit.priority === 'high'
                ? 'High'
                : habit.priority === 'medium'
                ? 'Medium'
                : 'Low'}
            </span>
            {habit.reminderTime && (
              <span className="text-small text-[var(--text-secondary)] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {habit.reminderTime}
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
