import { Habit, HabitEntry } from '../types'
import { isHabitDueOnDate, getHabitEndDate } from './habit'
import { parseDateISO, formatDateISO, getDateRange } from './date'

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
