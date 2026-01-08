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
import HistoryDayCard from '../components/HistoryDayCard'
import Card from '../components/Card'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import Button from '../components/Button'

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
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (habits.length === 0) {
    return (
      <div>
        <h2 className="text-h1 mb-6">History</h2>
        <EmptyState
          icon="📊"
          title="No history yet"
          description="Create some habits and start tracking to see your progress history and statistics."
        />
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-h1 mb-4">History & Insights</h2>

        {/* View Mode Selector */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Button
            variant={viewMode === 'daily' ? 'primary' : 'ghost'}
            onClick={() => setViewMode('daily')}
          >
            Daily
          </Button>
          <Button
            variant={viewMode === 'weekly' ? 'primary' : 'ghost'}
            onClick={() => setViewMode('weekly')}
          >
            Weekly
          </Button>
          <Button
            variant={viewMode === 'monthly' ? 'primary' : 'ghost'}
            onClick={() => setViewMode('monthly')}
          >
            Monthly
          </Button>
        </div>

        {/* Date Navigation */}
        <div className="flex items-center justify-between mb-4">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatsCard
            title="Total Habits"
            value={overallStats.totalHabits}
            subtitle="Active habits"
          />
          <StatsCard
            title="Completion Rate"
            value={`${overallStats.averageCompletionRate}%`}
            subtitle={`${overallStats.totalCompleted} of ${overallStats.totalDueDates} completed`}
          />
          <StatsCard
            title="Completed"
            value={overallStats.totalCompleted}
            subtitle="Habits checked off"
          />
          <StatsCard
            title="Missed"
            value={overallStats.totalMissed}
            subtitle="Habits not completed"
            trend={overallStats.totalMissed > 0 ? 'down' : 'neutral'}
          />
        </div>
      )}

      {/* Top Streaks */}
      {overallStats && overallStats.habitsWithStreaks.length > 0 && (
        <Card className="mb-6">
          <h3 className="text-h3 mb-4">Top Streaks</h3>
          <div className="space-y-3">
            {overallStats.habitsWithStreaks
              .filter((h) => h.currentStreak > 0)
              .sort((a, b) => b.currentStreak - a.currentStreak)
              .slice(0, 5)
              .map(({ habit, currentStreak, longestStreak }) => (
                <div
                  key={habit.id}
                  className="flex items-center justify-between p-3 bg-[var(--bg-primary)] rounded-8 cursor-pointer hover:bg-[var(--bg-surface)] transition-colors"
                  onClick={() =>
                    setSelectedHabitId(
                      selectedHabitId === habit.id ? null : habit.id
                    )
                  }
                >
                  <div className="flex items-center gap-3">
                    <span className="text-body font-medium">{habit.name}</span>
                    <StreakBadge
                      currentStreak={currentStreak}
                      longestStreak={longestStreak}
                      size="small"
                    />
                  </div>
                  {selectedHabitId === habit.id && (
                    <span className="text-small text-primary">▼</span>
                  )}
                </div>
              ))}
          </div>
        </Card>
      )}

      {/* Selected Habit Details */}
      {selectedHabitStats && (
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-h3">{selectedHabitStats.habit.name}</h3>
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
            />
            <div className="flex items-center">
              <StreakBadge
                currentStreak={selectedHabitStats.currentStreak}
                longestStreak={selectedHabitStats.longestStreak}
                size="medium"
              />
            </div>
            <StatsCard
              title="Completed"
              value={selectedHabitStats.stats.completed}
            />
            <StatsCard
              title="Missed"
              value={selectedHabitStats.stats.missed}
              trend={selectedHabitStats.stats.missed > 0 ? 'down' : 'neutral'}
            />
          </div>
        </Card>
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
            dailyBreakdown.map((day) => (
              <HistoryDayCard
                key={day.date}
                date={day.date}
                habits={habits}
                entries={entries}
              />
            ))
          ) : (
            <EmptyState
              icon="📅"
              title="No data for this period"
              description="No habits were due during this time period."
            />
          )}
        </div>
      </div>
    </div>
  )
}
