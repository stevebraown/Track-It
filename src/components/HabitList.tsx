import { Habit, Priority, DayOfWeek } from '../types'
import Card from './Card'
import Button from './Button'
import EmptyState from './EmptyState'
import { Target, Pencil, Trash2 } from 'lucide-react'
import { CATEGORY_COLORS, getCategoryLabel, getCategoryIcon } from '../utils/categories'

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
        icon={<Target className="w-12 h-12 text-[var(--text-secondary)] mx-auto" />}
        title="No habits yet"
        description="Create your first habit to start tracking your progress and building better routines."
      />
    )
  }

  return (
    <div className="space-y-4">
      {habits.map((habit, index) => (
        <div
          key={habit.id}
          className="animate-fade-in"
          style={{ animationDelay: `${index * 30}ms` }}
        >
          <Card className="hover:shadow-[var(--card-shadow-hover)] transition-all duration-300">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
              <div className="flex items-start gap-4 flex-1">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white"
                  style={{ backgroundColor: CATEGORY_COLORS[habit.category] }}
                >
                  <span className="text-sm font-semibold">
                    {getCategoryIcon(habit.category)}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h4 className="text-h3 font-semibold">{habit.name}</h4>
                    <span
                      className="px-2.5 py-1 rounded-full text-xs font-medium text-[var(--text-primary)] bg-[var(--accent-soft)]"
                    >
                      {getCategoryLabel(habit.category)}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium text-[var(--text-primary)] bg-[var(--bg-primary)]">
                      {PRIORITY_LABELS[habit.priority]}
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-2 text-small text-[var(--text-secondary)]">
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
                  </div>
                  {habit.description && (
                    <p className="mt-3 text-body text-[var(--text-secondary)]">
                      {habit.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-2 w-full lg:w-auto">
                <Button
                  variant="ghost"
                  onClick={() => onEdit(habit)}
                  className="flex-1 lg:flex-none"
                >
                  <span className="inline-flex items-center gap-2">
                    <Pencil className="w-4 h-4" />
                    Edit
                  </span>
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to delete "${habit.name}"?`)) {
                      onDelete(habit.id)
                    }
                  }}
                  className="flex-1 lg:flex-none"
                >
                  <span className="inline-flex items-center gap-2">
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </span>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      ))}
    </div>
  )
}
