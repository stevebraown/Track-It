import { Habit, DayOfWeek } from '../types'
import { getDayOfWeek, parseDateISO, formatDateISO, addDays, addWeeks, addMonths } from './date'

/**
 * Check if a habit is due on a specific date
 */
export function isHabitDueOnDate(habit: Habit, date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? parseDateISO(date) : date
  const habitStartDate = parseDateISO(habit.createdAt)
  
  // Check if date is before habit was created
  if (dateObj < habitStartDate) {
    return false
  }

  // Check if habit is still within its commitment duration
  const endDate = getHabitEndDate(habit)
  if (dateObj > endDate) {
    return false
  }

  // Check cadence
  switch (habit.cadence) {
    case 'daily':
      return true

    case 'weekly': {
      const dayOfWeek = getDayOfWeek(dateObj) as DayOfWeek
      const weeklyConfig = habit.cadenceConfig as { days: DayOfWeek[] }
      return weeklyConfig.days.includes(dayOfWeek)
    }

    case 'custom':
      // For now, custom cadence is not implemented
      return false

    default:
      return false
  }
}

/**
 * Get the end date of a habit's commitment period
 */
export function getHabitEndDate(habit: Habit): Date {
  const startDate = parseDateISO(habit.createdAt)
  const { value, unit } = habit.duration

  switch (unit) {
    case 'days':
      return addDays(startDate, value)
    case 'weeks':
      return addWeeks(startDate, value)
    case 'months':
      return addMonths(startDate, value)
    default:
      return startDate
  }
}

/**
 * Get all dates a habit is due within a date range
 */
export function getHabitDueDates(
  habit: Habit,
  startDate: Date | string,
  endDate: Date | string
): string[] {
  const start = typeof startDate === 'string' ? parseDateISO(startDate) : startDate
  const end = typeof endDate === 'string' ? parseDateISO(endDate) : endDate
  const dueDates: string[] = []
  const current = new Date(start)

  while (current <= end) {
    if (isHabitDueOnDate(habit, current)) {
      dueDates.push(formatDateISO(current))
    }
    current.setDate(current.getDate() + 1)
  }

  return dueDates
}

/**
 * Generate a unique ID for a habit
 * Simple timestamp-based ID (can be enhanced with UUID later)
 */
export function generateHabitId(): string {
  return `habit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}
