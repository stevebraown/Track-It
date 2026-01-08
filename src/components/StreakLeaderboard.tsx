import { Habit } from '../types'
import Card from './Card'
import StreakBadge from './StreakBadge'
import { Link } from 'react-router-dom'

interface StreakLeaderboardProps {
  habits: Array<{
    habit: Habit
    currentStreak: number
    longestStreak: number
  }>
  onHabitClick?: (habitId: string) => void
}

export default function StreakLeaderboard({
  habits,
  onHabitClick,
}: StreakLeaderboardProps) {
  const activeStreaks = habits
    .filter((h) => h.currentStreak > 0)
    .sort((a, b) => b.currentStreak - a.currentStreak)
    .slice(0, 5)

  if (activeStreaks.length === 0) {
    return (
      <Card>
        <h3 className="text-h3 mb-4">🔥 Streaks</h3>
        <p className="text-body text-[var(--text-secondary)] text-center py-6">
          No active streaks yet. Complete your habits to start building streaks!
        </p>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-to-br from-[var(--bg-surface)] to-[var(--bg-primary)] border-2 border-[var(--border-color)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-h3 font-bold">🔥 Top Streaks</h3>
        <Link
          to="/history"
          className="text-small text-primary font-medium hover:underline"
        >
          View All
        </Link>
      </div>
      <div className="space-y-3">
        {activeStreaks.map(({ habit, currentStreak, longestStreak }, index) => (
          <div
            key={habit.id}
            className={`flex items-center justify-between p-4 rounded-8 cursor-pointer transition-all ${
              index === 0
                ? 'bg-gradient-to-r from-success-light to-transparent border-2 border-success'
                : 'bg-[var(--bg-primary)] hover:bg-[var(--bg-surface)] border border-[var(--border-color)]'
            }`}
            onClick={() => onHabitClick?.(habit.id)}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {index === 0 && (
                <span className="text-h2 flex-shrink-0">👑</span>
              )}
              <div className="flex-1 min-w-0">
                <h4 className="text-body font-semibold truncate">{habit.name}</h4>
                {index === 0 && longestStreak > currentStreak && (
                  <p className="text-small text-[var(--text-secondary)]">
                    Best: {longestStreak} days
                  </p>
                )}
              </div>
            </div>
            <div className="flex-shrink-0">
              <StreakBadge
                currentStreak={currentStreak}
                longestStreak={index === 0 ? longestStreak : undefined}
                size="medium"
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
