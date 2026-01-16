import { Habit, HabitEntry } from '../types'
import { isHabitDueOnDate } from '../utils/habit'
import Card from './Card'
import ProgressRing from './ProgressRing'
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
    <Card
      className={`transition-all hover:shadow-[var(--card-shadow-hover)] ${
        isToday
          ? 'border border-[var(--accent)] bg-[var(--accent-soft)]'
          : ''
      }`}
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-5">
        <div>
          <h3 className="text-h3 font-semibold">{formattedDate}</h3>
          {isToday && (
            <span className="inline-block mt-2 px-3 py-1 bg-[var(--accent-gradient)] text-white rounded-full text-small font-medium">
              Today
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-h2 font-bold">{completionRate}%</p>
            <p className="text-small text-[var(--text-secondary)]">
              {completedCount}/{habitsDue.length}
            </p>
          </div>
          {habitsDue.length > 0 && (
            <ProgressRing percentage={completionRate} size={80} strokeWidth={6} />
          )}
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
                className={`flex items-center gap-3 p-3 rounded-12 transition-all ${
                  completed
                    ? 'bg-success-light border border-success'
                    : 'bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-[var(--accent)]'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    completed
                      ? 'bg-success'
                      : 'border-2 border-[var(--border-color)]'
                  }`}
                >
                  {completed && (
                    <svg
                      className="w-3.5 h-3.5 text-white"
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
                  className={`text-body flex-1 ${
                    completed
                      ? 'line-through text-[var(--text-secondary)]'
                      : 'text-[var(--text-primary)] font-medium'
                  }`}
                >
                  {habit.name}
                </span>
              </div>
            )
          })}
        </div>
      ) : (
        <p className="text-small text-[var(--text-secondary)] text-center py-4">
          No habits due on this day
        </p>
      )}
    </Card>
  )
}
