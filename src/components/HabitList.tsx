import { Habit, Priority, DayOfWeek } from '../types'
import Card from './Card'
import Button from './Button'
import EmptyState from './EmptyState'

interface HabitListProps {
  habits: Habit[]
  onEdit: (habit: Habit) => void
  onDelete: (habitId: string) => void
}

const DAY_NAMES: Record<DayOfWeek, string> = {
  0: 'Sun',
  1: 'Mon',
  2: 'Tue',
  3: 'Wed',
  4: 'Thu',
  5: 'Fri',
  6: 'Sat',
}

const PRIORITY_COLORS: Record<Priority, string> = {
  low: 'bg-gray-500',
  medium: 'bg-primary',
  high: 'bg-destructive',
}

const PRIORITY_LABELS: Record<Priority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}

function formatCadence(habit: Habit): string {
  switch (habit.cadence) {
    case 'daily':
      return 'Daily'
    case 'weekly': {
      const days = (habit.cadenceConfig as { days: DayOfWeek[] }).days
      if (days.length === 0) return 'Weekly (no days selected)'
      if (days.length === 7) return 'Daily'
      const dayLabels = days.map((d) => DAY_NAMES[d]).join(', ')
      return `Weekly (${dayLabels})`
    }
    case 'custom':
      return 'Custom'
    default:
      return 'Unknown'
  }
}

function formatDuration(habit: Habit): string {
  const { value, unit } = habit.duration
  const unitLabel = value === 1 ? unit.slice(0, -1) : unit // Remove 's' for singular
  return `${value} ${unitLabel}`
}

export default function HabitList({ habits, onEdit, onDelete }: HabitListProps) {
  if (habits.length === 0) {
    return (
      <EmptyState
        icon="🎯"
        title="No habits yet"
        description="Create your first habit to start tracking your progress and building better routines."
      />
    )
  }

  return (
    <div className="space-y-4">
      {habits.map((habit) => (
        <Card key={habit.id} className="hover:shadow-lg transition-shadow">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1 w-full">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h4 className="text-h3">{habit.name}</h4>
                <span
                  className={`px-2 py-1 rounded-4 text-small text-white ${PRIORITY_COLORS[habit.priority]}`}
                >
                  {PRIORITY_LABELS[habit.priority]}
                </span>
              </div>

              <div className="space-y-1 text-small text-[var(--text-secondary)]">
                <p>
                  <span className="font-medium">Frequency:</span> {formatCadence(habit)}
                </p>
                <p>
                  <span className="font-medium">Duration:</span> {formatDuration(habit)}
                </p>
                {habit.reminderTime && (
                  <p>
                    <span className="font-medium">Reminder:</span> {habit.reminderTime}
                  </p>
                )}
                {habit.description && (
                  <p className="mt-2 text-body">{habit.description}</p>
                )}
              </div>
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <Button variant="ghost" onClick={() => onEdit(habit)} className="flex-1 sm:flex-none">
                Edit
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (window.confirm(`Are you sure you want to delete "${habit.name}"?`)) {
                    onDelete(habit.id)
                  }
                }}
                className="flex-1 sm:flex-none"
              >
                Delete
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
