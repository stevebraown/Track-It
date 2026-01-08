import { Habit, HabitEntry } from '../types'
import { isHabitDueOnDate } from '../utils/habit'
import Card from './Card'
import { formatDateISO, parseDateISO } from '../utils/date'

interface HistoryDayCardProps {
  date: string
  habits: Habit[]
  entries: HabitEntry[]
}

export default function HistoryDayCard({
  date,
  habits,
  entries,
}: HistoryDayCardProps) {
  const dateObj = parseDateISO(date)
  const formattedDate = dateObj.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })

  const habitsDue = habits.filter((habit) => isHabitDueOnDate(habit, date))
  const completedCount = habitsDue.filter((habit) => {
    const entry = entries.find(
      (e) => e.habitId === habit.id && e.date === date
    )
    return entry?.completed
  }).length

  const completionRate =
    habitsDue.length > 0
      ? Math.round((completedCount / habitsDue.length) * 100)
      : 0

  const isToday = formatDateISO(new Date()) === date

  return (
    <Card className={isToday ? 'border-2 border-primary' : ''}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-h3 font-semibold">{formattedDate}</h3>
          {isToday && (
            <span className="text-small text-primary font-medium">Today</span>
          )}
        </div>
        <div className="text-right">
          <p className="text-h2 font-semibold">{completionRate}%</p>
          <p className="text-small text-[var(--text-secondary)]">
            {completedCount}/{habitsDue.length} completed
          </p>
        </div>
      </div>

      {habitsDue.length > 0 ? (
        <div className="space-y-2">
          {habitsDue.map((habit) => {
            const entry = entries.find(
              (e) => e.habitId === habit.id && e.date === date
            )
            const completed = entry?.completed ?? false

            return (
              <div
                key={habit.id}
                className={`flex items-center gap-2 p-2 rounded-4 ${
                  completed
                    ? 'bg-success-light'
                    : 'bg-[var(--bg-primary)] border border-[var(--border-color)]'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-4 flex items-center justify-center ${
                    completed
                      ? 'bg-success'
                      : 'border-2 border-[var(--border-color)]'
                  }`}
                >
                  {completed && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                <span
                  className={`text-small flex-1 ${
                    completed
                      ? 'line-through text-[var(--text-secondary)]'
                      : 'text-[var(--text-primary)]'
                  }`}
                >
                  {habit.name}
                </span>
              </div>
            )
          })}
        </div>
      ) : (
        <p className="text-small text-[var(--text-secondary)]">
          No habits due on this day
        </p>
      )}
    </Card>
  )
}
