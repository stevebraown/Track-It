import { Habit, HabitEntry, HabitCategory } from '../types'
import { isHabitDueOnDate, getHabitEndDate } from './habit'
import { parseDateISO, formatDateISO, getDateRange, getStartOfWeek, addDays } from './date'

/**
 * Calculate the current streak for a habit
 * Streak is the number of consecutive days (going backwards from today) where the habit was completed
 */
export function calculateStreak(habit: Habit, entries: HabitEntry[]): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  let streak = 0
  let currentDate = new Date(today)
  
  // Check if habit is still active (within commitment period)
  const endDate = getHabitEndDate(habit)
  if (today > endDate) {
    // Habit has ended, calculate final streak
    currentDate = new Date(endDate)
  }
  
  // Go backwards from today (or end date) and count consecutive completed days
  while (currentDate >= parseDateISO(habit.createdAt)) {
    const dateStr = formatDateISO(currentDate)
    
    // Check if habit was due on this date
    if (!isHabitDueOnDate(habit, currentDate)) {
      // Not due on this day, skip it (doesn't break streak)
      currentDate.setDate(currentDate.getDate() - 1)
      continue
    }
    
    // Check if habit was completed on this date
    const entry = entries.find(
      (e) => e.habitId === habit.id && e.date === dateStr
    )
    
    if (entry?.completed) {
      streak++
      currentDate.setDate(currentDate.getDate() - 1)
    } else {
      // Streak broken
      break
    }
  }
  
  return streak
}

/**
 * Calculate longest streak for a habit
 */
export function calculateLongestStreak(habit: Habit, entries: HabitEntry[]): number {
  const startDate = parseDateISO(habit.createdAt)
  const endDate = getHabitEndDate(habit)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const effectiveEndDate = today > endDate ? endDate : today
  const dates = getDateRange(startDate, effectiveEndDate)
  
  let longestStreak = 0
  let currentStreak = 0
  
  for (const dateStr of dates) {
    // Only count days when habit is due
    if (!isHabitDueOnDate(habit, dateStr)) {
      continue
    }
    
    const entry = entries.find(
      (e) => e.habitId === habit.id && e.date === dateStr
    )
    
    if (entry?.completed) {
      currentStreak++
      longestStreak = Math.max(longestStreak, currentStreak)
    } else {
      currentStreak = 0
    }
  }
  
  return longestStreak
}

/**
 * Get completion statistics for a habit over a date range
 */
export interface HabitStats {
  totalDue: number
  completed: number
  missed: number
  completionRate: number // 0-100
}

export function getHabitStats(
  habit: Habit,
  entries: HabitEntry[],
  startDate: Date | string,
  endDate: Date | string
): HabitStats {
  const dates = getDateRange(startDate, endDate)
  let totalDue = 0
  let completed = 0
  
  for (const dateStr of dates) {
    if (isHabitDueOnDate(habit, dateStr)) {
      totalDue++
      const entry = entries.find(
        (e) => e.habitId === habit.id && e.date === dateStr
      )
      if (entry?.completed) {
        completed++
      }
    }
  }
  
  const missed = totalDue - completed
  const completionRate = totalDue > 0 ? Math.round((completed / totalDue) * 100) : 0
  
  return {
    totalDue,
    completed,
    missed,
    completionRate,
  }
}

/**
 * Get overall statistics for all habits over a date range
 */
export interface OverallStats {
  totalHabits: number
  totalDueDates: number
  totalCompleted: number
  totalMissed: number
  averageCompletionRate: number
  habitsWithStreaks: Array<{
    habit: Habit
    currentStreak: number
    longestStreak: number
  }>
}

export function getOverallStats(
  habits: Habit[],
  entries: HabitEntry[],
  startDate: Date | string,
  endDate: Date | string
): OverallStats {
  let totalDueDates = 0
  let totalCompleted = 0
  
  const habitsWithStreaks = habits.map((habit) => ({
    habit,
    currentStreak: calculateStreak(habit, entries),
    longestStreak: calculateLongestStreak(habit, entries),
  }))
  
  for (const habit of habits) {
    const stats = getHabitStats(habit, entries, startDate, endDate)
    totalDueDates += stats.totalDue
    totalCompleted += stats.completed
  }
  
  const totalMissed = totalDueDates - totalCompleted
  const averageCompletionRate =
    totalDueDates > 0
      ? Math.round((totalCompleted / totalDueDates) * 100)
      : 0
  
  return {
    totalHabits: habits.length,
    totalDueDates,
    totalCompleted,
    totalMissed,
    averageCompletionRate,
    habitsWithStreaks,
  }
}

/**
 * Get daily breakdown for a date range
 */
export interface DailyBreakdown {
  date: string
  habitsDue: number
  habitsCompleted: number
  completionRate: number
}

export function getDailyBreakdown(
  habits: Habit[],
  entries: HabitEntry[],
  startDate: Date | string,
  endDate: Date | string
): DailyBreakdown[] {
  const dates = getDateRange(startDate, endDate)
  
  return dates.map((dateStr) => {
    let habitsDue = 0
    let habitsCompleted = 0
    
    for (const habit of habits) {
      if (isHabitDueOnDate(habit, dateStr)) {
        habitsDue++
        const entry = entries.find(
          (e) => e.habitId === habit.id && e.date === dateStr
        )
        if (entry?.completed) {
          habitsCompleted++
        }
      }
    }
    
    const completionRate =
      habitsDue > 0 ? Math.round((habitsCompleted / habitsDue) * 100) : 0
    
    return {
      date: dateStr,
      habitsDue,
      habitsCompleted,
      completionRate,
    }
  })
}

export interface CategorySummary {
  category: HabitCategory
  completed: number
  total: number
  completionRate: number
}

export function getCategorySummaries(
  habits: Habit[],
  entries: HabitEntry[],
  startDate: Date | string,
  endDate: Date | string
): CategorySummary[] {
  const dates = getDateRange(startDate, endDate)
  const summaries = new Map<HabitCategory, { completed: number; total: number }>()

  for (const habit of habits) {
    if (!summaries.has(habit.category)) {
      summaries.set(habit.category, { completed: 0, total: 0 })
    }
  }

  for (const dateStr of dates) {
    for (const habit of habits) {
      if (!isHabitDueOnDate(habit, dateStr)) continue
      const record = summaries.get(habit.category)
      if (!record) continue
      record.total += 1
      const entry = entries.find(
        (e) => e.habitId === habit.id && e.date === dateStr
      )
      if (entry?.completed) {
        record.completed += 1
      }
    }
  }

  return Array.from(summaries.entries()).map(([category, value]) => ({
    category,
    completed: value.completed,
    total: value.total,
    completionRate: value.total > 0 ? Math.round((value.completed / value.total) * 100) : 0,
  }))
}

export interface WeeklyCategoryDataPoint {
  date: string
  label: string
  totalCompleted: number
  totalDue: number
  categories: Record<HabitCategory, number>
}

export function getWeeklyCategoryCompletion(
  habits: Habit[],
  entries: HabitEntry[],
  referenceDate: Date | string = new Date()
): WeeklyCategoryDataPoint[] {
  const start = getStartOfWeek(referenceDate)
  const days = Array.from({ length: 7 }, (_, index) => addDays(start, index))

  return days.map((day) => {
    const dateStr = formatDateISO(day)
    const categoryCounts: Record<HabitCategory, number> = {} as Record<HabitCategory, number>
    let totalCompleted = 0
    let totalDue = 0

    for (const habit of habits) {
      if (!isHabitDueOnDate(habit, dateStr)) continue
      totalDue += 1
      if (!categoryCounts[habit.category]) {
        categoryCounts[habit.category] = 0
      }
      const entry = entries.find(
        (e) => e.habitId === habit.id && e.date === dateStr
      )
      if (entry?.completed) {
        categoryCounts[habit.category] += 1
        totalCompleted += 1
      }
    }

    return {
      date: dateStr,
      label: day.toLocaleDateString(undefined, { weekday: 'short' }),
      totalCompleted,
      totalDue,
      categories: categoryCounts,
    }
  })
}

export interface HabitWeeklyProgress {
  habit: Habit
  completionRate: number
  completed: number
  total: number
}

export function getHabitWeeklyProgress(
  habits: Habit[],
  entries: HabitEntry[],
  referenceDate: Date | string = new Date()
): HabitWeeklyProgress[] {
  const start = getStartOfWeek(referenceDate)
  const end = addDays(start, 6)

  return habits.map((habit) => {
    const stats = getHabitStats(habit, entries, start, end)
    return {
      habit,
      completionRate: stats.completionRate,
      completed: stats.completed,
      total: stats.totalDue,
    }
  })
}

export interface CompletionTrendPoint {
  date: string
  completionRate: number
}

export function getCompletionTrend(
  habits: Habit[],
  entries: HabitEntry[],
  days: number
): CompletionTrendPoint[] {
  const end = new Date()
  const start = addDays(end, -Math.max(days - 1, 0))
  const breakdown = getDailyBreakdown(habits, entries, start, end)

  return breakdown.map((day) => ({
    date: day.date,
    completionRate: day.completionRate,
  }))
}

export function calculateMovingAverage(
  points: CompletionTrendPoint[],
  windowSize: number
): CompletionTrendPoint[] {
  return points.map((point, index) => {
    const start = Math.max(0, index - windowSize + 1)
    const slice = points.slice(start, index + 1)
    const average =
      slice.reduce((sum, item) => sum + item.completionRate, 0) / slice.length
    return {
      date: point.date,
      completionRate: Math.round(average),
    }
  })
}

export interface DayOfWeekSummary {
  day: string
  completionRate: number
}

export function getBestDayOfWeek(
  habits: Habit[],
  entries: HabitEntry[]
): DayOfWeekSummary[] {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const dayTotals = days.map(() => ({ total: 0, completed: 0 }))

  const allDates = entries.map((entry) => entry.date)
  const uniqueDates = Array.from(new Set(allDates))

  uniqueDates.forEach((dateStr) => {
    const date = parseDateISO(dateStr)
    const dayIndex = date.getDay()
    let totalDue = 0
    let completed = 0
    habits.forEach((habit) => {
      if (isHabitDueOnDate(habit, dateStr)) {
        totalDue += 1
        const entry = entries.find(
          (e) => e.habitId === habit.id && e.date === dateStr
        )
        if (entry?.completed) {
          completed += 1
        }
      }
    })
    dayTotals[dayIndex].total += totalDue
    dayTotals[dayIndex].completed += completed
  })

  return days.map((day, index) => ({
    day,
    completionRate:
      dayTotals[index].total > 0
        ? Math.round((dayTotals[index].completed / dayTotals[index].total) * 100)
        : 0,
  }))
}

export interface TimeOfDayBucket {
  hour: number
  count: number
}

export function getTimeOfDayDistribution(entries: HabitEntry[]): TimeOfDayBucket[] {
  const buckets = Array.from({ length: 24 }, (_, hour) => ({ hour, count: 0 }))

  entries.forEach((entry) => {
    if (!entry.timestamp || !entry.completed) return
    const date = new Date(entry.timestamp)
    if (Number.isNaN(date.getTime())) return
    const hour = date.getHours()
    buckets[hour].count += 1
  })

  return buckets
}
