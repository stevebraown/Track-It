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
import ProgressRing from '../components/ProgressRing'
import { Link } from 'react-router-dom'
import Button from '../components/Button'
import { Sparkles, PartyPopper } from 'lucide-react'
import WeeklyCompletionChart from '../components/WeeklyCompletionChart'
import ProgressRingGrid from '../components/ProgressRingGrid'

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
      <div className="flex items-center justify-center min-h-[400px] animate-fade-in">
        <LoadingSpinner size="large" text="Loading your habits..." />
      </div>
    )
  }

  return (
    <div>
      {/* Install Prompt */}
      <InstallPrompt />

      {/* Header */}
      <div className="mb-6">
        <p className="text-small text-[var(--text-secondary)] uppercase tracking-[0.2em]">
          Focus Summary
        </p>
        <h2 className="text-h1 font-bold mb-1">{formatToday()}</h2>
        <p className="text-body text-[var(--text-secondary)]">
          Keep your momentum with a clear snapshot of today's progress.
        </p>
      </div>

      {/* Stats Card */}
      {habitsDueToday.length > 0 && (
        <Card className="mb-8 bg-[var(--bg-surface)] border border-[var(--border-color)] animate-scale-in">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex-1 text-center lg:text-left">
              <p className="text-small text-[var(--text-secondary)] mb-3 font-medium uppercase tracking-[0.2em]">
                Today's Focus
              </p>
              <p className="text-display font-bold mb-2">
                {completionStats.completed} / {completionStats.total}
              </p>
              <div className="flex items-center justify-center lg:justify-start gap-2 text-body text-[var(--text-secondary)]">
                {completionStats.total === completionStats.completed ? (
                  <>
                    <PartyPopper className="w-5 h-5 text-success" />
                    <span>All habits complete</span>
                  </>
                ) : completionStats.completed === 0 ? (
                  <span>Start your first task to build momentum</span>
                ) : (
                  <span>{completionStats.total - completionStats.completed} tasks remaining</span>
                )}
              </div>
            </div>
            <div className="flex-shrink-0">
              <ProgressRing
                percentage={completionStats.percentage}
                size={220}
                strokeWidth={12}
                className="animate-ring-pulse"
              />
            </div>
          </div>
        </Card>
      )}

      {/* Weekly Overview */}
      {habits.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <WeeklyCompletionChart habits={habits} entries={entries} />
          <ProgressRingGrid habits={habits} entries={entries} />
        </div>
      )}

      {/* Habits List */}
      <div className="mb-8">
        {habitsDueToday.length === 0 ? (
          <EmptyState
            icon={<Sparkles className="w-12 h-12 text-[var(--text-secondary)] mx-auto" />}
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
          <div className="space-y-4">
            {habitsDueToday.map((habit, index) => (
              <div
                key={habit.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <TodayHabitItem
                  habit={habit}
                  completed={getCompletionStatus(habit.id)}
                  entries={entries}
                  onToggle={handleToggleHabit}
                />
              </div>
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
