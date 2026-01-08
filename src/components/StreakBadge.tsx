interface StreakBadgeProps {
  currentStreak: number
  longestStreak?: number
  size?: 'small' | 'medium' | 'large'
}

export default function StreakBadge({
  currentStreak,
  longestStreak,
  size = 'medium',
}: StreakBadgeProps) {
  const sizeClasses = {
    small: 'text-small px-2 py-1',
    medium: 'text-body px-3 py-1.5',
    large: 'text-h3 px-4 py-2',
  }

  return (
    <div className="flex items-center gap-2">
      <div
        className={`${sizeClasses[size]} bg-success text-white rounded-8 font-semibold flex items-center gap-1`}
      >
        <span>🔥</span>
        <span>{currentStreak}</span>
      </div>
      {longestStreak !== undefined && longestStreak !== currentStreak && (
        <span className="text-small text-[var(--text-secondary)]">
          Best: {longestStreak}
        </span>
      )}
    </div>
  )
}
