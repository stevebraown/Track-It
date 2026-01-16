import { useState, useEffect, useMemo } from 'react'
import { useHabitStore, useEntryStore } from '../stores'
import {
  getOverallStats,
  getDailyBreakdown,
  getHabitStats,
  calculateStreak,
  calculateLongestStreak,
  getCategorySummaries,
  getHabitWeeklyProgress,
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
import StreakLeaderboard from '../components/StreakLeaderboard'
import HistoryDayCard from '../components/HistoryDayCard'
import CompletionChart from '../components/CompletionChart'
import Card from '../components/Card'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import Button from '../components/Button'
import { BarChart3, Calendar } from 'lucide-react'
import WeeklyCompletionChart from '../components/WeeklyCompletionChart'
import CategoryDonutChart from '../components/CategoryDonutChart'
import MonthlyHeatmap from '../components/MonthlyHeatmap'
import ProgressRingGrid from '../components/ProgressRingGrid'
import TimelineCalendar from '../components/TimelineCalendar'
import { getCategoryLabel } from '../utils/categories'
import TrendLineChart from '../components/TrendLineChart'
import DayOfWeekBarChart from '../components/DayOfWeekBarChart'
import CategoryComparisonChart from '../components/CategoryComparisonChart'
import CategoryRingGrid from '../components/CategoryRingGrid'
import TimeDistributionChart from '../components/TimeDistributionChart'

type ViewMode = 'daily' | 'weekly' | 'monthly'
type AnalyticsTab = 'overview' | 'categories' | 'trends' | 'insights'

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
  const [analyticsTab, setAnalyticsTab] = useState<AnalyticsTab>('overview')

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

  const weeklyStats = useMemo(() => {
    if (habits.length === 0) return null
    const start = getStartOfWeek(new Date())
    const end = getEndOfWeek(new Date())
    return getOverallStats(habits, entries, start, end)
  }, [habits, entries])

  // Get daily breakdown
  const dailyBreakdown = useMemo(() => {
    if (habits.length === 0) return []
    return getDailyBreakdown(habits, entries, dateRange.start, dateRange.end)
  }, [habits, entries, dateRange])

  const categorySummaries = useMemo(() => {
    if (habits.length === 0) return []
    return getCategorySummaries(habits, entries, dateRange.start, dateRange.end)
  }, [habits, entries, dateRange])

  const bestCategory = useMemo(() => {
    if (categorySummaries.length === 0) return null
    return categorySummaries.reduce((best, current) =>
      current.completionRate > best.completionRate ? current : best
    )
  }, [categorySummaries])

  const monthlyTimeInvested = useMemo(() => {
    const start = getStartOfMonth(new Date())
    const end = getEndOfMonth(new Date())
    const habitMap = new Map(habits.map((habit) => [habit.id, habit]))
    return entries
      .filter((entry) => entry.completed && entry.date >= formatDateISO(start) && entry.date <= formatDateISO(end))
      .reduce((total, entry) => {
        const habit = habitMap.get(entry.habitId)
        const minutes = entry.duration ?? habit?.targetDuration ?? 0
        return total + minutes
      }, 0)
  }, [habits, entries])

  const consistencyScore = useMemo(() => {
    if (!overallStats) return 0
    return Number((overallStats.averageCompletionRate / 10).toFixed(1))
  }, [overallStats])

  const topHabitsThisWeek = useMemo(() => {
    const weeklyProgress = getHabitWeeklyProgress(habits, entries)
    return weeklyProgress
      .filter((item) => item.total > 0)
      .sort((a, b) => b.completionRate - a.completionRate)
      .slice(0, 3)
  }, [habits, entries])

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

  const bestStreak = useMemo(() => {
    if (!overallStats) return 0
    return overallStats.habitsWithStreaks.reduce(
      (max, entry) => Math.max(max, entry.currentStreak),
      0
    )
  }, [overallStats])

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
          <p className="text-small text-[var(--text-secondary)] uppercase tracking-[0.2em]">
            Productivity Dashboard
          </p>
          <h2 className="text-h1 font-bold mb-2">History & Insights</h2>
          <p className="text-body text-[var(--text-secondary)]">
            Track your progress, streaks, and completion rates over time.
          </p>
        </div>

        <Card className="mb-6">
          {/* View Mode Selector */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              variant={viewMode === 'daily' ? 'primary' : 'ghost'}
              onClick={() => setViewMode('daily')}
              className="font-medium px-5"
            >
              Daily
            </Button>
            <Button
              variant={viewMode === 'weekly' ? 'primary' : 'ghost'}
              onClick={() => setViewMode('weekly')}
              className="font-medium px-5"
            >
              Weekly
            </Button>
            <Button
              variant={viewMode === 'monthly' ? 'primary' : 'ghost'}
              onClick={() => setViewMode('monthly')}
              className="font-medium px-5"
            >
              Monthly
            </Button>
          </div>

          {/* Date Navigation */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
        </Card>

        <div className="flex flex-wrap gap-2">
          {(['overview', 'categories', 'trends', 'insights'] as AnalyticsTab[]).map((tab) => (
            <Button
              key={tab}
              variant={analyticsTab === tab ? 'primary' : 'ghost'}
              onClick={() => setAnalyticsTab(tab)}
              className="capitalize"
            >
              {tab}
            </Button>
          ))}
        </div>
      </div>

      {analyticsTab === 'overview' && (
        <>
          {overallStats && (
            <div className="mb-8 overflow-x-auto">
              <div className="flex gap-4 min-w-[1100px]">
                <div
                  className="min-w-[220px] rounded-16 p-4 text-white"
                  style={{ background: 'var(--gradient-accent)' }}
                >
                  <p className="text-xs uppercase tracking-[0.2em]">Total Habits</p>
                  <p className="text-display font-bold">{overallStats.totalHabits}</p>
                  <p className="text-small opacity-80">Active</p>
                </div>
                <div
                  className="min-w-[220px] rounded-16 p-4 text-white"
                  style={{ background: 'var(--gradient-success)' }}
                >
                  <p className="text-xs uppercase tracking-[0.2em]">Weekly Completion</p>
                  <p className="text-display font-bold">{weeklyStats?.averageCompletionRate ?? 0}%</p>
                  <p className="text-small opacity-80">vs last week</p>
                </div>
                <div
                  className="min-w-[220px] rounded-16 p-4 text-white"
                  style={{ background: 'var(--gradient-streak)' }}
                >
                  <p className="text-xs uppercase tracking-[0.2em]">Current Streak</p>
                  <p className="text-display font-bold">Streak {bestStreak} days</p>
                  <p className="text-small opacity-80">Best in progress</p>
                </div>
                <div
                  className="min-w-[220px] rounded-16 p-4 text-white"
                  style={{ background: 'var(--gradient-info)' }}
                >
                  <p className="text-xs uppercase tracking-[0.2em]">Best Category</p>
                  <p className="text-display font-bold">
                    {bestCategory ? `${bestCategory.completionRate}%` : '—'}
                  </p>
                  <p className="text-small opacity-80">
                    {bestCategory ? getCategoryLabel(bestCategory.category) : 'No data'}
                  </p>
                </div>
                <div
                  className="min-w-[220px] rounded-16 p-4 text-white"
                  style={{ background: 'var(--gradient-warning)' }}
                >
                  <p className="text-xs uppercase tracking-[0.2em]">Time Invested</p>
                  <p className="text-display font-bold">{Math.round(monthlyTimeInvested / 60)}h</p>
                  <p className="text-small opacity-80">This month</p>
                </div>
                <div
                  className="min-w-[220px] rounded-16 p-4 text-white"
                  style={{ background: 'var(--gradient-accent)' }}
                >
                  <p className="text-xs uppercase tracking-[0.2em]">Consistency Score</p>
                  <p className="text-display font-bold">{consistencyScore}/10</p>
                  <p className="text-small opacity-80">Trend this month</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <WeeklyCompletionChart habits={habits} entries={entries} />
            <CategoryDonutChart habits={habits} entries={entries} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <ProgressRingGrid habits={habits} entries={entries} />
            <Card>
              <h3 className="text-h3 font-semibold mb-4">Top Habits This Week</h3>
              {topHabitsThisWeek.length === 0 ? (
                <p className="text-body text-[var(--text-secondary)]">
                  Complete a few habits to see weekly leaders.
                </p>
              ) : (
                <div className="space-y-3">
                  {topHabitsThisWeek.map((item) => (
                    <div
                      key={item.habit.id}
                      className="flex items-center justify-between bg-[var(--bg-primary)] rounded-12 p-3"
                    >
                      <div>
                        <p className="text-body font-semibold">{item.habit.name}</p>
                        <p className="text-small text-[var(--text-secondary)]">
                          {item.completed}/{item.total} completed
                        </p>
                      </div>
                      <span className="text-h3 font-semibold">{item.completionRate}%</span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

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
        </>
      )}

      {analyticsTab === 'categories' && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <CategoryDonutChart habits={habits} entries={entries} />
            <CategoryRingGrid habits={habits} entries={entries} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <CategoryComparisonChart habits={habits} entries={entries} />
            <Card>
              <h3 className="text-h3 font-semibold mb-4">Habits by Category</h3>
              <div className="space-y-3">
                {habits.map((habit) => (
                  <button
                    key={habit.id}
                    type="button"
                    onClick={() => setSelectedHabitId(habit.id)}
                    className={`w-full text-left p-3 rounded-12 transition-all ${
                      selectedHabitId === habit.id
                        ? 'bg-[var(--accent-soft)] border border-[var(--accent)]'
                        : 'bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-[var(--accent)]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-body font-semibold">{habit.name}</p>
                        <p className="text-small text-[var(--text-secondary)]">
                          {getCategoryLabel(habit.category)} · {habit.status}
                        </p>
                      </div>
                      <span className="text-small text-[var(--text-secondary)]">
                        {habit.targetFrequency ? `${habit.targetFrequency}/wk` : '—'}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {selectedHabitStats ? (
            <div className="space-y-6">
              <Card>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-h2 font-bold">{selectedHabitStats.habit.name}</h3>
                    <p className="text-small text-[var(--text-secondary)]">
                      {getCategoryLabel(selectedHabitStats.habit.category)} · {selectedHabitStats.habit.status}
                    </p>
                  </div>
                  <Button variant="ghost" onClick={() => setSelectedHabitId(null)}>
                    Close
                  </Button>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
                  <div className="bg-[var(--bg-primary)] rounded-12 p-3">
                    <p className="text-xs uppercase tracking-[0.2em]">Overall</p>
                    <p className="text-h3 font-semibold">{selectedHabitStats.stats.completionRate}%</p>
                  </div>
                  <div className="bg-[var(--bg-primary)] rounded-12 p-3">
                    <p className="text-xs uppercase tracking-[0.2em]">This Week</p>
                    <p className="text-h3 font-semibold">{selectedHabitStats.stats.completed}/{selectedHabitStats.stats.totalDue}</p>
                  </div>
                  <div className="bg-[var(--bg-primary)] rounded-12 p-3">
                    <p className="text-xs uppercase tracking-[0.2em]">Current Streak</p>
                    <p className="text-h3 font-semibold">{selectedHabitStats.currentStreak} days</p>
                  </div>
                  <div className="bg-[var(--bg-primary)] rounded-12 p-3">
                    <p className="text-xs uppercase tracking-[0.2em]">Longest Streak</p>
                    <p className="text-h3 font-semibold">{selectedHabitStats.longestStreak} days</p>
                  </div>
                </div>
              </Card>

              <TimelineCalendar habit={selectedHabitStats.habit} entries={entries} />
            </div>
          ) : (
            <Card className="mb-8">
              <p className="text-body text-[var(--text-secondary)]">
                Select a habit above to view its timeline calendar and detailed stats.
              </p>
            </Card>
          )}
        </>
      )}

      {analyticsTab === 'trends' && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <TrendLineChart habits={habits} entries={entries} />
            <DayOfWeekBarChart habits={habits} entries={entries} />
          </div>

          {dailyBreakdown.length > 1 && (
            <div className="mb-6">
              <CompletionChart dailyBreakdown={dailyBreakdown} />
            </div>
          )}

          <div className="mb-6">
            <MonthlyHeatmap habits={habits} entries={entries} onDaySelect={setSelectedDate} />
          </div>

          <div className="mb-6">
            <TimeDistributionChart entries={entries} />
          </div>

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
        </>
      )}

      {analyticsTab === 'insights' && (
        <Card className="mb-8">
          <h3 className="text-h3 font-semibold mb-4">Insights</h3>
          <div className="space-y-3 text-body text-[var(--text-secondary)]">
            <p>You've logged {overallStats?.totalCompleted ?? 0} completions across {overallStats?.totalHabits ?? 0} habits.</p>
            <p>Your consistency score is {overallStats ? (overallStats.averageCompletionRate / 10).toFixed(1) : '0.0'} / 10.</p>
            <p>Best streak this period: {bestStreak} days.</p>
            {bestCategory && (
              <p>
                Strongest category: {getCategoryLabel(bestCategory.category)} at {bestCategory.completionRate}% completion.
              </p>
            )}
            {topHabitsThisWeek.length > 0 && (
              <p>
                Top habit this week: {topHabitsThisWeek[0].habit.name} at {topHabitsThisWeek[0].completionRate}%.
              </p>
            )}
            <p>Total time invested this month: {Math.round(monthlyTimeInvested / 60)} hours.</p>
            <p>Consistency improved by staying above {overallStats?.averageCompletionRate ?? 0}% completion.</p>
          </div>
        </Card>
      )}
    </div>
  )
}
