import { useState, useEffect, useMemo } from 'react'
import { useHabitStore, useEntryStore } from '../stores'
import {
  getOverallStats,
  getDailyBreakdown,
  getHabitStats,
  calculateStreak,
  calculateLongestStreak,
} from '../utils/statistics'
import {
  getTodayISO,
  formatDateISO,
  parseDateISO,
  getStartOfWeek,
  getEndOfWeek,
  getStartOfMonth,
  getEndOfMonth,
  addDays,
  addWeeks,
  addMonths,
} from '../utils/date'
import StatsCard from '../components/StatsCard'
import StreakBadge from '../components/StreakBadge'
import StreakLeaderboard from '../components/StreakLeaderboard'
import HistoryDayCard from '../components/HistoryDayCard'
import CompletionChart from '../components/CompletionChart'
import Card from '../components/Card'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import Button from '../components/Button'
import { BarChart3, CheckSquare, TrendingUp, CheckCircle2, AlertTriangle, Calendar } from 'lucide-react'

type ViewMode = 'daily' | 'weekly' | 'monthly'

export default function History() {
  const habits = useHabitStore((state) => state.habits)
  const habitsLoading = useHabitStore((state) => state.isLoading)
  const loadHabits = useHabitStore((state) => state.loadHabits)

  const entries = useEntryStore((state) => state.entries)
  const entriesLoading = useEntryStore((state) => state.isLoading)
  const loadEntries = useEntryStore((state) => state.loadEntries)

  const [viewMode, setViewMode] = useState<ViewMode>('daily')
  const [selectedDate, setSelectedDate] = useState(getTodayISO())
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null)

  useEffect(() => {
    loadHabits()
    loadEntries()
  }, [loadHabits, loadEntries])

  // Calculate date range based on view mode
  const dateRange = useMemo(() => {
    const date = parseDateISO(selectedDate)
    
    switch (viewMode) {
      case 'daily':
        return { start: selectedDate, end: selectedDate }
      case 'weekly':
        return {
          start: formatDateISO(getStartOfWeek(date)),
          end: formatDateISO(getEndOfWeek(date)),
        }
      case 'monthly':
        return {
          start: formatDateISO(getStartOfMonth(date)),
          end: formatDateISO(getEndOfMonth(date)),
        }
    }
  }, [viewMode, selectedDate])

  // Get overall statistics
  const overallStats = useMemo(() => {
    if (habits.length === 0) return null
    return getOverallStats(habits, entries, dateRange.start, dateRange.end)
  }, [habits, entries, dateRange])

  // Get daily breakdown
  const dailyBreakdown = useMemo(() => {
    if (habits.length === 0) return []
    return getDailyBreakdown(habits, entries, dateRange.start, dateRange.end)
  }, [habits, entries, dateRange])

  // Get selected habit stats
  const selectedHabitStats = useMemo(() => {
    if (!selectedHabitId) return null
    const habit = habits.find((h) => h.id === selectedHabitId)
    if (!habit) return null

    const stats = getHabitStats(habit, entries, dateRange.start, dateRange.end)
    const currentStreak = calculateStreak(habit, entries)
    const longestStreak = calculateLongestStreak(habit, entries)

    return {
      habit,
      stats,
      currentStreak,
      longestStreak,
    }
  }, [selectedHabitId, habits, entries, dateRange])

  const isLoading = habitsLoading || entriesLoading

  // Navigation helpers
  const navigateDate = (direction: 'prev' | 'next') => {
    const current = parseDateISO(selectedDate)
    let newDate: Date

    switch (viewMode) {
      case 'daily':
        newDate = addDays(current, direction === 'next' ? 1 : -1)
        break
      case 'weekly':
        newDate = addWeeks(current, direction === 'next' ? 1 : -1)
        break
      case 'monthly':
        newDate = addMonths(current, direction === 'next' ? 1 : -1)
        break
    }

    setSelectedDate(formatDateISO(newDate))
  }

  const goToToday = () => {
    setSelectedDate(getTodayISO())
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] animate-fade-in">
        <LoadingSpinner size="large" text="Loading history..." />
      </div>
    )
  }

  if (habits.length === 0) {
    return (
      <div>
        <h2 className="text-h1 font-bold mb-8">History</h2>
        <EmptyState
          icon={<BarChart3 className="w-12 h-12 text-[var(--text-secondary)] mx-auto" />}
          title="No history yet"
          description="Create some habits and start tracking to see your progress history and statistics."
        />
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="mb-6">
          <h2 className="text-h1 font-bold mb-2">History & Insights</h2>
          <p className="text-body text-[var(--text-secondary)]">
            Track your progress, streaks, and completion rates over time
          </p>
        </div>

        {/* View Mode Selector */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={viewMode === 'daily' ? 'primary' : 'ghost'}
            onClick={() => setViewMode('daily')}
            className="font-medium"
          >
            Daily
          </Button>
          <Button
            variant={viewMode === 'weekly' ? 'primary' : 'ghost'}
            onClick={() => setViewMode('weekly')}
            className="font-medium"
          >
            Weekly
          </Button>
          <Button
            variant={viewMode === 'monthly' ? 'primary' : 'ghost'}
            onClick={() => setViewMode('monthly')}
            className="font-medium"
          >
            Monthly
          </Button>
        </div>

        {/* Date Navigation */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => navigateDate('prev')}>
            ← Previous
          </Button>
          <div className="flex items-center gap-3">
            <p className="text-body font-medium">
              {viewMode === 'daily'
                ? parseDateISO(selectedDate).toLocaleDateString(undefined, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : viewMode === 'weekly'
                ? `Week of ${parseDateISO(dateRange.start).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  })}`
                : parseDateISO(selectedDate).toLocaleDateString(undefined, {
                    month: 'long',
                    year: 'numeric',
                  })}
            </p>
            <Button variant="ghost" onClick={goToToday} className="text-small">
              Today
            </Button>
          </div>
          <Button variant="ghost" onClick={() => navigateDate('next')}>
            Next →
          </Button>
        </div>
      </div>

      {/* Overall Statistics */}
      {overallStats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-fade-in">
          <StatsCard
            title="Total Habits"
            value={overallStats.totalHabits}
            subtitle="Active habits"
            icon={<CheckSquare className="w-5 h-5" />}
          />
          <StatsCard
            title="Completion Rate"
            value={`${overallStats.averageCompletionRate}%`}
            subtitle={`${overallStats.totalCompleted} of ${overallStats.totalDueDates} completed`}
            showProgress={true}
            progressValue={overallStats.averageCompletionRate}
            icon={<BarChart3 className="w-5 h-5" />}
          />
          <StatsCard
            title="Completed"
            value={overallStats.totalCompleted}
            subtitle="Habits checked off"
            trend="up"
            icon={<CheckCircle2 className="w-5 h-5" />}
          />
          <StatsCard
            title="Missed"
            value={overallStats.totalMissed}
            subtitle="Habits not completed"
            trend={overallStats.totalMissed > 0 ? 'down' : 'neutral'}
            icon={<AlertTriangle className="w-5 h-5" />}
          />
        </div>
      )}

      {/* Top Streaks - Enhanced */}
      {overallStats && (
        <div className="mb-8">
          <StreakLeaderboard
            habits={overallStats.habitsWithStreaks}
            onHabitClick={(habitId) =>
              setSelectedHabitId(
                selectedHabitId === habitId ? null : habitId
              )
            }
          />
        </div>
      )}

      {/* Selected Habit Details */}
      {selectedHabitStats && (
        <Card className="mb-8 border-2 border-primary shadow-md">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-h2 font-bold">{selectedHabitStats.habit.name}</h3>
              <p className="text-small text-[var(--text-secondary)] mt-1">
                Detailed statistics for selected period
              </p>
            </div>
            <Button
              variant="ghost"
              onClick={() => setSelectedHabitId(null)}
            >
              Close
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <StatsCard
              title="Completion Rate"
              value={`${selectedHabitStats.stats.completionRate}%`}
              subtitle={`${selectedHabitStats.stats.completed} of ${selectedHabitStats.stats.totalDue} completed`}
              showProgress={true}
              progressValue={selectedHabitStats.stats.completionRate}
              icon={<TrendingUp className="w-5 h-5" />}
            />
            <Card className="flex items-center justify-center">
              <StreakBadge
                currentStreak={selectedHabitStats.currentStreak}
                longestStreak={selectedHabitStats.longestStreak}
                size="large"
              />
            </Card>
            <StatsCard
              title="Completed"
              value={selectedHabitStats.stats.completed}
              icon={<CheckCircle2 className="w-5 h-5" />}
              trend="up"
            />
            <StatsCard
              title="Missed"
              value={selectedHabitStats.stats.missed}
              trend={selectedHabitStats.stats.missed > 0 ? 'down' : 'neutral'}
              icon={<AlertTriangle className="w-5 h-5" />}
            />
          </div>
        </Card>
      )}

      {/* Completion Chart - for weekly/monthly views */}
      {dailyBreakdown.length > 1 && (
        <div className="mb-6">
          <CompletionChart dailyBreakdown={dailyBreakdown} />
        </div>
      )}

      {/* Daily Breakdown */}
      <div>
        <h3 className="text-h3 mb-4">
          {viewMode === 'daily'
            ? 'Day Details'
            : viewMode === 'weekly'
            ? 'Week Overview'
            : 'Month Overview'}
        </h3>
        <div className="space-y-4">
          {dailyBreakdown.length > 0 ? (
            dailyBreakdown.map((day, index) => (
              <div
                key={day.date}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <HistoryDayCard
                  date={day.date}
                  habits={habits}
                  entries={entries}
                />
              </div>
            ))
          ) : (
            <EmptyState
              icon={<Calendar className="w-12 h-12 text-[var(--text-secondary)] mx-auto" />}
              title="No data for this period"
              description="No habits were due during this time period."
            />
          )}
        </div>
      </div>
    </div>
  )
}
