import { useMemo, useState } from 'react'
import { Habit, HabitEntry } from '../types'
import { addDays, formatDateISO, getStartOfWeek, parseDateISO, getStartOfMonth, getEndOfMonth, getDayOfWeek, getTodayISO } from '../utils/date'
import { isHabitDueOnDate } from '../utils/habit'
import { calculateLongestStreak, calculateStreak, getHabitStats } from '../utils/statistics'
import { CATEGORY_COLORS, getCategoryLabel } from '../utils/categories'

interface TimelineCalendarProps {
  habit: Habit
  entries: HabitEntry[]
}

type ViewMode = 'year' | 'month'

const EMPTY_COLOR = '#EBEDF0'
const MISSED_COLOR = '#FECACA'
const FUTURE_COLOR = '#D1D5DB'

function getDayStatusColor(
  habit: Habit,
  entry: HabitEntry | undefined,
  dateStr: string,
  today: string
): string {
  const dateObj = parseDateISO(dateStr)
  const isFuture = dateStr > today
  if (!isHabitDueOnDate(habit, dateObj)) {
    return EMPTY_COLOR
  }
  if (entry?.completed) {
    return CATEGORY_COLORS[habit.category]
  }
  return isFuture ? FUTURE_COLOR : MISSED_COLOR
}

export default function TimelineCalendar({ habit, entries }: TimelineCalendarProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('year')
  const today = getTodayISO()
  const habitEntries = entries.filter((entry) => entry.habitId === habit.id)
  const entryMap = useMemo(
    () => new Map(habitEntries.map((entry) => [entry.date, entry])),
    [habitEntries]
  )

  const yearGrid = useMemo(() => {
    const start = getStartOfWeek(addDays(new Date(), -364))
    const weeks = Array.from({ length: 52 }, (_, weekIndex) => {
      const weekStart = addDays(start, weekIndex * 7)
      return Array.from({ length: 7 }, (_, dayIndex) => {
        const date = addDays(weekStart, dayIndex)
        const dateStr = formatDateISO(date)
        return {
          dateStr,
          color: getDayStatusColor(habit, entryMap.get(dateStr), dateStr, today),
        }
      })
    })
    return weeks
  }, [habit, entryMap, today])

  const monthGrid = useMemo(() => {
    const startOfMonth = getStartOfMonth(new Date())
    const endOfMonth = getEndOfMonth(new Date())
    const startOffset = getDayOfWeek(startOfMonth)
    const totalDays = endOfMonth.getDate()
    const totalCells = Math.ceil((startOffset + totalDays) / 7) * 7

    return Array.from({ length: totalCells }, (_, index) => {
      const dayIndex = index - startOffset
      if (dayIndex < 0 || dayIndex >= totalDays) {
        return null
      }
      const date = addDays(startOfMonth, dayIndex)
      const dateStr = formatDateISO(date)
      return {
        dateStr,
        color: getDayStatusColor(habit, entryMap.get(dateStr), dateStr, today),
      }
    })
  }, [habit, entryMap, today])

  const monthStats = getHabitStats(habit, entries, getStartOfMonth(new Date()), getEndOfMonth(new Date()))
  const currentStreak = calculateStreak(habit, entries)
  const longestStreak = calculateLongestStreak(habit, entries)

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-16 p-5 shadow-[var(--card-shadow)]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="text-h2 font-bold">{habit.name}</h3>
          <p className="text-small text-[var(--text-secondary)]">
            Category: {getCategoryLabel(habit.category)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setViewMode('year')}
            className={`px-3 py-2 rounded-full text-small font-medium ${viewMode === 'year' ? 'bg-[var(--accent-gradient)] text-white' : 'bg-[var(--bg-primary)] text-[var(--text-secondary)]'}`}
          >
            Year
          </button>
          <button
            type="button"
            onClick={() => setViewMode('month')}
            className={`px-3 py-2 rounded-full text-small font-medium ${viewMode === 'month' ? 'bg-[var(--accent-gradient)] text-white' : 'bg-[var(--bg-primary)] text-[var(--text-secondary)]'}`}
          >
            Month
          </button>
        </div>
      </div>

      {viewMode === 'year' ? (
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-2">
            {yearGrid.map((week, index) => (
              <div key={`week-${index}`} className="grid grid-rows-7 gap-1">
                {week.map((day) => (
                  <div
                    key={day.dateStr}
                    className="w-3 h-3 rounded-4"
                    style={{ backgroundColor: day.color }}
                    title={day.dateStr}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-2">
          {monthGrid.map((cell, index) =>
            cell ? (
              <div
                key={cell.dateStr}
                className="h-6 rounded-8"
                style={{ backgroundColor: cell.color }}
                title={cell.dateStr}
              />
            ) : (
              <div key={`empty-${index}`} className="h-6" />
            )
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--text-secondary)] mt-4">
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-4" style={{ backgroundColor: EMPTY_COLOR }} />
          No activity
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-4" style={{ backgroundColor: MISSED_COLOR }} />
          Missed
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-4" style={{ backgroundColor: CATEGORY_COLORS[habit.category] }} />
          Completed
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-4" style={{ backgroundColor: FUTURE_COLOR }} />
          Future
        </span>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-6 text-small text-[var(--text-secondary)]">
        <div className="bg-[var(--bg-primary)] rounded-12 p-3">
          <p className="text-xs uppercase tracking-[0.2em]">This Month</p>
          <p className="text-h3 font-semibold text-[var(--text-primary)]">
            {monthStats.completed}/{monthStats.totalDue} ({monthStats.completionRate}%)
          </p>
        </div>
        <div className="bg-[var(--bg-primary)] rounded-12 p-3">
          <p className="text-xs uppercase tracking-[0.2em]">Current Streak</p>
          <p className="text-h3 font-semibold text-[var(--text-primary)]">{currentStreak} days</p>
        </div>
        <div className="bg-[var(--bg-primary)] rounded-12 p-3">
          <p className="text-xs uppercase tracking-[0.2em]">Longest Streak</p>
          <p className="text-h3 font-semibold text-[var(--text-primary)]">{longestStreak} days</p>
        </div>
        <div className="bg-[var(--bg-primary)] rounded-12 p-3">
          <p className="text-xs uppercase tracking-[0.2em]">Total Completions</p>
          <p className="text-h3 font-semibold text-[var(--text-primary)]">{habitEntries.filter((e) => e.completed).length}</p>
        </div>
      </div>
    </div>
  )
}
