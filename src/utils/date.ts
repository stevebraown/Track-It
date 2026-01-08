/**
 * Date utility functions for habit tracking
 */

/**
 * Get today's date as ISO string (YYYY-MM-DD)
 */
export function getTodayISO(): string {
  return new Date().toISOString().split('T')[0]
}

/**
 * Format a Date object to ISO date string (YYYY-MM-DD)
 */
export function formatDateISO(date: Date): string {
  return date.toISOString().split('T')[0]
}

/**
 * Parse an ISO date string (YYYY-MM-DD) to Date object
 */
export function parseDateISO(isoString: string): Date {
  return new Date(isoString + 'T00:00:00')
}

/**
 * Get day of week from a date (0 = Sunday, 6 = Saturday)
 */
export function getDayOfWeek(date: Date | string): number {
  const d = typeof date === 'string' ? parseDateISO(date) : date
  return d.getDay()
}

/**
 * Check if two dates are the same day
 */
export function isSameDay(date1: Date | string, date2: Date | string): boolean {
  const d1 = typeof date1 === 'string' ? parseDateISO(date1) : date1
  const d2 = typeof date2 === 'string' ? parseDateISO(date2) : date2
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  )
}

/**
 * Add days to a date
 */
export function addDays(date: Date | string, days: number): Date {
  const d = typeof date === 'string' ? parseDateISO(date) : date
  const result = new Date(d)
  result.setDate(result.getDate() + days)
  return result
}

/**
 * Add weeks to a date
 */
export function addWeeks(date: Date | string, weeks: number): Date {
  return addDays(date, weeks * 7)
}

/**
 * Add months to a date (approximate)
 */
export function addMonths(date: Date | string, months: number): Date {
  const d = typeof date === 'string' ? parseDateISO(date) : date
  const result = new Date(d)
  result.setMonth(result.getMonth() + months)
  return result
}

/**
 * Get start of week (Sunday) for a given date
 */
export function getStartOfWeek(date: Date | string): Date {
  const d = typeof date === 'string' ? parseDateISO(date) : date
  const result = new Date(d)
  const day = result.getDay()
  result.setDate(result.getDate() - day)
  result.setHours(0, 0, 0, 0)
  return result
}

/**
 * Get end of week (Saturday) for a given date
 */
export function getEndOfWeek(date: Date | string): Date {
  const start = getStartOfWeek(date)
  return addDays(start, 6)
}

/**
 * Get start of month for a given date
 */
export function getStartOfMonth(date: Date | string): Date {
  const d = typeof date === 'string' ? parseDateISO(date) : date
  const result = new Date(d.getFullYear(), d.getMonth(), 1)
  return result
}

/**
 * Get end of month for a given date
 */
export function getEndOfMonth(date: Date | string): Date {
  const d = typeof date === 'string' ? parseDateISO(date) : date
  const result = new Date(d.getFullYear(), d.getMonth() + 1, 0)
  return result
}

/**
 * Get array of dates between two dates (inclusive)
 */
export function getDateRange(start: Date | string, end: Date | string): string[] {
  const startDate = typeof start === 'string' ? parseDateISO(start) : start
  const endDate = typeof end === 'string' ? parseDateISO(end) : end
  const dates: string[] = []
  const current = new Date(startDate)

  while (current <= endDate) {
    dates.push(formatDateISO(current))
    current.setDate(current.getDate() + 1)
  }

  return dates
}
