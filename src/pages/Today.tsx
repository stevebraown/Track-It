import { useEffect, useMemo, useState } from 'react'
import { useHabitStore, useEntryStore, useReflectionStore } from '../stores'
import { isHabitDueOnDate } from '../utils/habit'
import { getTodayISO } from '../utils/date'
import TodayHabitItem from '../components/TodayHabitItem'
import DailyReflection from '../components/DailyReflection'
import Card from '../components/Card'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import InstallPrompt from '../components/InstallPrompt'
import { Link } from 'react-router-dom'
import Button from '../components/Button'

export default function Today() {
  const today = getTodayISO()
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  // Store hooks
  const habits = useHabitStore((state) => state.habits)
  const habitsLoading = useHabitStore((state) => state.isLoading)
  const loadHabits = useHabitStore((state) => state.loadHabits)

  const entries = useEntryStore((state) => state.entries)
  const entriesLoading = useEntryStore((state) => state.isLoading)
  const upsertEntry = useEntryStore((state) => state.upsertEntry)
  const loadEntries = useEntryStore((state) => state.loadEntries)

  const reflections = useReflectionStore((state) => state.reflections)
  const reflectionsLoading = useReflectionStore((state) => state.isLoading)
  const upsertReflection = useReflectionStore((state) => state.upsertReflection)
  const loadReflections = useReflectionStore((state) => state.loadReflections)
  
  // Get today's reflection
  const reflection = reflections.find((r) => r.date === today)

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([loadHabits(), loadEntries(), loadReflections()])
      setIsInitialLoad(false)
    }
    loadData()
  }, [loadHabits, loadEntries, loadReflections])

  const isLoading = isInitialLoad || habitsLoading || entriesLoading || reflectionsLoading

  // Filter habits due today
  const habitsDueToday = useMemo(() => {
    return habits.filter((habit) => isHabitDueOnDate(habit, today))
  }, [habits, today])

  // Get completion status for each habit
  const getCompletionStatus = (habitId: string): boolean => {
    const entry = entries.find((e) => e.habitId === habitId && e.date === today)
    return entry?.completed ?? false
  }

  // Calculate completion stats
  const completionStats = useMemo(() => {
    const total = habitsDueToday.length
    const completed = habitsDueToday.filter((habit) => getCompletionStatus(habit.id)).length
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
    return { total, completed, percentage }
  }, [habitsDueToday, entries, today])

  // Handle habit toggle
  const handleToggleHabit = (habitId: string, completed: boolean) => {
    upsertEntry(habitId, today, completed)
  }

  // Handle reflection save
  const handleSaveReflection = (text: string) => {
    upsertReflection(today, text)
  }

  // Format today's date nicely
  const formatToday = () => {
    const date = new Date(today + 'T00:00:00')
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
    return date.toLocaleDateString(undefined, options)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <div>
      {/* Install Prompt */}
      <InstallPrompt />

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-h1 mb-2">Today</h2>
        <p className="text-body text-[var(--text-secondary)]">{formatToday()}</p>
      </div>

      {/* Stats Card */}
      {habitsDueToday.length > 0 && (
        <Card className="mb-6 bg-[var(--bg-surface)]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-small text-[var(--text-secondary)] mb-1">Today's Progress</p>
              <p className="text-h2">
                {completionStats.completed} of {completionStats.total} habits completed
              </p>
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="text-h1 font-semibold">{completionStats.percentage}%</div>
              <div className="flex-1 sm:w-24 h-2 bg-[var(--bg-primary)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-success transition-all duration-300"
                  style={{ width: `${completionStats.percentage}%` }}
                />
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Habits List */}
      <div className="mb-6">
        {habitsDueToday.length === 0 ? (
          <EmptyState
            icon="✨"
            title="No habits due today"
            description={
              habits.length === 0
                ? "Create your first habit to start tracking your progress!"
                : "Great job! You have a day off from your habits."
            }
            action={
              habits.length === 0 ? (
                <Link to="/habits">
                  <Button variant="primary">Create Your First Habit</Button>
                </Link>
              ) : null
            }
          />
        ) : (
          <div className="space-y-3">
            {habitsDueToday.map((habit) => (
              <TodayHabitItem
                key={habit.id}
                habit={habit}
                completed={getCompletionStatus(habit.id)}
                onToggle={handleToggleHabit}
              />
            ))}
          </div>
        )}
      </div>

      {/* Daily Reflection */}
      <DailyReflection
        date={today}
        initialText={reflection?.text || ''}
        onSave={handleSaveReflection}
      />
    </div>
  )
}
