import { Habit, Priority } from '../types'
import Card from './Card'

interface TodayHabitItemProps {
  habit: Habit
  completed: boolean
  onToggle: (habitId: string, completed: boolean) => void
}

const PRIORITY_COLORS: Record<Priority, string> = {
  low: 'border-gray-400',
  medium: 'border-primary',
  high: 'border-destructive',
}

const PRIORITY_LABELS: Record<Priority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}

export default function TodayHabitItem({ habit, completed, onToggle }: TodayHabitItemProps) {
  const handleToggle = () => {
    onToggle(habit.id, !completed)
  }

  return (
    <Card
      className={`border-l-4 ${PRIORITY_COLORS[habit.priority]} transition-all ${
        completed ? 'opacity-75' : ''
      }`}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        {/* Checkbox */}
        <button
          onClick={handleToggle}
          className={`mt-1 flex-shrink-0 w-6 h-6 rounded-4 border-2 flex items-center justify-center transition-all ${
            completed
              ? 'bg-success border-success'
              : 'border-[var(--border-color)] hover:border-primary'
          }`}
          aria-label={completed ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {completed && (
            <svg
              className="w-4 h-4 text-white"
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
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3
              className={`text-h3 break-words ${completed ? 'line-through text-[var(--text-secondary)]' : ''}`}
            >
              {habit.name}
            </h3>
            <span
              className={`px-2 py-0.5 rounded-4 text-small flex-shrink-0 ${
                completed
                  ? 'bg-gray-500 text-white'
                  : habit.priority === 'high'
                  ? 'bg-destructive text-white'
                  : habit.priority === 'medium'
                  ? 'bg-primary text-white'
                  : 'bg-gray-500 text-white'
              }`}
            >
              {PRIORITY_LABELS[habit.priority]}
            </span>
          </div>
          {habit.description && (
            <p className="text-small text-[var(--text-secondary)] break-words">{habit.description}</p>
          )}
        </div>
      </div>
    </Card>
  )
}
