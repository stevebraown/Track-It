import { Habit, HabitEntry } from '../types'
import { getDailyBreakdown } from '../utils/statistics'
import { getStartOfMonth, getEndOfMonth, getTodayISO, getDayOfWeek, addDays, formatDateISO } from '../utils/date'

interface MonthlyHeatmapProps {
  habits: Habit[]
  entries: HabitEntry[]
  referenceDate?: Date
  className?: string
  onDaySelect?: (date: string) => void
}

const BASE_ACCENT = '108, 93, 211'

function getIntensityColor(rate: number): string {
  if (rate === 0) return '#EBEDF0'
  if (rate <= 25) return `rgba(${BASE_ACCENT}, 0.2)`
  if (rate <= 50) return `rgba(${BASE_ACCENT}, 0.35)`
  if (rate <= 75) return `rgba(${BASE_ACCENT}, 0.6)`
  return `rgba(${BASE_ACCENT}, 0.9)`
}

export default function MonthlyHeatmap({
  habits,
  entries,
  referenceDate = new Date(),
  className = '',
  onDaySelect,
}: MonthlyHeatmapProps) {
  const startOfMonth = getStartOfMonth(referenceDate)
  const endOfMonth = getEndOfMonth(referenceDate)
  const dailyBreakdown = getDailyBreakdown(habits, entries, startOfMonth, endOfMonth)
  const completionMap = new Map(dailyBreakdown.map((day) => [day.date, day.completionRate]))

  const startDayOffset = getDayOfWeek(startOfMonth)
  const totalDays = endOfMonth.getDate()
  const totalCells = Math.ceil((startDayOffset + totalDays) / 7) * 7
  const todayISO = getTodayISO()

  const cells = Array.from({ length: totalCells }, (_, index) => {
    const dayIndex = index - startDayOffset
    if (dayIndex < 0 || dayIndex >= totalDays) {
      return null
    }
    const date = addDays(startOfMonth, dayIndex)
    const dateStr = formatDateISO(date)
    const rate = completionMap.get(dateStr) ?? 0
    return { dateStr, rate }
  })

  return (
    <div className={`bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-16 p-5 shadow-[var(--card-shadow)] ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-h3 font-semibold">Monthly Heatmap</h3>
        <span className="text-small text-[var(--text-secondary)]">
          {referenceDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
        </span>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {cells.map((cell, index) => {
          if (!cell) {
            return <div key={`empty-${index}`} className="h-6" />
          }
          const isToday = cell.dateStr === todayISO
          return (
            <button
              key={cell.dateStr}
              type="button"
              onClick={() => onDaySelect?.(cell.dateStr)}
              className={`h-6 rounded-8 transition-all ${isToday ? 'ring-2 ring-[var(--accent)]' : ''}`}
              style={{ backgroundColor: getIntensityColor(cell.rate) }}
              title={`${cell.dateStr}: ${cell.rate}%`}
            />
          )
        })}
      </div>
      <div className="flex items-center justify-between mt-4 text-xs text-[var(--text-secondary)]">
        <span>Low</span>
        <div className="flex items-center gap-2">
          {[0, 25, 50, 75, 100].map((value) => (
            <span key={value} className="w-3 h-3 rounded-4" style={{ backgroundColor: getIntensityColor(value) }} />
          ))}
        </div>
        <span>High</span>
      </div>
    </div>
  )
}
